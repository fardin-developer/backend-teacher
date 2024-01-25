const express = require('express');
const router = express.Router();
const User = require('../model/userModel');
const Attendance = require('../model/attendenceMode');
router.get('/salary', (req, res) => {

});

router.post('/salary', async (req, res) => {
    let { month, year, name } = req.body;
    month = Number(month);
    year = Number(year);
    let attendances = {
    }

    const sundaysCount = countSundaysInMonth(month, year);

    const salaryFind = async (name) => {
        let user = await User.findOne({ name: name });
        if (user) {
            const baseslary = user.baseSalary;
            let userID = user._id;
             let result = await getNumberOfPresentAttendances(userID, month, year);
             let numberOfPresentAttendances = result.length
            console.log("Number of present attendances:", numberOfPresentAttendances);
            let lateTimeCount = 0

            result.map((value)=>{
             lateTimeCount = lateTimeCount+ value.earlydepartureMinute+value.lateMinutes
            });
            console.log(lateTimeCount);
            console.log(userID);
            let daysalary = baseslary / 30;

            const lateTimeSalary = lateTimeCount *daysalary/(5*60);
            console.log(lateTimeSalary);
            const finalSalary = numberOfPresentAttendances * daysalary + sundaysCount * daysalary -lateTimeSalary;
            console.log("final " + finalSalary);
            res.status(200).json({
                name: name,
                month: month,
                year: year,
                numberOfPresentAttendances,
                sundaysCount,
                baseslary,
                finalSalary: finalSalary,
                lateTimeCount,
                lateTimeSalary

            })


        } else {
            console.log('not found');
        }
    }

    salaryFind(name);
});

function countSundaysInMonth(month, year) {

    const date = new Date(year, month, 1);
    console.log("date: " + date);
    let count = 0;

    while (date.getMonth() === month) {
        if (date.getDay() === 0) {
            count++;
        }
        date.setDate(date.getDate() + 1);
    }

    return count;
}

const getNumberOfPresentAttendances = async (userID, month, year) => {
    try {
        const presentAttendances = await Attendance.find({
            user: userID, status: "present", date: {
                $gte: new Date(year, month, 1), 
                $lte: new Date(year, month+1, 0),     
            },
        });


        return presentAttendances;
    } catch (error) {
        console.error("Error fetching attendances:", error);
        throw error;
    }
};


module.exports = router