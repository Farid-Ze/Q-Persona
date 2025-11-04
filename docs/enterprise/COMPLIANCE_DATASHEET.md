# Q-Persona Compliance Datasheet

**Version 1.0**  
**Last Updated: November 2024**  
**For: Enterprise Prospects & Customers**

## Quick Reference

| Compliance Area | Status | Details |
|----------------|--------|---------|
| **GDPR** | ✅ Compliant | Full compliance, DPA available |
| **HIPAA** | 🟡 Ready | BAA available, audit in progress |
| **SOC 2 Type II** | ⏳ In Progress | Target Q2 2025 |
| **ISO 27001** | 📅 Planned | Target Q4 2025 |
| **Indonesia PDP** | ✅ Compliant | Law No. 27/2022 |
| **Audit Logs** | ✅ Complete | Immutable, exportable |
| **Data Encryption** | ✅ Full | AES-256 at rest, TLS 1.3 in transit |
| **SSO/SAML** | ✅ Supported | Okta, Azure AD, Google |
| **MFA** | ✅ Supported | TOTP, SMS, authenticator apps |

---

## 1. Regulatory Compliance

### 1.1 GDPR (General Data Protection Regulation)

**Status:** ✅ **Fully Compliant**

**Compliance Date:** October 2023

#### Key Requirements

| Requirement | Q-Persona Implementation |
|-------------|-------------------------|
| **Lawful Basis** | Consent, contract, legitimate interest documented |
| **Data Subject Rights** | Self-service tools for access, rectification, erasure, portability |
| **Privacy by Design** | Security controls built into platform architecture |
| **DPO/EU Rep** | EU representative appointed |
| **Data Processing Agreement** | Standard DPA available for all customers |
| **Breach Notification** | <72-hour notification process established |
| **Cross-Border Transfers** | Standard Contractual Clauses (SCCs) implemented |
| **Cookie Consent** | Compliant consent management |

#### User Rights Implementation

✅ **Right to Access**
- Users can export all personal data via dashboard
- Format: JSON, CSV
- Delivery: Instant download

✅ **Right to Rectification**
- Profile editing available in user settings
- Real-time updates across all systems

✅ **Right to Erasure ("Right to be Forgotten")**
- Account deletion via dashboard or support request
- 30-day soft delete with recovery option
- Hard delete after 30 days (irreversible)
- All associated data purged

✅ **Right to Data Portability**
- Export all questionnaires, responses, templates
- Machine-readable format (JSON, CSV)
- Includes metadata and timestamps

✅ **Right to Object**
- Opt-out of analytics tracking
- Opt-out of marketing communications
- Granular consent management

#### Documentation Available
- ✅ Data Processing Agreement (DPA)
- ✅ Privacy Policy
- ✅ Cookie Policy
- ✅ Subprocessor List
- ✅ Data Flow Diagrams

### 1.2 HIPAA (Health Insurance Portability and Accountability Act)

**Status:** 🟡 **HIPAA-Ready**

**Target Certification:** Q1 2025

#### Safeguards Implementation

**Administrative Safeguards:**
- ✅ Security management process
- ✅ Assigned security responsibility
- ✅ Workforce security training
- ✅ Contingency planning
- ✅ Business associate agreements

**Physical Safeguards:**
- ✅ Facility access controls (via AWS data centers)
- ✅ Workstation security policies
- ✅ Device and media controls

**Technical Safeguards:**
- ✅ Access control (RBAC, SSO, MFA)
- ✅ Audit controls (comprehensive logging)
- ✅ Integrity controls (checksums, versioning)
- ✅ Transmission security (TLS 1.3)

#### Protected Health Information (PHI)

**Encryption:**
- At rest: AES-256
- In transit: TLS 1.3
- Backups: Encrypted before storage

**Access Controls:**
- Role-based access (Admin, Editor, Viewer)
- Minimum necessary access principle
- Automatic session timeout (15 minutes)
- Device authentication

**Audit Logging:**
- All PHI access logged
- Who, what, when, where tracked
- Immutable audit trail
- Exportable for compliance audits

#### Business Associate Agreement (BAA)

**Availability:** Enterprise tier customers

