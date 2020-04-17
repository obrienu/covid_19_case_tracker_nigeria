/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/user');

const secretKey = process.env.SECRET_KEY;
const { ADMIN_CODE } = process.env;

const validateReg = async (body) => {
  const {
    name, password, cpassword, email, adminCode,
  } = body;
  if (adminCode !== ADMIN_CODE) throw new Error('Unauthorised Access');
  if (!email || !name || !password || !cpassword) throw new Error('Please Enter All Fields');
  if (password !== cpassword) throw new Error('Password and Cpassword must be the same');
  const checkUser = await User.findOne({ email });
  if (checkUser) throw new Error('User exists already');
};

const validateLogin = async (body) => {
  const { email, password } = body;
  if (!email || !password) throw new Error('Please Enter All Fields');
  const checkUser = await User.findOne({ email });
  if (!checkUser) throw new Error('User Does Not Exist');
  return checkUser;
};

const signToken = async (id) => {
  const token = await jwt.sign({ id }, secretKey, { expiresIn: 3600 });
  return token;
};

exports.registerUser = async (req, res) => {
  try {
    const {
      name, password, email,
    } = req.body;
    validateReg(req.body);
    const newUser = new User({
      name,
      email,
      password,
    });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newUser.password, salt);
    newUser.password = hash;
    const user = await newUser.save();
    const token = await signToken(user.id);
    res.json({
      token,
      user: {
        name: user.name,
        id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('user', err);
    res.status(400).json({ err: err.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await validateLogin(req.body);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid Credentials');
    const token = await signToken(user._id);
    res.json({
      token,
      user: {
        name: user.name,
        id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('user', err);
    res.status(400).json({ err: err.message });
  }
};

exports.getUser = (req, res) => {
  User.findById(req.user.id)
    .then((user) => res.json(user))
    .catch(() => res.status(400).json({ err: 'Cannot get user' }));
};
