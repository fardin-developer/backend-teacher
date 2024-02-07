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
const getStudent = require('./routes/getStudent')

const rootUser = require('./routes/rootUser');
TZ = 'Asia/Calcutta'

require('dotenv').config();

connectDB();

const user = new User({
  name: 'john doe'
})

app.use(cors());
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

app.get('/new', (req, res) => {
  res.send("hello")
})

const port = process.env.PORT || 80;

// Listen on `port` and 0.0.0.0
app.listen(port, "0.0.0.0", function () {
  console.log("server running at 80");

});

