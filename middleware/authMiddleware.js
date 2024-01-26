require('dotenv').config();

const jwt = require('jsonwebtoken');
function verifyToken(req, res, next) {
const token = req.header('Authorization');
const secretKey = process.env.SECRETKEY
if (!token) return res.status(401).json({ error: 'Access denied' });
try {
 const decoded = jwt.verify(token, secretKey);
 req.userId = decoded.userId;
 next();
 } catch (error) {
 res.status(401).json({ error: 'Invalid token',status:"invalid token" });
 }
 };

module.exports = verifyToken;