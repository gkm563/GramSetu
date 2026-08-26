# 🇮🇳 GRAMSETU — Civic Grievance Command Center
### Official Authority & Panchayat Governance Operations Portal

[![Firebase](https://img.shields.io/badge/Firebase-Firestore%20Realtime-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

---

## 🏛️ System Architecture

GramSetu connects rural and urban citizens with local governance authorities in real-time through a single shared Cloud Firestore database:

```
                    ┌────────────────────────┐
                    │  CITIZEN MOBILE APP    │
                    │   (FlutterFlow App)    │
                    └───────────┬────────────┘
                                │ Submits Grievance
                                ▼
               🔥 SHARED FIREBASE FIRESTORE
                  Project: gramsetu-ee7ab
               ┌────────────────┼────────────────┐
               ▼                ▼                ▼
         [complaints]   [complaint_updates]   [users]
               ▲                ▲                ▲
               │ Triages &      │ Logs Audit     │ Dispatches
               │ Updates Status │ Milestones     │ Workers
               └────────────────┴────────────────┘
                                │
                    ┌───────────┴────────────┐
                    │  AUTHORITY DASHBOARD   │
                    │   (React / TypeScript) │
                    └────────────────────────┘
```

> **Zero Secondary Database**: Both the mobile citizen application and this authority web portal synchronize directly with `gramsetu-ee7ab`. When a citizen submits a complaint on mobile, Firestore `onSnapshot` listeners immediately render it on the officer's command dashboard without refreshing the page.

---

## 🔐 Official Authority Credentials

Pre-configured role presets with full administrative authority:

| Authority Role | Official Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Panchayat Sachiv (Secretary)** | `sachiv@gramsetu.in` | `Sachiv@123` | Operational Triaging, Worker Dispatch, Status Lifecycle |
| **Gram Pradhan (Village Head)** | `pradhan@gramsetu.in` | `Pradhan@123` | Executive Overview, Block Approvals, Ward Oversight |
| **Block Grievance Officer (BDO / Admin)** | `admin@gramsetu.in` | `Admin@123` | Full District Administration & System Settings |

---

## 🚀 Key Command Center Features

1. **Executive Operations Hub**: Real-time KPI stat cards (Total Grievances, Pending Review, In Remediation, Resolved Rate), urgent critical hazard banners, and weekly resolution velocity charts.
2. **Grievance Master Directory**: Comprehensive multi-facet search & filtering by Status, Priority, Category, Village, Ward, and Date Range. Export to CSV for government audits.
3. **Full Grievance Dossier**:
   - High-resolution Photographic Evidence (Original Citizen Site Photo vs Field Resolution Proof).
   - Citizen Reporter info and verification feedback.
   - Spatial GPS location with direct Google Maps navigation.
   - Official Status Transition action modal.
   - Field Worker Dispatch modal with target SLA deadline.
4. **Accountability & SLA Timeline**: Live chronological audit trail pulling directly from `complaint_updates`.
5. **Interactive GIS Geospatial Map**: Color-coded Leaflet pins (Red for Critical, Amber for Pending, Cyan for In Progress, Green for Resolved) with interactive preview popups.
6. **Field Workforce Roster**: Manage panchayat field workers (Sanitation, Water Works, Electricity, Civil Road Repair), monitor active workloads, and balance assignments.
7. **Citizens Directory**: Track active filers, complaints frequency, and citizen verification rates.
8. **Civic Analytics**: Sector-wise grievance concentration, village-wise distribution, and turnaround velocity.

---

## 🛠️ Local Development & Build

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (`.env`)
```env
VITE_FIREBASE_API_KEY=AIzaSyDd1_gvnlcP8D4UIYv7vlBA1JSggXzemRE
VITE_FIREBASE_AUTH_DOMAIN=gramsetu-ee7ab.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=gramsetu-ee7ab
VITE_FIREBASE_STORAGE_BUCKET=gramsetu-ee7ab.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1014277573919
VITE_FIREBASE_APP_ID=1:1014277573919:web:a5ea3b470ba80d7f02742a
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🌐 Deploy to Vercel

1. Push code to your GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "GramSetu Civic Grievance Command Center Authority Portal"
   git remote add origin https://github.com/gkm563/GramSetu.git
   git branch -M main
   git push -u origin main
   ```
2. In [Vercel Dashboard](https://vercel.com/):
   - Click **Add New Project** → Select repository `gkm563/GramSetu`.
   - Set Framework Preset: **Vite**.
   - Add the Environment Variables from `.env`.
   - Click **Deploy**!
