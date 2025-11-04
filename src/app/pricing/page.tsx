/**
 * Pricing Page
 * Week 1 Day 1-2: Pricing & Packaging
 * Enterprise pricing with clear tier comparison
 */

import Link from 'next/link'

export default function PricingPage() {
  const tiers = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for personal projects and getting started',
      features: [
        'Up to 3 questionnaires',
        '100 responses/month',
        'Basic analytics',
        'Email support',
        'Community access',
      ],
      cta: 'Get Started',
      ctaLink: '/auth/signup',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      description: 'For professionals and growing teams',
      features: [
        'Unlimited questionnaires',
        '1,000 responses/month',
        'Advanced analytics',
        'Custom branding',
        'Priority email support',
        'Template library access',
        'Export to CSV/JSON',
      ],
      cta: 'Start Free Trial',
      ctaLink: '/auth/signup?plan=pro',
      highlighted: false,
    },
    {
      name: 'Business',
      price: '$99',
      period: '/month',
      description: 'For teams that need collaboration and security',
      features: [
        'Everything in Pro',
        '10,000 responses/month',
        'Team collaboration',
        'SSO (SAML, OAuth)',
        'Basic audit logs (30 days)',
        'Role-based access control',
        'Priority support',
        'Dedicated account manager',
      ],
      cta: 'Start Free Trial',
      ctaLink: '/auth/signup?plan=business',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: '$10,000',
      period: '/year',
      description: 'For regulated industries requiring complete compliance',
      features: [
        'Everything in Business',
        'Unlimited responses',
        'Complete audit logs (unlimited)',
        'Multi-factor authentication',
        '99.5% uptime SLA',
        'Custom integrations',
        'Advanced security features',
        'Dedicated account manager',
        'Custom onboarding',
        'Legal & compliance support',
      ],
      cta: 'Contact Sales',
      ctaLink: '/enterprise#demo',
      highlighted: false,
      enterprise: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Q-Persona
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/marketplace" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
                Marketplace
              </Link>
              <Link href="/enterprise" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
                Enterprise
              </Link>
              <Link href="/security" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
                Security
              </Link>
              <Link href="/auth/login" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
                Sign In
              </Link>
              <Link href="/auth/signup" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your needs. From personal projects to enterprise deployments.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="#pricing"
              className="rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700"
            >
              View Pricing
            </Link>
            <Link
              href="/enterprise#calculator"
              className="rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Enterprise Calculator
            </Link>
          </div>
        </div>
      </div>

      {/* Pricing Tiers */}
      <div id="pricing" className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl ${tier.highlighted
                    ? 'border-2 border-blue-600 shadow-xl'
                    : 'border border-gray-200 shadow-sm'
                  } bg-white p-8 ${tier.enterprise ? 'lg:col-span-1' : ''}`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold text-white">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900">{tier.name}</h3>
                  <p className="mt-2 text-sm text-gray-600">{tier.description}</p>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-5xl font-bold text-gray-900">{tier.price}</span>
                    <span className="ml-2 text-gray-600">{tier.period}</span>
                  </div>
                  {tier.name === 'Enterprise' && (
                    <p className="mt-2 text-sm text-gray-500">Custom pricing for &gt;500 users</p>
                  )}
                </div>

                <ul className="mb-8 space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <svg
                        className="h-6 w-6 flex-shrink-0 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="ml-3 text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={tier.ctaLink}
                  className={`block w-full rounded-lg py-3 text-center font-medium ${tier.highlighted || tier.enterprise
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Compare Plans
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th scope="col" className="py-3 px-6 text-left text-sm font-semibold text-gray-900">
                    Feature
                  </th>
                  <th scope="col" className="py-3 px-6 text-center text-sm font-semibold text-gray-900">
                    Free
                  </th>
                  <th scope="col" className="py-3 px-6 text-center text-sm font-semibold text-gray-900">
                    Pro
                  </th>
                  <th scope="col" className="py-3 px-6 text-center text-sm font-semibold text-gray-900 bg-blue-50">
                    Business
                  </th>
                  <th scope="col" className="py-3 px-6 text-center text-sm font-semibold text-gray-900">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <ComparisonRow
                  feature="Questionnaires"
                  values={['3', 'Unlimited', 'Unlimited', 'Unlimited']}
                />
                <ComparisonRow
                  feature="Responses/month"
                  values={['100', '1,000', '10,000', 'Unlimited']}
                />
                <ComparisonRow
                  feature="Team Members"
                  values={['1', '5', 'Unlimited', 'Unlimited']}
                />
                <ComparisonRow
                  feature="Custom Branding"
                  values={[false, true, true, true]}
                />
                <ComparisonRow
                  feature="SSO (SAML, OAuth)"
                  values={[false, false, true, true]}
                />
                <ComparisonRow
                  feature="Audit Logs"
                  values={[false, false, '30 days', 'Unlimited']}
                />
                <ComparisonRow
                  feature="Multi-Factor Auth"
                  values={[false, false, false, true]}
                />
                <ComparisonRow
                  feature="SLA Guarantee"
                  values={[false, false, false, '99.5%']}
                />
                <ComparisonRow
                  feature="Support"
                  values={['Email', 'Priority Email', 'Priority + Phone', '24/7 Dedicated']}
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Enterprise CTA */}
      <div className="bg-blue-600 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need an enterprise solution?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Get complete audit logging, compliance documentation, and dedicated support for your regulated organization.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/enterprise"
              className="rounded-md bg-white px-6 py-3 text-base font-medium text-blue-600 hover:bg-blue-50"
            >
              Learn About Enterprise
            </Link>
            <Link
              href="/enterprise#demo"
              className="rounded-md border-2 border-white px-6 py-3 text-base font-medium text-white hover:bg-blue-700"
            >
              Schedule a Demo
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-gray-50 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-8">
            <FAQItem
              question="Can I switch plans later?"
              answer="Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle."
            />
            <FAQItem
              question="What payment methods do you accept?"
              answer="We accept all major credit cards (Visa, MasterCard, American Express) and can arrange invoice billing for Enterprise customers."
            />
            <FAQItem
              question="Is there a free trial?"
              answer="Yes! Pro and Business plans include a 30-day free trial. No credit card required to start."
            />
            <FAQItem
              question="What happens if I exceed my response limit?"
              answer="We'll notify you when you approach your limit. You can upgrade your plan or purchase additional responses as needed."
            />
            <FAQItem
              question="Do you offer discounts for non-profits?"
              answer="Yes, we offer special pricing for educational institutions and non-profit organizations. Contact our sales team for details."
            />
            <FAQItem
              question="Can I get a custom Enterprise plan?"
              answer="Absolutely. Enterprise plans are fully customizable based on your organization's specific needs. Contact us to discuss your requirements."
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">
            <p>Questions? Contact us at <a href="mailto:sales@q-persona.com" className="text-blue-600 hover:text-blue-700">sales@q-persona.com</a></p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ComparisonRow({ feature, values }: { feature: string; values: (string | boolean)[] }) {
  return (
    <tr>
      <td className="py-4 px-6 text-sm text-gray-900">{feature}</td>
      {values.map((value, index) => (
        <td key={index} className={`py-4 px-6 text-center ${index === 2 ? 'bg-blue-50' : ''}`}>
          {typeof value === 'boolean' ? (
            value ? (
              <svg className="h-6 w-6 text-green-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="h-6 w-6 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )
          ) : (
            <span className="text-sm text-gray-700">{value}</span>
          )}
        </td>
      ))}
    </tr>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b border-gray-200 pb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{question}</h3>
      <p className="text-gray-600">{answer}</p>
    </div>
  )
}
