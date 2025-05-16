# medicare
# 🩺 Doctor Appointment Booking Website

A full-stack web application for booking and managing doctor appointments, designed to streamline the interaction between **patients** and **doctors**. Built using the **MERN stack** (MongoDB, Express.js, React, Node.js), this platform enables smooth scheduling, efficient management, and a user-friendly interface.

---

## 🚀 Features

### 👤 User Functionality
- 📝 Patient registration and login
- 📅 Book appointments with available doctors
- 🔍 View available time slots
- 🧾 View and manage appointment history

### 🧑‍⚕️ Doctor Functionality
- ✅ Accept or reject appointment requests
- 📆 Manage availability and schedule
- 📄 View upcoming appointments

### 🔐 Admin Functionality (Optional)
- 👁️‍🗨️ Monitor all users and doctors
- ⚙️ Manage system-wide settings and roles
- 📊 View platform-wide statistics

### 🛡️ Security
- 🔒 Password hashing (bcrypt)
- 📄 JWT-based authentication
- 🧑‍💻 Role-based access control (Patient, Doctor, Admin)

---

## 🛠️ Tech Stack

| Tech       | Description                           |
|------------|---------------------------------------|
| 🧠 MongoDB | NoSQL database for storing data       |
| 🚂 Express | Backend server framework              |
| ⚛️ React   | Frontend UI library                   |
| 🟢 Node.js | Runtime for backend JavaScript        |
| 🔐 JWT     | JSON Web Tokens for authentication    |
| 💅 CSS     | Clean and responsive user interface   |

---

## 🌐 Live Demo

👉 [Visit the Live Site](https://your-live-link.com)  
📁 [Admin Panel (if separate)](https://admin.your-live-link.com)

---

## 📸 Screenshots

| Patient View | Doctor Dashboard | Admin Panel |
|--------------|------------------|-------------|
| ![Patient](./screenshots/patient.png) | ![Doctor](./screenshots/doctor.png) | ![Admin](./screenshots/admin.png) |

---

## 🧑‍💻 Getting Started

### ✅ Prerequisites

- Node.js ≥ v14
- MongoDB Atlas/local
- npm or yarn

### 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/doctor-appointment-app.git
cd doctor-appointment-app

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Admin (optional)
cd ../admin
npm install


