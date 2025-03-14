const express = require('express');
const router = express.Router();
const RootUser = require('../model/rootUerModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretKey = process.env.SECRETKEY




router.get('/', (req, res) => {
  res.send('hello');
});




router.post('/register', async (req, res) => {
  try {
    // console.log(req.body);
    
    const { username, password, role } = req.body;  
    if (!role) {
      return res.status(400).json({ error: 'Role is required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new RootUser({ username, password: hashedPassword, role }); 
    await user.save();
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { username, password, role } = req.body; // Extract role from request

    // Find user by username
    const user = await RootUser.findOne({ username });
    if (!user) {
      return res.status(403).json({ error: 'Authentication failed', message: 'Username or password is wrong' });
    }

    // Check if password matches
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Authentication failed', message: 'Username or password is wrong' });
    }

    // Check if role matches
    if (user.role !== role) {
      return res.status(403).json({ error: 'Authentication failed', message: 'Incorrect role' });
    }

    // Generate JWT token including user ID and role
    const token = jwt.sign({ userId: user._id, role: user.role }, secretKey, {
      expiresIn: '2400h',
    });

    // Send token and role in response
    res.status(200).json({ token, role: user.role, message: 'tokenSuccess' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed', message: 'Server error' });
  }
});



module.exports = router
