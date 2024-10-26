const express = require('express');
const cors = require('cors');  // To allow frontend to make requests
const cookieParser = require('cookie-parser');
const session = require('express-session'); // To handle sessions
require('dotenv').config();  // Load environment variables

const app = express();

// Middleware
app.use(express.json());  // Parse incoming JSON requests
app.use(cors({
    origin: 'http://localhost:5173',  // Allow requests only from this frontend URL
    credentials: true  // Allow cookies and credentials to be sent
}));
app.use(cookieParser());  // To parse cookies (for JWT)
app.use(session({
    secret: 'my_super_secret_jwt_key',  // Secret key for session management
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Import routes
const userRoutes = require('./routes/user');

// Routes
app.use('/api/users', userRoutes);  // All user-related routes

// Error handling (optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
