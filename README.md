# 🎓 Smart Campus Digital Ecosystem

> One QR Code. Complete College Lifecycle. From Discovery to Graduation.

![License](https://img.shields.io/badge/license-MIT-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.0-purple)

## 📖 Table of Contents
- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the App](#running-the-app)
- [Default Credentials](#default-credentials)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [PWA Features](#-pwa-features)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 📖 About
The **Smart Campus Digital Ecosystem** transforms a single QR code or NFC smart card into an entire college student lifecycle management platform. Designed specifically for modern academic institutions, it spans from initial public campus discovery with virtual tours and maps, to streamlined multi-step online admissions portals, dynamic optical digital ID cards, comprehensive examination management hubs, secure digital payment flows, and powerful, centralized administrative control rooms with bulk automation.

---

## ✨ Features

### 🏫 Campus Discovery
- **Interactive 3D Coordinates Map**: Fully responsive Leaflet map charting physical campus structures, timing schedules, and hosted departments. Features live GPS calibration and simulated tracking.
- **Virtual Tour Station**: 360-degree panoramic viewpoints with yaw and pitch control to inspect laboratories, entrance gateways, libraries, and student plazas alongside integrated guide media broadcasts.
- **Academic Faculty Guild Directory**: Robust search index supporting department-level filters (`CSE`, `ECE`, `ME`, `Biotech`) and real-time contact portals.
- **Unified Social Media Hub**: Curated Instagram highlights grids and real-time Twitter timeline microblogs with broadcast share/copy mechanisms.
- **Emergency SOS Command Center**: Active trigger dashboard capable of broadcasting high-priority alert packages and instantly identifying dispatch hotlines.

### 🎓 Online Admission & Enrollment
- **Multi-step Application Portal**: Progressive intake steps tracking personal demographics, prior academic transcripts, and official certificate document uploads.
- **Secure Processing Desk**: Direct fee payments with detailed digital invoice outputs and real-time transactional logs.
- **Real-Time Stage Monitor**: Live dashboard visualizer updating applicants on merit placement boards, draft audits, and seat letters.

### 🆔 Smart Digital ID Card
- **Futuristic Glassmorphic Layouts**: Double-sided holographic cards featuring native front-and-back keyframe flipping.
- **Daily Encrypted Dynamic QR**: AES-256 styled rotating credentials syncing only within 24-hour verification limits.
- **Security Protocols & Wallet**: Native offline PWA backup, biometric-ready touch validations, anti-screenshot masking, and Google/Apple Wallet passes guidance.

### 📝 Examination Management
- **Admit Card Registration**: Instantly registers candidates for upcoming academic cycles, calculating necessary fees based on core selected courses.
- **Optical Verification Admit Passes**: Produces downloadable cryptographic admit slips with built-in timing blocks and examination hall mappings.
- **Live Performance Audits**: Digital course marksheets tracking running CGPA points, relative class scales, and historic semester results.

### 💳 Cashless Payment Gateways
- **Comprehensive Payment Cart**: Secure integrations representing credit/debit card, unified UPI, and web banking protocols.
- **Centralized Ledger Transactions**: Automated persistent invoicing, instant download receipt exports, and digital ledger reconciliation.

### 👑 Admin Control Panel
- **Operational Command Dashboard**: Rich visualizations monitoring enrollment percentages, transactional aggregates, and total matriculant logs.
- **Bulk Data Transits**: Instant imports and exports leveraging standard Excel/CSV structures.
- **Admissions Management**: Process, reject, or enroll applicants in a single click with instant academic notification dispatch.
- **Fee Configuration & Exam Schedulers**: Set localized curriculum costs, publish examination sessions, and authorize single/bulk admit cards.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router, Strict Layout Nodes)
- **Language**: TypeScript 5.0 (Strict Typing)
- **Styling**: Tailwind CSS + Shadcn UI components
- **Motion**: Framer Motion (Keyframes, layout animations, transitions)
- **State Engine**: Zustand (Global cache, credential token lifecycle states)
- **Data Hooking**: React Query v5 (Optimistic queries & mutations)
- **Document Rendering**: jsPDF + HTML2Canvas (Ticket, Receipt, and Admit pass compiles)

### Backend
- **Platform**: Node.js & Express
- **ORM Config**: Prisma ORM v5 (PostgreSQL relational linkages)
- **Caching**: Redis (Rate limiting and credential validation schedules)
- **Secured Tokens**: JWT with stateful refresh token rotations
- **Validation**: Express-Validator & Zod Schemes

### DevOps & Containers
- **Virtualization**: Docker + Docker Compose workflows
- **Reverse Proxy**: Nginx load balancers
- **Integration**: GitHub Actions continuous integrations

---

## 📋 Prerequisites
Ensure the following are installed locally prior to provisioning development servers:
- **Node.js**: v20.12.0 or greater
- **Database Engine**: PostgreSQL 16
- **Cache Engine**: Redis 7+
- **Package Manager**: npm (or bun/pnpm/yarn)

---

## 🚀 Installation

### Step 1: Clone the Codebase
```bash
git clone <your-repository-url>
cd smart-campus
```

### Step 2: Provision Package Files
Install necessary library dependencies for both workspaces:
```bash
# Provision Express Backend Modules
cd backend
npm install

# Provision Next.js Frontend Modules
cd ../frontend
npm install
```

### Step 3: Configure Environment Variables
Establish configuration contexts by copying standard variables presets:
```bash
# Register Backend Secrets
cd ../backend
cp .env.example .env

# Register Frontend Settings
cd ../frontend
cp .env.example .env
```

---

## ⚙️ Environment Variables

### Backend Environment Constants (`backend/.env`)
```env
PORT=5000
NODE_ENV=development

# Database linkage configuration strings
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/smart_campus?schema=public"

# Auth Secrets
JWT_SECRET="academic_core_stamped_256bit_block"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="academic_refresh_stamped_512bit_block"
JWT_REFRESH_EXPIRES_IN="7d"

# Systems integrations properties
CLOUDINARY_URL="cloudinary://api_key:secret@cloud_name"
SMTP_HOST="smtp.college.com"
SMTP_PORT=587
SMTP_USER="billing@college.com"
SMTP_PASS="college_decryption_gate"
```

---

## 🗄️ Database Setup
Instantiate PostgreSQL structures and seed sample student records:

```bash
# Start required daemon containers
docker-compose up -d

# Execute Prisma structure migrations
cd backend
npx prisma migrate dev --name init_campus_architecture

# Seed defaults student roster and admin credentials
npx prisma db seed
```

---

## 🏃 Running the App

Run both servers concurrently to access the full-stack system:

### Terminal 1: Launch Backend API
```bash
cd backend
npm run dev
# Server instantiates at http://localhost:5000
```

### Terminal 2: Launch Next.js Frontend
```bash
cd frontend
npm run dev
# Client instantiates at http://localhost:3000
```

---

## 🔐 Default Credentials

Use these sample profiles to audit separate authorization flows after database seeding completes:

| Level | Account Email | Secure Password | Access Permissions |
|:---|:---|:---|:---|
| **Super Admin** | `admin@college.com` | `Admin@123` | Control Panel, Student Enrollments, Bulk CSV imports, Schedulers |
| **Student (Regular)** | `rahul.sharma@example.com` | `Student@123` | Virtual ID flip, Exams marks, Fee carts, Admissions tracking |
| **Student (Alternative)** | `priya.patel@example.com` | `Student@123` | Dynamic QR code cycles, Admittance letters, SOS dispatchers |

---

## 📁 Project Structure

```text
smart-campus/
├── backend/                      # Express REST System
│   ├── prisma/                   # Schema blueprints, seed records
│   ├── src/
│   │   ├── config/               # Prisma database connects, environment caches
│   │   ├── controllers/          # Business logic (Admissions, ID Card, Security)
│   │   ├── middleware/           # Role clearances, rate limits, session auth
│   │   ├── routes/               # API endpoints maps
│   │   └── server.ts             # REST starter node
│   └── tsconfig.json
├── frontend/                     # Next.js 14 Client App
│   ├── app/                      # App router nodes
│   │   ├── (admin)/              # Dashboard, student bulk lists, audits
│   │   ├── (admission)/          # Enrollment intakes, invoice clearances
│   │   ├── (auth)/               # Login gateways, biometric checkups
│   │   ├── (dashboard)/          # Dynamic ID codes, exam schedules
│   │   ├── (campus)/             # Interactive maps, Virtual Tours, SOS hubs
│   │   └── layout.tsx            # Session checks
│   ├── components/               # Custom UI layouts
│   │   ├── admin/                # Stats widgets, enrollment panels
│   │   ├── campus/               # Maps, FAQ registers, Live Chats
│   │   ├── card/                 # Holographic digital pass sheets
│   │   ├── dashboard/            # Sidebars, Navbars, headers
│   │   └── ui/                   # Shared theme components
│   ├── hooks/                    # Reusable API states and Hooks
│   ├── lib/                      # Helper libraries
│   └── tailwind.config.ts        # Custom dark canvas system configs
├── docker-compose.yml            # System services launcher configurations
└── README.md                     # Central system documentation
```

---

## 📚 API Documentation

Centralized routes index and payloads specifications structure:

- **Swagger Endpoints Endpoint Specification**: `http://localhost:5000/api-docs`
- **Active Base Node URL**: `http://localhost:5000/api`

### Core Interface Definitions

#### Auth Modules
- `POST /api/auth/login` - Authenticate student accounts.
- `POST /api/auth/admin-login` - Authenticate control panel roles.
- `POST /api/auth/refresh` - Swap active refresh token.

#### Admission Portals
- `POST /api/admission/apply` - Submit entry applications profiles.
- `GET /api/admission/merit-list` - Pull merit brackets list.
- `GET /api/admission/status` - Request local tracking state.

#### Smart Wallet passes & ID Verification
- `GET /api/id/generate-qr` - Return dynamic encrypted AES pass matrices.
- `POST /api/id/verify-pass` - Admin NFC verification scans.

#### Examinations
- `POST /api/exam/register` - Course admissions and semester entries.
- `GET /api/exam/admit-card` - Export PDF optical admit vouchers.

---

## 📲 PWA Features

Ensure offline utility by registering the App in progressive web applications (PWA) formats:
1. **PWA Standalone Window Mode**: Fits snug in Android, iOS, or macOS wrappers without navigation addresses.
2. **Offline ID Access**: Offline service workers cache dynamic SVG card graphics and barcode payloads inside physical IndexedDB layers.
3. **Push Alerts Syncing**: Push registrations update devices with administrative announcements in background networks.

---

## 🚢 Deployment

### 1. Unified Cloud Config (Railway + Supabase)
- **API Engine**: Deploy `backend/` as a Dockerized node target on Railway or Render.
- **Database Cluster**: Attach a secure hosted PostgreSQL cluster on Supabase or Neon. Run migrations using the remote `DATABASE_URL` during CI triggers.
- **NextJS Static Vercel Engine**: Link `frontend/` to Vercel networks, ensuring `NEXT_PUBLIC_API_URL` properties target your newly provisioned backend URL.

---

## 🤝 Contributing
1. Fork the workspace repository.
2. Develop features on independent branch lanes (`git checkout -b feature/campus-module`).
3. Commit logical changesets (`git commit -m "feat: implement precise biometric validation parameters"`).
4. Dispatch structured Pull Requests.

---

## 📄 License
This ecosystem is licensed under the terms of the MIT License. See `LICENSE` for regulatory definitions.

---

## 📧 Contact
- **Institution**: Metropolitan University of Technology
- **Inquiry Portal**: `https://metrouni.edu.in`
- **Help Desk Contact**: `info@metrouni.edu.in` | `+91 1122334401`
- **Location**: Sector-12 Campus Blocks, New Delhi, India
