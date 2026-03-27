const express = require('express');
const fs = require('fs').promises;  // Use promise-based FS
const path = require('path');
const router = express.Router();

const usersFilePath = path.join(__dirname, '../../data/users.json');

// Improved: Async file reading with better error handling
async function readUsersFile() {
    try {
        const data = await fs.readFile(usersFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        if (err.code === 'ENOENT') {
            // File doesn't exist - create empty array
            await fs.writeFile(usersFilePath, '[]');
            return [];
        }
        console.error('Error reading users.json:', err);
        return [];
    }
}

// Login route
router.post('/login', async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ 
            success: false, 
            message: 'Missing credentials' 
        });
    }

    try {
        const users = await readUsersFile();
        const user = users.find(u => 
            u.username === username && 
            u.password === password && 
            u.role === role
        );

        if (user) {
            res.json({ 
                success: true, 
                message: 'Login successful' 
            });
        } else {
            res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during login' 
        });
    }
});

module.exports = router;


