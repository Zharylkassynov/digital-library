const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const { signToken } = require('../utils/tokens');
const { pickErrors } = require('../utils/validators');

const SALT_ROUNDS = 10;

async function register(req, res) {
  const { username, email, password } = req.body || {};
  const errors = pickErrors(req.body || {}, {
    username: { required: true },
    email: { required: true, type: 'email' },
    password: { required: true, minLength: 6 },
  });
  if (errors.length) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }
  try {
    const existingEmail = await userModel.findByEmail(email);
    if (existingEmail) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const existingUser = await userModel.findByUsername(username);
    if (existingUser) {
      return res.status(409).json({ error: 'Username already taken' });
    }
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const { id } = await userModel.create({
      username,
      email,
      passwordHash,
      role: 'user',
    });
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    if (adminEmail && email.trim().toLowerCase() === adminEmail) {
      await userModel.setRoleById(id, 'admin');
    }
    const user = await userModel.findById(id);
    const token = signToken({ id: user.id, role: user.role, username: user.username });
    return res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Registration failed' });
  }
}

async function login(req, res) {
  const { email, password } = req.body || {};
  const errors = pickErrors(req.body || {}, {
    email: { required: true, type: 'email' },
    password: { required: true },
  });
  if (errors.length) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }
  try {
    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = signToken({
      id: user.id,
      role: user.role,
      username: user.username,
    });
    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Login failed' });
  }
}

async function me(req, res) {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load profile' });
  }
}

module.exports = { register, login, me };
