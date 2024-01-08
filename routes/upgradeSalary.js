const express = require('express')
const router = express.Router();
const User = require('../model/userModel');

router.post('/upgrade-salary', async (req, res) => {
  try {
    const { name, baseSalary, password } = req.body;

    const user = await User.findOne({ name });

    if (!user) {
      console.log('not user');
      return res.status(404).json({ error: 'User not found',message:"User not found" });
    }

    if (user.password !== password) {
      console.log('invalid password');
      return res.status(401).json({ error: 'Invalid password',message:"invalid password" });
    }

    const updatedUser = await User.findOneAndUpdate({ name }, { $set: { baseSalary } }, { new: true });
    console.log({
      data: updatedUser,
      message: 'Base salary updated successfully',
    });

    res.json({
      data: updatedUser,
      message: 'Base salary updated successfully',
    });
  } catch (error) {
    console.error('Error upgrading salary:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
module.exports = router
