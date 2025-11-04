import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/config'
import { updateSubscriptionStatus } from '@/lib/stripe/subscription'
import Stripe from 'stripe'

/**
 * Stripe Webhook Handler
 * Listens to Stripe events for subscription management
 */

/**
 * Helper function to extract user_id from Stripe event
 */
async function getUserIdFromEvent(
  subscription: Stripe.Subscription
): Promise<string | null> {
  if (!stripe) return null
  
  // Try to get from subscription metadata
  if (subscription.metadata?.user_id) {
    return subscription.metadata.user_id
  }
  
  // Fallback to customer metadata
  try {
    const customer = await stripe.customers.retrieve(
      subscription.customer as string
    )
    
    if (!customer.deleted && customer.metadata?.user_id) {
      return customer.metadata.user_id
    }
  } catch (error) {
    console.error('Error retrieving customer:', error)
  }
  
  return null
}

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe is not configured' },
      { status: 503 }
    )
  }
  
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')
  
  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    )
  }
  
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set')
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    )
  }
  
  let event: Stripe.Event
  
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }
  
  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.mode === 'subscription' && session.subscription) {
          const userId = session.metadata?.user_id
          
          if (!userId) {
            console.error('No user_id in session metadata')
            break
          }
          
          // Retrieve the subscription to get full details
          const subscription: Stripe.Subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          ) as Stripe.Subscription
          
          await updateSubscriptionStatus(userId, {
            stripe_subscription_id: subscription.id,
            stripe_price_id: subscription.items.data[0].price.id,
            status: subscription.status,
            current_period_start: subscription.items.data[0].current_period_start,
            current_period_end: subscription.items.data[0].current_period_end,
            cancel_at_period_end: subscription.cancel_at_period_end,
          })
        }
        break
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = await getUserIdFromEvent(subscription)
        
        if (!userId) {
          console.error('No user_id found for subscription update')
          break
        }
        
        await updateSubscriptionStatus(userId, {
          stripe_subscription_id: subscription.id,
          stripe_price_id: subscription.items.data[0].price.id,
          status: subscription.status,
          current_period_start: subscription.items.data[0].current_period_start,
          current_period_end: subscription.items.data[0].current_period_end,
          cancel_at_period_end: subscription.cancel_at_period_end,
        })
        break
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = await getUserIdFromEvent(subscription)
        
        if (!userId) {
          console.error('No user_id found for subscription deletion')
          break
        }
        
        await updateSubscriptionStatus(userId, {
          stripe_subscription_id: subscription.id,
          stripe_price_id: subscription.items.data[0].price.id,
          status: 'canceled',
          current_period_start: subscription.items.data[0].current_period_start,
          current_period_end: subscription.items.data[0].current_period_end,
          cancel_at_period_end: true,
        })
        break
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        console.warn('Payment failed for invoice:', invoice.id)
        // Additional handling can be added here (e.g., notify user)
        break
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
    
    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Error processing webhook:', err)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
