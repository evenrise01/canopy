# PROJECT_RULES.md

## Purpose

This document is the **constitution** for the **Canopy (ClientOS) MVP**.

Any human or AI contributor (Cursor, Copilot, internal agents, etc.) **must follow these rules strictly**.  
Violations mean the work is **out of scope** and must be rejected.

This document overrides convenience, creativity, speed, and personal preference.

---

## 1. Product Philosophy (Non-Negotiable)

Canopy (ClientOS) is **not** a generic CRM, task manager, or all-in-one business suite.

The system exists to:

- Centralize client-facing work into a single source of truth
- Increase client trust through transparency and clarity
- Reduce admin overhead using **AI-assisted (approval-gated) workflows**
- Keep humans fully in control of decisions and communication

### Hard Rules

- ❌ Never allow AI to take irreversible actions autonomously  
- ❌ Never expose internal-only data to clients  
- ❌ Never allow AI to commit to timelines, pricing, or outcomes  
- ❌ Never optimize for feature breadth over clarity and trust  
- ❌ Never turn Canopy into a “do-everything” CRM  

All AI behavior must be:

- Explainable  
- Reversible  
- Explicitly approved by an admin  
- Based only on observable project data  

---

## 2. MVP Scope Enforcement

If a feature is **not explicitly mentioned in the PRD**, it **does not exist**.

### Explicitly Out of Scope (MVP)

- Mobile apps
- Time tracking
- Slack / WhatsApp / third-party chat integrations
- White-labeling
- Automation rule builders
- Client-to-client visibility
- Real-time collaboration or presence
- Advanced analytics or reporting dashboards

Do not “helpfully” add features.

---

## 3. Tech Stack (Frozen – Non-Negotiable)

⚠️ **DO NOT CHANGE, SUBSTITUTE, OR ADD TO THIS STACK**

### Repository & Build System

- **Single-app repository**
- Scaffolded using **`npm create t3-app@latest`**
- **No Turborepo**
- **No monorepo**
- **No workspaces**
- One `.git` directory at the repository root only

Architecture style:
- **Modular monolith**
- Domain separation via folders and modules (not packages)

---

### Frontend

- React with TypeScript (`strict: true`)
- Next.js (App Router only)
- Tailwind CSS
- **shadcn/ui (MANDATORY)**
- Radix UI (via shadcn)
- React Server Components by default

❌ No custom component libraries  
❌ No inline UI hacks outside shadcn patterns  

---

### Backend

- Next.js Route Handlers (App Router)
- **tRPC** (end-to-end type safety)
- TypeScript (strict)

Backend responsibilities:
- API orchestration
- Auth enforcement
- AI agent coordination
- Billing enforcement
- File access control

❌ No separate Express/Fastify servers  
❌ No business logic directly inside route handlers  

---

### Authentication

- **Clerk** (mandatory)

Supports:
- Email / password
- Magic links
- Social login (future-ready)

Auth must be enforced at:
- API layer
- Service/domain layer (defense in depth)

---

### Database

- **Supabase Postgres**
- **Prisma ORM** (mandatory)

Rules:
- Prisma schema is the source of truth
- All migrations via Prisma
- No raw SQL unless explicitly approved

---

### Caching

- **Upstash Redis**

Allowed uses:
- Rate limiting
- Short-lived caching
- Idempotency keys

❌ No caching of sensitive client data  
❌ No caching that bypasses permission checks  

---

### File Storage

- **Supabase Storage**

Rules:
- Files must be scoped by workspace and project
- Signed URLs only
- No public buckets

---

### Payments

- **Stripe**

Scope:
- Subscriptions
- Invoices (basic)
- No complex billing logic in MVP

---

### AI

- **OpenAI** (primary LLM)
- **LangGraph** (agent orchestration)

AI is a **copilot**, not an executor.

---

## 4. Architecture Principles (Mandatory)

### Modular Monolith (Strict)

Canopy uses a **single-codebase modular monolith**.

- Clear domain boundaries via folders (e.g. `domains/`, `services/`)
- No cross-domain imports without explicit interfaces
- Shared utilities must be dependency-light

