# Q-Persona Compliance Datasheet

**Version:** 1.0  
**Last Updated:** November 4, 2025  
**Document Type:** Compliance Reference

---

## Quick Reference

| Compliance Standard | Status | Certification Date | Notes |
|-------------------|--------|-------------------|-------|
| **GDPR** | ✅ Compliant | Ongoing | Full compliance with EU regulations |
| **HIPAA** | ✅ Ready | N/A | BAA available for healthcare customers |
| **SOC 2 Type I** | 🟡 In Progress | Expected Q2 2024 | Audit underway |
| **SOC 2 Type II** | ⏳ Planned | Expected Q4 2024 | 6-month observation period |
| **ISO 27001** | 🟡 Partial | Expected Q4 2024 | Controls implemented |
| **PCI DSS** | ✅ Compliant | Ongoing | Via Stripe (Level 1 certified) |
| **CCPA** | ✅ Compliant | Ongoing | California privacy rights supported |
| **PDPA (Singapore)** | ✅ Compliant | Ongoing | Local data protection compliance |

**Legend:**  
✅ Compliant | 🟡 In Progress | ⏳ Planned | ❌ Not Applicable

---

## 1. GDPR Compliance (EU General Data Protection Regulation)

### Status: ✅ Fully Compliant

### Overview
Q-Persona is fully compliant with the EU General Data Protection Regulation (GDPR) and implements all required technical and organizational measures to protect personal data.

### Key GDPR Requirements Met

#### 1.1 Lawful Basis for Processing
- **Consent:** Explicit opt-in consent collected for all data processing
- **Contract:** Processing necessary for service delivery
- **Legitimate Interest:** Fraud prevention, security monitoring

#### 1.2 Data Subject Rights

| Right | Implementation | Access Method |
|-------|---------------|---------------|
| **Right to Access** | Full data export in JSON format | Settings → Privacy → Export Data |
| **Right to Rectification** | Self-service profile editing | Settings → Profile |
| **Right to Erasure** | Complete account deletion (30-day recovery) | Settings → Privacy → Delete Account |
| **Right to Restrict Processing** | Account suspension available | Contact support |
| **Right to Data Portability** | Machine-readable JSON export | Settings → Privacy → Export Data |
| **Right to Object** | Opt-out of marketing communications | Email unsubscribe link |
| **Automated Decision-Making** | No automated profiling or decisions | N/A |

#### 1.3 Technical Measures
- ✅ Encryption at rest (AES-256)
- ✅ Encryption in transit (TLS 1.3)
- ✅ Pseudonymization of personal data where possible
- ✅ Regular security testing and vulnerability assessments
- ✅ Access controls and authentication (MFA, SSO)

#### 1.4 Organizational Measures
- ✅ Data Protection Impact Assessments (DPIA) conducted
- ✅ Data Processing Agreements with all sub-processors
- ✅ Staff training on GDPR requirements
- ✅ Privacy by Design principles followed
- ✅ Data breach notification procedures (within 72 hours)

#### 1.5 Data Residency
- **EU Region:** Frankfurt (AWS eu-central-1) available
- **Standard Contractual Clauses (SCCs):** In place for EU-US transfers
- **No data transfers to:** Countries without adequate protection