**Key Terms:**
- HIPAA compliance commitment
- Permitted uses and disclosures
- Safeguards implementation
- Breach notification (within 24 hours)
- Subcontractor management
- Access to PHI for investigations
- Termination and data return

**Note:** Healthcare organizations must:
1. Sign BAA before storing PHI
2. Complete internal risk assessment
3. Configure appropriate access controls
4. Enable audit logging
5. Train staff on HIPAA requirements

### 1.3 SOC 2 Type II

**Status:** ⏳ **In Progress**

**Target Completion:** Q2 2025

#### Trust Service Criteria

**1. Security** ✅ **Controls Implemented**
- Logical and physical access controls
- System operations monitoring
- Change management procedures
- Risk mitigation processes

**2. Availability** ✅ **Controls Implemented**
- System uptime monitoring (99.5% SLA for Enterprise)
- Disaster recovery plan
- Incident response procedures
- Backup and restore processes

**3. Processing Integrity** ✅ **Controls Implemented**
- Data validation and error handling
- Quality assurance processes
- System monitoring and alerting

**4. Confidentiality** ✅ **Controls Implemented**
- Data classification
- Encryption in transit and at rest
- Secure data disposal
- Non-disclosure agreements

**5. Privacy** ⏳ **In Progress**
- Privacy notice and consent
- Data collection and use policies
- Data retention and disposal
- Privacy-related complaints

#### Audit Timeline

| Phase | Status | Date |
|-------|--------|------|
| Controls Design | ✅ Complete | Oct 2024 |
| Controls Implementation | ✅ Complete | Nov 2024 |
| 90-Day Observation Period | ⏳ In Progress | Nov 2024 - Jan 2025 |
| Third-Party Audit | 📅 Scheduled | Feb 2025 |
| Report Issuance | 📅 Expected | Mar 2025 |

**Auditor:** [SOC 2 Certified Auditing Firm]

### 1.4 ISO 27001

**Status:** 📅 **Planned**

**Target Certification:** Q4 2025

#### ISMS Framework

**Current Progress:**
- ✅ Information Security Policy established
- ✅ Risk assessment methodology defined
- ✅ Asset inventory completed
- ⏳ Control implementation (Annex A)
- ⏳ Internal audit program
- 📅 Management review process
- 📅 Certification audit

#### Annex A Controls Implementation

**Progress by Category:**
- Organizational Controls: 75% complete
- People Controls: 80% complete
- Physical Controls: 90% complete (via AWS)
- Technological Controls: 85% complete

**Timeline:**
- Q4 2024: Complete control implementation
- Q1 2025: Internal audits
- Q2 2025: Pre-assessment audit
- Q3 2025: Gap remediation
- Q4 2025: Certification audit

### 1.5 Regional Compliance

#### Indonesia Personal Data Protection (PDP) Law

**Status:** ✅ **Compliant**

**Law:** No. 27 of 2022 (effective October 2024)

**Key Requirements:**
- ✅ Lawful data processing basis
- ✅ Data subject consent mechanisms
- ✅ Data controller/processor roles defined
- ✅ Cross-border transfer safeguards
- ✅ Data breach notification (3x24 hours)
- ✅ Local representative appointed
- ✅ Data localization options available

**Data Localization:**
- Primary region: AWS Singapore (ap-southeast-1)
- Backup region: AWS Tokyo (ap-northeast-1)
- Processing location: APAC region only (optional)

#### Other Regional Requirements

**Singapore PDPA:** ✅ Aligned  
**EU GDPR:** ✅ Compliant (see Section 1.1)  
**California CCPA/CPRA:** ✅ Aligned  
**Brazil LGPD:** 🟡 Substantially aligned  
**Australia Privacy Act:** 🟡 Substantially aligned

---

## 2. Industry Standards

### 2.1 PCI DSS (Payment Card Industry Data Security Standard)

**Status:** ✅ **Delegated to Stripe**

**Implementation:**
- We do NOT store, process, or transmit credit card data
- All payment processing via Stripe (PCI DSS Level 1 certified)
- Stripe-hosted checkout and billing portal
- No credit card data touches our servers

**Stripe Compliance:**
- PCI DSS Level 1 (highest level)
- SOC 2 Type II certified
- Annual third-party audits

