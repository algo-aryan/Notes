# Collaborative Notes Application

A full-stack, real-time collaborative document editing application. This platform allows multiple users to edit the same document simultaneously, mirroring the core functionality of professional collaborative tools. It leverages WebSockets for instantaneous data synchronization and provides a robust, decoupled architecture separating the client interface from the server-side logic.

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Core Features](#core-features)
4. [Project Directory Structure](#project-directory-structure)
5. [Environment Variables](#environment-variables)
6. [Local Development Setup](#local-development-setup)
7. [API Documentation](#api-documentation)
8. [WebSocket Event Reference](#websocket-event-reference)
9. [Deployment Guide](#deployment-guide)
10. [License](#license)

## Architecture Overview

The application follows a standard client-server architecture utilizing RESTful principles for standard CRUD operations and WebSockets for real-time bidirectional communication.

- **Client Layer**: A lightweight, Vanilla JavaScript frontend utilizing Quill.js for rich text editing. It manages local state and communicates with the backend via REST API calls (for authentication and document retrieval) and Socket.IO (for real-time delta synchronization).
- **Service Layer**: An Node.js/Express backend that handles routing, authentication (Passport.js), session management, and business logic.
- **Data Layer**: A MongoDB database (interfaced via Mongoose) responsible for persisting user credentials, OAuth linkages, and document contents (stored as JSON-compliant Quill Deltas).

## Technology Stack

**Frontend:**
- HTML5 & CSS3 (Custom responsive styling, no CSS framework)
- Vanilla JavaScript (ES6+)
- Quill.js (Rich text editor framework)
- Socket.IO Client (Real-time connection handling)

**Backend:**
- Node.js & Express.js (Runtime and web framework)
- Socket.IO (WebSocket protocol abstraction)
- MongoDB & Mongoose (NoSQL Database and ODM)
- Passport.js (Authentication middleware supporting Local and Google OAuth2 strategies)
- Express-Session (Session management)

## Core Features

- **Real-Time Collaboration**: Multiple users can edit a document concurrently. Changes are synchronized across all connected clients with minimal latency using Operational Transformation (handled via Quill Deltas).
- **Authentication System**: Secure user registration and login flows. Supports traditional email/password credentials alongside seamless Google OAuth2 integration.
- **Document Management**: Users possess a personalized dashboard to view, create, and access their documents.
- **Auto-Saving**: Document states are automatically broadcasted and persisted to the database during active editing sessions.
- **Cross-Origin Configuration**: Fully configured to support decoupled deployments (e.g., frontend hosted on Vercel communicating with a backend hosted on Render) requiring strict CORS policies and cross-site cookie transmission.

## Project Directory Structure

```text
├── backend/
│   ├── config/
│   │   └── passport.js      # Passport strategies (Local and Google OAuth)
│   ├── models/
│   │   ├── Document.js      # Mongoose schema for document persistence
│   │   └── User.js          # Mongoose schema for user accounts
│   ├── routes/
│   │   ├── authRoutes.js    # Endpoints for login, register, and OAuth callbacks
│   │   └── docRoutes.js     # Endpoints for document creation and retrieval
│   ├── .env                 # Environment configuration (ignored in version control)
│   └── server.js            # Main application entry point and socket handler
├── frontend/
│   ├── css/
│   │   └── styles.css       # Global stylesheet and UI components
│   ├── js/
│   │   ├── auth.js          # Handles client-side authentication requests
│   │   ├── config.js        # Global configuration (e.g., target BACKEND_URL)
│   │   ├── dashboard.js     # Manages the document list interface
│   │   └── editor.js        # Initializes Quill.js and handles socket events
│   ├── dashboard.html       # Protected view for listing documents
│   ├── editor.html          # Protected view for editing a specific document
│   └── index.html           # Public landing, login, and registration view
├── .gitignore               # Excluded files and directories
├── package.json             # Project dependencies and npm scripts
└── vercel.json              # Configuration for Vercel deployment
```

## Environment Variables

The backend requires specific environment variables to function correctly. Create a `.env` file in the `backend/` directory with the following keys:

```env
# Application Port (Defaults to 5000 if omitted)
PORT=5000

# MongoDB Connection String (Atlas or Local)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority

# Session Encryption Key (Use a strong, randomized string)
SESSION_SECRET=your_secure_session_secret

# Google OAuth2 Credentials
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

## Local Development Setup

### 1. Initialize the Backend
1. Clone the repository to your local machine.
2. Navigate to the root directory and run `npm install` to install all required Node.js packages.
3. Configure your `backend/.env` file as detailed in the Environment Variables section.
4. Execute `npm start` to spin up the Express and Socket.IO server. You should see "Server running on port 5000" and "MongoDB connected" in your terminal.

### 2. Initialize the Frontend
1. Navigate to `frontend/js/config.js`.
2. Ensure `BACKEND_URL` is set to your local server address (e.g., `const BACKEND_URL = 'http://localhost:5000';`).
3. Open `frontend/index.html` directly in your browser or serve the `frontend/` directory using an extension like VSCode Live Server.

## API Documentation

### Authentication Routes (`/auth`)
- `POST /register`: Accepts `name`, `email`, and `password`. Creates a new local user.
- `POST /login`: Accepts `email` and `password`. Authenticates the user and sets an HTTP-only session cookie.
- `GET /current-user`: Returns the currently authenticated user's profile based on the session cookie.
- `POST /logout`: Destroys the current session.
- `GET /google`: Initiates the Google OAuth2 flow.
- `GET /google/callback`: The redirect endpoint for Google OAuth2.

### Document Routes (`/api/documents`)
- `GET /`: Retrieves all documents owned by the authenticated user, sorted by the most recently updated.
- `POST /`: Initializes and saves a new, empty document to the database.
- `GET /:id`: Retrieves the metadata and contents of a specific document by its MongoDB ObjectId.

## WebSocket Event Reference

The Socket.IO server listens for and emits specific events to handle real-time collaboration.

### Client-to-Server Events
- `get-document`: Sent when a client opens a document. Payload: `documentId`. Triggers the server to join the client to a specific room.
- `send-changes`: Sent when a client types or formats text. Payload: Quill Delta object.
- `save-document`: Sent periodically by the client to persist the current document state to MongoDB. Payload: Full Quill Delta contents.

### Server-to-Client Events
- `load-document`: Emitted by the server upon successfully joining a room. Payload: The current document contents retrieved from the database.
- `receive-changes`: Emitted by the server to broadcast changes made by one client to all other clients currently residing in the same document room.

## Deployment Guide

This application is designed to be deployed across two separate services to maximize scalability.

### Backend Deployment (Render)
1. Push the repository to GitHub.
2. Create a new "Web Service" in Render and connect your repository.
3. Set the Build Command to `npm install`.
4. Set the Start Command to `npm start`.
5. Under the Environment tab, input all variables listed in the Environment Variables section.
6. Deploy the service and note the generated Render URL.

### Frontend Deployment (Vercel)
1. Update `frontend/js/config.js` and change `BACKEND_URL` to the live Render URL you just generated.
2. Ensure the Google OAuth Authorized Redirect URIs in your Google Cloud Console are updated to point to the live Vercel and Render URLs.
3. Commit and push these changes to GitHub.
4. Import the repository into Vercel.
5. In the Vercel project settings, explicitly set the "Root Directory" to `frontend`.
6. Deploy the application.

## License

This project is licensed under the ISC License.
