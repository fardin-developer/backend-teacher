const express = require('express');
const router = express.Router();
// const moment = require('moment-timezone')

const Student = require('../model/StudentModel');

router.get('/students',async(req,res)=>{
    console.log('okay');
    let studentClass = req.query.class
    let section = req.query.section

   const student = await Student.find({Class: studentClass,section})
   if (student) {
    res.status(200).json(student)
   }else{
    res.status(404).json({ message: 'Student not found' });
   }
})

module.exports = router