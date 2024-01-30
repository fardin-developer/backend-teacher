const express = require('express')
const router = express.Router()
const User = require('../model/userModel')

router.post('/create-user', (req, res) => {
  // console.log(req.body)
  // res.send("hello");
  const { name, baseSalary, password, confirmPassword, phone } = req.body
  // console.log('name ;' + name)
  // console.log(baseSalary);
  // console.log(password);
  // console.log(phone);
  const currentDate = new Date()
  const modifiedDate = new Date(currentDate)
  modifiedDate.setHours(currentDate.getHours() + 5)
  modifiedDate.setMinutes(modifiedDate.getMinutes() + 30);
  const isoString = modifiedDate.toISOString();


  // Get the ISO string representation in Indian Standard Time
  // const isoStringIST = currentDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata', hour12: false });
  
  // console.log(isoStringIST);
  



  const findByName = async name => {
    try {
      const user = await User.findOne({ name })
      if (!user) {
        if (password == confirmPassword) {
          const user = new User({
            name: name,
            phone: phone,
            password: password,
            dateOfJoin:isoString,
            baseSalary: baseSalary
          })
          user.save().then(() => {
            // console.log("user saved");
            res.json({
              status: 200,
              message: 'User Created successfully',
              message1: 'A new member is added in your stuff'
            })
          })
        }
      } else {
        // console.log('user already exist ,please change the name')
        res.json({
          status: 500,
          message: 'user already exist',
          message1: 'please change the name'
        })
      }
      return user
    } catch (error) {
      // console.error('Error finding user:', error)
      throw error
    }
  }
  findByName(name)
})
module.exports = router
