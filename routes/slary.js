const express = require('express');
const router = express.Router();
const User = require('../model/userModel');
const Attendance = require('../model/attendenceMode');
router.get('/salary', (req, res) => {




    // const baseslary =3000;
    // let absent = 10;
    // let sundayOfMonth 
    // let daysalary = 3000/30;
    // const finalSalary = baseslary - daysalary*absent
    // res.send("salary reciept: "+ finalSalary)
});

router.post('/salary', async (req, res) => {
    let { month, year, name } = req.body;
    month = Number(month);
    year = Number(year)

    const sundaysCount = countSundaysInMonth(month, year);

    // console.log(` Number of Sundays: ${sundaysCount} `);

    // res.send(`Received month data. Number of Sundays: ${sundaysCount}`);

    // console.log("name " + name);

    const salaryFind = async (name) => {
        let user = await User.findOne({ name: name });
        if (user) {
            const baseslary = user.baseSalary;
            let userID = user._id;
            const numberOfPresentAttendances = await getNumberOfPresentAttendances(userID, month, year);
            console.log("Number of present attendances:", numberOfPresentAttendances);
            console.log(userID);
            let daysalary = baseslary / 30;
            const finalSalary = numberOfPresentAttendances * daysalary + sundaysCount * daysalary
            console.log("final " + finalSalary);
            res.json({
                name: name,
                month: month,
                year: year,
                numberOfPresentAttendances,
                sundaysCount,
                baseslary,
                finalSalary: finalSalary,

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

        return presentAttendances.length;
    } catch (error) {
        console.error("Error fetching attendances:", error);
        throw error;
    }
};


module.exports = router