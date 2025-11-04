# Enterprise Demo Account Setup Guide

## Overview

**Purpose:** Create a compelling demo environment that showcases all enterprise features to prospects.

**Demo Account Details:**
- **Workspace:** "Acme Bank Indonesia - Demo"
- **URL:** demo.q-persona.com (or /demo path)
- **Tier:** Enterprise (all features enabled)
- **Pre-populated:** Sample data, surveys, audit logs, team members

---

## Demo Account Components

### 1. Pre-Populated Surveys (8 total)

#### Survey 1: Employee Satisfaction Q4 2023
- **Type:** Internal HR survey
- **Status:** Completed (250 responses)
- **Purpose:** Show analytics dashboard
- **Features to demo:**
  - Real-time response charts
  - Export capabilities
  - Filter/segment results

#### Survey 2: Customer Net Promoter Score (NPS)
- **Type:** Customer feedback
- **Status:** Active (1,200 responses)
- **Purpose:** Show public-facing survey
- **Features to demo:**
  - Anonymous vs. identified responses
  - Email triggers
  - Trend analysis

#### Survey 3: Compliance Training Assessment
- **Type:** Regulatory compliance
- **Status:** Completed (500 responses)
- **Purpose:** Show audit trail importance
- **Features to demo:**
  - Required questions
  - Completion tracking
  - Audit log for compliance

#### Survey 4: IT Security Awareness Survey
- **Type:** Security/compliance
- **Status:** Active (75 responses)
- **Purpose:** Show SSO integration
- **Features to demo:**
  - SSO-only access
  - MFA requirement
  - Role-based viewing

#### Survey 5: Branch Manager Feedback
- **Type:** Internal management
- **Status:** Active (45 responses)
- **Purpose:** Show RBAC
- **Features to demo:**
  - Workspace isolation
  - Admin vs. Editor vs. Viewer roles
  - Limited data access

#### Survey 6: New Product Feature Request
- **Type:** Product development
- **Status:** Active (320 responses)
- **Purpose:** Show template marketplace
- **Features to demo:**
  - Template usage
  - Expert-created templates
  - Template ratings

#### Survey 7: Customer Support CSAT
- **Type:** Support quality
- **Status:** Completed (5,000 responses)
- **Purpose:** Show scale/performance
- **Features to demo:**
  - Large dataset handling
  - Fast load times (CDN)
  - Export large files

#### Survey 8: [FAILED] Salary Survey 2023
- **Type:** HR compensation
- **Status:** Failed processing
- **Purpose:** Show failed jobs dashboard
- **Features to demo:**
  - Failed job detection
  - Error details visible
  - One-click retry

---

### 2. Pre-Populated Team Members (8 users)

#### User 1: Sarah Tan (Admin)
- **Email:** sarah.tan@acmebank.demo
- **Role:** Workspace Admin
- **Department:** IT Security
- **MFA:** Enabled
- **Recent Activity:** Created 3 surveys, exported audit logs

#### User 2: Ahmad Rahman (Admin)
- **Email:** ahmad.rahman@acmebank.demo
- **Role:** Workspace Admin
- **Department:** Compliance
- **MFA:** Enabled
- **Recent Activity:** Reviewed compliance survey results

#### User 3: Linda Wijaya (Editor)
- **Email:** linda.wijaya@acmebank.demo
- **Role:** Editor
- **Department:** HR
- **MFA:** Enabled
- **Recent Activity:** Created employee satisfaction survey

#### User 4: David Santoso (Editor)
- **Email:** david.santoso@acmebank.demo
- **Role:** Editor
- **Department:** Marketing
- **MFA:** Not enabled
- **Recent Activity:** Launched NPS survey

#### User 5: Maya Putri (Editor)
- **Email:** maya.putri@acmebank.demo
- **Role:** Editor
- **Department:** Product
- **MFA:** Enabled
- **Recent Activity:** Analyzing feature request data

