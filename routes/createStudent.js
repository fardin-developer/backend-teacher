const express = require('express');
const router = express.Router();
const moment = require('moment-timezone')

const Student = require('../model/StudentModel');

router.post('/create-student', async (req, res) => {
    const { name, rollNo, DOB, Class, parentsPhone,section } = req.body;
    if (!name || !rollNo || !DOB || !Class|| !parentsPhone) {
        return res.json({
            message:"All fields are required"
        })
    }

    const user = await Student.findOne({rollNo,Class,section});
    if (!user) {
        const user = new Student({
            name: name,
            section,
            rollNo,
            DOB,
            Class,
            parentsPhone
        })
        user.save()
            .then((savedUser) => {
                return res.status(200).json({
                    status: 200,
                    message: 'User Created successfully',
                    message1: 'A new member is added in your stuff',
                    user:savedUser
                })
            })
    } else {
        res.json({
            status: 500,
            message: 'user already exist',
            message1: ''
        })
    }

})
router.post('/payment-update',async(req,res)=>{
   const {Class,rollNo,section} = req.body
   const student = await Student.findOne({rollNo,Class,section});
   console.log(student);
   if (!student) {
    return res.json({message:"user not found"})
   }
   student.due = 'paid';
   student.save()
   .then(()=>{
    res.status(200).json({
       status:"success" ,
       message:"payment updated as paid",
       student
    })
   })
   
})

module.exports = router
