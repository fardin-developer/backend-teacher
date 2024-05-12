const express = require('express');
const router = express.Router();
const Student = require('../model/StudentModel');

router.get('/students', async (req, res) => {
    let studentClass = req.query.class;
    let section = req.query.section;

    try {
        const students = await Student.find({ Class: studentClass, section });
        if (students.length > 0) {
            res.status(200).json(students);
        } else {
            res.status(404).json({ message: 'Students not found' });
        }
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'An error occurred while fetching students' });
    }
});

module.exports = router;
