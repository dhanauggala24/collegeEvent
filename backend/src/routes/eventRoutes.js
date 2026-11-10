const express = require('express');
const router = express.Router();

const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getEventStats
} = require('../controllers/eventController');

const {
  validateCreateEvent,
  validateUpdateEvent
} = require('../middleware/validateEvent');

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
router.post('/:id/register', registerForEvent);

module.exports = router;
