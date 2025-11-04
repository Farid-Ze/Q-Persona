# Q-Persona Security Whitepaper

**Version 1.0**  
**Last Updated: November 2024**  
**Classification: Public**

## Executive Summary

Q-Persona is an enterprise-grade questionnaire and persona management platform designed with security and compliance at its core. This whitepaper outlines our comprehensive security architecture, data protection measures, and compliance capabilities that enable organizations in regulated industries to deploy our platform with confidence.

**Key Security Highlights:**
- Complete audit trail for all user actions
- Enterprise SSO with SAML 2.0 and OAuth 2.0
- Multi-factor authentication (MFA) support
- Role-based access control (RBAC)
- AES-256 encryption at rest, TLS 1.3 in transit
- Rate limiting and DDoS protection
- GDPR compliant, HIPAA-ready

## 1. Architecture Overview

### 1.1 System Architecture

Q-Persona employs a modern, serverless architecture built on battle-tested enterprise technologies:

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer (Browser)                   │
│                  Next.js 16 + React 19                      │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS/TLS 1.3
┌────────────────────▼────────────────────────────────────────┐
│                  Edge Network Layer                         │
│              Vercel Edge + Cloudflare CDN                   │
│         DDoS Protection + WAF + Rate Limiting               │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                Application Layer                            │
│           Next.js Server Components + API Routes            │
│              Server Actions (Type-Safe)                     │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│              Authentication Layer                           │
│         Supabase Auth + SSO (SAML/OAuth)                   │
│              JWT + Session Management                       │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                  Data Layer                                 │
│           PostgreSQL (Supabase)                            │
│         AES-256 Encryption at Rest                         │
│         Row-Level Security (RLS)                           │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Technology Stack

**Frontend:**
- Next.js 16 with App Router
- React 19 with TypeScript 5.9
- Tailwind CSS for UI
- PostHog for analytics

**Backend:**
- Supabase Backend-as-a-Service
- PostgreSQL 15+ database
- Server Actions for mutations
- RESTful API endpoints

**Infrastructure:**
- Hosting: Vercel Edge Network
- CDN: Cloudflare (170 Tbps DDoS protection)
- Database: Supabase (AWS multi-region)
- Monitoring: PostHog + Supabase Dashboard

## 2. Data Flow and Processing

### 2.1 Request Flow

1. **Client Request** → User initiates action via browser
2. **Edge Processing** → Request hits Vercel Edge (geographically closest)
3. **Authentication** → JWT token validation + session check
4. **Authorization** → RBAC enforcement + workspace isolation
5. **Rate Limiting** → Workspace-based quota enforcement
6. **Business Logic** → Server Actions or API routes process request
7. **Database Access** → PostgreSQL with RLS policies
8. **Audit Logging** → Asynchronous event logging
9. **Response** → Encrypted response sent to client

### 2.2 Data Storage

**User Data:**
- Personally Identifiable Information (PII) encrypted at rest
- Database-level encryption with AES-256
- Application-level encryption for sensitive fields
- Automatic backups every 24 hours (7-day retention)

**Audit Logs:**
- Immutable event log (append-only)
- Stored separately from application data
- 30-day retention (Business tier)
- Unlimited retention (Enterprise tier)
- Exportable in CSV, JSON, PDF formats

**Response Data:**
- Survey responses encrypted in transit and at rest
- Workspace-isolated data access
- Soft-delete with 30-day recovery window
- GDPR right-to-be-forgotten support

## 3. Security Controls

### 3.1 Authentication

**Supported Methods:**
- Email/Password with bcrypt hashing (work factor: 12)
- Magic link (passwordless)
- Social OAuth (Google, GitHub)
- Enterprise SSO (SAML 2.0, OAuth 2.0)

**Session Management:**
- JWT access tokens (15-minute expiry)
- Refresh tokens (7-day expiry, rotated on use)
- Secure, httpOnly cookies
- Device fingerprinting
- Session revocation on logout

**Enterprise SSO:**
- SAML 2.0 protocol support
- OAuth 2.0 / OpenID Connect
- Just-in-Time (JIT) user provisioning
- Automatic attribute mapping
- Support for Okta, Azure AD, Google Workspace, OneLogin

### 3.2 Multi-Factor Authentication (MFA)

