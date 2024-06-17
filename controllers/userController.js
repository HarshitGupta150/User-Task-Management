const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

/**
 * Registers a new user.
 * @param {object} req - Request object from express.
 * @param {object} res - Response object from express.
 * @returns {Promise} - Resolves with an json object with the registered user data in the database or rejects with an error
 * message if there is an error.
*/
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    }

    return res.status(400).json({ message: 'Invalid user data' });

  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Failed to register user' });
  }
}

/**
 * Authenticates a user and generates a JWT token upon successful authentication.
 * @param {object} req - Request object from express.
 * @param {object} res - Response object from express.
 * @returns {Promise} - Resolves with an json object with the authentication token or rejects with an error
 * message if there is an error.
*/
const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      return res.status(200).json({ token });
    }

    return res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    console.error('Error in authenticating user:', error);
    return res.status(500).json({ message: 'Failed to authenticate user' });
  }
}

module.exports = {
  registerUser,
  authUser,
}