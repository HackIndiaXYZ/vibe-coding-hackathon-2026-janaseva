# 🚀 JanaSeva AI

### From Complaint to Resolution

JanaSeva AI is an AI-powered civic issue reporting platform built for the **HackIndia Vibe Coding Hackathon 2026**.

The platform empowers citizens to report civic issues such as potholes, garbage dumps, broken streetlights, drainage problems, and water leakages by simply uploading a photo. Using Artificial Intelligence, JanaSeva automatically identifies the issue, generates a complaint, recommends the responsible authority, and visualizes community-reported issues on an interactive map.

---

## 🌐 Live Demo

**Website:** https://janaseva-ai-citizen.lovable.app/

**GitHub Repository:** https://github.com/HackIndiaXYZ/vibe-coding-hackathon-2026-janaseva

---

## 🎯 Problem Statement

Every day, citizens encounter civic problems such as:

* Potholes
* Garbage dumps
* Water leakages
* Broken streetlights
* Drainage issues

However, reporting these issues is often difficult because:

* Citizens don't know which authority is responsible.
* Complaint filing is time-consuming.
* Writing formal complaints can be confusing.
* There is no visibility into community-reported issues.
* Many issues remain unresolved due to lack of participation.

As a result, local civic problems continue to affect communities.

---

## 💡 Our Solution

JanaSeva AI simplifies civic reporting using Artificial Intelligence.

A citizen can:

1. Upload a photo of a civic issue.
2. Select or confirm the issue location.
3. Allow AI to analyze the image.
4. Automatically generate a formal complaint.
5. Identify the responsible authority.
6. Submit and track reports.
7. View community-reported issues on an interactive map.

This transforms civic reporting from a complex process into a simple, user-friendly experience.

---

## ✨ Key Features

### 📸 AI-Powered Issue Detection

Upload an image and AI automatically identifies:

* Road Potholes
* Garbage Dumps
* Water Leakages
* Broken Streetlights
* Drainage Problems
* Road Damage

---

### 🤖 Smart Complaint Generation

AI generates professional complaint descriptions instantly.

Example:

**Input:** Pothole image

**Output:**

> A large pothole has developed near the specified location, creating safety risks for pedestrians and vehicles. Immediate repair is recommended.

---

### 🏛 Authority Recommendation

The platform identifies the responsible civic authority based on issue type.

Examples:

| Issue Type        | Authority              |
| ----------------- | ---------------------- |
| Road Damage       | GHMC Roads Department  |
| Garbage Dump      | Sanitation Department  |
| Water Leakage     | Hyderabad Water Board  |
| Streetlight Issue | Electricity Department |

---

### 🗺 Community Pulse Map

Interactive Telangana map displaying:

* Reported Issues
* Severity Levels
* Community Support
* Issue Locations

Marker Colors:

🔴 High Severity

🟡 Medium Severity

🟢 Low Severity

---

### 📄 My Reports Dashboard

Users can:

* View submitted reports
* Track issue status
* Monitor complaint progress
* Access report history

Status Workflow:

```text
Submitted
↓
Under Review
↓
Assigned
↓
Resolved
```

---

### 🔐 Secure Authentication

* Email Login
* Google Login
* Email Verification
* User Profiles

---

## 🎬 User Flow

```text
Login / Signup
        ↓
Upload Civic Issue Image
        ↓
Select Location
        ↓
AI Image Analysis
        ↓
Authority Identification
        ↓
Complaint Generation
        ↓
Submit Report
        ↓
Track Through Dashboard
        ↓
View Community Impact
```

---

## 🏗 Tech Stack

### Frontend

* React
* TypeScript
* Tailwind CSS
* ShadCN UI

### Backend

* Supabase

### Authentication

* Supabase Auth

### AI

* Gemini Vision
* Gemini 2.5 Flash

### Maps

* React Leaflet
* OpenStreetMap

### Deployment

* Vercel

---

## 🧠 AI Features

### Image Understanding

AI analyzes uploaded images and determines:

* Issue Type
* Severity Level
* Description

---

### Complaint Generation

AI generates structured and professional complaint text.

---

### Authority Recommendation

AI determines the correct civic authority based on issue classification.

---

## 📊 Database Design

### Users

```sql
id
name
email
created_at
```

### Reports

```sql
id
user_id
image_url
issue_type
severity
description
authority
status
latitude
longitude
created_at
```

### Community Support

```sql
id
report_id
user_id
created_at
```

---

## 📁 Project Structure

```bash
src/
├── components/
├── pages/
├── hooks/
├── integrations/
├── services/
├── lib/
├── assets/
├── types/
└── utils/
```

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/HackIndiaXYZ/vibe-coding-hackathon-2026-janaseva.git
```

Navigate to the project:

```bash
cd vibe-coding-hackathon-2026-janaseva
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
SUPABASE_PROJECT_ID=your_project_id
SUPABASE_PUBLISHABLE_KEY=your_publishable_key
SUPABASE_URL=your_supabase_url

VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_SUPABASE_URL=your_supabase_url
```

---

## 🚀 Future Enhancements

* 🎤 Voice-Based Issue Reporting
* 🌍 Multilingual Support (Telugu, Hindi, English)
* 📈 Civic Impact Score
* 🤝 Community Verification System
* 🧠 AI Civic Assistant
* 🔍 Duplicate Issue Detection
* 📊 Civic Intelligence Dashboard
* 🔗 Government Portal Integrations

---

## 🏆 HackIndia Vibe Coding Hackathon 2026

Built for:

**HackIndia Vibe Coding Hackathon 2026**

Theme:

> Build Anything with AI

JanaSeva AI demonstrates how Artificial Intelligence can make civic participation more accessible, efficient, and impactful for citizens.

---

## 👨‍💻 Team JanaSeva

### Karanam Mohan Rahul

Building smarter civic engagement through Artificial Intelligence.

---

### ❤️ Making Civic Reporting Simple for Everyone
