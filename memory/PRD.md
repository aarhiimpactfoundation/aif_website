# Aarhi Impact Foundation Website - PRD

## Original Problem Statement
Build a premium, multi-page website for "Aarhi Impact Foundation," a Section 8 nonprofit organization based in India, working on climate action, sustainable livelihoods, green jobs, and technology-driven development in North East India.

## User Personas
1. **CSR Foundations & Corporate Donors** - Looking for credible NGO partners for climate/sustainability initiatives
2. **Government Agencies** - Seeking implementation partners for development programs
3. **Academic Institutions** - Research collaboration partners
4. **International Development Organizations** - Partnership opportunities
5. **Youth (18-30)** - Seeking internship/volunteering opportunities in sustainability
6. **Farmers & Community Members** - Beneficiaries of programs

## Core Requirements (Static)
- 9+ main pages: Home, About, Programs, Impact, Events, Internships, CSR Partnership, Donate, Reports, Contact
- 4 legal pages: Privacy Policy, Terms & Conditions, Refund Policy, Governance
- Admin panel for content management
- Contact form with database storage + email notifications
- Internship application form with database storage + email notifications
- Donate page with bank details (Razorpay integration ready for future)
- SEO optimized, mobile-responsive, WCAG-friendly

## What's Been Implemented

### December 2025 - Vercel Deployment Conversion
- ✅ Converted backend from standalone FastAPI to Vercel Serverless Functions
- ✅ Created `/api/index.py` - serverless-compatible FastAPI handler
- ✅ Created `vercel.json` - Vercel build/routing configuration
- ✅ Created root `requirements.txt` - Python dependencies for Vercel
- ✅ Created `VERCEL_DEPLOYMENT_GUIDE.md` - Step-by-step deployment instructions
- ✅ Created `.vercelignore` - Exclude unnecessary files from deployment
- ✅ All tests passing: Backend 100% (18/18), Frontend 100%

### December 2025 - Post-Deployment Enhancements
- ✅ Secured admin registration with secret code (`AIF-SECRET-2026`)
- ✅ Implemented event detail page (`/events/:eventId`)
- ✅ Added sitemap.xml and robots.txt served via API endpoints
- ✅ Added JSON-LD schema, OG image, enhanced meta tags for SEO
- ✅ Fixed sitemap `changefreq` value (verified by Google Search Console)
- ✅ **Code Cleanup (Dec 2025)**: Removed obsolete files:
  - Deleted `/app/backend` directory (old standalone backend)
  - Deleted `deploy.sh`, `update.sh` (old VPS deployment scripts)
  - Deleted static `sitemap.xml`, `robots.txt` from `/public` (now served via API)

### March 17, 2026 - Initial Development

#### Backend (FastAPI + MongoDB)
- ✅ Contact form API with email notification support (Resend)
- ✅ Internship application API with email notification support
- ✅ Events CRUD API (public + admin)
- ✅ Admin authentication (JWT-based)
- ✅ Donation bank details & tiers API
- ✅ Admin dashboard stats API
- ✅ Security hardening (rate limiting, input sanitization, CORS)

#### Frontend (React + Tailwind + Shadcn/UI)
- ✅ Homepage with hero, focus areas, SDG alignment, impact metrics, CTA
- ✅ About page with founders, mission/vision, governance
- ✅ Programs page with 4 pillars (Climate, Green Jobs, Agriculture, Technology)
- ✅ Impact page with metrics, initiatives, stories
- ✅ Events page with category filtering
- ✅ Internships page with application form
- ✅ Donate page with bank details, donation tiers, CSR section
- ✅ CSR Partnership page with partnership types, engagement models, Schedule VII alignment
- ✅ Reports page with PDF viewer for annual/audit reports
- ✅ Contact page with form
- ✅ All 4 legal pages
- ✅ Admin login/register
- ✅ Admin dashboard with stats
- ✅ Admin events management (CRUD)
- ✅ Admin contact messages viewer
- ✅ Admin internship applications viewer

### Design
- Color palette: #F1EFE9 (background), #1B4332 (header/footer), #2D6A6A (buttons), #C2A878 (accents)
- Typography: Manrope (headings) + Public Sans (body)
- Responsive design (mobile-first)
- Sticky navbar with scroll behavior
- Clean, institutional design

## Architecture

### Vercel Deployment Structure (Current - Clean)
```
/app
├── api/
│   ├── index.py          # FastAPI serverless function (all backend logic)
│   ├── requirements.txt  # Python dependencies
│   └── runtime.txt       # Python runtime version
├── frontend/
│   ├── src/              # React source code
│   ├── public/           # Static assets (index.html, og-image.jpg)
│   └── package.json      # Frontend dependencies
├── vercel.json           # Vercel configuration (builds, rewrites)
├── .vercelignore         # Files to exclude from deployment
└── VERCEL_DEPLOYMENT_GUIDE.md
```

### API Endpoints
- `GET /api/health` - Health check
- `GET /api/events` - List published events
- `GET /api/events/{event_id}` - Get single event details
- `POST /api/contact` - Submit contact form
- `POST /api/internships/apply` - Submit internship application
- `GET /api/donations/bank-details` - Get bank account info
- `POST /api/admin/login` - Admin authentication
- `POST /api/admin/register` - Admin registration (requires secret code)
- `GET /api/admin/stats` - Dashboard statistics
- `GET/POST/PUT/DELETE /api/admin/events` - Event management
- `GET /sitemap.xml` - Dynamic sitemap
- `GET /robots.txt` - Dynamic robots file

## Prioritized Backlog

### P0 (Critical - Required for Launch)
- [x] Core website pages ✅
- [x] Admin panel ✅
- [x] Contact & application forms ✅
- [x] Vercel deployment conversion ✅
- [x] Resend API key configured ✅
- [x] Deployed to Vercel ✅
- [x] SEO (sitemap, robots.txt, JSON-LD schema, OG image) ✅
- [x] Event detail pages ✅
- [x] Code cleanup & refactoring ✅

### P1 (High Priority - Post Launch)
- [ ] Add actual PDF files to Reports page
- [ ] Razorpay payment integration

### P2 (Medium Priority)
- [ ] Google Analytics integration
- [ ] Image gallery/media section
- [ ] Social media sharing buttons

### P3 (Nice to Have)
- [ ] Multi-language support (Hindi, Assamese)
- [ ] Interactive North East India map
- [ ] Newsletter subscription
- [ ] Volunteer hour tracking

## Next Tasks (User Actions)
1. **Add real PDFs** to Reports page (update links in `/app/frontend/src/pages/Reports.jsx`)
2. **Change admin password** after first login (current: AIF@2026)
3. **(Optional)** Configure Razorpay for online donations

## Admin Access
- **URL**: `/admin/login`
- **Email**: `admin@aarhiimpactfoundation.org`
- **Password**: `AIF@2026` (CHANGE THIS!)

## Test Reports
- `/app/test_reports/iteration_1.json` - Initial testing
- `/app/test_reports/iteration_2.json` - Post-Vercel conversion testing (100% pass rate)
