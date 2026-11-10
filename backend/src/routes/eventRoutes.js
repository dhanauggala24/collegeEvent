const express = require('express');
const router = express.Router();

const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  cancelRsvp,
  getEventAttendees,
  getEventStats
} = require('../controllers/eventController');

const {
  validateCreateEvent,
  validateUpdateEvent
} = require('../middleware/validateEvent');
const { protect, optionalAuth, authorize } = require('../middleware/authMiddleware');

// Statistics route (must precede /:id)
router.get('/stats', getEventStats);

// Main CRUD routes
router
  .route('/')
  .get(getEvents)
  .post(validateCreateEvent, createEvent);

router
  .route('/:id')
  .get(getEventById)
  .put(validateUpdateEvent, updateEvent)
  .delete(deleteEvent);

// Registration endpoint
router.post('/:id/register', optionalAuth, registerForEvent);

// Cancel RSVP endpoint
router.post('/:id/cancel-rsvp', protect, cancelRsvp);

// Attendee list endpoint (Admin only)
router.get('/:id/attendees', protect, authorize('admin'), getEventAttendees);

module.exports = router;
