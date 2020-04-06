const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key');

const { User } = require('./models/user');

// DB Connection
mongoose.connect(config.mongoURI, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
  if(err){
    process.exit(1);
    console.log('Unable to connect to database');
  }
  else
    console.log('Successfully connected to the database');
});

// Body-Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Cookie-Parser
app.use(cookieParser());

// Routing - GET
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Routing - GET
app.post('/api/users/register', (req, res) => {
  const user = new User(req.body);
  user.save((err, userDate) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true
    });
  });
});

// Listen
app.listen('5000');
