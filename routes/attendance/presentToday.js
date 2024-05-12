const express = require('express');
const router = express.Router();
const studentAttendance = require('../../model/studentAttendance');
const moment = require('moment-timezone');

router.get('/present-today', async (req, res) => {
  try {
    const { classnumber, section } = req.query;
    const todayStart = moment().startOf('day'); 
    const todayEnd = moment().endOf('day');
    
    const students = await studentAttendance.find({
      date: { $gte: todayStart, $lte: todayEnd },
      classnumber: classnumber,
      section: section
    });

    if (students && students.length > 0) {
      res.json({
        success: true,
        data: students
      });
    } else {
      res.json({
        success: true,
        message: 'No students found for today'
      });
    }
  } catch (error) {
    console.error('Error fetching present students:', error);
    res.status(500).json({
      error: 'An error occurred while fetching present students'
    });
  }
});

module.exports = router;
