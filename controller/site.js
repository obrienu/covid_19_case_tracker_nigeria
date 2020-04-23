const states = require('../helper/states');

exports.getHome = (req, res) => {
  res.render('index');
};

exports.getStat = (req, res) => {
  res.render('statistics');
};

exports.getLogin = (req, res) => {
  res.render('login');
};

exports.getPostData = (req, res) => {
  res.render('postdata', { states });
};

exports.getRegister = (req, res) => {
  res.render('register');
};