### 2.2 NIST Cybersecurity Framework

**Status:** ✅ **Aligned**

**Framework Adoption:**

**Identify**
- ✅ Asset management
- ✅ Risk assessment
- ✅ Governance structure

**Protect**
- ✅ Access control (RBAC, SSO, MFA)
- ✅ Data security (encryption)
- ✅ Protective technology (WAF, DDoS)

**Detect**
- ✅ Continuous monitoring
- ✅ Security event detection
- ✅ Anomaly detection

**Respond**
- ✅ Incident response plan
- ✅ Communication procedures
- ✅ Mitigation strategies

**Recover**
- ✅ Recovery planning
- ✅ Backup and restore
- ✅ Lessons learned process

### 2.3 CIS Controls

**Status:** ✅ **Implemented (v8)**

**Implementation Coverage:**

| CIS Control | Status | Notes |
|-------------|--------|-------|
| Inventory & Control of Assets | ✅ Complete | Automated asset discovery |
| Inventory of Software | ✅ Complete | Dependency tracking |
| Data Protection | ✅ Complete | Encryption, classification |
| Secure Configuration | ✅ Complete | IaC, hardened defaults |
| Account Management | ✅ Complete | SSO, RBAC, MFA |
| Access Control | ✅ Complete | Least privilege model |
| Continuous Monitoring | ✅ Complete | 24/7 monitoring |
| Audit Log Management | ✅ Complete | Comprehensive logging |
| Email & Web Browser | ✅ Complete | SPF, DKIM, DMARC |
| Malware Defenses | ✅ Complete | Dependency scanning |
| Data Recovery | ✅ Complete | Automated backups |
| Network Infrastructure | ✅ Complete | Cloudflare, Vercel |
| Security Awareness | ✅ Complete | Team training program |
| Service Provider Management | ✅ Complete | Vendor assessments |
| Application Security | ✅ Complete | SAST, DAST, SCA |
| Incident Response | ✅ Complete | IR plan and testing |
| Penetration Testing | ⏳ Planned | Q1 2025 |

---

## 3. Security Certifications

### 3.1 Current Certifications

**Infrastructure Providers:**

✅ **Vercel (Hosting Platform)**
- SOC 2 Type II certified
- ISO 27001 certified
- GDPR compliant

✅ **AWS (Database Infrastructure via Supabase)**
- SOC 1, 2, 3
- ISO 27001, 27017, 27018
- PCI DSS Level 1
- HIPAA eligible

✅ **Cloudflare (CDN & Security)**
- SOC 2 Type II certified
- ISO 27001 certified
- PCI DSS certified

✅ **Stripe (Payment Processing)**
- PCI DSS Level 1
- SOC 2 Type II
- ISO 27001

### 3.2 Platform-Specific Certifications

**In Progress:**
- ⏳ SOC 2 Type II (Q2 2025)
- 📅 ISO 27001 (Q4 2025)

**Planned:**
- 📅 HITRUST CSF (2026)
- 📅 FedRAMP Moderate (2026)
- 📅 CSA STAR Level 2 (2026)

---

## 4. Data Governance

### 4.1 Data Classification

**Classification Levels:**

| Level | Description | Examples | Protection |
|-------|-------------|----------|------------|
| **Public** | No sensitivity | Marketing materials | None required |
| **Internal** | Business use only | Templates, analytics | Access control |
| **Confidential** | Sensitive business data | Survey responses | Encryption + RBAC |
| **Restricted** | Highly sensitive | PHI, PII, financial | Encryption + MFA + Audit |

### 4.2 Data Retention

**Default Retention Periods:**

| Data Type | Free/Pro | Business | Enterprise |
|-----------|----------|----------|------------|
| Survey Responses | 1 year | 3 years | Custom (up to 7 years) |
| Audit Logs | N/A | 30 days | Unlimited |
| User Accounts | Active only | Active + 1 year | Custom |
| Backups | 7 days | 30 days | 90 days |
| Deleted Data | 30 days | 30 days | Custom |

**Configurable Options (Enterprise):**
- Custom retention periods per workspace
- Legal hold capabilities
- Scheduled data purging
- Export before delete

