const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto=require('crypto')
const login = async (req, res) => {
  try {
    console.log(req.body);
    
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.status(200).json({ token,user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};




const signUp = async (req, res) => {
  try {
    console.log(req.body);
    
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword
    });

    await newUser.save();

    // const otp = await createOTP(email);

    const token = jwt.sign({ userId: newUser._id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.status(201).json({ token, message: 'User registered successfully',user:newUser});
  } catch (error) {
    console.log(error.message);
    
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { login, signUp};
