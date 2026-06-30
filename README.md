# Collaborative Notes

A real-time collaborative document editing application using Node.js, Express, MongoDB, Socket.IO, and Quill.js.

## Features

- User Authentication (Local and Google OAuth2)
- Create, view, and edit documents
- Real-time collaborative editing using WebSockets
- Automatic document saving
- Cross-origin support for separate frontend (Vercel) and backend (Render) deployments

## Project Structure

```
├── backend/
│   ├── config/
│   │   └── passport.js      # Passport authentication strategies
│   ├── models/
│   │   ├── Document.js      # Mongoose schema for documents
│   │   └── User.js          # Mongoose schema for users
│   ├── routes/
│   │   ├── authRoutes.js    # Authentication API endpoints
│   │   └── docRoutes.js     # Document API endpoints
│   ├── .env                 # Environment variables
│   └── server.js            # Express & Socket.IO server entry point
├── frontend/
│   ├── css/
│   │   └── styles.css       # Vanilla CSS styling
│   ├── js/
│   │   ├── auth.js          # Client-side authentication logic
│   │   ├── config.js        # Global configuration (e.g., API URL)
│   │   ├── dashboard.js     # Client-side document list logic
│   │   └── editor.js        # Client-side Quill editor & Socket.IO logic
│   ├── dashboard.html       # Document list interface
│   ├── editor.html          # Document editing interface
│   └── index.html           # Login and Registration interface
├── .gitignore               # Git ignored files
├── package.json             # Node.js dependencies and scripts
└── vercel.json              # Vercel deployment configuration
```

## Setup and Installation

### Prerequisites
- Node.js (v14 or higher recommended)
- MongoDB account (e.g., MongoDB Atlas)
- Google Cloud account (for OAuth)

### Backend Configuration
1. Navigate to the project root directory.
2. Run `npm install` to install dependencies.
3. Update `backend/.env` with your actual MongoDB connection string and Google OAuth credentials.
4. Run `npm start` to start the backend server. The server will run on port 5000 by default.

### Frontend Configuration
1. Open `frontend/js/config.js`.
2. Update the `BACKEND_URL` variable to point to your backend server (e.g., `http://localhost:5000` for local development).
3. Open `frontend/index.html` in your web browser or serve it using a local static file server.

## Deployment

- **Backend**: Can be deployed to services like Render. Ensure you set the environment variables in your deployment dashboard.
- **Frontend**: Can be deployed to static hosting services like Vercel. Ensure `config.js` is updated to point to the production backend URL before deploying.

## License

ISC License
