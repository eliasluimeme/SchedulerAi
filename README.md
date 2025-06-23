# Coordinator Chat Platform

## Overview

**Coordinator Chat** is a full-stack platform that combines a modern chat UI for monitoring, a mini CRM, a FastAPI backend, and n8n workflow automations.  
It is designed to coordinate meetings and appointments between clients and owners, confirm and schedule appointments in a calendar, and provide additional AI-powered assistants (such as follow-up confirmation).

- **Frontend:** React + Supabase (chat UI, CRM, real-time updates)
- **Backend:** FastAPI (Python) + MongoDB (API, data storage)
- **Automation:** n8n workflows (AI agents, scheduling, follow-ups, etc.)

---

## Features

- **Chat UI:** Real-time chat between clients and AI/owner, with clear message alignment and history.
- **Mini CRM:** Manage contacts, view statuses, and see detailed contact information.
- **Automated Scheduling:** n8n workflows coordinate, confirm, and schedule meetings/appointments.
- **AI Assistants:** Automations for follow-up, confirmations, and conflict resolution.
- **Modern UI:** Responsive, user-friendly interface with modals, badges, and status indicators.

---

## Project Structure

```
Coordinator_chat/
  backend/      # FastAPI backend (Python)
  frontend/     # React frontend (chat UI, CRM)
  n8n workflows/ # n8n automation workflows (AI, scheduling, etc.)
  docker-compose.yml
  README.md
```

---

## Getting Started

### Prerequisites

- Docker & Docker Compose (recommended)
- Supabase project (for data sync)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/Coordinator_chat.git
cd Coordinator_chat
```

---

### 2. Environment Variables

#### Frontend (`frontend/.env`)

Create a `.env` file in the `frontend/` directory with your Supabase credentials:

```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

### 3. Running with Docker Compose (Recommended)

This will start the backend, frontend, and MongoDB (if enabled).

```bash
docker-compose up --build
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8000](http://localhost:8000)

---

### 4. Running Locally (Dev Mode)

#### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --reload
```

#### Frontend

```bash
cd frontend
yarn install
yarn start
```

---

## n8n Workflows

- The `n8n workflows/` directory contains automation flows for:
  - AI agents that coordinate meetings and appointments
  - Follow-up confirmation assistants
  - MCP

You can import these workflows into your own n8n instance.

---

