const express = require('express');
const router = express.Router();
const Attendance = require('../model/attendenceMode');
const User = require('../model/userModel');





router.get('/', (req, res) => {
  res.send('hello');
});

router.get('/users', async (req, res) => {
  const users = await User.find();
  const allUsers = [];

  for (let i = 0; i < users.length; i++) {
    allUsers.push(
      {
        id: i,
        name: users[i].name,
        cost: users[i].baseSalary,
        phone: users[i].phone,
        date: users[i].dateOfJoin,
      }
    )
  }

  console.log(allUsers);

  res.json({
    users: allUsers,
  });
});



router.post('/submit', (req, res) => {
  const location = {}
  location.latitude = req.body.latitude;
  location.longitude = req.body.longitude;
  location.name = req.body.name;

  function calculateLateEntryMinutes() {
    const indianTimeZone = 'Asia/Kolkata';
    const options = { timeZone: indianTimeZone };

    const currentDate = new Date().toLocaleString('en-US', options);
    const currentDateTime = new Date(currentDate);

    const targetTime = new Date(currentDate);
    targetTime.setHours(8, 45, 0, 0);

    const lastTime = new Date(currentDate);
    lastTime.setHours(14, 10, 0, 0);

    if (currentDateTime > targetTime) {
      const timeDifference = currentDateTime.getTime() - targetTime.getTime();
      const minDifference = timeDifference / (1000 * 60);
      // console.log("lateEntryInMinutes: " + minDifference);

      return minDifference;
    } else {
      // console.log("Not within the specified time range.");
      return 0;
    }
  }

  const indianTimeZone = 'Asia/Kolkata';
    const options = { timeZone: indianTimeZone };

    const currentDate = new Date().toLocaleString('en-US', options);
    const currentDateTime = new Date(currentDate);


  function calculateEarlyLeavingMinutes() {
    const indianTimeZone = 'Asia/Kolkata';
    const options = { timeZone: indianTimeZone };

    const currentDate = new Date().toLocaleString('en-US', options);
    const currentDateTime = new Date(currentDate);
    console.log(currentDateTime);

    const targetTime = new Date(currentDate);
    targetTime.setHours(14, 10, 0, 0);

    const startTime = new Date(currentDate);
    startTime.setHours(9, 0, 0, 0);

    if (currentDateTime < targetTime && currentDateTime > startTime) {
      const timeDifference = targetTime.getTime() - currentDateTime.getTime();
      const minuteDifference = timeDifference / (1000 * 60);
      return minuteDifference;
    } else if (currentDateTime >= targetTime) {

      return 0;
    }else{
      return -1;
    }
  }

  const lateEntryInMinutes = calculateLateEntryMinutes();
  // console.log(`The hour difference between now and 9:00 AM today is: ${lateEntryInMinutes} hours.`);

  const earlyLeavingMinutes = calculateEarlyLeavingMinutes();
  // console.log(`The difference between now and 2:00 PM is: ${earlyLeavingMinutes} minutes.`);




  const findUserByName = async (name) => {
    try {
      const user = await User.findOne({ name });

      if (user) {
        const today = new Date().setHours(0, 0, 0, 0);


        const existingAttendance = await Attendance.findOne({
          user: user._id,
          date: { $gte: today, $lt: today + 24 * 60 * 60 * 1000 },
        });
        if (!existingAttendance) {
          // const currentDate = new Date();
          // const targetTime = new Date(currentDate);
          // targetTime.setHours(9, 45, 0, 0);

          if (lateEntryInMinutes > 60) {
            return res.status(400).json({
              status: 'fail',
              message: 'You are too late',
              data: "after 9:40 am moring attendance is not allowed",
            });
          }
          const newAttendence = new Attendance({
            user: user._id,
            name: user.name,
            date: currentDateTime,
            status: 'inComplete',
            morningStatus: true,
            lateMinutes: lateEntryInMinutes
          })
          newAttendence.save().then((saveAttendence) => {
            res.status(200).json({
              status: 'success',
              message: `attendence saved successfully`,
              data: saveAttendence
            });

          }).catch(err => {
            console.log(err);
            res.status(500).json({
              status: 'error',
              message: "failed to save attendence"
            })
          })
        } else {
          if (existingAttendance.morningStatus === true && existingAttendance.evengStatus === false) {
            if (earlyLeavingMinutes > 130) {
              res.status(400).json({
                status: 'fail',
                message: 'You are trying too early',
                data: "Before 12:00 pm attendence is not allowed",
              });
            }
            existingAttendance.evengStatus = true;
            // if (existingAttendance.lateMinutes ===0 && existingAttendance.earlydepartureMinute ===0) {
            existingAttendance.status = "present"
            // }

            if (earlyLeavingMinutes > 0) {
              // Check if it's Saturday and time is more than 11:59 AM;
              let currentDate = new Date()
              if (currentDate.getDay() === 6 && currentDate.getHours() > 11 && currentDate.getMinutes() > 59) {
                existingAttendance.earlydepartureMinute = 0;
                // console.log('It is Saturday and the time is more than 11:59 AM, so early departure minutes set to 0.');
              } else {
                existingAttendance.earlydepartureMinute = earlyLeavingMinutes;
                // console.log('Early departure minutes updated.');
              }
            }
            existingAttendance.save()
              .then(() => {
                console.log('attendance updated');
                res.status(200).json({
                  status: 'success',
                  message: 'evening attendance updated successfully',
                  data: existingAttendance,
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  status: 'error',
                  message: 'failed to update attendance',
                });
              });

          } else {
            console.log('attendence exist');
            res.status(409).json({
              status: 'exist',
              message: 'Attendance already exists',
            });
          }
        }
      } else {
        console.log('user not found');
        res.status(404).json({
          user: "user not found",
          status: "noUser",
          message: 'User not found...',
          data: "Check your username or be a member first",
        })
      }
      return user;
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }
  const name = location.name
  findUserByName(name)

  console.log('Location:', location.latitude);
  console.log('Location:', location.longitude);
  console.log('name:', location.name);

});




module.exports = router
