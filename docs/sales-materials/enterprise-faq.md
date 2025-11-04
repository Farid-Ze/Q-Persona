# Enterprise FAQ - Q-Persona

**Version:** 1.0  
**Last Updated:** November 4, 2025  
**Audience:** Enterprise Prospects & Customers

---

## General Questions

### What is Q-Persona?

Q-Persona is an enterprise-grade survey and questionnaire platform built specifically for regulated industries. Unlike consumer survey tools, we provide complete audit trails, SSO integration, and compliance documentation required for banking, healthcare, and government organizations.

### How is Q-Persona different from SurveyMonkey/Typeform/Google Forms?

**Key Differences:**

| Feature | Q-Persona Enterprise | SurveyMonkey Enterprise | Typeform Business | Google Forms |
|---------|---------------------|------------------------|------------------|--------------|
| **Complete Audit Logs** | ✅ Unlimited | ⚠️ Limited | ❌ No | ❌ No |
| **SSO (SAML, OAuth)** | ✅ Included | ✅ Yes ($$$) | ✅ Yes | ⚠️ Google only |
| **Multi-Factor Auth** | ✅ TOTP + SMS | ❌ No | ❌ No | ⚠️ Google only |
| **HIPAA BAA** | ✅ Available | ✅ Yes ($$$) | ❌ No | ❌ No |
| **Regional Hosting** | ✅ APAC/EU/US | ❌ US only | ❌ EU only | ❌ US only |
| **Pricing** | **$10K/year** | $25K+/year | $12K/year | Free (no compliance) |

**Bottom Line:** We're the only platform that combines enterprise security with affordable pricing and Asia-Pacific focus.

### What industries is Q-Persona designed for?

**Primary Industries:**
- **Banking & Financial Services** - OJK/BI compliance, audit trails
- **Healthcare** - HIPAA compliance, PHI protection
- **Government** - Data sovereignty, transparency requirements
- **Large Enterprises** - IT security standards, SSO requirements
- **Research Institutions** - Multi-country compliance, IRB approval

### Is Q-Persona suitable for small businesses?

Q-Persona has tiers for all sizes:
- **Free** ($0) - Personal projects, up to 3 questionnaires
- **Pro** ($29/month) - Small teams, up to 50 questionnaires
- **Business** ($99/month) - Growing companies, SSO + basic audit logs
- **Enterprise** ($10K/year) - Regulated industries, complete compliance

If you don't have compliance requirements, our Pro or Business tiers may be more suitable than Enterprise.

---

## Security & Compliance

### What security certifications does Q-Persona have?

**Current Status:**
- ✅ **GDPR Compliant** - Full data protection compliance
- ✅ **HIPAA Ready** - BAA available for healthcare customers
- 🔄 **SOC 2 Type I** - In progress, expected Q2 2024
- 🔄 **ISO 27001** - Planned for Q4 2024

**Infrastructure:**
- Hosted on AWS (ISO 27001, SOC 2 certified)
- Supabase database (SOC 2, GDPR compliant)
- Stripe payments (PCI DSS Level 1)

See our [Security Whitepaper](../enterprise/security-whitepaper.md) for complete details.

### How do audit logs work?

Every action in Q-Persona is logged with complete context:

```json
{
  "timestamp": "2025-11-04T19:12:31.104Z",
  "user": "john.doe@company.com",
  "action": "questionnaires:view",
  "resource": "Employee Salary Survey Q4",
  "ipAddress": "203.0.113.42",
  "result": "success"
}
```

**Audit logs include:**
- User authentication (login, logout, MFA)
- Data access (view, edit, delete)
- Permission changes
- Configuration updates
- Failed access attempts
- Data exports

**Retention:**
- Business tier: 30 days
- Enterprise tier: Unlimited

**Export formats:** CSV, JSON, PDF

### Can audit logs be modified or deleted?

**No.** Audit logs are **immutable** and **tamper-evident**:
- Logs cannot be modified by users (including admins)
- Each log entry includes a hash of the previous entry (blockchain-style)
- Any tampering is automatically detected
- Only Q-Persona system administrators can access raw logs (for support purposes)

This ensures audit logs meet compliance requirements for regulatory audits.

### Is Q-Persona GDPR compliant?

**Yes.** Q-Persona implements all GDPR requirements:

**Data Subject Rights:**
- ✅ Right to Access (full data export)
- ✅ Right to Rectification (profile editing)
- ✅ Right to Erasure ("right to be forgotten")
- ✅ Right to Data Portability (JSON export)
- ✅ Right to Object (opt-out mechanisms)

