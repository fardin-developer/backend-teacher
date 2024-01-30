const express = require('express')
const router = express.Router()
const Attendance = require('../model/attendenceMode')
const User = require('../model/userModel');
const moment = require('moment-timezone');



router.get('/holiday', async (req, res) => {
    const currentDate = new Date()
    const modifiedDate = new Date(currentDate)
    modifiedDate.setHours(currentDate.getHours() + 5)
    modifiedDate.setMinutes(modifiedDate.getMinutes() + 30)
    const isoString = modifiedDate.toISOString();

    let users = await User.find();
    const promises = users.map((user, index) => {

        const newAttendance = new Attendance({
            user: user._id,
            name: user.name,
            status: 'present',
            date: isoString,
            morningStatus: false,
            eveningStatus: false,
            lateMinutes: 0,
            earlyDepartureMinutes: 0
        });

        return newAttendance.save();
    });

    Promise.all(promises)
        .then(savedAttendances => {
            return res.status(200).json({
                status: 'success',
                message: 'Holiday attendance updated',
                data: savedAttendances
            });
        })
        .catch(err => {
            return res.status(500).json({
                status: 'error',
                message: 'Failed to save attendance'
            });
        });



});

router.get('/half-holiday', async (req, res) => {
    const todayIST = moment().tz('Asia/Kolkata').startOf('day');
    let actualtoday = todayIST.valueOf();

    const users = await User.find();

    const promises = users.map(async (user) => {
        const existingAttendance = await Attendance.findOne({
            user: user._id,
            date: {
                $gte: actualtoday,
                $lt: actualtoday + 24 * 60 * 60 * 1000
            }
        });
    
        if (existingAttendance && existingAttendance.morningStatus === true && !existingAttendance.evengStatus) {
            existingAttendance.evengStatus = true;
            existingAttendance.status = 'present';
            return existingAttendance.save(); 
        } else {
            return null; 
        }
    });
    
    Promise.all(promises)
        .then(savedAttendances => {
            // Filter out null values before returning
            const validAttendances = savedAttendances.filter(attendance => attendance !== null);
    
            return res.status(200).json({
                status: 'success',
                message: 'half holiday attendance updated',
                data: validAttendances
            });
        })
        .catch(err => {
            // console.error(err);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to save attendance'
            });
        });
});

module.exports = router
