const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('../db'); // Assuming your db.js is already set up
const session = require('express-session'); // Import session middleware
const router = express.Router();

// Hardcoded JWT secret (replace with your secret in production)
const jwtSecret = 'my_super_secret_jwt_key';

// Session configuration
router.use(session({
    secret: jwtSecret, // Using the hardcoded JWT secret here
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Registration route
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        connection.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Database error' });
                }
                res.status(201).json({ message: 'User registered successfully' });
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user in the database
        connection.query(
            'SELECT * FROM users WHERE email = ?',
            [email],
            async (err, results) => {
                if (err || results.length === 0) {
                    return res.status(401).json({ error: 'User not found' });
                }

                const user = results[0];

                // Compare the password
                const match = await bcrypt.compare(password, user.password);
                if (!match) {
                    return res.status(401).json({ error: 'Invalid credentials' });
                }

                // Generate JWT token (optional)
                const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: '1h' });

                // Store session details
                // console.log(user.id);
                req.session.user = {
                    
                    id: user.id,
                    email: user.email,
                };


                    req.session.save((err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Session save failed' });
                    }
                    res.json({ message: 'Logged in successfully' });
                });
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Logout route
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to log out' });
        }
        res.json({ message: 'Logged out successfully' });
    });
});

// Check session route
router.get('/check-session', (req, res) => {
    console.log(req.session);
    if (req.session.user) {
        
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        console.log("hehe");
        res.json({ loggedIn: false });
    }
});

// Auth middleware
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ error: 'User not authenticated' });
    }
};

module.exports = router;
