const express = require('express');
const router = express.Router();
// const moment = require('moment-timezone')

const Student = require('../model/StudentModel');

router.get('/student-name',async(req,res)=>{
    let rollNo = req.query.rollNo;
    let studentClass = req.query.class
    let section = req.query.section
    // console.log(section);
   const student = await Student.findOne({rollNo,Class: studentClass,section})
   if (student) {
    res.status(200).json(student)
   }else{
    res.status(404).json({ message: 'Student not found' });
   }
})

module.exports = router