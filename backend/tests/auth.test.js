const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const { User, ROLES } = require('../src/models/User');

describe('Authentication & Authorization Tests (Student & Admin)', () => {
  describe('User Model Schema & Methods', () => {
    test('User model should have student and admin in ROLES', () => {
      expect(ROLES).toContain('student');
      expect(ROLES).toContain('admin');
    });

    test('generateAuthToken should produce a valid JWT containing user info', () => {
      const mockUser = new User({
        name: 'Jane Student',
        email: 'jane@college.edu',
        password: 'Password123',
        role: 'student',
        department: 'Computer Science'
      });

      const token = mockUser.generateAuthToken();
      expect(typeof token).toBe('string');

      const decoded = jwt.decode(token);
      expect(decoded.email).toBe('jane@college.edu');
      expect(decoded.role).toBe('student');
      expect(decoded.name).toBe('Jane Student');
    });

    test('matchPassword should verify bcrypt hashed passwords', async () => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Secret123', salt);

      const user = new User({
        name: 'Prof. Admin',
        email: 'admin@college.edu',
        password: hashedPassword,
        role: 'admin'
      });

      const isMatch = await user.matchPassword('Secret123');
      expect(isMatch).toBe(true);

      const isWrong = await user.matchPassword('WrongPass');
      expect(isWrong).toBe(false);
    });

    test('User schema should fail validation when email is invalid', () => {
      const user = new User({
        name: 'Test User',
        email: 'not-an-email',
        password: 'Password123',
        role: 'student'
      });

      const err = user.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.email).toBeDefined();
    });

    test('User schema should fail validation when role is invalid', () => {
      const user = new User({
        name: 'Test User',
        email: 'valid@college.edu',
        password: 'Password123',
        role: 'super_guest_invalid'
      });

      const err = user.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.role).toBeDefined();
    });
  });

  describe('POST /api/auth/register (Validation & Logic)', () => {
    test('Should return 400 when required fields are missing', async () => {
      const res = await request(app).post('/api/auth/register').send({
        email: 'incomplete@college.edu'
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/provide full name, email, and password/i);
    });

    test('Should return 400 when password is shorter than 6 characters', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'John Doe',
        email: 'john@college.edu',
        password: '123'
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/at least 6 characters/i);
    });

    test('Should successfully register a new student user via controller', async () => {
      const mockCreatedUser = new User({
        name: 'Alice Student',
        email: 'alice@college.edu',
        password: 'hashed_password',
        role: 'student',
        department: 'Computer Science',
        studentId: 'CS2026-001',
        registeredEvents: []
      });

      const spyFindOne = jest.spyOn(User, 'findOne').mockResolvedValueOnce(null);
      const spyCreate = jest.spyOn(User, 'create').mockResolvedValueOnce(mockCreatedUser);

      const res = await request(app).post('/api/auth/register').send({
        name: 'Alice Student',
        email: 'alice@college.edu',
        password: 'Password123',
        role: 'student',
        department: 'Computer Science',
        studentId: 'CS2026-001'
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.role).toBe('student');
      expect(res.body.user.email).toBe('alice@college.edu');

      spyFindOne.mockRestore();
      spyCreate.mockRestore();
    });

    test('Should successfully register a new faculty admin user via controller', async () => {
      const mockCreatedAdmin = new User({
        name: 'Prof. Ada Lovelace',
        email: 'ada@college.edu',
        password: 'hashed_password',
        role: 'admin',
        department: 'Computer Science',
        registeredEvents: []
      });

      const spyFindOne = jest.spyOn(User, 'findOne').mockResolvedValueOnce(null);
      const spyCreate = jest.spyOn(User, 'create').mockResolvedValueOnce(mockCreatedAdmin);

      const res = await request(app).post('/api/auth/register').send({
        name: 'Prof. Ada Lovelace',
        email: 'ada@college.edu',
        password: 'Password123',
        role: 'admin',
        department: 'Computer Science'
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.role).toBe('admin');

      spyFindOne.mockRestore();
      spyCreate.mockRestore();
    });
  });

  describe('POST /api/auth/login (Validation & Logic)', () => {
    test('Should return 400 when email or password is missing', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'test@college.edu'
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('Should return 401 when user is not found', async () => {
      const spy = jest.spyOn(User, 'findOne').mockReturnValueOnce({
        select: () => Promise.resolve(null)
      });

      const res = await request(app).post('/api/auth/login').send({
        email: 'nonexistent@college.edu',
        password: 'Password123'
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/invalid/i);

      spy.mockRestore();
    });

    test('Should return 200 with JWT token when credentials are valid', async () => {
      const mockUser = new User({
        name: 'Logged In Student',
        email: 'student@college.edu',
        password: 'hashed_password',
        role: 'student',
        department: 'Computer Science',
        registeredEvents: []
      });

      mockUser.matchPassword = jest.fn().mockResolvedValueOnce(true);

      const spy = jest.spyOn(User, 'findOne').mockReturnValueOnce({
        select: () => Promise.resolve(mockUser)
      });

      const res = await request(app).post('/api/auth/login').send({
        email: 'student@college.edu',
        password: 'Password123'
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.name).toBe('Logged In Student');

      spy.mockRestore();
    });
  });
});