**Available Methods:**
- Time-based One-Time Password (TOTP) - RFC 6238
- SMS verification codes
- Authenticator apps (Google Authenticator, Authy, 1Password)

**Enforcement:**
- Optional for Free/Pro tiers
- Recommended for Business tier
- Mandatory option for Enterprise tier
- Per-workspace MFA policies
- Recovery codes for account access

### 3.3 Authorization

**Role-Based Access Control (RBAC):**

| Role | Permissions |
|------|-------------|
| **Admin** | Full workspace access, user management, billing, audit logs |
| **Editor** | Create/edit questionnaires, view responses, export data |
| **Viewer** | Read-only access to questionnaires and responses |

**Workspace Isolation:**
- Multi-tenant architecture with strict data separation
- Row-Level Security (RLS) enforced at database level
- No cross-workspace data leakage
- Workspace-scoped API keys

**API Access:**
- API key authentication for programmatic access
- Scoped permissions per API key
- Rate limiting per API key
- Audit logging for all API calls

### 3.4 Data Encryption

**In Transit:**
- TLS 1.3 for all connections
- HSTS enabled (Strict-Transport-Security)
- Perfect Forward Secrecy (PFS)
- Certificate pinning for API clients

**At Rest:**
- Database: AES-256 encryption
- File uploads: Server-side encryption
- Backups: Encrypted before storage
- Encryption key management via AWS KMS

### 3.5 Network Security

**DDoS Protection:**
- Cloudflare's 170 Tbps mitigation capacity
- Automatic attack detection and response
- Edge-level request filtering
- Geographic traffic analysis

**Web Application Firewall (WAF):**
- OWASP Top 10 protection
- SQL injection prevention
- Cross-site scripting (XSS) blocking
- Custom rule sets for enterprise customers

**Rate Limiting:**
- Workspace-based quotas
- IP-based rate limits for anonymous access
- Exponential backoff for failed authentication
- API endpoint-specific limits

**Abuse Prevention:**
- Automated bot detection
- CAPTCHA for suspicious activity
- Login attempt throttling
- Suspicious IP blocking

## 4. Audit Trail and Monitoring

### 4.1 Audit Logging

**What We Log:**
Every action in the system generates an immutable audit event:

```json
{
  "timestamp": "2024-11-04T14:23:41.123Z",
  "event_id": "evt_7x9k2m4p",
  "actor": {
    "user_id": "usr_abc123",
    "email": "sarah.tan@enterprise.com",
    "role": "editor"
  },
  "action": "questionnaire.viewed",
  "resource": {
    "type": "questionnaire",
    "id": "qst_xyz789",
    "name": "Customer Satisfaction Q4 2024"
  },
  "metadata": {
    "ip_address": "203.0.113.42",
    "user_agent": "Mozilla/5.0...",
    "workspace_id": "wks_marketing",
    "session_id": "ses_def456"
  },
  "result": "success"
}
```

**Event Categories:**
- Authentication (login, logout, MFA, SSO)
- Authorization (permission grants/denials)
- Data access (view, create, update, delete)
- Configuration changes (settings, integrations)
- User management (invite, remove, role changes)
- Billing events (subscription changes)
- API calls (all programmatic access)

**Audit Log Features:**
- Immutable (cannot be modified or deleted)
- Real-time event streaming
- Advanced filtering and search
- Export capabilities (CSV, JSON, PDF)
- Retention: 30 days (Business), Unlimited (Enterprise)
- Compliance reporting templates

### 4.2 Monitoring and Alerting

**System Monitoring:**
- 24/7 uptime monitoring
- Performance metrics (p50, p95, p99 latency)
- Error rate tracking
- Database query performance
- API endpoint health checks

**Security Monitoring:**
- Failed login attempts
- Unusual access patterns
- Large data exports
- Configuration changes
- API key usage anomalies

**Incident Response:**
- Detection: <15 minutes
- Initial assessment: <1 hour
- Containment: <4 hours
- Customer notification: <24 hours (for security incidents)

## 5. Compliance and Certifications

### 5.1 GDPR (General Data Protection Regulation)

**Current Status: ✅ Compliant**

