const express = require('express')
const router = express.Router()
const studentAttendance = require('../../model/studentAttendance')
const moment = require('moment-timezone')

router.get('/present-today', async (req, res) => {
  try {
    const todayStart = moment().startOf('day'); 
    const todayEnd = moment().endOf('day');
    let students = await studentAttendance.find({
      
      date: { $gte: todayStart, $lte: todayEnd },
      classnumber: 1
    });
    if (students) {
        res.json({
            success:true,
            data:students
        })
    }
  } catch (error) {
    res.status(500).json({
        error: 'An error occurred while submitting attendance'
      });
  }
})

module.exports = router
