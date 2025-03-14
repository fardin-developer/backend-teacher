const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const connectDB = require('./config/conndecDB')
const User = require('./model/userModel');
const userRoute = require('./routes/user');
const salary = require('./routes/slary')
const createUser = require('./routes/createUer');
const netAttendence = require('./routes/netAttendeces')
const upgradeSalary = require('./routes/upgradeSalary');
const holiday = require('./routes/holiday')
const createStudent = require('./routes/createStudent')
const getStudent = require('./routes/getStudent');
const submitAttendance = require('./routes/attendance/submitAttendance')
const getAllstudent = require('./routes/getAllstudent')
const presentStudents = require('./routes/attendance/presentToday')
const dashboard = require('./routes/dashboard')

const rootUser = require('./routes/rootUser');
TZ = 'Asia/Calcutta'

require('dotenv').config();

connectDB();

const user = new User({
  name: 'john doe'
})

const corsOptions = {
  origin: "http://localhost:5001",
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(bodyParser.json());
app.use('/admin',rootUser);

app.use('/', userRoute)
app.use('/', createStudent)
app.use('/', getStudent)
app.use('/', salary)
app.use('/', createUser)
app.use('/', holiday)
app.use('/', netAttendence);
app.use('/',upgradeSalary);
app.use('/',submitAttendance);
app.use('/',getAllstudent);
app.use('/',presentStudents);
app.use('/', dashboard)

app.get('/new', (req, res) => {
  res.send("hello")
})

const port =  800;

// Listen on `port` and 0.0.0.0
app.listen(port, "0.0.0.0", function () {
  console.log("server running at 80");

});

