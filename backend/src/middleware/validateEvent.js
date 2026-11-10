const { CATEGORIES, DEPARTMENTS, STATUSES } = require('../models/Event');

/**
 * Middleware to validate event payload for create and update requests
 */
const validateEventInput = (isUpdate = false) => {
  return (req, res, next) => {
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
      status
    } = req.body;

    const errors = [];

    // Helper: validate required strings
    const checkRequiredString = (val, name, min = 1, max = 500) => {
      if (!isUpdate || val !== undefined) {
        if (!val || typeof val !== 'string' || val.trim().length === 0) {
          errors.push(`${name} is required and cannot be empty.`);
        } else if (val.trim().length < min) {
          errors.push(`${name} must be at least ${min} characters long.`);
        } else if (val.trim().length > max) {
          errors.push(`${name} cannot exceed ${max} characters.`);
        }
      }
    };

    checkRequiredString(title, 'Title', 3, 120);
    checkRequiredString(description, 'Description', 10, 5000);
    checkRequiredString(time, 'Time', 2, 80);
    checkRequiredString(venue, 'Venue', 2, 120);
    checkRequiredString(organizer, 'Organizer', 2, 100);

    // Validate Category
    if (!isUpdate || category !== undefined) {
      if (!category || !CATEGORIES.includes(category)) {
        errors.push(`Category must be one of: ${CATEGORIES.join(', ')}`);
      }
    }

    // Validate Department
    if (!isUpdate || department !== undefined) {
      if (!department || !DEPARTMENTS.includes(department)) {
        errors.push(`Department must be one of: ${DEPARTMENTS.join(', ')}`);
      }
    }

    // Validate Date
    if (!isUpdate || date !== undefined) {
      if (!date) {
        errors.push('Date is required.');
      } else {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
          errors.push('Date must be a valid date string (e.g., YYYY-MM-DD).');
        }
      }
    }

    // Validate Organizer Email
    if (!isUpdate || organizerEmail !== undefined) {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!organizerEmail || !emailRegex.test(organizerEmail)) {
        errors.push('A valid organizer email address is required.');
      }
    }

    // Validate Capacity
    if (!isUpdate || capacity !== undefined) {
      const numCapacity = Number(capacity);
      if (isNaN(numCapacity) || numCapacity <= 0 || !Number.isInteger(numCapacity)) {
        errors.push('Capacity must be a positive integer.');
      }
    }

    // Validate Status (if provided)
    if (status !== undefined) {
      if (!STATUSES.includes(status)) {
        errors.push(`Status must be one of: ${STATUSES.join(', ')}`);
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    next();
  };
};

module.exports = {
  validateCreateEvent: validateEventInput(false),
  validateUpdateEvent: validateEventInput(true)
};
