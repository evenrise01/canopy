# PRD.md — Canopy MVP

## 1. Product Overview

### Product Name
**Canopy**

### Product Type
Client-facing project management platform with AI-assisted admin workflows

### Target Users
- **Primary:** Freelancers, studios, agencies, consultants
- **Secondary:** Their clients (read-only + limited interaction)

### Problem Statement
Freelancers and small teams manage clients using fragmented tools (Notion, email, WhatsApp, Drive).  
This leads to:
- Client confusion
- Status anxiety
- Repetitive updates
- Lack of trust and visibility

### Solution
Canopy provides a **single, structured, client-visible workspace** per project, with:
- Clear progress tracking
- Controlled transparency
- AI-assisted (but human-approved) admin workflows

Canopy is **not** a CRM replacement or internal task manager.  
It is a **trust and communication layer** between admins and clients.

---

## 2. Goals & Non-Goals

### Goals (MVP)

- Allow admins to manage projects in a structured way
- Allow clients to clearly see project progress
- Reduce repetitive client communication
- Introduce AI assistance without loss of control
- Guide new admins to a usable workspace immediately after signup
- Enforce strict data boundaries and permissions

### Non-Goals (MVP)

- Full CRM functionality
- Time tracking
- Real-time chat
- Automation-first workflows
- Complex analytics
- Mobile apps

---

## 3. User Roles

### 3.1 Admin
- Creates and manages workspaces
- Completes onboarding during first-time setup
- Manages clients and projects
- Controls what clients see
- Approves all AI-generated actions

### 3.2 Client
- Views assigned projects
- Views milestones, status, files
- Uploads files
- Leaves comments
- Views invoices

Clients have **no visibility into internal systems**.

---

## 4. Core Concepts & Data Models

### Workspace
- Represents a freelancer or agency
- Created automatically after onboarding completion
- Owned by an Admin
- Contains:
  - Business metadata (currency, business type, team size)
  - Clients
  - Projects
  - Billing configuration

---

## 5. Signup & Onboarding Flow (MVP – Mandatory)

### 5.1 Authentication

- Authentication handled exclusively by **Clerk**
- Supported methods:
  - Email/password
  - Magic link
  - Social login (future-ready)

---

### 5.2 Post-Signup Redirect (Critical)

**Immediately after successful Clerk authentication**, the user must be redirected to:

/getting_started


This flow is **mandatory** and cannot be skipped on first login.

No workspace is considered “active” until onboarding is completed.

---

### 5.3 `/getting_started` Onboarding Flow

The onboarding flow is **multi-step**, inspired by the provided Bonsai UX.

Progress is visually indicated (step indicator).

---

#### Step 1: Business Type

**Question**
> What kind of work does your business do?

**Input**
- Select or type business category (e.g. Design, Development, Marketing, Consulting)

**Stored As**
- `workspace.businessCategory`

---

#### Step 2: Business Details

**Questions**
- Which currency do you bill your clients in?
- What type of business do you have?
- How many people work in your business?

**Inputs**
- Currency selector (default inferred from locale)
- Business type (Solo / Agency / Studio / Company)
- Team size:
  - Just me
  - 2–5
  - 6–20
  - 21–100
  - 100+

**Stored As**
- `workspace.currency`
- `workspace.businessType`
- `workspace.teamSize`

Validation:
- All fields required
- Inline errors only (no blocking modals)

---

#### Step 3: Intended Usage

**Question**
> How do you plan to use Canopy?

**Multi-select options**
- Manage clients & projects
- Send proposals & agreements (future-facing, no implementation in MVP)
- Bill clients with invoices
- Manage milestones & deliverables
- Plan team resources (future-facing)

Selections are used **only for prioritization**, not feature gating.

**Stored As**
- `workspace.intendedUsage[]`

---

#### Step 4: Trial & Subscription Setup

- User is shown a **7-day free trial**
- Stripe checkout embedded or modal-based
- Credit card required to start trial
- Clear disclosure:
  - Trial duration
  - Billing start date
  - Monthly vs yearly pricing
  - Cancel anytime

**Rules**
- No charges during trial
- Workspace becomes fully active only after this step
- Pricing logic handled via Stripe only

---

### 5.4 Onboarding Completion

Once all steps are complete:

- Workspace is marked as `onboardingComplete = true`
- User is redirected to:
/dashboard


---

## 6. Feature Scope (MVP)

### 6.1 Admin Dashboard

Admins can:

- Create/edit/delete projects
- Assign clients to projects
- Define milestones
- Update project status
- Upload files
- Add internal notes
- Invite clients via email
- View AI suggestions (approval-gated)

---

### 6.2 Client Dashboard

Clients can:

- View project overview
- View current status
- View milestones & progress
- Download files
- Upload files
- Leave comments
- View invoices

Clients cannot:
- See internal notes
- See AI activity
- Modify project structure

---

## 7. AI System (Agentic, Approval-Gated)

AI exists solely to **assist admins**, never to act autonomously.

_No changes from previous version._

---

## 8. Architecture & Technical Design

### 8.1 Architecture

- Single-app repository
- Modular monolith
- Scaffolded using `npm create t3-app@latest`
- No Turborepo / no monorepo
- Clear domain separation via folders

---

## 9. Permissions & Security

_No changes from previous version._

---

## 10. Performance Requirements

_No changes from previous version._

---

## 11. Out of Scope (Explicit)

_No changes from previous version._

---

## 12. Success Metrics (MVP)

- Onboarding completion rate
- % of users completing trial setup
- Time-to-first-project
- % of projects with client logins
- Reduction in manual status updates

---

## 13. Definition of Done

A feature is done only if:

- It matches this PRD exactly
- It follows **PROJECT_RULES.md**
- It introduces no new concepts
- It preserves trust and clarity

If unclear, default to:

> Trust > Safety > Simplicity > Speed