**Technical Measures:**
- AES-256 encryption at rest
- TLS 1.3 encryption in transit
- Pseudonymization where applicable
- Access controls and MFA

**Organizational Measures:**
- Data Processing Agreements with all subprocessors
- Privacy by Design principles
- Data breach notification procedures (<72 hours)
- Regular Data Protection Impact Assessments (DPIA)

See our [Compliance Datasheet](../enterprise/compliance-datasheet.md) for details.

### Is Q-Persona HIPAA compliant?

**Yes.** Q-Persona is HIPAA-ready and can sign Business Associate Agreements (BAA) with covered entities.

**HIPAA Safeguards Implemented:**

**Technical:**
- Access Control (unique IDs, RBAC, auto-logout)
- Audit Controls (complete audit trail)
- Integrity (hash verification, tamper detection)
- Transmission Security (TLS 1.3 encryption)

**Administrative:**
- Security Management Process
- Workforce Security (background checks)
- Information Access Management (least privilege)
- Security Awareness Training
- Incident Response Plan

**To Request BAA:** Contact sales@q-persona.com

### Where is data stored? Can I choose the region?

**Default Regions:**
- **APAC (Default):** Singapore (AWS ap-southeast-1)
- **EU:** Frankfurt (AWS eu-central-1) - GDPR compliant
- **US:** Virginia (AWS us-east-1) - Available for Enterprise

**Enterprise Customers:**
Can choose data residency region during onboarding. Custom regions available on request.

**Data Transfers:**
- Standard Contractual Clauses (SCCs) for EU-US transfers
- No transfers to high-risk jurisdictions
- All subprocessors GDPR compliant

### What encryption does Q-Persona use?

**At Rest:**
- Database: AES-256 encryption (AWS KMS)
- Backups: AES-256 with separate keys
- File uploads: AES-256 server-side encryption (S3)

**In Transit:**
- All traffic: TLS 1.3 encryption
- API calls: HTTPS only
- Perfect Forward Secrecy (ECDHE key exchange)

**Key Management:**
- AWS KMS for encryption key lifecycle
- Automatic key rotation every 90 days
- Separate keys per environment (dev/staging/prod)

---

## Features & Functionality

### Does Q-Persona support Single Sign-On (SSO)?

**Yes.** Enterprise and Business tiers include SSO:

**Supported Protocols:**
- SAML 2.0
- OAuth 2.0 / OpenID Connect

**Compatible Providers:**
- Okta
- Azure AD (Microsoft Entra)
- Google Workspace
- OneLogin
- Auth0
- Any SAML 2.0 compliant provider

**Implementation Time:** Typically 30 minutes to configure.

**Features:**
- Automatic user provisioning (Just-In-Time)
- Group-based role mapping
- Session timeout synchronization
- Single Logout (SLO) support

### What is Multi-Factor Authentication (MFA)?

MFA adds an extra layer of security beyond passwords.

**Supported Methods:**
- **TOTP** (Time-based One-Time Password): Google Authenticator, Authy, 1Password
- **SMS** (Text message): Backup authentication method
- **Recovery Codes:** One-time use codes for account recovery

**MFA Enforcement:**
- Workspace admins can enforce MFA for all members
- MFA required for sensitive actions (billing, SSO config, audit log access)
- 30-day grace period for enrollment

### What are the role-based access control (RBAC) options?

**Three-Tier Role System:**

| Role | Permissions | Use Cases |
|------|-------------|-----------|
| **Viewer** | Read-only access to questionnaires and responses | Executives, external auditors |
| **Editor** | Create/edit questionnaires, view audit logs | Survey creators, analysts |
| **Admin** | Full workspace control + billing + SSO config | IT administrators, department heads |

**Granular Permission Codes:**
- `questionnaires:create`, `questionnaires:read`, `questionnaires:update`, `questionnaires:delete`
- `workspace:settings`, `workspace:billing`, `workspace:members:manage`
- `workspace:audit:read`, `workspace:sso:configure`

### What question types are supported?

**Current Question Types:**
- Text input (short and long)
- Multiple choice (single and multi-select)
- Rating scales (1-5, 1-10, NPS)
- Dropdowns
- Yes/No
- Email validation
- Number input

**Coming Soon (Q2 2024):**
- File upload
- Date/time picker
- Matrix questions
- Ranking questions

### Can I import existing surveys?

**Yes.** We support imports from:
- Google Forms (via CSV)
- SurveyMonkey (via API or CSV)
- Typeform (via API)
- Excel/CSV templates

**Import Support:**
Contact our support team for assistance with large imports or complex surveys.

