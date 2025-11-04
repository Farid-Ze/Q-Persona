# Q-Persona Security Whitepaper

**Version:** 1.0  
**Last Updated:** November 4, 2025  
**Classification:** Public

---

## Executive Summary

Q-Persona is an enterprise-grade questionnaire and persona management platform built with security and compliance as foundational principles. This whitepaper details our comprehensive security architecture, data protection mechanisms, and compliance framework designed to meet the stringent requirements of regulated industries including banking, healthcare, and government sectors.

**Key Security Highlights:**
- Complete audit trail with immutable logging
- End-to-end encryption (TLS 1.3 + AES-256)
- Multi-factor authentication (TOTP, SMS)
- Enterprise SSO (SAML 2.0, OAuth 2.0)
- Role-based access control with workspace isolation
- 99.5% uptime SLA with redundant infrastructure

---

## 1. Architecture Overview

### 1.1 Technology Stack

Q-Persona leverages a modern, serverless architecture for optimal security and scalability:

```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                          │
│  Next.js 16 (React 19) + TypeScript + Tailwind CSS     │
└────────────────────┬────────────────────────────────────┘
                     │ TLS 1.3
┌────────────────────┴────────────────────────────────────┐
│                Application Layer                         │
│  - Next.js API Routes (RESTful + Server Actions)        │
│  - Rate Limiting (100-5000 req/min)                     │
│  - Authentication Middleware                            │
│  - RBAC Authorization                                   │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────┐
│              Backend-as-a-Service (Supabase)            │
│  - PostgreSQL 15 (encrypted at rest)                    │
│  - Row Level Security (RLS)                             │
│  - Real-time subscriptions                              │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────┐
│                Infrastructure Layer                      │
│  - AWS (Primary: Singapore, Replicas: US, EU)          │
│  - Vercel Edge Network (CDN)                            │
│  - DDoS Protection (Cloudflare)                         │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Data Flow and Isolation

Every data request follows a secure, multi-layer validation process:

1. **Request Reception:** TLS 1.3 encrypted connection established
2. **Authentication:** JWT token validation + session verification
3. **Rate Limiting:** Tier-based request throttling (workspace-scoped)
4. **Authorization:** RBAC permission check (action-level granularity)
5. **Data Access:** PostgreSQL RLS enforces workspace isolation
6. **Audit Logging:** All actions logged with full context
7. **Response:** Encrypted data returned to client

**Workspace Isolation:**
```sql
-- Every query automatically filtered by workspace_id
-- via PostgreSQL Row Level Security policies
CREATE POLICY "Users can only access their workspace data"
ON questionnaires FOR SELECT
USING (workspace_id IN (
  SELECT workspace_id FROM workspace_members 
  WHERE user_id = auth.uid()
));
```

---

## 2. Authentication & Authorization

### 2.1 Multi-Factor Authentication (MFA)

**Supported Methods:**
- **TOTP (Time-based One-Time Password):** Compatible with Google Authenticator, Authy, 1Password
- **SMS:** Backup authentication via SMS verification
- **Recovery Codes:** One-time use backup codes for account recovery

**MFA Enforcement:**
- Workspace administrators can enforce MFA for all members
- MFA required for privileged actions (billing, SSO configuration, audit log access)
- 30-day grace period for MFA enrollment with daily reminders

### 2.2 Single Sign-On (SSO)

**Protocols Supported:**
- **SAML 2.0:** Full SAML 2.0 SP implementation
- **OAuth 2.0:** OpenID Connect (OIDC) support
- **Supported Identity Providers:** Okta, Azure AD, Google Workspace, OneLogin, Auth0

**SSO Features:**
- Automatic user provisioning (JIT - Just In Time)
- Group-based role mapping
- Session timeout synchronization
- Single logout (SLO) support

**Configuration Example:**
```json
{
  "provider": "okta",
  "entityId": "https://q-persona.com",
  "ssoUrl": "https://your-org.okta.com/sso/saml",
  "certificate": "-----BEGIN CERTIFICATE-----...",
  "attributeMapping": {
    "email": "email",
    "firstName": "firstName",
    "lastName": "lastName",
    "role": "groups"
  }
}
```

### 2.3 Role-Based Access Control (RBAC)

**Three-Tier Role System:**

| Role     | Permissions                                      |
|----------|--------------------------------------------------|
| **Viewer** | Read-only access to questionnaires and responses |
| **Editor** | Create/edit questionnaires, view audit logs      |
| **Admin**  | Full workspace control + billing + SSO config    |

**Granular Action Codes:**
```typescript
// Permission system with fine-grained action codes
type Action = 
  | 'questionnaires:create'
  | 'questionnaires:read'
  | 'questionnaires:update'
  | 'questionnaires:delete'
  | 'workspace:settings'
  | 'workspace:billing'
  | 'workspace:audit:read'
  | 'workspace:members:manage'
  | 'workspace:sso:configure'
