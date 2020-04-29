/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const boolParser = require('express-query-boolean');
const cors = require('cors');
const exphbs = require('express-handlebars');
// const webpack = require('webpack');
// const webpackDevMiddleware = require('webpack-dev-middleware');
// const config = require('./webpack.dev');

// const compiler = webpack(config);
// require('dotenv').config();

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


app.set('views', path.join(__dirname, 'views'));

const hbs = exphbs.create({ defaultLayout: 'main' });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(boolParser());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), {
  etag: true,
  lastModified: true,
  // eslint-disable-next-line no-shadow
  setHeaders: (res, path) => {
    const hashRegExp = new RegExp('\\.[0-9a-f]{8}\\.');
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    } else if (hashRegExp.test(path)) {
      res.setHeader('Cache-Control', 'max-age=31536000');
    }
  },
}));

/* if (process.env.NODE !== 'production') {
  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  }));
} */

app.use('/api/v1/nigeria/covid-19/', indexRouter);
app.use('/user', require('./routes/user'));
app.use('/', require('./routes/site'));

app.use((req, res) => {
  res.status(404);
  res.render('404');
});

app.use((req, res) => {
  // eslint-disable-next-line no-undef
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

module.exports = app;
