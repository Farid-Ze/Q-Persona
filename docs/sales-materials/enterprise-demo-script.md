# Enterprise Demo Script

**Purpose**: 30-minute enterprise product demo focused on compliance and audit capabilities  
**Target Audience**: IT Directors, Compliance Officers, Security Teams  
**Key Goal**: Demonstrate how Q-Persona solves compliance challenges

---

## Pre-Demo Preparation

### Before the Call
- [ ] Confirm demo time and attendees
- [ ] Research prospect's company and industry
- [ ] Understand their compliance requirements (GDPR, HIPAA, SOC 2, etc.)
- [ ] Prepare demo environment with realistic data
- [ ] Test screen sharing and audio
- [ ] Have security whitepaper ready to share
- [ ] Prepare custom pricing based on their needs

### Demo Environment Setup
- [ ] Login to enterprise demo account
- [ ] Have multiple tabs ready:
  - Dashboard overview
  - Questionnaire builder
  - Audit logs
  - Team management
  - Admin settings
- [ ] Sample data loaded (see demo-account-setup.md)

---

## Demo Flow (30 Minutes)

### Introduction (2 minutes)

**Script**:

"Thanks for joining today, [Name]. I'm [Your Name] from Q-Persona. Before we dive in, I'd like to understand a bit more about your current situation."

**Discovery Questions**:
1. "What survey or questionnaire tools are you currently using?"
2. "What compliance frameworks do you need to comply with? (GDPR, HIPAA, etc.)"
3. "Have you had any compliance audits recently? What were the main challenges?"
4. "Who else in your organization will be involved in evaluating this solution?"

**Listen carefully** - adjust demo focus based on their answers.

---

### Part 1: The Problem (3 minutes)

**Script**:

"Based on what you've shared, let me highlight the core problem we solve.

Most survey tools—even popular ones like SurveyMonkey or Google Forms—have a critical gap: **no audit trail**.

When your compliance officer or auditor asks:
- 'Who accessed the employee compensation survey last quarter?'
- 'Show me everyone who viewed customer PII data.'
- 'Prove that only authorized personnel saw this sensitive information.'

...you simply can't answer those questions.

This creates real compliance risk, especially for organizations in [banking/healthcare/legal] industries like yours.

Let me show you how we solve this."

---

### Part 2: Platform Overview (5 minutes)

**Navigate to Dashboard**

**Script**:

"This is the Q-Persona dashboard. I'm logged in as an admin, and I can see:

1. **Active Questionnaires** - Our surveys and forms currently running
2. **Response Metrics** - How many responses we're collecting
3. **Team Activity** - Who's been active recently
4. **System Health** - Uptime, performance, any issues

Notice the clean, professional interface. This isn't a consumer tool—it's built for enterprise teams."

**Show**:
- Dashboard metrics
- Navigation structure
- User interface quality

**Key Points**:
- ✅ Modern, intuitive interface
- ✅ Real-time metrics
- ✅ Team collaboration features

---

### Part 3: Questionnaire Creation (5 minutes)

**Navigate to Questionnaire Builder**

**Script**:

"Let's create a quick questionnaire to show you the workflow.

[Click 'Create Questionnaire']

We have templates for common use cases—HR surveys, customer feedback, research studies. Or you can build from scratch.

[Select template or create new]

The drag-and-drop builder makes it easy to:
- Add questions (multiple choice, text, rating scales)
- Set conditional logic (show Question 3 only if they answered 'Yes' to Question 2)
- Customize branding
- Configure privacy settings

[Demonstrate adding a few questions]

Notice that I can set **visibility permissions** right here. I can control which team members can:
- Edit this questionnaire
- View responses
- Export data

This is our **Role-Based Access Control** in action."

**Show**:
- Template library
- Drag-and-drop builder
- Question types
- Conditional logic
- Branding options
- Permission settings

**Key Points**:
- ✅ Easy to use (non-technical users)
- ✅ Professional templates
- ✅ Granular access control
- ✅ Enterprise branding

---

### Part 4: Team & Role Management (5 minutes)

**Navigate to Team Settings**

**Script**:

"Now let's talk about how you control access.

[Navigate to Team/Users page]

Here's where you manage your team. I've set up a few sample users to show different roles:

1. **Admin** (like me)
   - Full system access
   - Can manage users and settings
   - Can view all audit logs