### 4.3 Data Deletion

**User-Initiated Deletion:**
1. Account deletion request
2. 30-day soft delete (recovery possible)
3. Notification sent to workspace admins
4. After 30 days: Hard delete (irreversible)

**Data Purged:**
- User profile and credentials
- All questionnaires and templates
- All survey responses
- Audit logs (except compliance-required)
- File uploads
- API keys

**Retained (as required by law):**
- Billing records (7 years for tax compliance)
- Security incident logs (1 year minimum)
- Legal hold data (until hold lifted)

### 4.4 Cross-Border Data Transfers

**Transfer Mechanisms:**

✅ **Standard Contractual Clauses (SCCs)**
- EU Commission approved clauses
- Customer DPA includes SCCs
- Module 2 (Controller to Processor)

✅ **Adequacy Decisions**
- Transfers to adequate countries (Japan, Canada, UK, etc.)

✅ **Data Localization Options (Enterprise)**
- EU-only processing
- APAC-only processing
- US-only processing
- Custom regional restrictions

**Transfer Impact Assessment:**
- Conducted for all data transfers
- Review of local laws in destination country
- Additional safeguards implemented as needed
- Annual reassessment

---

## 5. Audit and Monitoring

### 5.1 Audit Log Capabilities

**What We Log:**

Every action generates an immutable audit event:

```
[2024-11-04 14:23:41.123] user:sarah@company.com action:questionnaire.viewed 
resource:customer_satisfaction_q4 ip:203.0.113.42 workspace:marketing 
role:editor result:success
```

**Event Categories:**
- 🔐 Authentication (login, logout, SSO, MFA)
- 👤 User management (invite, remove, role change)
- 📋 Questionnaire actions (create, edit, delete, view)
- 📊 Response access (view, export, delete)
- ⚙️ Settings changes (workspace, integrations, billing)
- 🔑 API activity (all programmatic access)
- 🚨 Security events (failed login, suspicious activity)

**Audit Log Features:**

| Feature | Business Tier | Enterprise Tier |
|---------|--------------|-----------------|
| **Retention** | 30 days | Unlimited |
| **Export Formats** | CSV, JSON | CSV, JSON, PDF |
| **Real-time Access** | ✅ Yes | ✅ Yes |
| **Advanced Search** | ✅ Yes | ✅ Yes |
| **API Access** | ❌ No | ✅ Yes |
| **SIEM Integration** | ❌ No | ✅ Yes |
| **Compliance Reports** | ❌ No | ✅ Yes |

**Use Cases:**
- Regulatory compliance audits
- Security investigations
- User activity review
- Compliance reporting
- Forensic analysis
- Access certification

### 5.2 Compliance Reporting

**Available Reports (Enterprise):**

📊 **Access Certification Report**
- All users and their roles
- Last login date
- MFA status
- Review for access recertification

📊 **Data Access Report**
- Who accessed what data and when
- Sensitive data access patterns
- Export activities
- Anomaly detection

📊 **Change Management Report**
- All configuration changes
- Who made changes
- Approval workflow (if configured)
- Rollback capability

📊 **Security Event Report**
- Failed login attempts
- MFA challenges
- Suspicious activities
- Blocked actions

**Report Delivery:**
- On-demand via dashboard
- Scheduled email delivery
- API export
- SIEM integration

### 5.3 External Audits

**Audit Support:**

We provide auditors with:
- ✅ System access (read-only)
- ✅ Documentation (architecture, policies, procedures)
- ✅ Audit log exports
- ✅ Evidence packages
- ✅ Technical Q&A sessions
- ✅ Compliance attestations

**Audit Types Supported:**
- Internal IT audits
- Regulatory compliance audits (OJK, BI, etc.)
- Third-party security assessments
- Customer due diligence reviews
- Vendor risk assessments

**Response Time:**
- Audit requests: 5 business days
- Document requests: 3 business days
- Technical questions: 24 hours
- Urgent compliance: Same day (best effort)

---

## 6. Access Control

### 6.1 Authentication Methods

**Supported Methods:**

