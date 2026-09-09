# JC Beauty Lash Designer

A full-stack appointment and business management system developed for **JC Beauty Lash Designer**.

The platform combines a modern customer-facing website with a secure administrative dashboard for managing appointments, clients, services, finances, reports, and business settings.

---

## ✨ Features

### Customer Experience

* Online appointment scheduling
* Service selection
* Real-time available time checking
* Services showcase
* Image gallery
* Instagram integration
* WhatsApp contact
* Business information
* Frequently Asked Questions
* Privacy Policy
* Terms of Use

### Admin Dashboard

* Secure administrator authentication
* Dashboard overview
* Appointment management
* Agenda and timeline
* Client management
* Service management
* Financial management
* Reports
* Business settings
* Protected admin routes

### Appointment Management

* Create appointments
* Check available time slots
* Update appointment status
* Edit appointment information
* Associate appointments with clients and services
* Prevent duplicate appointments for the same date and time

---

## 🛠️ Tech Stack

### Frontend

* **React**
* **TypeScript**
* **Vite**
* **React Router**
* **CSS Modules**
* **REST API**

### Backend

* **Node.js**
* **Express**
* **JavaScript**
* **Prisma ORM**
* **SQLite**
* **JWT Authentication**

### Tools

* **Git**
* **GitHub**
* **VS Code**

---

## 📁 Project Structure

```text
JC-BeautyLash-Designer/
│
├── Back/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.js
│   │
│   └── src/
│       ├── controllers/
│       ├── lib/
│       ├── middlewares/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       └── server.js
│
├── Front/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── data/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       ├── styles/
│       ├── types/
│       ├── utils/
│       ├── app.tsx
│       └── main.tsx
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* [Node.js](https://nodejs.org/)
* npm
* Git

---

## ⚙️ Backend Setup

Navigate to the backend directory:

```bash
cd Back
```

Install the dependencies:

```bash
npm install
```

Create a `.env` file based on `.env.example`.

Generate the Prisma client:

```bash
npx prisma generate
```

Run the database migrations:

```bash
npx prisma migrate deploy
```

Start the development server:

```bash
npm run dev
```

---

## 💻 Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd Front
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will provide the local development URL in the terminal.

---

## 🗄️ Database

The application uses **SQLite** with **Prisma ORM**.

The main database entities are:

```text
Client
   │
   └── Appointment
           │
           └── Service
```

The system manages relationships between:

* Clients
* Appointments
* Services

Appointments also enforce a unique date/time combination to prevent scheduling conflicts.

---

## 🔌 API

The backend exposes REST API endpoints for the main business operations.

### Authentication

```text
POST /admin/login
```

### Dashboard

```text
GET /admin/dashboard
```

### Appointments & Agenda

```text
GET   /admin/agenda
GET   /appointments
POST  /appointments
PATCH /appointments/:id
PATCH /appointments/:id/status
GET   /available-times
```

### Clients

```text
GET /admin/clients
GET /admin/clients/:id
```

### Services

```text
GET  /admin/services
POST /admin/services
PUT  /admin/services/:id
```

### Financial & Reports

```text
GET /admin/financeiro
GET /admin/reports
```

### Settings

```text
GET /admin/settings
```

---

## 🔐 Authentication & Security

The administrative area uses token-based authentication.

Security-related features include:

* JWT authentication
* Protected API routes
* Protected frontend admin routes
* Authentication middleware
* Environment variable protection
* Sensitive files excluded through `.gitignore`

Production credentials and private environment variables should never be committed to the repository.

---

## 📊 Admin Modules

The administrative dashboard is organized into the following modules:

| Module    | Purpose                             |
| --------- | ----------------------------------- |
| Dashboard | Business overview                   |
| Agenda    | Appointment scheduling and timeline |
| Clients   | Client management                   |
| Services  | Service management                  |
| Finance   | Financial tracking                  |
| Reports   | Business reports                    |
| Settings  | Business configuration              |

---

## 📌 Project Status

**In active development.**

The project is continuously evolving with improvements to the user experience, administration interface, performance, and business management capabilities.

---

## 🎯 Purpose

JC Beauty Lash Designer was designed to centralize the business's digital presence and operational management into a single full-stack application.

The system connects the customer booking experience with an administrative environment, creating a more organized workflow for managing appointments and business data.

---

## 👨‍💻 Development

Built as a full-stack web application using a modern frontend architecture, RESTful backend, relational data modeling, and protected administrative workflows.

---

## 📄 License

This project is private and intended for **JC Beauty Lash Designer**.

---

**JC Beauty Lash Designer**

*Appointment & Business Management System*
