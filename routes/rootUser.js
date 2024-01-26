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
    return res.status(403).json({ error: 'Authentication failed',message:"Username or password is wrong" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
    return res.status(401).json({ error: 'Authentication failed',message:"Username or password is wrong" });
    }
    console.log("sss"+secretKey);
    const token = jwt.sign({ userId: user._id }, secretKey, {
    expiresIn: '2400h',
    });
    res.status(200).json({ token ,"message":"tokenSuccess"});
    } catch (error) {
    res.status(500).json({ error: 'Login failed',message:"Server error" });
    }
    });


module.exports = router
