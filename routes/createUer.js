const express = require('express')
const router = express.Router()
const User = require('../model/userModel');
const moment = require('moment-timezone');


router.post('/create-user', (req, res) => {
  const now = moment().tz("Asia/Kolkata");
const formattedDate = now.format("YYYY-MM-DDTHH:mm:ss.SSS") + 'Z';
const formattedDateInDateObj = new Date(formattedDate);
// console.log(formattedDateInDateObj);

  const { name, baseSalary, password, confirmPassword, phone, url } = req.body
  
  const findByName = async name => {
    try {
      const user = await User.findOne({ name })
      if (!user) {
        if (password == confirmPassword) {
          const user = new User({
            name: name,
            phone: phone,
            password: password,
            url:url,
            dateOfJoin:formattedDateInDateObj,
            baseSalary: baseSalary,
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
