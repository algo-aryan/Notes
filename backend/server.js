const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// Require configuration & models
require('./config/passport');
const Document = require('./models/Document');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware setup
app.set('trust proxy', 1); // Trust Render proxy for secure cookies

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, // Required for cross-domain cookies over HTTPS
    sameSite: 'none', // Required to allow cookies between Vercel and Render
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// Serve static frontend files to avoid file:// protocol cookie issues
app.use(express.static(path.join(__dirname, '../frontend')));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/collaborative_notes')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/api/documents', require('./routes/docRoutes'));

// Socket.io for Real-time Collaboration
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a specific document room
  socket.on('get-document', async (documentId) => {
    socket.join(documentId);
    
    // Attempt to load from DB
    try {
      const document = await Document.findById(documentId);
      if (document) {
        socket.emit('load-document', document.content);
      }
    } catch (error) {
      console.error('Error fetching doc on connect:', error);
    }

    // Listen for changes from this client and broadcast to others in the room
    socket.on('send-changes', (delta) => {
      socket.broadcast.to(documentId).emit('receive-changes', delta);
    });

    // Save document changes to database
    socket.on('save-document', async (data) => {
      try {
        await Document.findByIdAndUpdate(documentId, { content: data });
      } catch (error) {
        console.error('Error saving doc:', error);
      }
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