```

---

## 3. Data Protection

### 3.1 Encryption

**At Rest:**
- **Database:** AES-256 encryption via Supabase (AWS KMS)
- **Backups:** Encrypted with separate keys, stored in different regions
- **File Uploads:** AES-256 server-side encryption (S3)

**In Transit:**
- **TLS 1.3:** All API and web traffic
- **Certificate Pinning:** Mobile apps (planned Q2 2024)
- **Perfect Forward Secrecy:** Ephemeral key exchange (ECDHE)

**Key Management:**
- AWS KMS for encryption key lifecycle
- Automatic key rotation every 90 days
- Separate keys per environment (dev, staging, production)

### 3.2 Data Retention & Deletion

**Retention Policies:**
- **Audit Logs:** 
  - Business tier: 30 days
  - Enterprise tier: Unlimited (configurable)
- **Response Data:** Retained per customer contract (default: 5 years)
- **Deleted Data:** Soft delete with 30-day recovery period, then hard delete

**GDPR Compliance:**
- **Right to Access:** Export all personal data in JSON format
- **Right to Deletion:** Complete data purge within 30 days
- **Right to Portability:** Machine-readable export format

### 3.3 Data Residency

**Regional Data Storage:**
- **Default:** Singapore (AWS ap-southeast-1)
- **EU Customers:** Frankfurt (AWS eu-central-1) - GDPR compliant
- **US Customers:** Virginia (AWS us-east-1) - optional
- **Custom:** Available for Enterprise customers

**Cross-Border Data Transfers:**
- Standard Contractual Clauses (SCCs) for EU-US transfers
- No data transfer to high-risk jurisdictions

---

## 4. Audit Logging & Compliance

### 4.1 Complete Audit Trail

**Every action logged includes:**
```json
{
  "id": "audit_abc123",
  "timestamp": "2025-11-04T18:46:53.957Z",
  "workspaceId": "ws_xyz789",
  "userId": "user_123",
  "action": "questionnaires:delete",
  "resourceType": "questionnaire",
  "resourceId": "quest_456",
  "ipAddress": "203.0.113.42",
  "userAgent": "Mozilla/5.0...",
  "metadata": {
    "questionnaireName": "Employee Survey Q4",
    "previousState": {...},
    "changes": {...}
  },
  "result": "success"
}
```

**Audit Log Coverage:**
- User authentication (login, logout, MFA)
- Resource mutations (create, update, delete)
- Permission changes (role assignments)
- Configuration changes (SSO, webhooks, API keys)
- Data exports (CSV, JSON)
- Failed access attempts

**Log Integrity:**
- **Immutable:** Audit logs cannot be modified or deleted by users
- **Hash-chained:** Each log entry includes hash of previous entry
- **Tamper-evident:** Any modification detected via hash verification

### 4.2 Compliance Exports

**Automated Report Generation:**
- **Daily:** Failed authentication attempts
- **Weekly:** Permission change summary
- **Monthly:** Full audit log export
- **On-Demand:** Custom date range exports

**Export Formats:**
- CSV (Excel-compatible)
- JSON (machine-readable)
- PDF (audit-ready reports with signatures)

---

## 5. Network Security

### 5.1 Rate Limiting

**Tier-Based Limits:**
| Tier       | Requests/Minute | Burst Allowance |
|------------|-----------------|-----------------|
| Free       | 100             | 120             |
| Pro        | 500             | 600             |
| Business   | 2,000           | 2,500           |
| Enterprise | 5,000           | 10,000          |

**Rate Limit Headers:**
```http
X-RateLimit-Limit: 500
X-RateLimit-Remaining: 342
X-RateLimit-Reset: 1699120000
```

**Protection Against:**
- Brute force attacks (credential stuffing)
- DDoS and resource exhaustion
- API abuse and cost overruns

### 5.2 DDoS Protection

**Multi-Layer Defense:**
1. **CDN Layer:** Cloudflare DDoS protection (up to 100 Tbps)
2. **Application Layer:** Rate limiting + CAPTCHA challenges
3. **Database Layer:** Connection pooling + query timeout limits

### 5.3 Web Application Firewall (WAF)

**OWASP Top 10 Protection:**
- SQL Injection prevention
- Cross-Site Scripting (XSS) filtering
- CSRF token validation
- Malicious file upload blocking
- Security header enforcement (CSP, HSTS, X-Frame-Options)

---

## 6. Infrastructure Security

### 6.1 Hosting & Redundancy

**Primary Infrastructure:**
- **Hosting:** AWS (ISO 27001, SOC 2 Type II certified)
- **CDN:** Vercel Edge Network (200+ global PoPs)
- **Database:** Supabase (managed PostgreSQL with automated backups)

**High Availability:**
- **Uptime SLA:** 99.5% for Enterprise tier
- **Multi-AZ Deployment:** Automatic failover within 30 seconds
- **Load Balancing:** Geographic distribution with health checks

### 6.2 Backup & Disaster Recovery

**Backup Strategy:**
- **Frequency:** Continuous (point-in-time recovery available)
- **Retention:** 30 days for automated backups
- **Storage:** Geographically distributed (3 regions minimum)
- **Encryption:** AES-256 with separate backup keys

**Disaster Recovery:**
- **RTO (Recovery Time Objective):** 1 hour
- **RPO (Recovery Point Objective):** 5 minutes
- **Annual DR Test:** Full disaster recovery drill

### 6.3 Security Monitoring

**24/7 Monitoring:**
- **Infrastructure:** AWS CloudWatch + Datadog
- **Application:** Error tracking (Sentry), APM
- **Security:** Intrusion detection, anomaly detection
- **Uptime:** StatusPage.io (public status page)

**Incident Response:**
- **Detection:** Automated alerts within 15 minutes
- **Escalation:** On-call engineer notified immediately
- **Communication:** Customer notification within 4 hours (if impacted)

---

## 7. Application Security

### 7.1 Secure Development Lifecycle (SDL)

**Security in SDLC:**
1. **Design:** Threat modeling, security architecture review
2. **Development:** Secure coding standards, peer code review
3. **Testing:** Automated security scanning, penetration testing
4. **Deployment:** Secrets management, infrastructure-as-code
5. **Operations:** Continuous monitoring, incident response

### 7.2 Vulnerability Management

**Dependency Scanning:**
- **Automated:** Daily npm audit, Snyk scanning
- **SLA:** Critical vulnerabilities patched within 24 hours
- **Disclosure:** CVE publication for public vulnerabilities

**Penetration Testing:**
- **Frequency:** Annual third-party penetration test
- **Scope:** Full application + infrastructure assessment
- **Remediation:** 90-day remediation timeline for findings

### 7.3 Secure Code Practices

**Security Controls:**
- **Input Validation:** All user input sanitized and validated
- **Output Encoding:** XSS prevention via context-aware encoding
- **Parameterized Queries:** SQL injection prevention
- **CSRF Protection:** Token-based CSRF validation
- **Secret Management:** Environment variables, never committed to git

---

## 8. Compliance Framework

### 8.1 Current Compliance Status

| Standard      | Status       | Details                                    |
|---------------|--------------|-------------------------------------------|
| **GDPR**      | ✅ Compliant | Full data portability, right to deletion |
| **HIPAA**     | ✅ Ready     | BAA available, encryption + audit logs    |
| **SOC 2 Type I** | 🟡 In Progress | Audit scheduled Q2 2024               |
| **ISO 27001** | 🟡 Partial   | Controls implemented, cert Q4 2024        |

### 8.2 GDPR Compliance

**Data Protection Principles:**
- **Lawfulness:** Explicit consent, legitimate interest
- **Purpose Limitation:** Data used only for stated purposes
- **Data Minimization:** Collect only necessary data
- **Accuracy:** Mechanisms to update/correct data
- **Storage Limitation:** Configurable retention policies
- **Integrity & Confidentiality:** Encryption + access controls

**GDPR Rights Implemented:**
- Right to Access (data export)
- Right to Rectification (profile editing)
- Right to Erasure ("right to be forgotten")
- Right to Restrict Processing (account suspension)
- Right to Data Portability (JSON export)
- Right to Object (opt-out mechanisms)

### 8.3 HIPAA Readiness

**Technical Safeguards:**
- ✅ Access Control (unique user IDs, emergency access, auto logoff)
- ✅ Audit Controls (complete audit trail)
- ✅ Integrity Controls (hash verification, tamper detection)
- ✅ Transmission Security (TLS 1.3 encryption)

**Business Associate Agreement (BAA):**
- Available for Enterprise customers handling PHI
- Includes breach notification procedures
- Regular compliance audits

---

## 9. Privacy & Data Handling

### 9.1 Privacy Policy Highlights

**Data Collection:**
- **Account Data:** Email, name, organization (required)
- **Usage Data:** Questionnaire interactions, response data
- **Technical Data:** IP address, browser info (for audit logs)

**Data Usage:**
- Service delivery and improvement
- Security monitoring and fraud prevention
- Compliance with legal obligations
- No selling or sharing with third parties

### 9.2 Third-Party Subprocessors

**Critical Vendors:**
| Vendor     | Purpose                | Data Access | Location    | Compliance      |
|------------|------------------------|-------------|-------------|-----------------|
| AWS        | Infrastructure hosting | Full        | Singapore   | SOC 2, ISO 27001 |
| Supabase   | Database management    | Full        | Singapore   | SOC 2, GDPR     |
| Vercel     | CDN & hosting          | Metadata    | Global      | SOC 2           |
| Stripe     | Payment processing     | Billing     | US          | PCI DSS Level 1 |

**Vendor Security:**
- All vendors undergo annual security review
- Data Processing Agreements (DPAs) in place
- Regular vendor security assessments

---

## 10. Incident Response

### 10.1 Incident Response Plan

**Response Timeline:**
```
T+0:     Incident detected (automated alerts)
T+15m:   On-call engineer engaged
T+1h:    Incident assessment & classification
T+4h:    Containment & mitigation initiated
T+24h:   Customer notification (if impacted)
T+7d:    Post-incident review & report
```

**Incident Classification:**
- **Critical:** Data breach, complete service outage
- **High:** Degraded performance, security vulnerability
- **Medium:** Partial feature unavailability
- **Low:** Minor issues, scheduled maintenance

### 10.2 Security Incident Notification

**Customer Communication:**
- **Trigger:** Confirmed security incident affecting customer data
- **Timeline:** Within 24 hours of confirmation
- **Channel:** Email to workspace administrators
- **Content:** Incident summary, impact, remediation steps

### 10.3 Reporting Security Issues

**Responsible Disclosure:**
- **Contact:** security@q-persona.com
- **Response Time:** Initial acknowledgment within 24 hours
- **Reward Program:** Bug bounty program (launching Q2 2024)

**What to Report:**
- Authentication bypasses
- Authorization flaws (accessing other workspaces)
- Data leakage vulnerabilities
- XSS, CSRF, SQL injection
- Infrastructure misconfigurations

---

## 11. Roadmap

### Q1 2024 (Completed)
- ✅ Complete audit logging
- ✅ SSO (SAML 2.0, OAuth)
- ✅ Multi-factor authentication
- ✅ Role-based access control
- ✅ Rate limiting

### Q2 2024 (In Progress)
- 🔄 SOC 2 Type I certification
- 🔄 Bug bounty program launch
- 🔄 Mobile app certificate pinning
- 🔄 Advanced threat detection

### Q3-Q4 2024 (Planned)
- ⏳ SOC 2 Type II certification
- ⏳ ISO 27001 certification
- ⏳ Enhanced DLP (Data Loss Prevention)
- ⏳ End-to-end encryption for sensitive fields

---

## 12. Contact & Support

**Security Team:**
- **Email:** security@q-persona.com
- **Response Time:** 24 hours for security inquiries
- **Escalation:** Urgent security issues escalated to CTO

**Sales & Compliance:**
- **Email:** sales@q-persona.com
- **Contact:** Schedule a call via our enterprise page
- **Schedule Demo:** https://q-persona.com/enterprise#demo

**Documentation:**
- Security Whitepaper (this document)
- [Compliance Datasheet](./compliance-datasheet.md)
- [Trust Center](https://q-persona.com/security)
- [API Security Documentation](../features/API_TESTING.md)

---

## Appendix A: Security Certifications

**Current Certifications:**
- ISO 27001 (Supabase infrastructure)
- SOC 2 Type II (AWS infrastructure)
- PCI DSS Level 1 (Stripe payment processing)

**In Progress:**
- SOC 2 Type I (Q-Persona platform) - Expected Q2 2024

**Planned:**
- SOC 2 Type II (Q-Persona platform) - Expected Q4 2024
- ISO 27001 (Q-Persona platform) - Expected Q4 2024

---

## Appendix B: Compliance Checklists

### Enterprise IT Security Checklist

- [x] Data encryption at rest (AES-256)
- [x] Data encryption in transit (TLS 1.3)
- [x] Multi-factor authentication available
- [x] Single Sign-On support (SAML, OAuth)
- [x] Role-based access control
- [x] Complete audit logging
- [x] Data export capabilities
- [x] GDPR compliance features
- [x] Uptime SLA (99.5% Enterprise)
- [x] Regular security audits
- [x] Incident response plan
- [x] Data backup & recovery
- [x] Regional data residency options

---

**Document Version History:**

| Version | Date            | Changes                          | Author         |
|---------|-----------------|----------------------------------|----------------|
| 1.0     | November 4, 2025 | Initial release                  | Security Team  |

**Classification:** Public  
**Distribution:** Approved for customer and partner distribution

---

© 2025 Q-Persona. All rights reserved.
