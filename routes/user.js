const express = require('express')
const router = express.Router()
const Attendance = require('../model/attendenceMode')
const User = require('../model/userModel')
const moment = require('moment-timezone')

router.get('/', (req, res) => {
  res.send('hello')
})

const verifyToken = require('../middleware/authMiddleware')

router.get('/users', async (req, res) => {
  const users = await User.find()
  const allUsers = []

  for (let i = 0; i < users.length; i++) {
    allUsers.push({
      id: i,
      name: users[i].name,
      cost: users[i].baseSalary,
      phone: users[i].phone,
      date: users[i].dateOfJoin
    })
  }

  console.log(allUsers)

  res.json({
    users: allUsers
  })
})

router.post('/submit', verifyToken, (req, res) => {
  const location = {}
  location.latitude = req.body.latitude
  location.longitude = req.body.longitude
  location.name = req.body.name

  const currentDate = new Date()
  const modifiedDate = new Date(currentDate)
  modifiedDate.setHours(currentDate.getHours() + 5)
  modifiedDate.setMinutes(modifiedDate.getMinutes() + 30)
  const isoString = modifiedDate.toISOString()

  const formattedTimeString = moment().tz('Asia/Kolkata').format('HH:mm:ss')
  const timeHour = Number(formattedTimeString.split(':')[0])
  const timeMin = Number(formattedTimeString.split(':')[1])
  const timeSec = Number(formattedTimeString.split(':')[2])

  console.log(timeHour)
  console.log(timeMin)
  console.log(timeSec)

  function calculateLateEntryMinutes () {
    const targetTimeHour = 12
    const targetTimeMinute = 30
    const targetTimeSec = 0
    const lastTimeHour = 14
    const lastTimeMinute = 10
    let minDifference

    if (timeHour === targetTimeHour && timeMin >= targetTimeMinute) {
      minDifference = timeMin - targetTimeMinute
      return minDifference
    }

    if (timeHour > targetTimeHour) {
      const hourDifference = timeHour - targetTimeHour
      const hourDifferenceInMin = hourDifference * 60
      const newMinDifff = timeMin - targetTimeMinute
      minDifference = hourDifferenceInMin + newMinDifff
      return minDifference
    } else {
      return 0
    }
  }

  function calculateEarlyLeavingMinutes () {
    const targetTimeHour = 14
    const targetTimeMinute = 10
    const targetTimeSec = 0

    if (timeHour <= targetTimeHour) {
      const hourDiff = targetTimeHour - timeHour
      const mindiff = targetTimeMinute - timeMin
      const minuteDifference = hourDiff * 60 + mindiff
      if (minuteDifference < 0) {
        return 0
      } else {
        return minuteDifference
      }
    } else {
      return 0 // If it's already 2:00 PM or later, return 0 minutes
    }
  }

  const lateEntryInMinutes = calculateLateEntryMinutes()

  const earlyLeavingMinutes = calculateEarlyLeavingMinutes()

  const findUserByName = async name => {
    try {
      const user = await User.findOne({ name })

      if (user) {
        const today = new Date().setHours(0, 0, 0, 0)
        let actualtoday =
          today - (5 * 60 * 60 * 1000 +30 * 60 * 1000) + 24 * 60 * 60 * 1000
        console.log(new Date().setHours(0, 0, 0, 0) + ' set 000')
        console.log(
          new Date().setHours(0, 0, 0, 0) + 5 * 60 * 60 * 1000 + 30 * 60 * 1000
        )
        console.log(actualtoday + ' greater')

        const existingAttendance = await Attendance.findOne({
          user: user._id,
          date: { $gte: actualtoday, $lt: actualtoday + 24 * 60 * 60 * 1000 }
        })
        if (!existingAttendance) {
          // const currentDate = new Date();
          // const targetTime = new Date(currentDate);
          // targetTime.setHours(9, 45, 0, 0);

          if (lateEntryInMinutes > 60) {
            return res.status(400).json({
              status: 'fail',
              message: 'You are too late',
              data: 'after 9:40 am moring attendance is not allowed'
            })
          }
          const newAttendence = new Attendance({
            user: user._id,
            name: user.name,
            date: isoString,
            status: 'inComplete',
            morningStatus: true,
            lateMinutes: lateEntryInMinutes
          })
          newAttendence
            .save()
            .then(saveAttendence => {
              return res.status(200).json({
                status: 'success',
                message: `attendence saved successfully`,
                data: saveAttendence
              })
            })
            .catch(err => {
              return res.status(500).json({
                status: 'error',
                message: 'failed to save attendence'
              })
            })
        } else {
          if (
            existingAttendance.morningStatus === true &&
            existingAttendance.evengStatus === false
          ) {
            if (earlyLeavingMinutes > 130) {
              return res.status(400).json({
                status: 'fail',
                message: 'You are trying too early',
                data: 'Before 12:00 pm attendence is not allowed'
              })
            }
            existingAttendance.evengStatus = true
            // if (existingAttendance.lateMinutes ===0 && existingAttendance.earlydepartureMinute ===0) {
            existingAttendance.status = 'present'
            // }

            if (earlyLeavingMinutes > 0) {
              // Check if it's Saturday and time is more than 11:59 AM;
              let currentDate = new Date()
              if (
                currentDate.getDay() === 6 &&
                currentDate.getHours() > 11 &&
                currentDate.getMinutes() > 59
              ) {
                existingAttendance.earlydepartureMinute = 0
              } else {
                existingAttendance.earlydepartureMinute = earlyLeavingMinutes
              }
            }
            existingAttendance
              .save()
              .then(() => {
                return res.status(200).json({
                  status: 'success',
                  message: 'evening attendance updated successfully',
                  data: existingAttendance
                })
              })
              .catch(err => {
                return res.status(500).json({
                  status: 'error',
                  message: 'failed to update attendance'
                })
              })
          } else {
            return res.status(409).json({
              status: 'exist',
              message: 'Attendance already exists'
            })
          }
        }
      } else {
        return res.status(404).json({
          user: 'user not found',
          status: 'noUser',
          message: 'User not found...',
          data: 'Check your username or be a member first'
        })
      }
      return 0
    } catch (error) {
      console.error('Error finding user:', error)
      throw error
    }
  }
  const name = location.name
  findUserByName(name)

  // console.log('Location:', location.latitude)
  // console.log('Location:', location.longitude)
  // console.log('name:', location.name)
})

module.exports = router