### Can I customize branding?

**Business & Enterprise Tiers:**
- ✅ Custom logo
- ✅ Custom colors
- ✅ Custom domain (CNAME)
- ✅ Remove "Powered by Q-Persona"
- ✅ Custom email templates

**Free & Pro Tiers:**
- ⚠️ Limited branding (logo only)
- Q-Persona branding included

### What integrations are available?

**Current Integrations:**
- **Webhooks** - Real-time event notifications
- **REST API** - Full programmatic access
- **Stripe** - Payment processing
- **PostHog** - Analytics (optional)

**Planned Integrations (Q2-Q3 2024):**
- Slack notifications
- Microsoft Teams
- Salesforce CRM
- HubSpot CRM
- Zapier
- Make (Integromat)

**Enterprise Custom Integrations:**
Available via API and webhooks. Our team can assist with integration setup.

---

## Pricing & Billing

### What is the pricing structure?

| Tier | Price | Questionnaires | Responses/Month | Audit Logs | SSO | Support |
|------|-------|----------------|-----------------|------------|-----|---------|
| **Free** | $0 | 3 | 100 | ❌ | ❌ | Email |
| **Pro** | $29/month | 50 | 5,000 | ❌ | ❌ | Email |
| **Business** | $99/month | 200 | 50,000 | 30 days | ✅ | Priority |
| **Enterprise** | $10K/year | Unlimited | Custom | Unlimited | ✅ | 24/7 Dedicated |

**Enterprise Custom Pricing:**
For organizations >500 users or >1M responses/month, contact sales for custom pricing.

### Can I pay monthly for Enterprise tier?

**Standard:** Annual payment ($10,000/year upfront)

**Available Options:**
- Quarterly payments ($2,750/quarter = $11K/year)
- Monthly payments (contact sales for pricing)

**Note:** Annual payment offers best value and is standard for enterprise contracts.

### What payment methods do you accept?

**Credit Card:**
- Visa, MasterCard, American Express
- Processed securely via Stripe (PCI DSS Level 1)

**Invoice/Bank Transfer (Enterprise Only):**
- Available for annual contracts
- NET 30 payment terms
- Wire transfer or ACH

**Purchase Orders:**
- Accepted for Enterprise customers
- Send PO to billing@q-persona.com

### Is there a free trial?

**Yes!**

**Pro & Business Tiers:**
- 30-day free trial
- No credit card required
- Full feature access during trial
- Cancel anytime

**Enterprise Tier:**
- 30-day Business tier trial (to test SSO, audit logs, etc.)
- Upgrade to Enterprise after trial
- Dedicated success manager during trial
- Custom onboarding included

### What happens if I exceed my response limit?

**Soft Limits:**
We notify you when you reach 80% and 100% of your monthly limit.

**Options:**
1. **Upgrade tier** - Immediate increase in limits
2. **Purchase add-on responses** - $10 per 1,000 additional responses
3. **Wait for next month** - Limits reset monthly
4. **Archive old questionnaires** - Stop collecting responses temporarily

**Enterprise Tier:**
Custom response limits negotiated in contract. No overage fees for reasonable usage.

### Can I cancel anytime?

**Monthly Plans (Pro, Business):**
- Yes, cancel anytime
- No cancellation fees
- Access until end of current billing period

**Annual Plans (Enterprise):**
- Annual commitment required
- Early termination available with 90-day notice
- Pro-rated refund if applicable per contract terms

### Do you offer discounts?

**Available Discounts:**

**Non-Profits & Education:**
- 30% discount on all tiers
- Proof of status required (501c3 or .edu email)

**Annual Commitment:**
- 2 months free when paying annually (Pro/Business)
- Effectively 16% discount

**Volume:**
- Custom pricing for >500 users
- Contact sales@q-persona.com

**Referrals:**
- $1,000 credit for successful Enterprise referral
- See our referral program for details

---

## Implementation & Support

### How long does implementation take?

**Typical Timeline:**

**Small Teams (<50 users):**
- 1 week: Self-service setup
- 2 weeks: With guided onboarding

**Enterprise (50+ users):**
- Week 1: SSO configuration, workspace setup
- Week 2: User import, training
- Week 3: First questionnaires deployed
- Week 4: Full rollout

**With Dedicated Success Manager (Enterprise):**
We handle most of the heavy lifting for you.

### What support is included?

| Tier | Support Channels | Response Time | Availability |
|------|-----------------|---------------|--------------|
| **Free** | Email, Help Center | 48 hours | Business hours |
| **Pro** | Email, Help Center | 24 hours | Business hours |
| **Business** | Email, Priority Support | 12 hours | Business hours |
| **Enterprise** | Email, Phone, Dedicated Manager | 4 hours | 24/7 |

