# Schedula Backend V2

Backend Internship Project developed using NestJS, TypeScript, PostgreSQL and JWT Authentication.

## Project Setup

```bash
npm install
npm run start:dev
```

## Environment Variables

```env
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_jwt_secret
PORT=3000
```

## Features Implemented

### Day 2

* JWT Authentication
* User Registration
* User Login

### Day 3

* Doctor Onboarding
* Patient Onboarding

### Day 8

* Appointment Booking & Management APIs

### Day 9

* Advanced Scheduling System

### Day 10

* Appointment Rescheduling APIs

## API Documentation

### Authentication

POST /auth/register

POST /auth/login

### Doctors

POST /doctors

GET /doctors

### Patients

POST /patients

GET /patients

### Appointments

POST /appointments

GET /appointments

PUT /appointments/:id

DELETE /appointments/:id

### Scheduling

GET /availability

POST /reschedule

## Repository

https://github.com/maheshvislavath18-star/schedula-backend-v2

## Pull Request

https://github.com/maheshvislavath18-star/schedula-backend-v2/pull/6