#### User 6: Budi Setiawan (Viewer)
- **Email:** budi.setiawan@acmebank.demo
- **Role:** Viewer (Read-only)
- **Department:** Finance
- **MFA:** Not enabled
- **Recent Activity:** Viewed NPS dashboard

#### User 7: Rina Kusuma (Viewer)
- **Email:** rina.kusuma@acmebank.demo
- **Role:** Viewer
- **Department:** Operations
- **MFA:** Not enabled
- **Recent Activity:** Accessed branch feedback report

#### User 8: [DEACTIVATED] Former Employee
- **Email:** john.doe@acmebank.demo
- **Role:** N/A (Access revoked via SSO)
- **Department:** IT (Former)
- **Purpose:** Show instant deprovisioning

---

### 3. Pre-Populated Audit Logs (500+ entries)

**Sample Audit Log Entries:**

```
2024-01-15 14:23:41 | User: sarah.tan@acmebank.demo
Action: questionnaire.created | Resource: Employee_Satisfaction_Q4
IP: 203.0.113.42 | Workspace: Acme-Bank | Role: Admin

2024-01-15 14:45:12 | User: linda.wijaya@acmebank.demo
Action: questionnaire.published | Resource: Employee_Satisfaction_Q4
IP: 203.0.113.45 | Workspace: Acme-Bank | Role: Editor

2024-01-16 09:15:33 | User: ahmad.rahman@acmebank.demo
Action: audit_log.exported | Resource: Compliance_Q4_2023
IP: 203.0.113.50 | Workspace: Acme-Bank | Role: Admin
Export Format: CSV | Records: 250

2024-01-16 11:30:22 | User: budi.setiawan@acmebank.demo
Action: questionnaire.viewed | Resource: NPS_Survey
IP: 203.0.113.67 | Workspace: Acme-Bank | Role: Viewer

2024-01-17 08:00:00 | User: john.doe@acmebank.demo [DEACTIVATED]
Action: login.failed | Resource: N/A
IP: 198.51.100.10 | Reason: SSO account disabled
```

**Audit Log Categories:**
- User authentication (login, logout, MFA events)
- Survey management (create, edit, delete, publish)
- Data access (view, export, download)
- Team management (invite, role change, deactivate)
- Settings changes (SSO config, MFA enforcement)

**Date Range:** Last 90 days  
**Total Entries:** 500+  
**Exportable:** ✅ CSV, JSON, PDF

---

### 4. Failed Jobs Dashboard (5 sample failures)

#### Failed Job #1: Salary Survey Response Processing
- **Job ID:** FJ-2024-001
- **Survey:** Salary Survey 2023
- **Failed At:** 2024-01-10 15:30:00
- **Error:** "Invalid JSON format in response #347"
- **Payload:** [View raw data]
- **Actions:** [Retry] [View Details] [Mark Resolved]
- **Status:** Pending retry

#### Failed Job #2: Bulk Email Send
- **Job ID:** FJ-2024-002
- **Survey:** NPS Survey
- **Failed At:** 2024-01-12 09:15:00
- **Error:** "SMTP timeout - 500 emails not sent"
- **Payload:** [View recipient list]
- **Actions:** [Retry] [Mark Resolved]
- **Status:** Resolved (manually)

#### Failed Job #3: Report Generation
- **Job ID:** FJ-2024-003
- **Survey:** Employee Satisfaction Q4
- **Failed At:** 2024-01-13 14:00:00
- **Error:** "PDF generation failed - missing template"
- **Payload:** [View report config]
- **Actions:** [Retry] [Delete]
- **Status:** Pending

#### Failed Job #4: Data Export
- **Job ID:** FJ-2024-004
- **Survey:** Compliance Training
- **Failed At:** 2024-01-14 10:30:00
- **Error:** "Export timeout - 10,000 rows"
- **Payload:** [View export params]
- **Actions:** [Retry with pagination] [Mark Resolved]
- **Status:** Resolved (retried successfully)