| Method | Free | Pro | Business | Enterprise |
|--------|------|-----|----------|------------|
| Email/Password | ✅ | ✅ | ✅ | ✅ |
| Magic Link | ✅ | ✅ | ✅ | ✅ |
| Social OAuth | ✅ | ✅ | ✅ | ✅ |
| SAML 2.0 SSO | ❌ | ❌ | ✅ | ✅ |
| OAuth 2.0 SSO | ❌ | ❌ | ✅ | ✅ |
| Custom SSO | ❌ | ❌ | ❌ | ✅ |

**Password Requirements:**
- Minimum 8 characters (12+ recommended)
- Mix of uppercase, lowercase, numbers, symbols
- No common passwords (checked against breach database)
- No password reuse (last 5 passwords)
- Optional: Custom password policy (Enterprise)

### 6.2 Multi-Factor Authentication (MFA)

**Supported Methods:**
- ✅ TOTP (Time-based One-Time Password) - RFC 6238
- ✅ SMS verification codes
- ✅ Authenticator apps (Google, Microsoft, Authy, 1Password)

**MFA Policies:**

| Policy | Free/Pro | Business | Enterprise |
|--------|----------|----------|------------|
| Optional MFA | ✅ | ✅ | ✅ |
| Enforced MFA | ❌ | Configurable | ✅ |
| MFA for Admins | ❌ | ✅ | ✅ |
| Grace Period | N/A | 7 days | Configurable |
| Recovery Codes | ✅ | ✅ | ✅ |

**Recovery Options:**
- Recovery codes (generated at MFA setup)
- Admin override (with audit log)
- Email verification + support ticket

### 6.3 Single Sign-On (SSO)

**Supported Protocols:**
- SAML 2.0
- OAuth 2.0 / OpenID Connect

**Supported Identity Providers:**
- ✅ Okta
- ✅ Azure Active Directory (Microsoft Entra ID)
- ✅ Google Workspace
- ✅ OneLogin
- ✅ Auth0
- ✅ Custom SAML 2.0 providers

**SSO Features:**
- Just-in-Time (JIT) user provisioning
- Automatic attribute mapping
- Custom attribute claims
- Multiple IdP support (Enterprise)
- IdP-initiated SSO
- SP-initiated SSO

**Configuration Time:** <10 minutes

### 6.4 Role-Based Access Control (RBAC)

**Built-in Roles:**

| Role | Permissions |
|------|-------------|
| **Admin** | Full workspace access, user management, billing, settings, audit logs |
| **Editor** | Create/edit questionnaires, view responses, export data |
| **Viewer** | Read-only access to questionnaires and responses |

**Custom Roles (Enterprise):**
- Define custom permission sets
- Granular permissions (view, create, edit, delete, export)
- Resource-level permissions (specific questionnaires)
- Approval workflows

**Permission Model:**
- Least privilege by default
- Explicit permission grants
- Workspace isolation
- Inheritance from IdP groups (SSO)

---

## 7. Encryption & Data Protection

### 7.1 Encryption Standards

**Data at Rest:**
- Algorithm: AES-256-GCM
- Key Management: AWS KMS
- Database: PostgreSQL encryption
- File Storage: S3 server-side encryption
- Backups: Encrypted before storage

**Data in Transit:**
- Protocol: TLS 1.3 (fallback to TLS 1.2)
- Perfect Forward Secrecy (PFS)
- HSTS enabled (max-age: 31536000)
- Certificate: 2048-bit RSA / ECDSA P-256
- Certificate Authority: Let's Encrypt / DigiCert

**Key Management:**
- Encryption keys rotated every 90 days
- Separate keys for production/staging/development
- Keys never stored in source code
- Hardware Security Module (HSM) backed (via AWS KMS)
- Key access logged and monitored

### 7.2 Data Residency

**Available Regions:**

**Standard (All Tiers):**
- 🇸🇬 AWS Singapore (ap-southeast-1)
- 🇯🇵 AWS Tokyo (ap-northeast-1)

**Enterprise Only:**
- 🇺🇸 AWS US East (us-east-1)
- 🇩🇪 AWS Frankfurt (eu-central-1)
- 🇬🇧 AWS London (eu-west-2)
- 🇦🇺 AWS Sydney (ap-southeast-2)
- 🇨🇦 AWS Canada (ca-central-1)

