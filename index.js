const express = require('express');
const app = express();
const mongoose = require('mongoose');

// DB Connection
mongoose.connect('mongodb+srv://admin:admin26@cluster0-xlswe.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
  if(err){
    process.exit(1);
    console.log('Unable to connect to database');
  }
  else
    console.log('Successfully connected to the database');
});

// Routing
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Listen
app.listen('5000');