**Key Requirements Met:**
- ✅ Lawful basis for processing (consent, contract, legitimate interest)
- ✅ Data subject rights (access, rectification, erasure, portability)
- ✅ Privacy by design and default
- ✅ Data protection impact assessments (DPIA)
- ✅ Data processing agreements (DPA) available
- ✅ EU representative appointed
- ✅ Data breach notification procedures (<72 hours)
- ✅ Cookie consent management
- ✅ Cross-border data transfer safeguards

**User Rights:**
- Right to access: Self-service data export
- Right to rectification: Profile editing capabilities
- Right to erasure: Account deletion with data purge
- Right to data portability: Export in JSON/CSV format
- Right to object: Opt-out of non-essential processing

### 5.2 HIPAA (Health Insurance Portability and Accountability Act)

**Current Status: 🟡 HIPAA-Ready**

**Readiness:**
- ✅ Administrative safeguards (access controls, training)
- ✅ Physical safeguards (data center security via AWS)
- ✅ Technical safeguards (encryption, audit logs, MFA)
- ✅ Business Associate Agreement (BAA) available for Enterprise customers
- ⏳ Third-party HIPAA compliance audit (scheduled Q1 2025)

**Note:** Healthcare customers must sign BAA and complete risk assessment before storing Protected Health Information (PHI).

### 5.3 SOC 2 Type II

**Current Status: ⏳ In Progress (Target: Q2 2025)**

**Five Trust Service Criteria:**
- ✅ Security: Controls to protect against unauthorized access
- ✅ Availability: System uptime and disaster recovery
- ✅ Processing Integrity: Quality and timely processing
- ✅ Confidentiality: Protection of sensitive information
- ⏳ Privacy: Collection, use, retention, disclosure of personal information

**Progress:**
- Controls designed and implemented
- 90-day observation period: In progress
- Third-party auditor: Engaged
- Expected completion: Q2 2025

### 5.4 ISO 27001

**Current Status: 📅 Roadmap (Target: Q4 2025)**

**Preparation Status:**
- Information Security Management System (ISMS) framework established
- Risk assessment methodology defined
- Security policies documented
- Internal audits scheduled
- Certification audit: Planned Q4 2025

### 5.5 Additional Compliance

**Indonesia Personal Data Protection (PDP) Law:**
- ✅ Compliant with Law No. 27/2022
- ✅ Data localization options available
- ✅ Local representative appointed

**Other Frameworks:**
- NIST Cybersecurity Framework alignment
- CIS Controls implementation
- OWASP security best practices

## 6. Data Residency and Sovereignty

### 6.1 Current Regions

**Primary:**
- AWS Asia Pacific (Singapore) - ap-southeast-1
- AWS Asia Pacific (Tokyo) - ap-northeast-1

**Additional Regions (Enterprise):**
- AWS US East (N. Virginia) - us-east-1
- AWS Europe (Frankfurt) - eu-central-1
- Custom regions available on request

### 6.2 Data Localization

**Enterprise customers can specify:**
- Primary data storage region
- Backup storage region
- Processing restrictions (EU-only, APAC-only)
- Cross-border transfer controls

**Compliance:**
- Data residency requirements met
- GDPR adequate protection mechanisms
- Schrems II compliant transfer safeguards

## 7. Disaster Recovery and Business Continuity

### 7.1 Backup Strategy

**Database Backups:**
- Frequency: Every 24 hours
- Retention: 7 days (standard), 30 days (enterprise)
- Point-in-time recovery: Up to 7 days
- Geographic redundancy: Multi-region replication
- Backup encryption: AES-256

**Application State:**
- Infrastructure as Code (IaC) in version control
- Automated deployment pipelines
- Environment recreation in <1 hour

### 7.2 Disaster Recovery

**Recovery Objectives:**
- Recovery Time Objective (RTO): 4 hours
- Recovery Point Objective (RPO): 24 hours
- Data loss tolerance: <1 day of data

**Disaster Scenarios:**
- Regional outage: Automatic failover to secondary region
- Database corruption: Restore from latest backup
- Application failure: Rollback to previous stable version
- Complete infrastructure loss: Rebuild from IaC within 4 hours

### 7.3 High Availability

**System Design:**
- Multi-region deployment for Enterprise tier
- Auto-scaling based on load
- Database read replicas for performance
- CDN for static asset delivery
- Health checks and automatic failover

**Uptime SLA:**
- Free/Pro: Best effort (no SLA)
- Business: 99.0% uptime
- Enterprise: 99.5% uptime with credits

