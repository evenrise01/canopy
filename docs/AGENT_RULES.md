# AGENT_RULES.md

## Purpose

This document defines **non-negotiable rules** for any coding agent working on the ClientOS codebase.

These rules exist to:
- Prevent repository corruption or nested Git boundaries
- Avoid subtle tooling mistakes that compound over time
- Ensure the codebase remains production-grade and human-reviewable

Violations of these rules mean the work is **invalid and must be reverted**.

---

## 1. Repository & Git Rules (Critical)

### Single Application Repository Rule

🚨 **This project uses a single-app repository scaffolded with `npm create t3-app@latest`.**

- There is **one application**
- There is **one repository**
- There is **one Git boundary**

There is **NO**:
- Turborepo
- Monorepo
- `apps/`, `packages/`, or workspace-style structure

---

### Single `.git` Directory Rule (Strict)

🚨 **There must be exactly ONE `.git` directory in the entire repository.**

- The `.git` directory must exist **only at the repository root**
- No subfolder may contain its own `.git`

#### Explicitly Forbidden

❌ Any of the following are invalid:

/apps/.git
/web/.git
/server/.git
/packages/.git
/src/.git


This includes Git folders accidentally created by:
- CLI scaffold tools
- Copy-pasted templates
- Example repositories
- AI-generated boilerplate

---

### Scaffolding Rule (T3 App)

✅ The app **must be scaffolded using**:

```bash
npm create t3-app@latest