### Compliance Evidence
- Privacy Policy: https://q-persona.com/privacy
- Data Processing Agreement (DPA): Available on request
- GDPR Compliance Checklist: [Download PDF](#)

---

## 2. HIPAA Compliance (Health Insurance Portability and Accountability Act)

### Status: ✅ Ready for Healthcare Customers

### Overview
Q-Persona implements all required Technical and Administrative Safeguards under HIPAA and can execute Business Associate Agreements (BAA) with covered entities.

### HIPAA Safeguards Implemented

#### 2.1 Technical Safeguards

| Requirement | Implementation | Evidence |
|------------|----------------|----------|
| **Access Control** | Unique user IDs, role-based access, automatic logout | Audit logs |
| **Audit Controls** | Complete audit trail of all PHI access | Exportable reports |
| **Integrity** | Hash verification, tamper detection | Whitepaper §4.1 |
| **Transmission Security** | TLS 1.3 encryption for all data in transit | SSL Labs A+ rating |

#### 2.2 Administrative Safeguards
- ✅ Security Management Process
- ✅ Workforce Security (background checks for staff with PHI access)
- ✅ Information Access Management (least privilege principle)
- ✅ Security Awareness Training
- ✅ Incident Response Plan

#### 2.3 Physical Safeguards
- ✅ Facility Access Controls (AWS SOC 2 certified data centers)
- ✅ Workstation Security (device encryption, screen timeouts)
- ✅ Device Controls (mobile device management)

### Business Associate Agreement (BAA)
**Available for:** Enterprise customers handling Protected Health Information (PHI)

**Includes:**
- Permitted uses and disclosures of PHI
- Breach notification requirements (within 60 days)
- Termination procedures
- Return or destruction of PHI upon contract end

**To Request BAA:** Contact sales@q-persona.com

### Compliance Evidence
- HIPAA Security Rule Checklist: [Download PDF](#)
- Business Associate Agreement Template: Available on request
- Technical Safeguards Documentation: [Security Whitepaper](./security-whitepaper.md)

---

## 3. SOC 2 Compliance (Service Organization Control)

### Status: 🟡 Type I In Progress | ⏳ Type II Planned

### Overview
Q-Persona is undergoing SOC 2 Type I audit with completion expected Q2 2024. Type II audit (6-month observation period) planned for Q4 2024.

### SOC 2 Trust Service Criteria

#### 3.1 Security (CC1-CC9)
- ✅ **CC1:** Control Environment - Security policies and procedures documented
- ✅ **CC2:** Communication - Security awareness training for all staff
- ✅ **CC3:** Risk Assessment - Annual risk assessments conducted
- ✅ **CC4:** Monitoring - 24/7 security monitoring and alerting
- ✅ **CC5:** Control Activities - Access controls, MFA, encryption
- ✅ **CC6:** Logical Access - RBAC, SSO, audit logging
- ✅ **CC7:** System Operations - Change management, backup procedures
- ✅ **CC8:** Change Management - Code review, testing, deployment controls
- ✅ **CC9:** Risk Mitigation - Incident response, disaster recovery

#### 3.2 Availability (A1)
- ✅ **A1.1:** Uptime monitoring and SLA tracking (99.5% for Enterprise)
- ✅ **A1.2:** Multi-AZ deployment with automatic failover
- ✅ **A1.3:** Disaster recovery plan tested annually

#### 3.3 Confidentiality (C1)
- ✅ **C1.1:** Data classification and handling procedures
- ✅ **C1.2:** Encryption at rest and in transit
- ✅ **C1.3:** Access controls and audit logging

#### 3.4 Processing Integrity (PI1)
- ✅ **PI1.1:** Input validation and error handling
- ✅ **PI1.2:** Data integrity checks (hash verification)
- ✅ **PI1.3:** Transaction logging and monitoring

#### 3.5 Privacy (P1-P8)
- ✅ **P1:** Notice and communication of privacy practices
- ✅ **P2:** Choice and consent for data collection
- ✅ **P3:** Collection limited to specified purposes
- ✅ **P4:** Use and retention policies documented
- ✅ **P5:** Access rights (GDPR-aligned)
- ✅ **P6:** Disclosure to third parties (DPAs in place)
- ✅ **P7:** Data quality and integrity
- ✅ **P8:** Monitoring and enforcement

### Audit Timeline
- **Kickoff:** January 2024
- **Fieldwork:** February - March 2024
- **Report Issuance:** Expected April 2024 (Type I)
- **Type II Start:** May 2024 (6-month observation)
- **Type II Report:** Expected November 2024

### Auditor
**Firm:** [To be confirmed - reputable Big 4 or SOC 2 specialist]  
**Report Availability:** Upon request to Enterprise customers after completion

---

## 4. ISO 27001 (Information Security Management)

### Status: 🟡 Partial Implementation | ⏳ Certification Planned Q4 2024

### Overview
Q-Persona has implemented ISO 27001 controls and is planning formal certification in Q4 2024.

### Annex A Controls Implemented

#### A.5 Information Security Policies (5/5)
- ✅ A.5.1.1 Policies for information security
- ✅ A.5.1.2 Review of policies

#### A.6 Organization of Information Security (7/7)
- ✅ A.6.1.1 Information security roles
- ✅ A.6.1.2 Segregation of duties
- ✅ A.6.1.3 Contact with authorities
- ✅ A.6.1.4 Contact with special interest groups
- ✅ A.6.1.5 Information security in project management
- ✅ A.6.2.1 Mobile device policy
- ✅ A.6.2.2 Teleworking

#### A.7 Human Resource Security (6/6)
- ✅ A.7.1.1 Screening (background checks)
- ✅ A.7.1.2 Terms and conditions of employment
- ✅ A.7.2.1 Management responsibilities
- ✅ A.7.2.2 Information security awareness
- ✅ A.7.3.1 Termination procedures

#### A.8 Asset Management (10/10)
- ✅ A.8.1.1 Inventory of assets
- ✅ A.8.1.2 Ownership of assets
- ✅ A.8.2.1 Classification guidelines
- ✅ A.8.2.3 Handling of assets
- ✅ A.8.3.1 Management of removable media

#### A.9 Access Control (14/14)
- ✅ Complete implementation of access control policies
- ✅ User access provisioning
- ✅ Password management
- ✅ Review of user access rights

#### A.10 Cryptography (2/2)
- ✅ A.10.1.1 Policy on cryptographic controls
- ✅ A.10.1.2 Key management

#### A.12 Operations Security (14/14)
- ✅ Change management
- ✅ Capacity management
- ✅ Malware protection
- ✅ Backup procedures
- ✅ Logging and monitoring

#### A.13 Communications Security (7/7)
- ✅ Network security
- ✅ Network segregation
- ✅ Information transfer policies

#### A.14 System Acquisition, Development and Maintenance (13/13)
- ✅ Secure development lifecycle
- ✅ Security in development
- ✅ Test data protection

#### A.16 Information Security Incident Management (7/7)
- ✅ Incident response procedures
- ✅ Evidence collection
- ✅ Learning from incidents

#### A.17 Business Continuity (4/4)
- ✅ Business continuity planning
- ✅ Disaster recovery
- ✅ Redundancy

#### A.18 Compliance (8/8)
- ✅ Compliance with legal requirements
- ✅ Privacy compliance (GDPR)
- ✅ Independent review of security

### Certification Timeline
- **Gap Analysis:** Completed January 2024
- **Remediation:** February - June 2024
- **Internal Audit:** July 2024
- **Certification Audit:** September - October 2024
- **Certificate Issuance:** Expected November 2024

---

## 5. PCI DSS (Payment Card Industry Data Security Standard)

### Status: ✅ Compliant via Stripe

### Overview
Q-Persona does not directly handle credit card data. All payment processing is handled by Stripe, a PCI DSS Level 1 certified payment processor.

### Implementation
- **Payment Flow:** All payments redirect to Stripe Checkout or use Stripe Elements
- **No Card Data Storage:** Q-Persona never sees or stores card numbers
- **Stripe Compliance:** Stripe maintains PCI DSS Level 1 certification
- **Tokenization:** Payment methods stored as Stripe tokens only

### Compliance Documentation
- Stripe PCI Compliance: https://stripe.com/docs/security/guide
- Q-Persona Payment Architecture: [Security Whitepaper §3.1](./security-whitepaper.md)

---

## 6. CCPA (California Consumer Privacy Act)

### Status: ✅ Compliant

### Overview
Q-Persona complies with the California Consumer Privacy Act and provides California residents with enhanced privacy rights.

### CCPA Rights Implemented

| Right | Implementation |
|-------|---------------|
| **Right to Know** | Data disclosure upon request |
| **Right to Delete** | Account deletion feature |
| **Right to Opt-Out** | Do Not Sell toggle (we don't sell data) |
| **Right to Non-Discrimination** | Same service regardless of privacy choices |

### CCPA Compliance Features
- ✅ Privacy Policy updated for CCPA
- ✅ "Do Not Sell My Personal Information" link (we don't sell)
- ✅ Verifiable consumer requests process
- ✅ 45-day response timeline to requests

---

## 7. PDPA (Singapore Personal Data Protection Act)

### Status: ✅ Compliant

### Overview
As a Singapore-based company, Q-Persona fully complies with the Personal Data Protection Act 2012.

### PDPA Obligations Met
- ✅ **Consent:** Obtained before collection
- ✅ **Purpose Limitation:** Data used only for stated purposes
- ✅ **Notification:** Privacy policy clearly states purposes
- ✅ **Access:** Users can access their personal data
- ✅ **Correction:** Users can correct inaccurate data
- ✅ **Accuracy:** Reasonable steps to ensure data accuracy
- ✅ **Protection:** Security measures in place
- ✅ **Retention:** Data deleted when no longer needed
- ✅ **Transfer:** SCCs for international transfers
- ✅ **Breach Notification:** Procedures in place

---

## 8. Industry-Specific Compliance

### 8.1 Banking & Financial Services
**Regulations:** Bank Indonesia regulations, OJK (Financial Services Authority)

**Compliance Measures:**
- ✅ Complete audit trail for all transactions
- ✅ Data encryption (at rest and in transit)
- ✅ Multi-factor authentication
- ✅ Role-based access control
- ✅ Data residency in Singapore (can be configured)
- ✅ Regular security audits

### 8.2 Healthcare
**Regulations:** HIPAA (US), Indonesian Health Law No. 36/2009

**Compliance Measures:**
- ✅ Business Associate Agreement available
- ✅ PHI encryption and access controls
- ✅ Audit logging of all PHI access
- ✅ Breach notification procedures
- ✅ Staff training on PHI handling

### 8.3 Education
**Regulations:** FERPA (US), local education privacy laws

**Compliance Measures:**
- ✅ Student data protection
- ✅ Parental consent mechanisms
- ✅ Data retention policies
- ✅ Access controls for educational records

### 8.4 Government
**Regulations:** Government data security standards

**Compliance Measures:**
- ✅ Data sovereignty (regional hosting)
- ✅ Enhanced security controls
- ✅ Dedicated instances available
- ✅ Security clearance for staff (on request)

---

## 9. Data Residency Options

### Available Regions

| Region | Location | Compliance | Availability |
|--------|----------|------------|--------------|
| **APAC** | Singapore (AWS ap-southeast-1) | PDPA, GDPR | Default |
| **EU** | Frankfurt (AWS eu-central-1) | GDPR, SCCs | Available |
| **US** | Virginia (AWS us-east-1) | CCPA, HIPAA | Enterprise |
| **Custom** | On request | Case-by-case | Enterprise |

### How to Configure
**Enterprise customers:** Contact sales@q-persona.com to configure data residency

---

## 10. Third-Party Compliance

### Sub-Processors & Their Compliance

| Vendor | Purpose | Compliance Certifications | DPA |
|--------|---------|-------------------------|-----|
| **AWS** | Infrastructure | SOC 2, ISO 27001, HIPAA | ✅ |
| **Supabase** | Database | SOC 2, GDPR | ✅ |
| **Vercel** | CDN & Hosting | SOC 2, GDPR | ✅ |
| **Stripe** | Payments | PCI DSS Level 1, SOC 2 | ✅ |
| **PostHog** | Analytics | GDPR, SOC 2 | ✅ |

**All vendors:**
- Have Data Processing Agreements (DPAs) in place
- Undergo annual security reviews
- Are contractually obligated to maintain compliance

---

## 11. Compliance Documentation

### Available Documents

| Document | Description | Access |
|----------|-------------|--------|
| **Security Whitepaper** | Complete security architecture | [Download](./security-whitepaper.md) |
| **Privacy Policy** | Data handling and privacy practices | https://q-persona.com/privacy |
| **Terms of Service** | Legal terms and conditions | https://q-persona.com/terms |
| **DPA Template** | Data Processing Agreement | On request |
| **BAA Template** | HIPAA Business Associate Agreement | On request |
| **Subprocessor List** | Third-party vendors | [Download PDF](#) |
| **SOC 2 Report** | Type I/II (when available) | Enterprise customers only |
| **Penetration Test Report** | Annual security assessment | Enterprise customers (NDA) |

---

## 12. Compliance Roadmap

### Q2 2024
- 🔄 SOC 2 Type I certification completion
- 🔄 Enhanced DLP (Data Loss Prevention) features
- 🔄 Bug bounty program launch

### Q3 2024
- ⏳ SOC 2 Type II observation period
- ⏳ ISO 27001 pre-audit
- ⏳ HIPAA security assessment

### Q4 2024
- ⏳ SOC 2 Type II certification
- ⏳ ISO 27001 certification
- ⏳ Additional regional certifications (as needed)

---

## 13. Requesting Compliance Information

### For Enterprise Customers

**Standard Requests:**
- Email: compliance@q-persona.com
- Response Time: 48 hours

**Available Upon Request:**
- Data Processing Agreement (DPA)
- Business Associate Agreement (BAA)
- Subprocessor list with compliance details
- Security questionnaires (SIG, CAIQ)
- SOC 2 reports (after completion)
- Penetration test results (under NDA)

### For Auditors

**Audit Support:**
- Dedicated compliance support during audits
- Technical documentation access
- System demonstrations
- Evidence collection assistance

**Contact:** compliance@q-persona.com

---

## 14. Compliance Contacts

**General Compliance Inquiries:**
- Email: compliance@q-persona.com
- Phone: +62-21-XXXX-XXXX (Enterprise)

**Data Protection Officer (DPO):**
- Email: dpo@q-persona.com
- Role: GDPR and privacy compliance oversight

**Chief Information Security Officer (CISO):**
- Email: ciso@q-persona.com
- Role: Overall security and compliance strategy

**Sales (Compliance Questions):**
- Email: sales@q-persona.com
- Phone: +62-21-XXXX-XXXX

---

## Appendix: Compliance Checklists

### Enterprise IT Security Checklist
- [x] SOC 2 certification (in progress)
- [x] Data encryption (AES-256 at rest, TLS 1.3 in transit)
- [x] Multi-factor authentication
- [x] Single Sign-On (SAML, OAuth)
- [x] Role-based access control
- [x] Complete audit logging
- [x] GDPR compliance features
- [x] HIPAA readiness (BAA available)
- [x] Data backup and recovery
- [x] Incident response plan
- [x] Security awareness training
- [x] Regular penetration testing
- [x] Vulnerability management program

### Banking Compliance Checklist
- [x] Complete audit trail
- [x] Data residency controls
- [x] Encryption standards met
- [x] Access controls and MFA
- [x] Incident response procedures
- [x] Business continuity plan
- [x] Vendor due diligence
- [x] Regulatory reporting capabilities

### Healthcare Compliance Checklist
- [x] HIPAA Technical Safeguards
- [x] HIPAA Administrative Safeguards
- [x] HIPAA Physical Safeguards
- [x] BAA available
- [x] PHI access controls
- [x] Audit logging of PHI access
- [x] Breach notification procedures
- [x] Encryption of PHI

---

**Document Version:**

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | November 4, 2025 | Initial release | Compliance Team |

**Classification:** Public  
**Next Review Date:** February 4, 2026

---

© 2025 Q-Persona. All rights reserved.
