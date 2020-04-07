const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key');

const { User } = require('./models/user');
const { auth } = require('./middleware/auth');

// DB Connection
mongoose.connect(config.mongoURI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err) => {
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

app.get('/', (req, res) => {
  res.json({
    'hello': 'I am happy to deploy our application'
  })
});

// Auth 
app.get('/api/user/auth', auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role
  });
});

// Register
app.post('/api/users/register', (req, res) => {
  const user = new User(req.body);
  user.save((err, userDate) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true
    });
  });
});

// Login
app.post('/api/user/login', (req, res) => {
  // Find The Email
  User.findOne({email: req.body.email}, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: 'Auth failed, email not found'
      });
      
      // Compare the Password
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (!isMatch) {
          return res.json({
            loginSuccess: false, 
            message: 'Auth failed, Wrong password'
          });
        }
      });
      // Generate Token
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res.cookie('x_auth', user.token)
          .status(200)
          .json({
            loginSuccess: true
          });
      });
  });
});

// Logout
app.get('/api/user/logout', auth, (req, res) => {
  User.findOneAndUpdate({_id: req.user._id}, {token: ''}, (err, doc) => {
    if (err) return res.json({
      success: false, err
    });
    return res.status(200).send({
      success: true
    });
  });
});

// Listen
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server Running at ${port}`);
});
