const express = require('express');
const router = express.Router();
const studentAttendance = require('../../model/studentAttendance');
const moment = require('moment-timezone');

router.post('/submit-attendance', async (req, res) => {
  try {
    const presentArr = req.body.presentArr || []; // Default to an empty array if presentArr is undefined

    if (!Array.isArray(presentArr)) {
      throw new Error('Invalid presentArr data');
    }

    const todayStart = moment().startOf('day'); // Get the start of today's date
    const todayEnd = moment().endOf('day'); // Get the end of today's date

    const attendancePromise = presentArr.map(async (value) => {
      // Check if attendance for today already exists for the user
      const existingAttendance = await studentAttendance.findOne({
        user: value.user,
        date: { $gte: todayStart, $lte: todayEnd }
      });

      if (!existingAttendance) {
        const student = new studentAttendance({
          user: value.user,
          name: value.name,
          classnumber:value.classnumber,
          section:value.section,
          rollNo:value.rollNo,
          count:value.count
        });
        await student.save();
      }
    });

    await Promise.all(attendancePromise);

    res.json({
      success: true,
      message: 'Attendance submitted for all students'
    });
  } catch (error) {
    console.error('Error submitting attendance:', error);
    res.status(500).json({
      error: 'An error occurred while submitting attendance'
    });
  }
});

module.exports = router;
