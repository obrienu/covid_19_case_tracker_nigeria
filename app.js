const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const boolParser = require('express-query-boolean');
const cors = require('cors');
//require('dotenv').config();

const indexRouter = require('./routes/index');

const app = express();

const url = process.env.DB_URI;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to DataBase');
}).catch((err) => {
  console.error('Failed to connect to server: ', err);
});

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(boolParser());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* app.use((req, res, next) => {
  console.log('%O', req);
  next();
}); */

app.use('/api/v1/nigeria/covid-19/', indexRouter);
app.use('/user', require('./routes/user'));

module.exports = app;
