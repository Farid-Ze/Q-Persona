/**
 * Enterprise Landing Page
 * Week 1 Day 8-10: Website Updates + Week 2 Enhancements
 * Positions Q-Persona as enterprise-grade platform with complete audit trail
 * Enhanced with ROI Calculator and improved features
 */

import Link from 'next/link'
import ROICalculator from '@/components/ROICalculator'

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                Q-Persona
              </Link>
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/marketplace" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                  Marketplace
                </Link>
                <Link href="/security" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                  Security
                </Link>
                <Link href="#pricing" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                  Pricing
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/login" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
                Sign In
              </Link>
              <Link href="#demo" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Schedule Demo
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5">
              <span className="text-sm font-medium text-blue-900">
                ✓ Trusted by Fortune 500 Companies
              </span>
            </div>
            
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
              Enterprise-Grade Survey Platform
              <br />
              <span className="text-blue-600">with Complete Audit Trail</span>
            </h1>
            
            <p className="mx-auto max-w-2xl text-xl text-gray-600 mb-12">
              The only survey platform built for regulated industries with complete compliance,
              audit logging, SSO integration, and enterprise security.
            </p>
            
            <div className="flex justify-center gap-4">
              <Link
                href="#demo"
                className="rounded-md bg-blue-600 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-700 shadow-lg"
              >
                Schedule Enterprise Demo
              </Link>
              <Link
                href="#features"
                className="rounded-md border-2 border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-900 hover:border-gray-400"
              >
                See Features
              </Link>
            </div>
            
            <div className="mt-12 flex justify-center gap-12 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                GDPR Compliant
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                HIPAA Ready
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                SOC 2 Preparation
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof - Will be populated with real logos */}
      <div className="border-y border-gray-200 bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold text-gray-500 mb-8">
            TRUSTED BY LEADING ORGANIZATIONS
          </p>
          <div className="flex justify-center items-center gap-16 opacity-40">
            <div className="text-2xl font-bold text-gray-400">[Bank Logo]</div>
            <div className="text-2xl font-bold text-gray-400">[Hospital Logo]</div>
            <div className="text-2xl font-bold text-gray-400">[University Logo]</div>
            <div className="text-2xl font-bold text-gray-400">[Enterprise Logo]</div>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div id="features" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything Enterprise IT Demands
            </h2>
            <p className="text-xl text-gray-600">
              The most complete compliance and security suite in the industry
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon="🔍"
              title="Complete Audit Logs"
              description="Track every action with timestamps, user IDs, and IP addresses. Export for compliance audits."
              highlight="The Golden Key"
            />
            <FeatureCard
              icon="🔐"
              title="Enterprise SSO"
              description="SAML 2.0 and OAuth integration with automatic user provisioning. Works with Okta, Azure AD, Google."
            />
            <FeatureCard
              icon="🛡️"
              title="Multi-Factor Auth"
              description="TOTP and SMS two-factor authentication. Enforce MFA for all workspace members."
            />
            <FeatureCard
              icon="👥"
              title="Role-Based Access"
              description="Admin, Editor, and Viewer roles with granular permissions. Workspace isolation."
            />
            <FeatureCard
              icon="⚡"
              title="Rate Limiting"
              description="Prevent abuse with workspace-based rate limits. Protect against DDoS and cost overruns."
            />
            <FeatureCard
              icon="🌍"
              title="Global CDN"
              description="Sub-second load times worldwide. 95% cache hit ratio. Automatic image optimization."
            />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div id="pricing" className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your organization
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <PricingTier
              name="Free"
              price="$0"
              period="/month"
              features={[
                '5 questionnaires',
                '100 responses/month',
                'Basic analytics',
                'Community support',
              ]}
              cta="Get Started"
              ctaLink="/auth/signup"
            />
            <PricingTier
              name="Pro"
              price="$29"
              period="/month"
              features={[
                '50 questionnaires',
                '5,000 responses/month',
                'Advanced analytics',
                'MFA available',
                'Email support',
              ]}
              cta="Start Free Trial"
              ctaLink="/auth/signup?plan=pro"
            />
            <PricingTier
              name="Business"
              price="$99"
              period="/month"
              features={[
                '200 questionnaires',
                '50,000 responses/month',
                'SSO integration',
                'Audit logs (30 days)',
                'Priority support',
              ]}
              cta="Start Free Trial"
              ctaLink="/auth/signup?plan=business"
              highlighted
            />
            <PricingTier
              name="Enterprise"
              price="$10,000"
              period="/year"
              features={[
                'Unlimited questionnaires',
                'Custom response limits',
                'Full audit trail',
                'Dedicated success manager',
                '99.5% SLA',
                'Custom contract',
              ]}
              cta="Schedule Demo"
              ctaLink="#demo"
              enterprise
            />
          </div>

          <div className="mt-12 text-center">
            <a href="#calculator" className="text-blue-600 hover:text-blue-700 font-medium">
              Not sure which plan? Try our ROI calculator →
            </a>
          </div>
        </div>
      </div>

      {/* ROI Calculator */}
      <ROICalculator />

      {/* Trust & Compliance Section */}
      <div className="py-16 bg-gray-50 border-y border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Built for Compliance & Security
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive documentation and certifications to pass your IT security review
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ComplianceCard
              icon="📋"
              title="Security Whitepaper"
              description="Complete security architecture, data flow, and encryption details"
              link="/docs/enterprise/security-whitepaper"
            />
            <ComplianceCard
              icon="✅"
              title="Compliance Datasheet"
              description="GDPR, HIPAA, SOC 2, and regional compliance status"
              link="/docs/enterprise/compliance-datasheet"
            />
            <ComplianceCard
              icon="🔒"
              title="Trust Center"
              description="Real-time security practices, certifications, and incident response"
              link="/security"
            />
            <ComplianceCard
              icon="📊"
              title="Audit Support"
              description="Documentation packages and technical support for your auditors"
              link="#demo"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div id="demo" className="bg-blue-600 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to pass your next IT security review?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Schedule a demo and see how Q-Persona helps enterprises maintain compliance
            </p>
            <form className="max-w-xl mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Work email"
                className="flex-1 rounded-md border-0 px-4 py-3 text-gray-900"
              />
              <button
                type="submit"
                className="rounded-md bg-white px-8 py-3 font-semibold text-blue-600 hover:bg-gray-50"
              >
                Schedule Demo
              </button>
            </form>
            <p className="mt-4 text-sm text-blue-200">
              30-minute demo • No credit card required • Same-day response
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/marketplace">Marketplace</Link></li>
                <li><Link href="/security">Security</Link></li>
                <li><Link href="#pricing">Pricing</Link></li>
                <li><Link href="/docs">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/careers">Careers</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms of Service</Link></li>
                <li><Link href="/security">Security</Link></li>
                <li><Link href="/compliance">Compliance</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/help">Help Center</Link></li>
                <li><Link href="/api">API Docs</Link></li>
                <li><Link href="/status">System Status</Link></li>
                <li><Link href="/experts/submit">Submit Template</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            © 2024 Q-Persona. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, highlight }: {
  icon: string
  title: string
  description: string
  highlight?: string
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-lg transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
        {highlight && (
          <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
            {highlight}
          </span>
        )}
      </h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function PricingTier({ name, price, period, features, cta, ctaLink, highlighted, enterprise }: {
  name: string
  price: string
  period: string
  features: string[]
  cta: string
  ctaLink: string
  highlighted?: boolean
  enterprise?: boolean
}) {
  return (
    <div className={`rounded-lg p-8 ${
      highlighted 
        ? 'border-2 border-blue-500 bg-white shadow-xl scale-105' 
        : 'border border-gray-200 bg-white'
    }`}>
      {highlighted && (
        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 mb-4">
          Most Popular
        </span>
      )}
      <h3 className="text-xl font-bold text-gray-900">{name}</h3>
      <div className="mt-4 flex items-baseline">
        <span className="text-4xl font-bold text-gray-900">{price}</span>
        <span className="ml-1 text-gray-600">{period}</span>
      </div>
      <ul className="mt-6 space-y-3">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start text-sm text-gray-600">
            <svg className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <Link
        href={ctaLink}
        className={`mt-8 block w-full rounded-md px-4 py-3 text-center font-semibold ${
          enterprise
            ? 'bg-gray-900 text-white hover:bg-gray-800'
            : highlighted
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }`}
      >
        {cta}
      </Link>
    </div>
  )
}

function ComplianceCard({ icon, title, description, link }: {
  icon: string
  title: string
  description: string
  link: string
}) {
  return (
    <Link href={link} className="block group">
      <div className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-lg transition h-full">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
          {title}
        </h3>
        <p className="text-sm text-gray-600">{description}</p>
        <div className="mt-4 text-sm font-medium text-blue-600 group-hover:text-blue-700">
          Learn more →
        </div>
      </div>
    </Link>
  )
}
