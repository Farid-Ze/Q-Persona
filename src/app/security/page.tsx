/**
 * Security & Trust Center Page
 * Week 1 Day 8-10: Website Updates
 * Demonstrates security practices and compliance status
 */

import Link from 'next/link'

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Q-Persona
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/enterprise" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
                Enterprise
              </Link>
              <Link href="/auth/login" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-50 to-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Security & Compliance
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enterprise-grade security built into every layer of Q-Persona.
              We take the protection of your data seriously.
            </p>
          </div>
        </div>
      </div>

      {/* Security Overview */}
      <div className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SecurityBadge
              title="SOC 2 Type I"
              status="In Progress"
              description="Undergoing SOC 2 Type I audit with expected completion Q2 2024"
            />
            <SecurityBadge
              title="GDPR Compliant"
              status="Certified"
              description="Full compliance with EU General Data Protection Regulation"
            />
            <SecurityBadge
              title="HIPAA Ready"
              status="Ready"
              description="Healthcare-ready with complete audit trail and encryption"
            />
          </div>
        </div>
      </div>

      {/* Security Layers */}
      <div className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Multi-Layer Security Architecture
          </h2>

          <div className="space-y-8">
            <SecurityLayer
              number="1"
              title="Network Security"
              items={[
                'Global CDN with DDoS protection',
                'Rate limiting (100-5000 req/min based on tier)',
                'Web Application Firewall (WAF)',
                'TLS 1.3 encryption for all traffic',
              ]}
            />
            <SecurityLayer
              number="2"
              title="Authentication & Authorization"
              items={[
                'Multi-Factor Authentication (TOTP & SMS)',
                'Single Sign-On (SAML 2.0, OAuth)',
                'Role-Based Access Control (RBAC)',
                'Workspace-level isolation',
              ]}
            />
            <SecurityLayer
              number="3"
              title="Data Protection"
              items={[
                'Encryption at rest (AES-256)',
                'Encryption in transit (TLS 1.3)',
                'Database encryption (Supabase)',
                'Secure key management',
              ]}
            />
            <SecurityLayer
              number="4"
              title="Audit & Compliance"
              items={[
                'Complete audit trail with timestamps',
                'IP address and user-agent logging',
                'Exportable compliance reports',
                'GDPR data portability',
              ]}
            />
            <SecurityLayer
              number="5"
              title="Application Security"
              items={[
                'Regular security audits',
                'Dependency vulnerability scanning',
                'Secure development lifecycle (SDLC)',
                'Bug bounty program (coming Q2 2024)',
              ]}
            />
          </div>
        </div>
      </div>

      {/* Compliance Matrix */}
      <div className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Compliance Status
          </h2>

          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Standard</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <ComplianceRow
                  standard="GDPR"
                  status="Compliant"
                  details="Full data portability, right to deletion, audit trails"
                  statusColor="green"
                />
                <ComplianceRow
                  standard="HIPAA"
                  status="Ready"
                  details="Encryption, audit logs, access controls in place"
                  statusColor="green"
                />
                <ComplianceRow
                  standard="SOC 2 Type I"
                  status="In Progress"
                  details="Audit scheduled for Q2 2024"
                  statusColor="yellow"
                />
                <ComplianceRow
                  standard="SOC 2 Type II"
                  status="Planned"
                  details="6-month observation period begins Q3 2024"
                  statusColor="gray"
                />
                <ComplianceRow
                  standard="ISO 27001"
                  status="Partial"
                  details="Security controls implemented, certification planned Q4 2024"
                  statusColor="yellow"
                />
                <ComplianceRow
                  standard="PCI DSS"
                  status="N/A"
                  details="Payment processing handled by Stripe (PCI Level 1)"
                  statusColor="gray"
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Incident Response */}
      <div className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Incident Response Policy
            </h2>

            <div className="prose prose-blue max-w-none">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Commitment</h3>
              <p className="text-gray-600 mb-6">
                Q-Persona maintains a comprehensive incident response plan to quickly identify,
                contain, and resolve security incidents while maintaining transparency with our customers.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Response Timeline</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="font-semibold text-gray-900 mr-2">15 minutes:</span>
                  Initial detection and alerting
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-gray-900 mr-2">1 hour:</span>
                  Incident assessment and classification
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-gray-900 mr-2">4 hours:</span>
                  Containment and mitigation initiated
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-gray-900 mr-2">24 hours:</span>
                  Customer notification (if impact confirmed)
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-gray-900 mr-2">7 days:</span>
                  Post-incident review and report
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">Report a Security Issue</h3>
              <p className="text-gray-600 mb-4">
                If you discover a security vulnerability, please report it to:
              </p>
              <p className="text-blue-600 font-medium">
                security@q-persona.com
              </p>
              <p className="text-gray-600 mt-2">
                We will acknowledge receipt within 24 hours and provide regular updates.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Centers */}
      <div className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Infrastructure & Data Residency
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Primary Infrastructure</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="mr-2 h-5 w-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Hosted on AWS/Supabase (ISO 27001, SOC 2)
                </li>
                <li className="flex items-start">
                  <svg className="mr-2 h-5 w-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Multi-region redundancy
                </li>
                <li className="flex items-start">
                  <svg className="mr-2 h-5 w-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Daily automated backups
                </li>
                <li className="flex items-start">
                  <svg className="mr-2 h-5 w-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Point-in-time recovery
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Data Residency</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="mr-2 h-5 w-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Default: Singapore (APAC)
                </li>
                <li className="flex items-start">
                  <svg className="mr-2 h-5 w-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  EU region available (GDPR compliance)
                </li>
                <li className="flex items-start">
                  <svg className="mr-2 h-5 w-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  US region available (Enterprise)
                </li>
                <li className="flex items-start">
                  <svg className="mr-2 h-5 w-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Custom regions on request
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Documentation Downloads */}
      <div className="py-16 bg-white border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Compliance Documentation
            </h2>
            <p className="text-lg text-gray-600">
              Download comprehensive security and compliance documentation for your IT review
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <a
              href="https://github.com/Farid-Ze/Q-Persona/blob/main/docs/enterprise/security-whitepaper.md"
              target="_blank"
              rel="noopener noreferrer"
              className="block group rounded-lg border-2 border-gray-200 p-6 hover:border-blue-500 hover:shadow-lg transition"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                    Security Whitepaper
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    30+ pages covering architecture, encryption, audit logging, and security controls
                  </p>
                  <div className="flex items-center text-sm text-blue-600 font-medium">
                    View Document
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </a>

            <a
              href="https://github.com/Farid-Ze/Q-Persona/blob/main/docs/enterprise/compliance-datasheet.md"
              target="_blank"
              rel="noopener noreferrer"
              className="block group rounded-lg border-2 border-gray-200 p-6 hover:border-blue-500 hover:shadow-lg transition"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                    Compliance Datasheet
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Complete compliance status for GDPR, HIPAA, SOC 2, ISO 27001, and regional regulations
                  </p>
                  <div className="flex items-center text-sm text-blue-600 font-medium">
                    View Document
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-gray-600 mb-4">
              Need additional documentation for your IT security review?
            </p>
            <Link
              href="/enterprise#demo"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Contact our security team for DPA, BAA, and other compliance documents →
            </Link>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-600 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Questions about our security?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Our security team is here to help with your compliance requirements
          </p>
          <Link
            href="/enterprise#demo"
            className="inline-block rounded-md bg-white px-8 py-3 font-semibold text-blue-600 hover:bg-gray-50"
          >
            Contact Security Team
          </Link>
        </div>
      </div>
    </div>
  )
}

function SecurityBadge({ title, status, description }: {
  title: string
  status: string
  description: string
}) {
  const statusColors = {
    'Certified': 'bg-green-100 text-green-800',
    'Ready': 'bg-blue-100 text-blue-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${statusColors[status as keyof typeof statusColors]}`}>
        {status}
      </span>
      <p className="mt-4 text-sm text-gray-600">{description}</p>
    </div>
  )
}

function SecurityLayer({ number, title, items }: {
  number: string
  title: string
  items: string[]
}) {
  return (
    <div className="flex gap-6">
      <div className="flex-shrink-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg">
          {number}
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-start text-gray-600">
              <svg className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function ComplianceRow({ standard, status, details, statusColor }: {
  standard: string
  status: string
  details: string
  statusColor: 'green' | 'yellow' | 'gray'
}) {
  const colors = {
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    gray: 'bg-gray-100 text-gray-800',
  }

  return (
    <tr>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">{standard}</td>
      <td className="px-6 py-4 text-sm">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[statusColor]}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">{details}</td>
    </tr>
  )
}
