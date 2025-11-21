# 🚀 CareerCraft — Updated Development Roadmap (v2)

> Crafting smarter career decisions with AI-powered insights.

This roadmap reflects the **current progress** (as of October 2025), including completed backend work, ongoing AI integration, and the proposed **CareerCraft Query 2.0** logic layer.

---

## Phase 1: Core Backend Foundation (MVP) *Complete*
**Goal:** Establish a working backend with authentication, AI endpoints, and query tracking.

### User Authentication
- [x] Express server + PostgreSQL with Prisma
- [x] `/api/users/register` + `/api/users/login`
- [x] JWT authentication middleware
- [x] `/api/users/me` + `/api/users/me (PUT)`
- [x] Input validation (Zod)
- [x] Global error handler (consistent JSON format)
- [x] Password reset flow via Nodemailer
- [x] Forgot-password / Reset-password / Change-password routes
- [x] Welcome email on registration

### AI Career Insights
- [x] Integrated Gemini API via `aiService.js`
- [x] Base prompt logic for structured career advice
- [x] Create `/api/career/query` route:
  - Accepts `{ query: "What career fits someone who loves data?" }`
  - Returns structured AI insights (overview, pros/cons, roles, learning paths)
- [x] Add caching layer (Redis or Prisma-level caching)

### History Tracking
- [x] Designed `CareerQuery` model
- [x] Implemented `/api/history` (get + delete)
- [x] Add `DELETE /api/history/:id` (cleanup route)

---

## CareerCraft Query 2.0 (New AI Logic Layer)
**Goal:** Make AI responses more career-aware, actionable, and consistent.

### What It Does
- Adds *structured logic* on top of Gemini for consistent response formatting.
- Uses one model for **query answering** and another for **contextual chat**.
- Defines response schema:
  ```json
  {
    "overview": "...",
    "pros": ["..."],
    "cons": ["..."],
    "career_paths": ["..."],
    "recommended_skills": ["..."],
    "learning_resources": ["..."]
  }
  ```
- Improves recall by checking Redis or database for similar past queries.
- Allows “follow-up chat” mode with previous context.

### API Enhancements
- `/api/career/query` → For structured single-question queries.
- `/api/chat` → For follow-up or conversational sessions.
- `/api/career/suggest` → (Future) Personalized suggestions based on history.

---

## Phase 2: Frontend (Web Client) In Planning
**Goal:** Build the React/Next.js UI to connect to backend APIs.

### Setup
- [ ] Design draft (Figma/Flow diagrams)
- [ ] Initialize Next.js project
- [ ] Configure auth context with JWT
- [ ] Add protected routes

### Core Pages
- [ ] `/login`, `/register`, `/dashboard`, `/profile`
- [ ] Dashboard = AI chat interface + history sidebar

### Chat Interface
- [ ] Build clean UI with:
  - Input box + response bubbles
  - “Save to history” toggle
  - “Regenerate response” option
- [ ] Add loading indicators + error states

---

## Phase 3: Insights & Analytics Planned
**Goal:** Enrich the experience with data-driven trends.

- [ ] `/api/career/insights` endpoint:
  - Returns job growth, salary, and demand data
- [ ] Integrate external APIs or datasets
- [ ] Visualize with Recharts or Chart.js

---

## Phase 4: UX & Security Planned
**Goal:** Enhance safety, reliability, and speed.

- [ ] Add rate limiting + audit logs
- [ ] Account deletion endpoint
- [ ] Enforce HTTPS + secure cookie storage
- [ ] Optimize Prisma queries

---

## Phase 5: Deployment & DevOps Upcoming
**Goal:** Productionize CareerCraft.

- [ ] Dockerize backend
- [ ] Deploy to Render (backend) + Vercel (frontend)
- [ ] GitHub Actions for CI/CD
- [ ] Automated backups + `.env.production`

---

## Phase 6: Future Enhancements

- **Career Path Recommendation Engine:** AI suggests skill roadmaps and learning resources.
- **Resume Builder:** AI-generated CVs tailored to roles.
- **Mentorship Matching:** Smart mentor-mentee matching algorithm.
- **Gamification:** Career Growth Score + badges for exploration.

### Documentation
- [ ] `README.md`
- [ ] `FEATURES.md`


---

### Milestone Summary

| Phase | Focus | Status |
| :---: | :--- | :---: |
| 1 | Backend MVP | 90% Complete |
| 2 | Frontend UI | Planned |
| 3 | Data Insights | Planned |
| 4 | Security + UX | Planned |
| 5 | Deployment | Planned |
| 6 | Future Features | Planned |


---

### Next Action Items (2–3 Week Sprint)
- [x] Finish `/api/career/query` route (structured output)
- [x] Implement Redis cache for query memory
- [x] Add `/api/history` (get + delete)
- [ ] Test and document `aiService v2` (query/chat separation)
- [ ] Begin frontend setup (Next.js + JWT context)

---
*Author: Oluwasemilore*
*Stack: Node.js • Express • PostgreSQL (Prisma) • Gemini API • JWT Auth*
*Last Updated: October 2025*