#### Failed Job #5: Integration Sync
- **Job ID:** FJ-2024-005
- **Survey:** Branch Manager Feedback
- **Failed At:** 2024-01-15 11:00:00
- **Error:** "API rate limit exceeded - Salesforce"
- **Payload:** [View sync log]
- **Actions:** [Retry after cooldown] [Configure rate limit]
- **Status:** Pending

---

### 5. SSO Configuration (Pre-configured)

**Provider:** Azure Active Directory (Demo)

**Configuration:**
- **Entry Point:** https://login.microsoftonline.com/[tenant]/saml2
- **Issuer:** https://sts.windows.net/[tenant]/
- **Certificate:** [Mock cert uploaded]
- **Auto-provision:** Enabled
- **Default Role:** Viewer (promoted manually)
- **Status:** ✅ Connected

**Test Users:**
- sarah.tan@acmebank.demo (via Azure AD)
- ahmad.rahman@acmebank.demo (via Azure AD)

---

### 6. MFA Settings (Configured)

**Workspace Policy:**
- MFA enforcement: Recommended (not required)
- Allowed methods: TOTP, SMS
- Backup codes: Enabled

**User MFA Status:**
- 5/8 users have MFA enabled (62.5%)
- Target: 100% for admins (met)

**Sample TOTP Secret (for demo):**
- User: sarah.tan@acmebank.demo
- Secret: DEMO1234567890ABCDEF
- QR Code: [Generated]

---

### 7. Demo Script / Talking Points

#### Introduction (2 minutes)
"Welcome to Acme Bank Indonesia's Q-Persona workspace. This is a realistic demo environment showing how a bank uses our platform for compliance-critical surveys."

#### Feature 1: Audit Logs (5 minutes)
**Navigate to:** `/dashboard/workspace/settings/audit`

**Show:**
- 500+ logged actions
- Filter by user (Sarah Tan)
- Filter by action (questionnaire.viewed)
- Export to CSV

**Say:**  
"Notice every action has: who, what, when, IP address. When your auditor asks, 'Who accessed customer satisfaction data last month?', you export this CSV. Audit done in 15 minutes, not 2 weeks."

#### Feature 2: SSO Integration (3 minutes)
**Navigate to:** `/dashboard/workspace/settings/sso`

**Show:**
- Azure AD configured
- Test connection button
- Auto-provisioning enabled

**Say:**  
"When an employee joins Acme Bank, they're auto-provisioned in Q-Persona via SSO. When they leave, their Q-Persona access is revoked instantly. No manual user management."

#### Feature 3: MFA Security (2 minutes)
**Navigate to:** `/dashboard/settings/security`

**Show:**
- TOTP setup flow
- Backup codes
- Enforcement options

**Say:**  
"For compliance (SOC 2, ISO 27001), you need MFA. Your admins get TOTP, others can use SMS. Takes 30 seconds to set up."

#### Feature 4: RBAC & Workspaces (3 minutes)
**Navigate to:** `/dashboard/workspace/settings/members`

**Show:**
- 8 team members
- 3 roles (Admin, Editor, Viewer)
- Budi (Finance) can only view, not edit

**Say:**  
"Principle of least privilege. Finance team needs to see NPS results but shouldn't create surveys. Marketing can't access HR surveys. Workspace isolation ensures this."

#### Feature 5: Failed Jobs Dashboard (4 minutes)
**Navigate to:** `/admin/health`

**Show:**
- 5 failed jobs listed
- Error details visible
- Click [Retry] on Salary Survey job

**Say:**  
"When processing fails—bad JSON, timeout, API error—it's logged here. Your support team can see the error, retry with one click. No lost data. 3-minute resolution instead of 2-hour email chains."

**Demo the retry:**  
[Click Retry] → Shows "Job queued for retry" → Refresh → Status: "Resolved"

