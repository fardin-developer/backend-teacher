const express = require('express');
const router = express.Router();
const moment = require('moment-timezone')

const Student = require('../model/StudentModel');

router.post('/create-student', async (req, res) => {
    const { name, rollNo, DOB, Class, parentsPhone } = req.body

    const user = await Student.findOne({ name })
    if (!user) {
        const user = new Student({
            name: name,
            rollNo,
            DOB,
            Class,
            parentsPhone
        })
        user.save()
            .then(() => {
                return res.status(200).json({
                    status: 200,
                    message: 'User Created successfully',
                    message1: 'A new member is added in your stuff'
                })
            })
    } else {
        res.json({
            status: 500,
            message: 'user already exist',
            message1: 'please change the name'
        })
    }

})

module.exports = router