**Data Localization:**
- Primary storage region: Customer choice
- Backup storage region: Customer choice or same region
- Processing location: Can be restricted to specific regions
- CDN caching: Global (static assets only) or regional

**Metadata:**
- Some operational metadata may be processed globally
- No personal data or survey responses in metadata
- Opt-out of global metadata processing (Enterprise)

---

## 8. Incident Response

### 8.1 Security Incident Response

**Response Timeline:**

| Phase | Target Time |
|-------|-------------|
| Detection | <15 minutes |
| Initial Assessment | <1 hour |
| Containment | <4 hours |
| Eradication | <24 hours |
| Recovery | <48 hours |
| Post-Incident Review | <7 days |

**Communication:**
- Affected customers notified within 24 hours
- Data breaches reported within 72 hours (GDPR)
- Regular updates during incident
- Post-incident report provided

### 8.2 Data Breach Notification

**Breach Criteria:**
- Unauthorized access to personal data
- Unauthorized disclosure of personal data
- Loss of personal data
- Unauthorized modification of personal data

**Notification Process:**
1. Breach detected and confirmed
2. Severity assessment (<1 hour)
3. Containment actions initiated
4. Affected customers notified (within 24 hours for security, 72 hours for GDPR)
5. Regulatory authorities notified (within 72 hours)
6. Remediation and monitoring
7. Post-incident report

**Notification Contents:**
- Nature of the breach
- Data elements affected
- Number of affected individuals (estimate)
- Actions taken to mitigate
- Recommended actions for affected users
- Contact information for questions

---

## 9. Third-Party Management

### 9.1 Subprocessors

**List of Subprocessors:**

| Provider | Service | Location | Compliance |
|----------|---------|----------|------------|
| Vercel Inc. | Hosting | USA | SOC 2, ISO 27001 |
| Supabase Inc. | Database | USA, Singapore | SOC 2 (in progress) |
| Cloudflare Inc. | CDN, Security | Global | SOC 2, ISO 27001 |
| Stripe Inc. | Payments | USA | PCI DSS, SOC 2 |
| PostHog Inc. | Analytics | USA, EU | GDPR compliant |
| AWS (via Supabase) | Infrastructure | Multi-region | SOC, ISO, PCI, HIPAA |

**Subprocessor Changes:**
- Enterprise customers: 30-day advance notice
- Objection process available
- Alternative arrangements considered

### 9.2 Vendor Security

**Vendor Assessment:**
- Annual security questionnaires
- Proof of compliance certifications
- Data processing agreements
- Security incident notification requirements
- Right to audit provisions

**Vendor Requirements:**
- SOC 2 or ISO 27001 certification (preferred)
- GDPR compliance (for EU data)
- Encryption in transit and at rest
- Incident response plan
- Security training for staff

---

## 10. Compliance Resources

### 10.1 Available Documentation

**Security & Compliance:**
- ✅ Security Whitepaper (this document)
- ✅ Privacy Policy
- ✅ Terms of Service
- ✅ Data Processing Agreement (DPA)
- ✅ Subprocessor List
- ✅ Cookie Policy
- ✅ Acceptable Use Policy

**Technical:**
- ✅ Architecture Documentation
- ✅ API Documentation
- ✅ Integration Guides
- ✅ Security Best Practices
- ✅ Disaster Recovery Plan (summary)

**Enterprise-Specific:**
- 🔒 Penetration Test Reports (under NDA)
- 🔒 SOC 2 Report (when available)
- 🔒 Business Associate Agreement (BAA)
- 🔒 Service Level Agreement (SLA)
- 🔒 Data Flow Diagrams
- 🔒 Security Roadmap

### 10.2 Support for Compliance Audits

**We Provide:**
- Documentation packages
- Technical Q&A sessions
- System demonstrations
- Audit log exports
- Evidence artifacts
- Compliance attestations

**Audit Types Supported:**
- IT general controls (ITGC)
- SOC 2 / ISO 27001 vendor reviews
- Regulatory compliance (OJK, BI, SEC, etc.)
- Customer due diligence
- Third-party risk assessments

**Contact for Audit Support:**
- Email: compliance@q-persona.com
- Enterprise customers: Dedicated success manager