**Business Hours:** Monday-Friday, 9am-6pm Singapore Time (UTC+8)

**Enterprise Emergency Support:** 24/7 phone support for critical issues

### Do you provide training?

**Self-Service (All Tiers):**
- Video tutorials
- Help center articles
- Quick start guides
- Webinars (monthly)

**Guided Training (Business & Enterprise):**
- 1-hour onboarding call
- Admin training (2 hours)
- End-user training (1 hour)
- Custom training sessions (Enterprise)

**Train-the-Trainer (Enterprise):**
We train your internal champions to onboard others in your organization.

### Can you help migrate from our current survey tool?

**Yes!** We provide migration assistance:

**Business Tier:**
- Migration guides for common tools
- Support ticket assistance
- Best-effort data import

**Enterprise Tier:**
- Dedicated migration specialist
- Complete data migration (surveys + responses)
- Testing and validation
- Cutover planning

**Supported Migrations:**
- Google Forms
- SurveyMonkey
- Typeform
- Qualtrics
- Custom/in-house tools (via CSV)

### What is your uptime SLA?

**Enterprise Tier:**
- **99.5% uptime guarantee**
- Monthly SLA credits if threshold not met
- Scheduled maintenance windows (announced 7 days in advance)
- Real-time status page: status.q-persona.com

**Other Tiers:**
- No formal SLA
- Best-effort 99%+ uptime
- Incident notifications via email

### What happens to my data if I cancel?

**Data Retention:**
- 30-day grace period after cancellation
- Export all data (questionnaires, responses, audit logs)
- JSON, CSV, PDF formats available

**After 30 Days:**
- All data permanently deleted
- No recovery possible
- Deletion confirmation email sent

**Enterprise Contracts:**
- Custom retention terms negotiable
- Extended export assistance available

---

## Technical Questions

### What browsers are supported?

**Fully Supported:**
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

**Mobile:**
- iOS Safari (latest)
- Chrome Mobile (latest)
- Responsive design for all screen sizes

**Not Supported:**
- Internet Explorer 11 (deprecated)

### Is there an API?

**Yes!** Enterprise tier includes full API access.

**REST API Features:**
- Create/read/update questionnaires
- Manage responses
- User management
- Webhook notifications
- Rate limiting (5,000 requests/minute for Enterprise)

**API Documentation:**
Available at: https://api.q-persona.com/docs

**Authentication:**
- API keys (managed in dashboard)
- OAuth 2.0 (for integrations)

### Can I self-host Q-Persona?

**No.** Q-Persona is a SaaS platform only.

**Why?**
- Cloud infrastructure ensures security, compliance, and automatic updates
- Self-hosting would require you to manage security, backups, and updates
- SaaS model allows us to provide better support and faster innovation

**Alternative:**
For organizations with strict data residency requirements, we offer:
- Regional hosting (APAC, EU, US)
- Dedicated instances (Enterprise)
- Private cloud deployment (contact sales)

### What are your backup and disaster recovery procedures?

**Backups:**
- **Frequency:** Continuous (point-in-time recovery)
- **Retention:** 30 days for automated backups
- **Storage:** Geographically distributed (3+ regions)
- **Encryption:** AES-256 with separate backup keys

**Disaster Recovery:**
- **RTO (Recovery Time Objective):** 1 hour
- **RPO (Recovery Point Objective):** 5 minutes
- **Annual DR Test:** Full disaster recovery drill
- **Multi-AZ Deployment:** Automatic failover within 30 seconds

**Enterprise:**
- Extended backup retention available
- Custom DR plans negotiable

### How do you handle security incidents?

**Incident Response Timeline:**
- **T+0:** Incident detected (automated alerts)
- **T+15min:** On-call engineer engaged
- **T+1h:** Incident assessment & classification
- **T+4h:** Containment & mitigation
- **T+24h:** Customer notification (if impacted)
- **T+7d:** Post-incident review & report

**Customer Communication:**
- Email to workspace administrators
- Status page updates
- Detailed incident report (within 7 days)

### How can I report a security vulnerability?

**Responsible Disclosure:**
- Email: security@q-persona.com
- Response time: 24 hours
- Bug bounty program (launching Q2 2024)

**What to Report:**
- Authentication bypasses
- Authorization flaws
- Data leakage vulnerabilities
- XSS, CSRF, SQL injection
- Infrastructure misconfigurations

---

