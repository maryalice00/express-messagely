/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 */
router.post('/login', async function (req, res, next) {
  try {
    const { username, password } = req.body;
    if (await User.authenticate(username, password)) {
      await User.updateLoginTimestamp(username);
      const token = jwt.sign({ username }, SECRET_KEY);
      return res.json({ token });
    } else {
      throw new Error('Invalid username/password');
    }
  } catch (err) {
    return next(err);
  }
});

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
router.post('/register', async function (req, res, next) {
  try {
    const user = await User.register(req.body);
    await User.updateLoginTimestamp(user.username);
    const token = jwt.sign({ username: user.username }, SECRET_KEY);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
