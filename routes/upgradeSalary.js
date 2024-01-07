const express = require('express')
const router = express.Router();
const User = require('../model/userModel');

router.post('/upgrade-salary',(req,res)=>{
    console.log(req.body);
    // res.send("hello");
    const{name,baseSalary,password}=req.body
    console.log("name ;"+name);
    // console.log(baseSalary);
    // console.log(password);
    // console.log(phone);


    const findByName = async (name) => { 
        try {
          const user = await User.findOneAndUpdate({ name, $set:{baseSalary:baseSalary} });
          console.log(user);
    
        } 
        catch (error) {
          console.error('Error finding user:', error);
          throw error;
        }
      }
      findByName(name)






})
module.exports = router
