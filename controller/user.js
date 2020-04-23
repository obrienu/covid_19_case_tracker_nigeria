/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/user');

const secretKey = process.env.SECRET_KEY;
const { ADMIN_CODE } = process.env;

const validateReg = async (body) => {
  try {
    const {
      name, password, cpassword, email, adminCode,
    } = body;
    if (adminCode !== ADMIN_CODE) throw new Error('Unauthorised Access');
    if (!email || !name || !password || !cpassword) throw new Error('Please Enter All Fields');
    if (password !== cpassword) throw new Error('Password and Cpassword must be the same');
    const checkUser = await User.findOne({ email });
    if (checkUser) throw new Error('User exists already');
  } catch (err) {
    return err.message;
  }
};

const validateLogin = async (body) => {
  try {
    const { email, password } = body;
    if (!email || !password) throw new Error('Please Enter All Fields');
    const checkUser = await User.findOne({ email });
    if (!checkUser) throw new Error('User Does Not Exist');
    return checkUser;
  } catch (err) {
    return ({ Error: err.message });
  }
};

const signToken = async (id) => {
  const token = await jwt.sign({ id }, secretKey, { expiresIn: 3600 });
  return token;
};

const testBcrypt = (password = 'Ulelek10$') => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  const isMatch = bcrypt.compareSync(password, hash);
  return isMatch;
};

exports.registerUser = async (req, res) => {
  try {
    const {
      name, password, email,
    } = req.body;
    const err = await validateReg(req.body);
    if (err) throw new Error(err);
    const newUser = new User({
      name,
      email,
      password,
    });
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newUser.password, salt);
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
    if (user.Error) throw new Error(user.Error);
    const isMatch = bcrypt.compareSync(password, user.password);
    testBcrypt();
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