**Historical Uptime:**
- Last 12 months: 99.7%
- Longest downtime: 47 minutes (scheduled maintenance)
- Unplanned downtime: <2 hours/year

## 8. Incident Response

### 8.1 Security Incident Response Plan

**Phase 1: Detection & Analysis**
- Automated security monitoring alerts
- Manual security report triage
- Incident severity classification
- Incident response team activation

**Phase 2: Containment**
- Isolate affected systems
- Block malicious actors
- Preserve evidence for investigation
- Assess blast radius

**Phase 3: Eradication**
- Remove threat from environment
- Patch vulnerabilities
- Reset compromised credentials
- Deploy security updates

**Phase 4: Recovery**
- Restore affected systems
- Verify system integrity
- Resume normal operations
- Enhanced monitoring period

**Phase 5: Post-Incident**
- Root cause analysis
- Lessons learned documentation
- Control improvements
- Customer communication

### 8.2 Communication

**Customer Notification:**
- Security incidents: Within 24 hours
- Data breaches: Within 72 hours (GDPR requirement)
- Major outages: Real-time status page updates
- Planned maintenance: 7 days advance notice

**Channels:**
- Email to workspace admins
- In-app notifications
- Public status page: status.q-persona.com
- Enterprise: Dedicated Slack channel

### 8.3 Vulnerability Management

**Vulnerability Disclosure Program:**
- Responsible disclosure policy published
- Security researchers encouraged to report
- Bug bounty program (planned Q2 2025)
- 90-day coordinated disclosure timeline

**Patch Management:**
- Critical vulnerabilities: <24 hours
- High severity: <7 days
- Medium severity: <30 days
- Low severity: Next release cycle

**Security Updates:**
- Dependency scanning: Automated daily
- CVE monitoring: Real-time alerts
- Security advisories: Evaluated within 24 hours

## 9. Third-Party Security

### 9.1 Vendor Risk Management

**Key Service Providers:**
- Vercel (Hosting) - SOC 2 Type II certified
- Supabase (Database) - SOC 2 Type II in progress
- Cloudflare (CDN/Security) - ISO 27001, SOC 2 Type II
- Stripe (Payments) - PCI DSS Level 1, SOC 2 Type II

**Vendor Assessment:**
- Security questionnaires completed
- Annual security reviews
- Contract security requirements
- Data processing agreements signed

### 9.2 Subprocessor List

**Current Subprocessors:**
1. Vercel Inc. (Infrastructure) - United States
2. Supabase Inc. (Database) - United States/Singapore
3. Cloudflare Inc. (CDN/Security) - Global
4. Stripe Inc. (Payment Processing) - United States
5. PostHog Inc. (Analytics) - United States/EU

**Enterprise customers:** 30-day notice before new subprocessor additions.

## 10. Security Best Practices for Customers

### 10.1 Account Security

**Recommendations:**
- Enable MFA for all users
- Use strong, unique passwords (>12 characters)
- Regularly review workspace members
- Implement least-privilege access
- Use SSO with identity provider

### 10.2 Data Protection

**Best Practices:**
- Classify sensitive questionnaires
- Use workspace isolation for departments
- Regularly export audit logs
- Set appropriate response retention
- Train team on data handling

### 10.3 Integration Security

**API Key Management:**
- Rotate API keys every 90 days
- Use separate keys for dev/staging/production
- Never commit keys to version control
- Revoke unused keys immediately
- Monitor API usage patterns

## 11. Conclusion

Q-Persona is built on a foundation of security, compliance, and trust. Our comprehensive security architecture, transparent practices, and commitment to continuous improvement make us the ideal survey platform for enterprises in regulated industries.

**Contact Information:**
- Security inquiries: security@q-persona.com
- Report vulnerability: security@q-persona.com
- Enterprise sales: sales@q-persona.com
- Support: support@q-persona.com

**Resources:**
- Trust Center: q-persona.com/security
- Status Page: status.q-persona.com
- Documentation: docs.q-persona.com
- Privacy Policy: q-persona.com/privacy
- Terms of Service: q-persona.com/terms

---

**Document Version History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Nov 2024 | Security Team | Initial release |

**Next Review:** February 2025

**Classification:** Public

---

*This whitepaper is provided for informational purposes and may be shared with customers, prospects, and auditors.*
