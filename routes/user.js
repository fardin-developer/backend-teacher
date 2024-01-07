const express = require('express');
const router = express.Router();
const Attendance = require('../model/attendenceMode');
const User = require('../model/userModel');


router.get('/', (req, res) => {
  res.send('hello');
});


router.post('/submit', (req, res) => {
  const location = {}
  location.latitude = req.body.latitude;
  location.longitude = req.body.longitude;
  location.name = req.body.name;


  const findUserByName = async (name) => {
    try {
      const user = await User.findOne({ name });
      if (user) {
        // console.log('Found user:', user);
        const today = new Date().setHours(0, 0, 0, 0);
        // console.log("datechecked " + today + 24 * 60 * 60 * 1000);


        const existingAttendance = await Attendance.findOne({
          user: user._id,
          date: { $gte: today, $lt: today + 24 * 60 * 60 * 1000 },
        });
        if (!existingAttendance) {
          const newAttendence = new Attendance({
            user: user._id,
            name: user.name,
            date: new Date(),
            status: 'present'
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
          console.log('attendence exist');
          res.status(409).json({
            status: 'exist',
            message: 'Attendance already exists',
          });
        }
      } else {
        console.log('user not found');
        res.status(404).json({
          user: "user not found",
          status: "noUser"
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
