const express = require('express');
const router = express.Router();
const Attendance = require('../model/attendenceMode');
const User = require('../model/userModel')



router.get('/attendence-list', async (req, res) => {
    try {
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const numberOfDays = lastDayOfMonth.getDate();
        console.log(numberOfDays);

        
        const attendances = await Attendance.find({
          date: {
            $gte: firstDayOfMonth,
            $lt: lastDayOfMonth,
          },
        });
        
        // Now attendances contains only entries for the current month
              const users = await User.find();
      var data = [];
  
      users.map((user, index) => {
        var count = 0;
        attendances.forEach((attendance) => {
          if (attendance.name === user.name) {
            count++;
          }
        });
        let attendance= count
        let percentage = Math.round(attendance/numberOfDays*100)
        data.push({
          id: index,
          name: user.name,
          attendance: attendance,
          percentage:percentage+"%"
        });
      });
  
      console.log(data);
  
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch data',
      });
    }
  });
  
  

module.exports = router