---

## 11. Compliance Roadmap

### 11.1 Current Year (2024-2025)

**Q4 2024:**
- ✅ GDPR compliance verification
- ✅ Indonesia PDP Law compliance
- ⏳ SOC 2 Type II observation period
- ⏳ HIPAA readiness assessment

**Q1 2025:**
- Complete SOC 2 Type II audit
- HIPAA third-party assessment
- Penetration testing
- Vulnerability assessment

**Q2 2025:**
- Receive SOC 2 Type II report
- HIPAA certification (target)
- ISO 27001 preparation
- SCIM provisioning launch

**Q3 2025:**
- ISO 27001 pre-assessment
- FedRAMP readiness assessment
- Bug bounty program launch
- Advanced RBAC features

**Q4 2025:**
- ISO 27001 certification audit
- HITRUST CSF consideration
- SOC 2 Type II renewal
- Annual compliance review

### 11.2 Future Certifications

**2026 and Beyond:**
- HITRUST CSF
- FedRAMP Moderate
- CSA STAR Level 2
- PCI DSS (if we handle cards directly)
- StateRAMP
- Regional certifications (e.g., MTCS in Singapore)

---

## 12. Contact Information

### Compliance & Security Inquiries

**General Security Questions:**
- 📧 Email: security@q-persona.com
- 📄 Trust Center: q-persona.com/security

**Compliance & Audit Support:**
- 📧 Email: compliance@q-persona.com
- 📞 Enterprise hotline: [Available to Enterprise customers]

**Report Security Vulnerability:**
- 📧 Email: security@q-persona.com
- 🔒 PGP Key: Available on request
- 📜 Responsible Disclosure: q-persona.com/security/disclosure

**Enterprise Sales:**
- 📧 Email: sales@q-persona.com
- 📅 Schedule Demo: q-persona.com/demo
- 📞 Phone: [Contact via website]

**Customer Support:**
- 📧 Email: support@q-persona.com
- 💬 In-app chat: Available to all tiers
- 📚 Help Center: help.q-persona.com

---

## Appendix: Compliance Checklist

### For IT Security Review

Use this checklist when evaluating Q-Persona for your organization:

**Authentication & Access:**
- [ ] SSO/SAML integration supported
- [ ] MFA available and enforceable
- [ ] Role-based access control (RBAC)
- [ ] Least privilege model
- [ ] Session management (timeouts, revocation)

**Data Protection:**
- [ ] Encryption at rest (AES-256)
- [ ] Encryption in transit (TLS 1.3)
- [ ] Data residency options
- [ ] Backup and recovery procedures
- [ ] Data deletion capabilities

**Audit & Monitoring:**
- [ ] Comprehensive audit logging
- [ ] Audit log export capabilities
- [ ] Audit log retention period adequate
- [ ] Real-time monitoring and alerting
- [ ] Compliance reporting available

**Compliance:**
- [ ] GDPR compliance verified
- [ ] Industry-specific compliance (HIPAA, etc.)
- [ ] Data Processing Agreement (DPA) available
- [ ] Subprocessor transparency
- [ ] Regional compliance (PDP, etc.)

**Security Operations:**
- [ ] Incident response plan in place
- [ ] Breach notification procedures
- [ ] Vulnerability management program
- [ ] Penetration testing performed
- [ ] Security certifications (SOC 2, ISO)

**Business Continuity:**
- [ ] Disaster recovery plan
- [ ] Backup strategy and testing
- [ ] High availability architecture
- [ ] SLA commitments
- [ ] RTO/RPO defined

**Vendor Management:**
- [ ] Third-party risk assessments
- [ ] Subprocessor security verification
- [ ] Right to audit provisions
- [ ] Annual security reviews

---

**Document Information:**

| Attribute | Value |
|-----------|-------|
| **Version** | 1.0 |
| **Date** | November 2024 |
| **Owner** | Security & Compliance Team |
| **Classification** | Public |
| **Next Review** | February 2025 |

**Questions or need more information?**  
Contact: compliance@q-persona.com

---

*This datasheet is provided for informational purposes and represents our compliance status as of the publication date. For the most current information, please visit our Trust Center at q-persona.com/security*
