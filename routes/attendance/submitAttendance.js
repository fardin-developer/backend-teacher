const express = require('express');
const router = express.Router();
const studentAttendance = require('../../model/studentAttendance');
const moment = require('moment-timezone');

router.post('/submit-attendance', async (req, res) => {
  try {
    const presentArr = req.body.presentArr || []; // Default to an empty array if presentArr is undefined

    console.log('Received presentArr:', presentArr);

    if (!Array.isArray(presentArr)) {
      console.error('Invalid presentArr data');
      return res.status(400).json({ error: 'Invalid presentArr data' });
    }

    const todayStart = moment().startOf('day').toDate(); // Get the start of today's date
    const todayEnd = moment().endOf('day').toDate(); // Get the end of today's date

    const bulkOps = presentArr.map(value => ({
      updateOne: {
        filter: {
          user: value.user,
          date: { $gte: todayStart, $lte: todayEnd }
        },
        update: {
          $setOnInsert: {
            user: value.user,
            name: value.name,
            classnumber: value.classnumber,
            section: value.section,
            rollNo: value.rollNo,
            count: value.count,
          }
        },
        upsert: true
      }
    }));

    // Perform bulk write with upsert
    if (bulkOps.length > 0) {
      const result = await studentAttendance.bulkWrite(bulkOps);
      console.log('Bulk write result:', result);
    }

    res.json({
      success: true,
      message: 'Attendance submitted for all students'
    });
  } catch (error) {
    console.error('Error submitting attendance:', error);
    if (error.code === 11000) {
      res.status(409).json({
        error: 'Duplicate attendance record detected'
      });
    } else {
      res.status(500).json({
        error: 'An error occurred while submitting attendance'
      });
    }
  }
});



module.exports = router;
