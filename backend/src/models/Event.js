const mongoose = require('mongoose');

const CATEGORIES = [
  'Technical',
  'Cultural',
  'Sports',
  'Workshop',
  'Seminar',
  'Hackathon',
  'Webinar',
  'Other'
];

const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics & Comm',
  'Mechanical',
  'Civil',
  'Electrical',
  'Management',
  'Biotechnology',
  'General College'
];

const STATUSES = ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'];

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters long']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: CATEGORIES,
        message: '{VALUE} is not a valid event category'
      }
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: {
        values: DEPARTMENTS,
        message: '{VALUE} is not a valid department'
      }
    },
    date: {
      type: Date,
      required: [true, 'Event date is required']
    },
    time: {
      type: String,
      required: [true, 'Event time or duration is required'],
      trim: true
    },
    venue: {
      type: String,
      required: [true, 'Venue / Location is required'],
      trim: true
    },
    organizer: {
      type: String,
      required: [true, 'Organizer name or club is required'],
      trim: true
    },
    organizerEmail: {
      type: String,
      required: [true, 'Organizer contact email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    capacity: {
      type: Number,
      required: [true, 'Max capacity is required'],
      min: [1, 'Capacity must be at least 1']
    },
    registrationCount: {
      type: Number,
      default: 0,
      min: [0, 'Registration count cannot be negative']
    },
    status: {
      type: String,
      enum: STATUSES,
      default: 'Upcoming'
    },
    bannerUrl: {
      type: String,
      trim: true,
      default: ''
    },
    tags: {
      type: [String],
      default: []
    },
    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual property: spots remaining
eventSchema.virtual('spotsRemaining').get(function () {
  return Math.max(0, this.capacity - this.registrationCount);
});

// Virtual property: is fully booked
eventSchema.virtual('isFull').get(function () {
  return this.registrationCount >= this.capacity;
});

// Indexes for high performance filtering & searching
eventSchema.index({ date: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ department: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ title: 'text', description: 'text', venue: 'text' });

module.exports = {
  Event: mongoose.model('Event', eventSchema),
  CATEGORIES,
  DEPARTMENTS,
  STATUSES
};