2. **Editor** 
   - Can create and edit questionnaires
   - Can view responses
   - Cannot delete data or manage users

3. **Viewer**
   - Read-only access
   - Can view responses and reports
   - Cannot make changes

[Show each user's permissions]

For regulated industries, this separation of duties is critical. You might have:
- **HR team** creating employee surveys (Editor role)
- **Legal team** reviewing for compliance (Viewer role)
- **IT security** monitoring the system (Admin role)

And here's the key: **every action is logged**, which brings us to our most important feature..."

**Show**:
- User list
- Role assignment
- Permission matrix
- Invite process

**Key Points**:
- ✅ Flexible role system
- ✅ Principle of least privilege
- ✅ Easy user management
- ✅ SSO integration available

---

### Part 5: Audit Logs - THE KEY FEATURE (10 minutes)

**Navigate to Audit Logs**

**Script**:

"This is why most enterprises choose Q-Persona: **Complete Audit Logging**.

[Navigate to /dashboard/workspace/settings/audit]

Every single action in the system is logged. Let me show you what we track:

[Scroll through audit log entries]

For each action, we record:
- **Who**: User ID and email address
- **What**: Specific action (viewed questionnaire, edited response, exported data)
- **When**: Exact timestamp (down to the millisecond)
- **Where**: IP address and geographic location
- **How**: Request method and browser information
- **Result**: Success or failure, with any error messages

[Point to specific log entries]

Let's filter this. Say your compliance officer asks: 'Show me everyone who accessed the customer satisfaction survey in October.'

[Demonstrate filtering]
- Filter by: Questionnaire ID
- Date range: October 1-31
- Action type: 'view_questionnaire'

[Show filtered results]

There you go. Complete audit trail. 

You can export this data for compliance audits:

[Click Export]
- CSV format for spreadsheet analysis
- JSON for integration with your SIEM system

**This is the capability that no other survey platform offers at this price point.**

Now let me show you a compliance scenario..."

**Compliance Scenario**:

**Script**:

"Imagine this scenario:

An employee files a GDPR data subject access request. They want to know:
'Who accessed my employee feedback survey response?'

With most tools, you'd have no answer. With Q-Persona:

[Filter audit logs]
- Filter by respondent_id: [employee ID]
- Action: 'view_response'

[Show results]

Here's everyone who viewed this employee's response:
- HR Manager: Viewed on Oct 15 at 2:34 PM from IP 192.168.1.100
- Department Head: Viewed on Oct 16 at 9:12 AM from IP 192.168.1.105

You have a complete, tamper-proof record. That's GDPR compliance in action."

**Show**:
- Audit log dashboard
- Log entry details
- Filtering capabilities
- Export options
- Real-time logging
- Search functionality

**Key Points**:
- ✅ Every action logged
- ✅ Tamper-proof records
- ✅ Easy to search and filter
- ✅ Export for compliance reporting
- ✅ GDPR/HIPAA/SOC 2 ready
- ✅ Integration with SIEM systems

---

### Part 6: Enterprise Security Features (3 minutes)

**Navigate to Security Settings**

**Script**:

"Beyond audit logs, we have comprehensive security features:

[Show Security Settings page]

1. **Single Sign-On (SSO)**
   - Works with Okta, Azure AD, Google Workspace
   - SAML 2.0 and OAuth 2.0
   - One login for all your tools

2. **Multi-Factor Authentication (MFA)**
   - TOTP (Time-based One-Time Password)
   - SMS codes
   - Authenticator apps
   - Required for admin users (configurable)

3. **Rate Limiting**
   - Prevent brute force attacks
   - API abuse protection
   - Configurable limits

4. **Data Encryption**
   - AES-256 at rest
   - TLS 1.3 in transit
   - Encrypted backups

5. **Data Residency**
   - Choose where your data is stored (EU, US, APAC)
   - Compliance with local data protection laws

All these features are included in our Enterprise tier. No additional charges for security."

**Show**:
- SSO configuration screen
- MFA settings
- Security dashboard
- Data residency options

**Key Points**:
- ✅ Enterprise authentication
- ✅ Defense in depth
- ✅ Global compliance
- ✅ No hidden costs

---

### Part 7: Pricing & Next Steps (2 minutes)

**Share Screen with Pricing Page**

**Script**:

"Let's talk about pricing. We have four tiers:

**Free**: For personal projects
- 3 questionnaires, 100 responses/month

**Pro ($29/month)**: For small teams
- Unlimited questionnaires, 1,000 responses/month

**Business ($99/month)**: For growing teams
- 10,000 responses/month
- Team collaboration
- Basic audit logs (30 days)
- SSO included

**Enterprise ($10,000/year)**: For regulated industries
- Unlimited responses
- Complete audit logs (unlimited retention)
- 99.5% SLA
- Priority support
- Custom integrations
- Dedicated account manager

Based on what you've shared, the **Enterprise tier** would be the right fit for [Company Name] because:
1. You need complete audit trails for compliance
2. You're in a regulated industry ([banking/healthcare/etc.])
3. You need [specific feature they mentioned]

For [estimated number] users and [estimated responses/month] responses, this would be our base Enterprise package.

[If they ask about ROI]

Let's talk about ROI. What's the cost of a GDPR violation? Up to 4% of annual revenue. What's the cost of a failed compliance audit? Potential regulatory action, reputational damage.

Our $10,000/year investment is insurance against those much larger costs. Plus, you save time on manual compliance reporting—our customers report saving 10+ hours per month on audit preparation."

**Show**:
- Pricing comparison table
- Enterprise feature list
- ROI calculator (if available)

**Key Points**:
- ✅ Transparent pricing
- ✅ Clear value proposition
- ✅ ROI justification
- ✅ Risk mitigation

---

## Q&A (Remaining time)

### Common Questions & Answers

**Q: "Do you integrate with our existing tools?"**

**A**: "Yes, we have:
- REST API for custom integrations
- Webhooks for real-time notifications
- SSO for authentication
- CSV/JSON export for data integration
- SIEM integration for security teams

What specific tools do you need to integrate with?"

---

**Q: "What about data privacy? Where is our data stored?"**

**A**: "Great question. Your data is stored in [region of choice—EU, US, or APAC]. It never leaves that region unless you explicitly configure cross-region backups.

We're GDPR compliant, HIPAA-ready, and working toward SOC 2 certification. I can send you our security whitepaper and DPA for your legal team to review."

---

**Q: "Can we customize the look and feel?"**

**A**: "Absolutely. You can:
- Add your company logo
- Customize colors and fonts
- Use custom domain (enterprise.yourcompany.com)
- White-label the platform (remove Q-Persona branding)

All included in Enterprise tier."

---

**Q: "What if we need help or have an issue?"**

**A**: "Enterprise tier includes:
- Priority support (1-hour response time for critical issues)
- Dedicated account manager
- Quarterly business reviews
- Implementation assistance
- Training for your team
- 24/7 emergency support

You're not just buying software—you're getting a partner."

---

**Q: "How long does implementation take?"**

**A**: "Most customers are up and running in 1-2 weeks:
- Week 1: Setup, SSO configuration, user import
- Week 2: Training, create first questionnaires, go live

We provide full implementation support. Our account manager will guide you through every step."

---

**Q: "What about compliance certifications?"**

**A**: "Current status:
- GDPR: ✅ Fully compliant
- HIPAA: ✅ Ready (BAA available)
- SOC 2 Type I: In progress (Q1 2026)
- SOC 2 Type II: Planned (Q3 2026)

We can share our security whitepaper, compliance datasheet, and current audit reports."

---

**Q: "Can we try it first?"**

**A**: "Absolutely. We offer a 30-day trial of the Business tier, which includes:
- Basic audit logging
- Team collaboration
- SSO integration
- Full feature access (except unlimited retention)

This gives you a chance to test it with real data before committing to Enterprise. Would you like me to set that up for you?"

---

**Q: "What if we outgrow the platform?"**

**A**: "Q-Persona scales with you:
- Architecture handles millions of responses
- Global CDN for performance
- Auto-scaling infrastructure
- No limits on users or questionnaires (Enterprise)

Our largest customer processes 500K+ responses per month with no issues. We're built for enterprise scale."

---

## Closing (Final 2-3 minutes)

**Script**:

"[Name], based on our conversation today, I think Q-Persona is a great fit for [Company Name] because:
1. [Reason 1 based on their needs]
2. [Reason 2 based on their needs]
3. [Reason 3 based on their needs]

Here's what I propose as next steps:

**Option 1: Trial**
- I'll set up a 30-day Business tier trial
- You can test with your team
- We'll have a check-in call in 1 week

**Option 2: Direct to Enterprise**
- I'll send you our DPA and BAA for legal review
- Custom pricing based on your volume
- Target: Go live in 3 weeks

**Option 3: More Information**
- I'll send security whitepaper and compliance datasheet
- You review with your team
- We schedule a follow-up call

Which option makes the most sense for you?"

[Listen to their response and follow their lead]

---

### Follow-Up Actions

**After the Demo**:
- [ ] Send thank you email within 1 hour
- [ ] Include demo recording (if allowed)
- [ ] Share security whitepaper
- [ ] Share compliance datasheet
- [ ] Send custom pricing proposal
- [ ] Schedule follow-up call
- [ ] Add to CRM with detailed notes
- [ ] Log demo in roadmap tracker

**Thank You Email Template**:

```
Subject: Thanks for the demo, [Name]

Hi [Name],

Thank you for taking the time to meet with me today. I enjoyed learning about [Company Name]'s compliance requirements and showing you how Q-Persona can help.

As discussed, here are the resources I mentioned:
- Security Whitepaper: [link]
- Compliance Datasheet: [link]
- Demo Recording: [link]
- Pricing Proposal: [link]

Based on our conversation, I'm proposing [recommended next step].

I'll follow up on [date] to see if you have any questions. In the meantime, feel free to reach out anytime.

Best regards,
[Your Name]
[Title]
[Phone]
[Email]
```

---

## Demo Tips

### Do's ✅
- ✅ Ask discovery questions first
- ✅ Focus on their pain points
- ✅ Show, don't tell (use the product)
- ✅ Use real-world scenarios
- ✅ Pause for questions
- ✅ Demonstrate audit logs thoroughly (it's the differentiator)
- ✅ Connect features to business value
- ✅ Be conversational, not scripted
- ✅ Take notes during the call
- ✅ Confirm next steps before ending

### Don'ts ❌
- ❌ Rush through the demo
- ❌ Show every feature (focus on what matters to them)
- ❌ Skip discovery questions
- ❌ Make promises you can't keep
- ❌ Bad-mouth competitors
- ❌ Ignore their concerns
- ❌ End without clear next steps
- ❌ Forget to follow up
- ❌ Talk more than they do (aim for 60/40 them/you)

---

## Demo Checklist

### Pre-Demo
- [ ] Research prospect company
- [ ] Understand their industry/compliance needs
- [ ] Prepare demo environment
- [ ] Test screen sharing
- [ ] Have resources ready to share
- [ ] Review this script

### During Demo
- [ ] Start with discovery questions
- [ ] Demonstrate problem understanding
- [ ] Show platform overview
- [ ] Demonstrate audit logs (thoroughly)
- [ ] Show security features
- [ ] Discuss pricing
- [ ] Handle objections
- [ ] Confirm next steps

### Post-Demo
- [ ] Send follow-up email (within 1 hour)
- [ ] Share promised resources
- [ ] Update CRM
- [ ] Schedule next call
- [ ] Add to pipeline tracking

---

## Customizations by Industry

### For Banking/Financial Services
- Emphasize: OJK compliance, transaction audit trails, data residency
- Show: Role separation (audit vs. operations)
- Mention: Basel III operational risk requirements

### For Healthcare
- Emphasize: HIPAA compliance, BAA availability, PHI protection
- Show: Access controls, encryption, breach notification
- Mention: Patient privacy requirements

### For Legal Services
- Emphasize: Client confidentiality, attorney-client privilege, ethical walls
- Show: Role-based access, audit trails, secure deletion
- Mention: Professional responsibility rules

### For Research Institutions
- Emphasize: IRB compliance, research data integrity, participant privacy
- Show: Data retention, export capabilities, consent management
- Mention: Research ethics guidelines

---

## Success Metrics

Track these for each demo:
- Demo completion rate
- Questions asked (engagement level)
- Objections raised
- Next steps confirmed
- Follow-up meeting scheduled
- Trial started
- Deal closed

**Goal**: 30% of demos → trials, 50% of trials → closed deals

---

**Document Version**: 1.0  
**Last Updated**: November 2025  
**Owner**: Sales Team

Good luck with your demos! 🚀