❌ No package-based domain splitting  
❌ No pseudo-monorepo patterns  

---

### Expected High-Level Structure (Illustrative)

src/
app/ # Next.js App Router
server/
api/ # tRPC routers
services/ # Domain logic
ai/ # LangGraph agents
billing/ # Stripe logic
storage/ # Supabase helpers
cache/ # Upstash utilities
db/ # Prisma schema & client
auth/ # Clerk helpers
ui/ # shadcn-based components
config/ # App configuration


❌ No circular dependencies  
❌ No business logic inside UI components  

---

## 5. AI System Rules (Critical)

### Core Principle

AI may **observe, analyze, and suggest**.  
Humans **approve and execute**.

---

### 5.1 Allowed AI Capabilities

AI may:

- Detect delayed milestones
- Flag inactivity or risk signals
- Draft client-facing updates
- Suggest tasks, status changes, or deadlines
- Answer client questions using **client-visible data only**

AI may NOT:

- Change data automatically
- Send emails or notifications without approval
- Promise delivery or outcomes
- Reveal internal reasoning to clients

---

### 5.2 AI Approval Flow (Mandatory)

1. AI generates a suggestion
2. Suggestion includes:
   - Proposed action
   - Reasoning
   - Data sources
   - Confidence score
3. Admin must explicitly:
   - Approve
   - Edit
   - Reject

❌ No background execution  
❌ No silent automation  

All AI actions must be logged.

---

## 6. Client Visibility Rules (Non-Negotiable)

Clients:

- Can see **only** assigned projects
- Can view:
  - Project status
  - Milestones
  - Deliverables
  - Files
  - Comments
  - Invoices

Clients may:
- Comment
- Upload files

Clients must NEVER see:
- Internal notes
- Internal tasks
- AI suggestions
- Other clients or projects
- Admin-only metadata

Permission checks must exist at the **API level**, not just the UI.

---

## 7. Language & Tone Rules

All user-facing language must be:

- Professional
- Neutral
- Clear
- Trust-building

Avoid:
- Casual or playful tone
- Over-promising
- Speculative statements
- Internal jargon

Examples:

- ✅ “This milestone appears delayed based on the current due date.”
- ❌ “This project is going badly.”

---

## 8. Notifications & Communication

- Notifications are **informational only**
- AI-generated messages must be labeled as drafts
- No client communication without admin approval

Email is a mirror, not the source of truth.

---

## 9. Data & Privacy Rules

### Storage

- Store only what is required
- No redundant copies of files or data
- Strict workspace and project scoping

### Security

- Signed URLs for files
- Role checks on every request
- No cross-project leakage

Privacy > convenience, always.

---

## 10. API Design Rules

All APIs (via tRPC) must:

- Enforce auth
- Enforce role-based access
- Validate inputs
- Return structured data only
- Be rate-limited (Upstash)

❌ No ad-hoc REST endpoints  
❌ No bypassing tRPC contracts  

---

## 11. Performance & Reliability

Targets:

- Client dashboard p95 < 2s
- AI suggestion generation p95 < 5s

Rules:

- AI calls must be async
- UI must never block on AI
- Fail safely if AI is unavailable

---

## 12. Coding Style Rules

- Prefer clarity over abstraction
- Avoid cleverness
- No premature optimization
- Small, readable functions

TypeScript:

- `strict: true`
- No `any`
- Explicit return types for public APIs

---

## 13. Testing Philosophy

Test only what can:

- Break trust
- Leak data
- Charge incorrectly
- Bypass approvals

Focus on:
- Auth & permissions
- Client visibility boundaries
- AI approval enforcement
- Billing logic

---

## 14. Working With Coding Agents

Before writing code, the agent must:

1. Explain the approach
2. List files to be created or modified
3. State assumptions explicitly

If unsure:
- **Stop and ask**
- Do not guess
- Do not invent requirements

---

## 15. Definition of “Done”

Work is complete only if:

- It strictly follows the PRD
- It respects this document
- It introduces no new features
- It preserves trust, safety, and data integrity

If there is ambiguity, default to:

> Trust > Safety > Clarity > Speed

---

**This file is the final authority for Canopy (ClientOS) MVP development.**
