const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../src/config/db');
const { Event, CATEGORIES, DEPARTMENTS } = require('../src/models/Event');

describe('Database Connection & Mongoose Model Tests', () => {
  describe('Connection Module Configuration', () => {
    test('connectDB and disconnectDB functions should be exported', () => {
      expect(typeof connectDB).toBe('function');
      expect(typeof disconnectDB).toBe('function');
    });

    test('Mongoose configuration should expose connection event listeners', () => {
      expect(mongoose.connection).toBeDefined();
      expect(typeof mongoose.connection.on).toBe('function');
    });
  });

  describe('Event Model Schema & Validation', () => {
    test('Valid event model instance should pass schema validation', async () => {
      const validData = {
        title: 'AI & Robotics Annual Hackathon',
        description: 'Comprehensive 48-hour student hackathon on autonomous agents and robotics.',
        category: 'Hackathon',
        department: 'Computer Science',
        date: new Date('2026-12-10'),
        time: '09:00 AM - 09:00 PM',
        venue: 'Auditorium Hall 1',
        organizer: 'Robotics Society',
        organizerEmail: 'robotics@college.edu',
        capacity: 150
      };

      const event = new Event(validData);
      const validationError = event.validateSync();
      expect(validationError).toBeUndefined();

      // Verify defaults & virtuals
      expect(event.registrationCount).toBe(0);
      expect(event.status).toBe('Upcoming');
      expect(event.spotsRemaining).toBe(150);
      expect(event.isFull).toBe(false);
    });

    test('Should calculate virtual properties correctly when filled', () => {
      const event = new Event({
        title: 'Full Capacity Workshop',
        description: 'A popular workshop that has reached its maximum seats.',
        category: 'Workshop',
        department: 'Information Technology',
        date: new Date('2026-11-30'),
        time: '02:00 PM',
        venue: 'Lab 1',
        organizer: 'IT Dept',
        organizerEmail: 'it@college.edu',
        capacity: 30,
        registrationCount: 30
      });

      expect(event.spotsRemaining).toBe(0);
      expect(event.isFull).toBe(true);
    });

    test('Should fail validation when title is missing or too short', () => {
      const event = new Event({
        title: 'Hi', // < 3 chars
        description: 'Valid description with enough characters.',
        category: 'Technical',
        department: 'Computer Science',
        date: new Date(),
        time: '10:00 AM',
        venue: 'Room 101',
        organizer: 'Club',
        organizerEmail: 'club@college.edu',
        capacity: 50
      });

      const err = event.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.title).toBeDefined();
    });

    test('Should fail validation when category is invalid', () => {
      const event = new Event({
        title: 'Invalid Category Event',
        description: 'Valid description with enough characters.',
        category: 'NotARealCategory',
        department: 'Computer Science',
        date: new Date(),
        time: '10:00 AM',
        venue: 'Room 101',
        organizer: 'Club',
        organizerEmail: 'club@college.edu',
        capacity: 50
      });

      const err = event.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.category).toBeDefined();
    });

    test('Should fail validation when email format is invalid', () => {
      const event = new Event({
        title: 'Invalid Email Event',
        description: 'Valid description with enough characters.',
        category: 'Technical',
        department: 'Computer Science',
        date: new Date(),
        time: '10:00 AM',
        venue: 'Room 101',
        organizer: 'Club',
        organizerEmail: 'notanemailaddress',
        capacity: 50
      });

      const err = event.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.organizerEmail).toBeDefined();
    });

    test('Should fail validation when capacity is less than 1', () => {
      const event = new Event({
        title: 'Zero Capacity Event',
        description: 'Valid description with enough characters.',
        category: 'Technical',
        department: 'Computer Science',
        date: new Date(),
        time: '10:00 AM',
        venue: 'Room 101',
        organizer: 'Club',
        organizerEmail: 'club@college.edu',
        capacity: 0
      });

      const err = event.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.capacity).toBeDefined();
    });

    test('Constants CATEGORIES and DEPARTMENTS should be properly populated', () => {
      expect(CATEGORIES).toContain('Technical');
      expect(CATEGORIES).toContain('Cultural');
      expect(CATEGORIES).toContain('Sports');
      expect(CATEGORIES).toContain('Hackathon');
      expect(DEPARTMENTS).toContain('Computer Science');
      expect(DEPARTMENTS).toContain('General College');
    });
  });
});
