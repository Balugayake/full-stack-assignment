# Full Stack Application Documentation

This document provides instructions for setting up, running, and using the full stack application composed of frontend and backend components.

1. ## Prerequisites
   Before running the application, ensure you have the following software installed on your machine:
   Node.js: Version 20 or higher
   Docker: Required for setting up the backend database

2. ## Frontend Setup
   Step-by-Step Instructions
   Navigate to Frontend Directory
   bash
   Copy code
   cd ./full-stack-assignment/frontend
   Install Dependencies
   bash
   Copy code
   npm install
   Run Development Server
   bash
   Copy code
   npm run dev
   Access the Application
   Open your browser and go to http://localhost:3000 to view the frontend application.

3. ## Backend Setup
   Step-by-Step Instructions
   Navigate to Backend Directory
   bash
   Copy code
   cd ./full-stack-assignment/backend
   Install Dependencies
   bash
   Copy code
   npm install express prisma @prisma/client
    Generate Prisma Client
    npx prisma generate

Build Docker Containers Ensure Docker is running, then build the containers:

docker-compose build

Start Docker Containers

docker-compose up -dThis command starts the backend services in detached mode (-d).

Run Database Migrations

docker exec -it backend npx prisma migrate dev --name init
Replace backend with the actual name or ID of your backend container if different. 4. API Endpoints
Backend API Endpoints
POST /user: Creates a new student with details provided in the request body.
Request Body: { "firstName": "string", "lastName": "string", "rollNumber": "string", "marks": [{ "subject": "string", "mark": number }] }
GET /user: Retrieves a list of students.
PUT /user/:id
: Updates a student's details and marks.
Request Body: { "firstName": "string", "lastName": "string", "rollNumber": "string", "marks": [{ "subject": "string", "mark": number }] }
DELETE /user/:id
: Deletes a student and associated marks by ID. 5. Additional Notes
Environment Variables: Ensure necessary environment variables are set (e.g., database URLs, API keys) for both frontend and backend components.
DATABASE_URL="postgresql://postgresql:postgresql@localhost:5432/postgres?schema=public"

Troubleshooting: If encountering issues, check logs (docker-compose logs for backend) and ensure dependencies and services are correctly configured.

//postMan collection link

https://bgteams548.postman.co/workspace/crud~26db2b4b-4f81-48cf-9f17-f2bec3dcd023/collection/18368118-6356ac72-80aa-4293-983c-ef5fe7c1720d?action=share&creator=18368118