## Comparison Questions

### Q-Persona vs. SurveyMonkey Enterprise?

| Factor | Q-Persona | SurveyMonkey |
|--------|-----------|--------------|
| **Audit Logs** | Unlimited (Enterprise) | Limited |
| **Regional Hosting** | APAC/EU/US | US only |
| **Price** | $10K/year | $25K+/year |
| **MFA** | TOTP + SMS | Not available |
| **HIPAA BAA** | ✅ Included | ✅ Extra cost |
| **Focus** | Regulated industries | General market |

**Best for Q-Persona:** Organizations in APAC, banking, healthcare with compliance needs

**Best for SurveyMonkey:** Large US enterprises, market research firms

### Q-Persona vs. Typeform Business?

| Factor | Q-Persona | Typeform |
|--------|-----------|----------|
| **Audit Logs** | ✅ 30-day (Business) | ❌ No |
| **SSO** | ✅ SAML + OAuth | ✅ OAuth only |
| **Compliance** | GDPR + HIPAA | GDPR only |
| **Price** | $99/month (Business) | $83/month |
| **UX Focus** | Compliance + Security | Beautiful forms |

**Best for Q-Persona:** Regulated industries needing audit trails and compliance

**Best for Typeform:** Marketing teams prioritizing form aesthetics

### Q-Persona vs. Qualtrics?

| Factor | Q-Persona | Qualtrics |
|--------|-----------|-----------|
| **Price** | $10K/year | $50K+/year |
| **Complexity** | Easy to use | Steep learning curve |
| **Research Focus** | Survey compliance | Academic research |
| **Implementation** | 2-4 weeks | 3-6 months |

**Best for Q-Persona:** Organizations needing compliance without research complexity

**Best for Qualtrics:** Large research institutions with dedicated research teams

### Q-Persona vs. Google Forms?

| Factor | Q-Persona | Google Forms |
|--------|-----------|--------------|
| **Price** | Free tier available | Free |
| **Audit Logs** | ✅ Yes (Business+) | ❌ No |
| **Compliance** | GDPR + HIPAA | Basic only |
| **SSO** | SAML + OAuth | Google only |
| **Enterprise** | ✅ Yes | ❌ No |

**Best for Q-Persona:** Any organization with compliance or security requirements

**Best for Google Forms:** Casual surveys with no compliance needs

---

## Getting Started

### How do I get started?

**1. Sign Up (Free):**
- Visit q-persona.com
- Create account (email + password)
- Verify email

**2. Explore:**
- Create your first questionnaire
- Try different question types
- Preview and test

**3. Upgrade (When Ready):**
- Choose Pro, Business, or Enterprise
- Add payment method
- Unlock advanced features

**4. Enterprise Demo:**
- Schedule at q-persona.com/enterprise#demo
- 30-minute personalized walkthrough
- Security documentation provided
- Custom pricing discussed

### Who should I contact for Enterprise pricing?

**Sales Team:**
- Email: sales@q-persona.com
- Schedule demo: q-persona.com/enterprise#demo

**What to prepare:**
- Number of users
- Expected survey volume (responses/month)
- Compliance requirements (HIPAA, SOC 2, etc.)
- Data residency preference
- Timeline for implementation

### Can I schedule a demo?

**Yes!** We offer personalized demos:

**Self-Service Demo:**
- Sign up for free account
- Try platform yourself
- No time limit on Free tier

**Guided Demo (15-30 minutes):**
- Book at q-persona.com/enterprise#demo
- Video call with sales rep
- Live platform walkthrough
- Q&A session

**Enterprise Demo (30-45 minutes):**
- Personalized to your use case
- Audit logs deep-dive
- Security & compliance review
- Custom pricing discussion
- Trial setup offered

---

## Still Have Questions?

**Contact Us:**
- **Sales:** sales@q-persona.com
- **Support:** support@q-persona.com
- **Security:** security@q-persona.com
- **Compliance:** compliance@q-persona.com

**Resources:**
- Help Center: help.q-persona.com
- Security Whitepaper: [View Document](../enterprise/security-whitepaper.md)
- Compliance Datasheet: [View Document](../enterprise/compliance-datasheet.md)
- API Documentation: api.q-persona.com/docs

**Schedule a Call:**
- Enterprise Demo: q-persona.com/enterprise#demo
- Technical Deep-Dive: Available upon request
- Security Review: Available for Enterprise prospects

---

**Document Version:**

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | November 4, 2025 | Initial FAQ | Sales Team |

**Next Review:** February 4, 2026

---

© 2025 Q-Persona. All rights reserved.
