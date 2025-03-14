const express = require('express');
const router = express.Router();
const Attendance = require('../model/attendenceMode'); // Adjust path if needed
const Student = require('../model/StudentModel');
const User = require('../model/userModel');

// Dashboard API
router.get('/dashboard', async (req, res) => {
  try {
    // Get today's date without time
    const today = new Date();
    today.setHours(0, 0, 0, 0);

// ----- Students Summary -----
const totalStudents = await Student.countDocuments();

// Dues summary: Paid, Unpaid, Considered
const studentDueSummary = await Student.aggregate([
  {
    $group: {
      _id: "$due",
      count: { $sum: 1 }
    }
  }
]);
const dueSummary = studentDueSummary.reduce((acc, curr) => {
  acc[curr._id] = curr.count;
  return acc;
}, { paid: 0, unpaid: 0, considered: 0 });

// Class-wise student count
const classWiseStudentSummary = await Student.aggregate([
  {
    $group: {
      _id: "$Class",
      count: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } } // Sorting classes in ascending order
]);

// Final structure
const classWiseStudents = classWiseStudentSummary.map(item => ({
  class: item._id,
  count: item.count
}));


    // ----- Teachers Summary -----
    const totalTeachers = await User.countDocuments();

    const teacherSalarySummary = await User.aggregate([
      {
        $group: {
          _id: null,
          totalBaseSalary: { $sum: "$baseSalary" },
          avgBaseSalary: { $avg: "$baseSalary" },
        }
      }
    ]);

    // ----- Attendance Summary for Today -----
    const todayAttendanceSummary = await Attendance.aggregate([
      {
        $match: { date: today }
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const attendanceSummary = todayAttendanceSummary.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, { present: 0, absent: 0, late: 0, inComplete: 0 });

    // ----- Additional Info -----
    const lateTeachersToday = await Attendance.find({ date: today, status: 'late' })
      .populate('user', 'name phone')
      .select('name lateMinutes');

    // Final Response
    res.json({
      success: true,
      data: {
        students: {
          total: totalStudents,
          dues: dueSummary,
          classWise: classWiseStudents 
        },
        teachers: {
          total: totalTeachers,
          salary: {
            totalBaseSalary: teacherSalarySummary[0]?.totalBaseSalary || 0,
            avgBaseSalary: teacherSalarySummary[0]?.avgBaseSalary || 0
          }
        },
        attendanceToday: {
          summary: attendanceSummary,
          lateTeachers: lateTeachersToday
        }
      }
    });

  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error. Unable to fetch dashboard data.',
      error: error.message
    });
  }
});

module.exports = router;
