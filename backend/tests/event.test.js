const request = require('supertest');
const app = require('../src/app');
const { Event } = require('../src/models/Event');

describe('Server & REST API Integration Tests', () => {
  describe('GET /api/health (Server Status)', () => {
    test('Should return status 200 OK with server health information', async () => {
      const res = await request(app).get('/api/health');

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.service).toBe('college-event-portal-api');
      expect(res.body.timestamp).toBeDefined();
    });
  });

  describe('Undefined Routes (404 Handling)', () => {
    test('Should return 404 with structured error response for unknown routes', async () => {
      const res = await request(app).get('/api/non-existent-route');

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/not found/i);
    });
  });

  describe('POST /api/events (Input Validation)', () => {
    test('Should reject request with 400 Bad Request when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/events')
        .send({
          title: 'AB' // Too short (< 3 chars) and missing other fields
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
      expect(Array.isArray(res.body.errors)).toBe(true);
      expect(res.body.errors.some((err) => err.includes('Title'))).toBe(true);
      expect(res.body.errors.some((err) => err.includes('Description'))).toBe(true);
      expect(res.body.errors.some((err) => err.includes('Category'))).toBe(true);
    });

    test('Should reject request with 400 when email format is invalid', async () => {
      const res = await request(app)
        .post('/api/events')
        .send({
          title: 'Cybersecurity Seminar',
          description: 'A deep dive into application security and cryptography.',
          category: 'Seminar',
          department: 'Computer Science',
          date: '2026-12-01',
          time: '10:00 AM',
          venue: 'Room 202',
          organizer: 'Security Club',
          organizerEmail: 'invalid-email-address',
          capacity: 50
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors.some((err) => err.includes('email'))).toBe(true);
    });

    test('Should reject request with 400 when category is invalid', async () => {
      const res = await request(app)
        .post('/api/events')
        .send({
          title: 'Tech Fest',
          description: 'Valid event description with enough length.',
          category: 'InvalidCategoryName',
          department: 'Computer Science',
          date: '2026-12-01',
          time: '10:00 AM',
          venue: 'Room 202',
          organizer: 'Tech Club',
          organizerEmail: 'tech@college.edu',
          capacity: 50
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors.some((err) => err.includes('Category'))).toBe(true);
    });
  });

  describe('Controller and Database Layer Verification', () => {
    test('Event model should be defined and queryable', () => {
      expect(Event).toBeDefined();
      expect(typeof Event.find).toBe('function');
      expect(typeof Event.create).toBe('function');
      expect(typeof Event.findById).toBe('function');
      expect(typeof Event.findByIdAndUpdate).toBe('function');
      expect(typeof Event.findByIdAndDelete).toBe('function');
    });

    test('Controller methods should handle error forwarding via next(error)', async () => {
      // Mock Event.find to throw an error to verify error handler
      const spy = jest.spyOn(Event, 'find').mockImplementationOnce(() => {
        throw new Error('Simulated database error');
      });

      const res = await request(app).get('/api/events');
      expect(res.statusCode).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Simulated database error');

      spy.mockRestore();
    });

    test('Controller should successfully return formatted mock events list', async () => {
      const mockEvents = [
        {
          _id: '674e12345678901234567890',
          title: 'Annual Tech Fest',
          description: 'Premier university technology fest with 20+ competitions.',
          category: 'Technical',
          department: 'Computer Science',
          date: new Date('2026-12-15'),
          time: '10:00 AM',
          venue: 'Main Auditorium',
          organizer: 'Tech Society',
          organizerEmail: 'tech@college.edu',
          capacity: 500,
          registrationCount: 210,
          status: 'Upcoming'
        }
      ];

      const spyFind = jest.spyOn(Event, 'find').mockReturnValueOnce({
        sort: () => ({
          skip: () => ({
            limit: () => ({
              lean: () => Promise.resolve(mockEvents)
            })
          })
        })
      });

      const spyCount = jest.spyOn(Event, 'countDocuments').mockResolvedValueOnce(1);

      const res = await request(app).get('/api/events');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].title).toBe('Annual Tech Fest');
      expect(res.body.pagination.total).toBe(1);

      spyFind.mockRestore();
      spyCount.mockRestore();
    });
  });
});
