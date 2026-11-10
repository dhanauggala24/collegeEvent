const { Event, CATEGORIES, DEPARTMENTS } = require('../models/Event');

/**
 * @desc    Get all events with filtering, search, sorting & pagination
 * @route   GET /api/events
 * @access  Public
 */
const getEvents = async (req, res, next) => {
  try {
    const {
      search,
      category,
      department,
      status,
      upcomingOnly,
      sortBy = 'date',
      sortOrder = 'asc',
      page = 1,
      limit = 20
    } = req.query;

    const query = {};

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by department
    if (department && department !== 'All') {
      query.department = department;
    }

    // Filter by status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Filter upcoming events only (date >= today or status = 'Upcoming')
    if (upcomingOnly === 'true' || upcomingOnly === true) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      query.date = { $gte: today };
      query.status = { $ne: 'Cancelled' };
    }

    // Search query on title, description, venue, or organizer
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { venue: searchRegex },
        { organizer: searchRegex }
      ];
    }

    // Sorting
    const sort = {};
    const validSortFields = ['date', 'createdAt', 'title', 'capacity', 'registrationCount'];
    const field = validSortFields.includes(sortBy) ? sortBy : 'date';
    sort[field] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [events, total] = await Promise.all([
      Event.find(query).sort(sort).skip(skip).limit(limitNum).lean({ virtuals: true }),
      Event.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: events,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
        hasMore: pageNum * limitNum < total
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single event by ID
 * @route   GET /api/events/:id
 * @access  Public
 */
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event not found with id ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new event
 * @route   POST /api/events
 * @access  Public
 */
const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      department,
      date,
      time,
      venue,
      organizer,
      organizerEmail,
      capacity,
      bannerUrl,
      tags,
      isFeatured
    } = req.body;

    const event = await Event.create({
      title: title.trim(),
      description: description.trim(),
      category,
      department,
      date: new Date(date),
      time: time.trim(),
      venue: venue.trim(),
      organizer: organizer.trim(),
      organizerEmail: organizerEmail.trim().toLowerCase(),
      capacity: Number(capacity),
      bannerUrl: bannerUrl ? bannerUrl.trim() : '',
      tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      isFeatured: Boolean(isFeatured),
      registrationCount: 0,
      status: 'Upcoming'
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an event
 * @route   PUT /api/events/:id
 * @access  Public
 */
const updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event not found with id ${req.params.id}`
      });
    }

    const updates = { ...req.body };

    if (updates.date) {
      updates.date = new Date(updates.date);
    }
    if (updates.capacity !== undefined) {
      updates.capacity = Number(updates.capacity);
      if (updates.capacity < event.registrationCount) {
        return res.status(400).json({
          success: false,
          message: `Capacity cannot be lower than current registrations (${event.registrationCount})`
        });
      }
    }
    if (updates.tags && typeof updates.tags === 'string') {
      updates.tags = updates.tags.split(',').map(t => t.trim()).filter(Boolean);
    }

    event = await Event.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an event
 * @route   DELETE /api/events/:id
 * @access  Public
 */
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event not found with id ${req.params.id}`
      });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Register for an event (increments registration count)
 * @route   POST /api/events/:id/register
 * @access  Public
 */
const registerForEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event not found with id ${req.params.id}`
      });
    }

    if (event.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot register for a cancelled event'
      });
    }

    if (event.registrationCount >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Event is at full capacity'
      });
    }

    // Check if user is logged in and already registered
    if (req.user && req.user.registeredEvents) {
      const alreadyRegistered = req.user.registeredEvents.some(
        (eId) => eId.toString() === event._id.toString()
      );
      if (alreadyRegistered) {
        return res.status(400).json({
          success: false,
          message: 'You have already registered for this event!'
        });
      }
    }

    // Atomic increment
    event.registrationCount += 1;
    await event.save();

    // Link event to student account if logged in
    if (req.user) {
      req.user.registeredEvents.push(event._id);
      await req.user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Registration successful!',
      data: event
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get event analytics / portal statistics
 * @route   GET /api/events/stats
 * @access  Public
 */
const getEventStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalEvents, upcomingEvents, totalRegistrations, categoryStats] = await Promise.all([
      Event.countDocuments(),
      Event.countDocuments({ date: { $gte: today }, status: { $ne: 'Cancelled' } }),
      Event.aggregate([
        { $group: { _id: null, total: { $sum: '$registrationCount' } } }
      ]),
      Event.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalEvents,
        upcomingEvents,
        totalRegistrations: totalRegistrations[0]?.total || 0,
        categoryBreakdown: categoryStats.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getEventStats
};
