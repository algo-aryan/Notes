# Collaborative Notes App

A real-time collaborative notes application designed as a Google Docs clone. Features include live text editing via WebSockets, Google & Email authentication, and a sleek user interface.

## Features
- **Real-Time Collaboration**: See changes from other users instantly without refreshing.
- **Rich Text Editing**: Bold, italic, headings, lists, and more powered by Quill.js.
- **Authentication**: Secure login using Email/Password or Google OAuth (Passport.js).
- **Auto-Saving**: Documents automatically save to the database while you type.

## Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript, Quill.js
- **Backend**: Node.js, Express, Socket.IO, Passport.js
- **Database**: MongoDB (Atlas)

## Setup Instructions

### Prerequisites
- Node.js installed
- A MongoDB Atlas connection URI
- Google Client ID and Secret (for Google Auth)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/algo-aryan/Notes.git
   cd Notes
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the `backend` directory and add:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_uri
   SESSION_SECRET=your_secret
   GOOGLE_CLIENT_ID=your_google_id
   GOOGLE_CLIENT_SECRET=your_google_secret
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Open your browser and navigate to `http://localhost:5000/index.html`