#### Feature 6: Survey at Scale (2 minutes)
**Navigate to:** `/dashboard/surveys/customer-nps`

**Show:**
- 1,200 responses
- Real-time charts
- Fast load time

**Say:**  
"Our CDN ensures <1 second load times globally. Whether you have 100 or 100,000 responses, performance stays fast."

#### Closing (3 minutes)
**Recap features:**
- ✅ Complete audit trail (compliance)
- ✅ SSO integration (IT security requirement)
- ✅ MFA security (best practice)
- ✅ RBAC (least privilege)
- ✅ Failed job retry (operational excellence)
- ✅ Global performance (CDN)

**Next steps:**
"Want to try this with your data? 30-day free trial, no credit card. I'll send you the link."

---

## Demo Environment Setup (Technical)

### Database Seed Script

```sql
-- Create demo workspace
INSERT INTO workspaces (id, name, slug, subscription_tier) 
VALUES ('demo-acme-bank', 'Acme Bank Indonesia - Demo', 'acme-bank-demo', 'enterprise');

-- Create demo users
INSERT INTO users (email, name, role) VALUES
('sarah.tan@acmebank.demo', 'Sarah Tan', 'admin'),
('ahmad.rahman@acmebank.demo', 'Ahmad Rahman', 'admin'),
('linda.wijaya@acmebank.demo', 'Linda Wijaya', 'editor'),
('david.santoso@acmebank.demo', 'David Santoso', 'editor'),
('maya.putri@acmebank.demo', 'Maya Putri', 'editor'),
('budi.setiawan@acmebank.demo', 'Budi Setiawan', 'viewer'),
('rina.kusuma@acmebank.demo', 'Rina Kusuma', 'viewer'),
('john.doe@acmebank.demo', 'John Doe (Deactivated)', NULL);

-- Create demo surveys (abbreviated)
INSERT INTO questionnaires (workspace_id, title, status, response_count) VALUES
('demo-acme-bank', 'Employee Satisfaction Q4 2023', 'completed', 250),
('demo-acme-bank', 'Customer NPS Survey', 'active', 1200),
('demo-acme-bank', 'Compliance Training Assessment', 'completed', 500),
-- ... etc

-- Create audit logs (generate 500 entries)
-- Use script to create realistic distribution over 90 days

-- Create failed jobs
INSERT INTO failed_jobs (job_id, survey_id, error_message, payload, status) VALUES
('FJ-2024-001', 'salary-survey-2023', 'Invalid JSON format in response #347', '{"raw": "..."}', 'pending'),
-- ... etc
```

### Access Credentials

**Demo Account Login:**
- **URL:** https://q-persona.com/demo
- **Email:** demo@q-persona.com
- **Password:** Demo2024!Enterprise
- **MFA:** Disabled for ease of demo

**SSO Test:**
- Available but not required for initial demo

---

## Demo Environment Maintenance

### Weekly Tasks:
- [ ] Reset demo data to baseline state
- [ ] Add 50-100 new audit log entries (realistic activity)
- [ ] Update failed jobs (mark some as resolved)
- [ ] Refresh response counts (+10-50 per survey)

### Monthly Tasks:
- [ ] Archive old audit logs (keep 90 days visible)
- [ ] Update demo script with new features
- [ ] Review feedback from sales team on demo effectiveness

### Quarterly Tasks:
- [ ] Complete demo environment refresh
- [ ] Update sample surveys to reflect current templates
- [ ] Review and update user personas

---

## Demo Success Metrics

Track for each demo:
- [ ] Features shown (checklist)
- [ ] Objections raised
- [ ] Questions asked
- [ ] Next step committed
- [ ] Follow-up scheduled

**Target metrics:**
- Demo → Trial: >60%
- Trial → Paid: >40%
- Demo satisfaction: >4.5/5

---

*This demo environment should be maintained as a production-quality showcase of all enterprise features.*
