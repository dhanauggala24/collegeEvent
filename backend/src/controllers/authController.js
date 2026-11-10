const { User, ROLES } = require('../models/User');

/**
 * @desc    Register a new user (Student or Admin)
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role = 'student',
      department = 'Computer Science',
      studentId = '',
      adminSecret = ''
    } = req.body;

    // Basic payload check
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, and password.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const normalizedRole = role.toLowerCase() === 'admin' ? 'admin' : 'student';

    // Verify admin secret if signing up as Admin (optional security check with default fallback)
    const EXPECTED_ADMIN_CODE = process.env.ADMIN_SIGNUP_SECRET || 'ADMIN2026';
    if (normalizedRole === 'admin' && adminSecret && adminSecret !== EXPECTED_ADMIN_CODE) {
      return res.status(403).json({
        success: false,
        message: 'Invalid Admin Security Key. Please contact the college portal administrator.'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.'
      });
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: normalizedRole,
      department: department.trim(),
      studentId: studentId.trim(),
      registeredEvents: []
    });

    const token = user.generateAuthToken();

    res.status(201).json({
      success: true,
      message: `${normalizedRole === 'admin' ? 'Faculty Admin' : 'Student'} account created successfully!`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        studentId: user.studentId,
        registeredEvents: user.registeredEvents
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user & return JWT token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.'
      });
    }

    // Find user and explicitly select password field
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = user.generateAuthToken();

    res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        studentId: user.studentId,
        registeredEvents: user.registeredEvents
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged in user profile with registered events
 * @route   GET /api/auth/me
 * @access  Private (Bearer token)
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('registeredEvents');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        studentId: user.studentId,
        registeredEvents: user.registeredEvents
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe
};
