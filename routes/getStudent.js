const express = require('express');
const router = express.Router();
const Student = require('../model/StudentModel');

router.get('/student-name', async (req, res) => {
    try {
        const { rollNo, class: studentClass, section } = req.query;

        // Validate input parameters
        if (!rollNo || !studentClass || !section) {
            return res.status(400).json({ message: 'Invalid input parameters' });
        }

        // Query the database for the student
        const student = await Student.findOne({ rollNo, Class: studentClass, section });

        if (student) {
            res.status(200).json(student);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ error: 'An error occurred while fetching student' });
    }
});

module.exports = router;
