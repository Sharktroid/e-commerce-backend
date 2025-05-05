const bcrypt = require('bcrypt');
const User = require('../models/User');
const { sendResponseError } = require('../middleware/middleware');
const { checkPassword, newToken } = require('../utils/utility.function');

const signUpUser = async (req, res) => {
  const { password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 8);

    await User.create({ ...req.body, password: hash });
    res.status(201).send('Successfully account opened ');
  } catch (err) {
    console.log('Error : ', err);
    sendResponseError(500, 'Something wrong please try again', res);
  }
};

const signInUser = async (req, res) => {
  const { password } = req.body;
  const email = req.body.email.toString();
  console.log(req.body);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      sendResponseError(400, 'You have to Sign up first !', res)
    }

    const same = await checkPassword(password, user.password);
    if (same) {
      const token = newToken(user);
      res.status(200).send({ status: 'ok', token });
      return
    }
    sendResponseError(400, 'InValid password !', res)
  } catch (err) {
    console.log('ERROR', err);
    sendResponseError(500, `Error ${err}`, res)
  }
};

const getUser = async (req, res) => {
  res.status(200).send({ user: req.user })
};
module.exports = { signUpUser, signInUser, getUser };
