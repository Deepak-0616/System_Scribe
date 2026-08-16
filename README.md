# SYSTEM SCRIBE ⚡

### AI-Powered Intelligent Workflow Orchestration Platform

> **Build. Execute. Predict. Optimize.**

System Scribe is a serious enterprise-grade AI-powered workflow intelligence platform designed for the Smart India Hackathon problem statement **SA-S03 (Automated Workflow Management Platform Software)**. It transforms fragmented administrative processes into predictive, explainable, and continuously self-improving workflows for educational and government institutions.

---

## 🌟 Core Product Philosophy

Traditional workflow systems:
> **Build → Execute → Monitor**

System Scribe:
> **Understand → Build → Simulate → Execute → Predict → Explain → Learn → Optimize**

> *"System Scribe doesn't just automate workflows. It understands them, predicts where they will fail, coordinates the people and AI agents involved, and continuously improves them over time."*

---

## 🚀 Key Features & Capabilities

### 1. 📊 Institutional Command Center
- **Real-Time Telemetry**: Tracks **92% Workflow Health**, **2,481 Active Requests**, **37 SLA Risk**, **1,284 AI Automations**, **312 Hours Saved**, and **94.6% Success Rate**.
- **Department Workload Monitoring**: Real-time capacity utilization charts across Finance (82%), Admissions (67%), Academics (60%), Student Services (54%), and Examination Cell (43%).
- **Predictive Bottleneck Mitigation**: AI early warnings ("Finance verification predicted to exceed SLA by 6.5 hours") with 1-click auto-mitigation re-assignment to Officer B.

### 2. 🤖 Natural Language AI Workflow Generator & Visual Builder
- **AI Synthesis**: Transforms natural language prompts (*"Create a scholarship workflow requiring document, academic, attendance and financial verification"*) into structured 8-node DAG graphs.
- **Node Inspector & Rule Engine**: Configures rules (`CGPA >= 7.5`, `Attendance >= 75%`, `Annual Income <= Rs 800,000`), SLAs, and assigned AI agents.
- **Automated Validation**: Checks graph reachability, missing start/end nodes, circular dependencies, and mandatory human sign-off steps.

### 3. 🎓 Flagship Student Scholarship Demo Workflow
- **End-to-End Execution**: Complete scholarship application lifecycle.
- **Specialized Multi-Agent AI Core**:
  - `DocumentAgent`: Aadhaar biometric checksum & Tehsildar income tax receipt verification (98% confidence).
  - `AcademicAgent`: CGPA 8.7 & 89% attendance audit (96% confidence).
  - `FinanceAgent`: Family income ceiling & tuition fee arrears check (95% confidence).
  - `ComplianceAgent`: Single-scholarship constraint check across national database (99% confidence).
  - `RoutingAgent`: Workload-aware officer assignment based on queue size and turnaround time.

### 4. 🛡️ Explainable AI Decision Passports
- **Audit Evidence Ledger**: Transparent evidence page for every AI decision exposing raw agent verification checks, rule evaluations, confidence scores, risk level (0.04 - LOW), and human approval policy reasons.

### 5. 🧬 Workflow DNA & Self-Optimization Engine
- **Continuous Metrics**: Analyzes average processing time (3.8 days), SLA compliance (91%), and automation potential (68%).
- **1-Click Self-Optimization**: **Apply Optimization Proposal** (*"Eliminate Duplicate Manual Income Verification"*) upgrades production workflow to **Version 3.3 (Self-Optimized)**, reduces processing time by **31%**, and appends an immutable audit log entry.

### 6. 🌐 Workflow Simulator & Institutional Digital Twin
- **Scenario Sliders**: Interactive controls for Application Volume (+40%) and Staff Capacity (-20%) forecasting projected SLA breach probability %, queue growth, and required staff.
- **Digital Twin Topology**: Structural hierarchy mapping Departments → Staff → Workloads → Active Queues.

### 7. 💬 Role-Aware AI Copilot
- **Executive Assistant**: Global slide-out drawer providing role-authorized answers backed by institutional records and verified evidence citations.

---

## 👥 Role-Based Access Control (RBAC)

System Scribe supports four distinct demo personas:

| Role | Demo Persona | Capabilities |
| :--- | :--- | :--- |
| **Student / Applicant** | Rahul Sharma (`student@forge.edu`) | Submit applications, track progress timeline, chat with AI Copilot |
| **Officer / Staff** | Officer B (`officer.b@forge.edu`) | Manage task inbox, inspect Decision Passports, approve/reject/reassign tasks |
| **Workflow Admin** | Vikram Seth (`admin@forge.edu`) | AI Workflow Generator, Visual Builder, Workflow DNA, Self-Optimization |
| **Department Head** | Dr. Arisudan Rao (`dean@forge.edu`) | Command Center telemetry, Digital Twin topology, Workflow Simulator |

---

## 🛠️ Technology Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS (Dark Enterprise Palette: `#000000` main bg, `#52057B` surface, `#892CDC` primary accent, `#BC6FF1` light accent) + `@xyflow/react` + Recharts + Lucide Icons + Canvas Confetti.
- **Backend**: FastAPI (Python 3.10), SQLAlchemy, Pydantic, SQLite (`system_scribe.db`), multi-agent orchestrator engines, and LLM provider abstraction layer with deterministic Demo AI Mode fallback.

---

## 🚦 Getting Started

### Prerequisites
- Node.js (v18+) & npm
- Python (3.10+)

### 1. Run Backend Server
```bash
cd backend
python -m app.db.seed
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```
*Backend runs at: `http://localhost:8000/api` (Swagger UI docs at `http://localhost:8000/docs`)*

### 2. Run Frontend Application
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at: `http://localhost:5173/`*

---

## 📜 License & Hackathon Info

Developed for **Smart India Hackathon (SIH) Problem Statement SA-S03**.
Created by team **System Scribe**.
