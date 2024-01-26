const express = require('express');
const router = express.Router();
const RootUser = require('../model/rootUerModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');




router.get('/', (req, res) => {
  res.send('hello');
});




router.post('/register', async (req, res) => {
  try {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new RootUser({ username, password:hashedPassword });
  console.log(username);
  await user.save();
  res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
  res.status(500).json({ error: 'Registration failed' });
  }
  });

  router.post('/login', async (req, res) => {
    try {
    const { username, password } = req.body;
    const user = await RootUser.findOne({ username });
    if (!user) {
    return res.status(401).json({ error: 'Authentication failed' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
    return res.status(401).json({ error: 'Authentication failed' });
    }
    const token = jwt.sign({ userId: user._id }, 'razSecretkey', {
    expiresIn: '1h',
    });
    res.status(200).json({ token });
    } catch (error) {
    res.status(500).json({ error: 'Login failed' });
    }
    });


module.exports = router
