import React, { useState, useEffect } from 'react';
import { X, Calendar, PlusCircle, Check } from 'lucide-react';

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

export default function EventFormModal({ isOpen, onClose, onSubmit, eventToEdit }) {
  if (!isOpen) return null;

  const isEditing = Boolean(eventToEdit);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technical',
    department: 'Computer Science',
    date: '',
    time: '',
    venue: '',
    organizer: '',
    organizerEmail: '',
    capacity: 100,
    bannerUrl: '',
    tags: '',
    status: 'Upcoming'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (eventToEdit) {
      // Format date for <input type="date" />
      const dateStr = eventToEdit.date
        ? new Date(eventToEdit.date).toISOString().split('T')[0]
        : '';

      setFormData({
        title: eventToEdit.title || '',
        description: eventToEdit.description || '',
        category: eventToEdit.category || 'Technical',
        department: eventToEdit.department || 'Computer Science',
        date: dateStr,
        time: eventToEdit.time || '',
        venue: eventToEdit.venue || '',
        organizer: eventToEdit.organizer || '',
        organizerEmail: eventToEdit.organizerEmail || '',
        capacity: eventToEdit.capacity || 100,
        bannerUrl: eventToEdit.bannerUrl || '',
        tags: Array.isArray(eventToEdit.tags) ? eventToEdit.tags.join(', ') : '',
        status: eventToEdit.status || 'Upcoming'
      });
    } else {
      // Reset defaults
      setFormData({
        title: '',
        description: '',
        category: 'Technical',
        department: 'Computer Science',
        date: '',
        time: '10:00 AM - 01:00 PM',
        venue: '',
        organizer: '',
        organizerEmail: '',
        capacity: 100,
        bannerUrl: '',
        tags: '',
        status: 'Upcoming'
      });
    }
    setErrors({});
  }, [eventToEdit, isOpen]);

  const validate = () => {
    const errs = {};
    if (!formData.title.trim() || formData.title.trim().length < 3) {
      errs.title = 'Title must be at least 3 characters.';
    }
    if (!formData.description.trim() || formData.description.trim().length < 10) {
      errs.description = 'Description must be at least 10 characters.';
    }
    if (!formData.date) {
      errs.date = 'Event date is required.';
    }
    if (!formData.time.trim()) {
      errs.time = 'Event time is required.';
    }
    if (!formData.venue.trim()) {
      errs.venue = 'Venue / Location is required.';
    }
    if (!formData.organizer.trim()) {
      errs.organizer = 'Organizer is required.';
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!formData.organizerEmail.trim() || !emailRegex.test(formData.organizerEmail)) {
      errs.organizerEmail = 'A valid organizer email address is required.';
    }
    if (!formData.capacity || Number(formData.capacity) <= 0) {
      errs.capacity = 'Capacity must be at least 1.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await onSubmit(formData, eventToEdit?._id);
      onClose();
    } catch (err) {
      // Handled in parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {isEditing ? 'Edit Event Details' : 'Publish New College Event'}
          </h3>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              {/* Title */}
              <div className="form-group col-span-2">
                <label className="form-label">
                  Event Title <span className="req">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="e.g. Annual Tech Symposium 2026"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
                {errors.title && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors.title}</span>}
              </div>

              {/* Category */}
              <div className="form-group">
                <label className="form-label">
                  Category <span className="req">*</span>
                </label>
                <select
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department */}
              <div className="form-group">
                <label className="form-label">
                  Host Department <span className="req">*</span>
                </label>
                <select
                  name="department"
                  className="form-control"
                  value={formData.department}
                  onChange={handleChange}
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div className="form-group">
                <label className="form-label">
                  Date <span className="req">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  className="form-control"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
                {errors.date && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors.date}</span>}
              </div>

              {/* Time */}
              <div className="form-group">
                <label className="form-label">
                  Time / Duration <span className="req">*</span>
                </label>
                <input
                  type="text"
                  name="time"
                  className="form-control"
                  placeholder="e.g. 10:00 AM - 01:00 PM"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
                {errors.time && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors.time}</span>}
              </div>

              {/* Venue */}
              <div className="form-group">
                <label className="form-label">
                  Venue / Location <span className="req">*</span>
                </label>
                <input
                  type="text"
                  name="venue"
                  className="form-control"
                  placeholder="e.g. Auditorium Block A / Seminar Hall"
                  value={formData.venue}
                  onChange={handleChange}
                  required
                />
                {errors.venue && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors.venue}</span>}
              </div>

              {/* Capacity */}
              <div className="form-group">
                <label className="form-label">
                  Maximum Capacity <span className="req">*</span>
                </label>
                <input
                  type="number"
                  name="capacity"
                  min="1"
                  className="form-control"
                  placeholder="e.g. 150"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                />
                {errors.capacity && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors.capacity}</span>}
              </div>

              {/* Organizer Name */}
              <div className="form-group">
                <label className="form-label">
                  Organizer Name / Club <span className="req">*</span>
                </label>
                <input
                  type="text"
                  name="organizer"
                  className="form-control"
                  placeholder="e.g. Robotics Club"
                  value={formData.organizer}
                  onChange={handleChange}
                  required
                />
                {errors.organizer && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors.organizer}</span>}
              </div>

              {/* Organizer Email */}
              <div className="form-group">
                <label className="form-label">
                  Organizer Email <span className="req">*</span>
                </label>
                <input
                  type="email"
                  name="organizerEmail"
                  className="form-control"
                  placeholder="e.g. club@college.edu"
                  value={formData.organizerEmail}
                  onChange={handleChange}
                  required
                />
                {errors.organizerEmail && (
                  <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors.organizerEmail}</span>
                )}
              </div>

              {/* Status (if editing) */}
              {isEditing && (
                <div className="form-group col-span-2">
                  <label className="form-label">Event Status</label>
                  <select
                    name="status"
                    className="form-control"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    {STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Description */}
              <div className="form-group col-span-2">
                <label className="form-label">
                  Event Description <span className="req">*</span>
                </label>
                <textarea
                  name="description"
                  className="form-control"
                  rows={4}
                  placeholder="Detailed schedule, prerequisites, rules, guest speaker details, etc."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
                {errors.description && (
                  <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors.description}</span>
                )}
              </div>

              {/* Banner URL */}
              <div className="form-group col-span-2">
                <label className="form-label">Banner Image URL (Optional)</label>
                <input
                  type="url"
                  name="bannerUrl"
                  className="form-control"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.bannerUrl}
                  onChange={handleChange}
                />
              </div>

              {/* Tags */}
              <div className="form-group col-span-2">
                <label className="form-label">Tags (Comma-separated, optional)</label>
                <input
                  type="text"
                  name="tags"
                  className="form-control"
                  placeholder="e.g. hackathon, python, artificial intelligence"
                  value={formData.tags}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? (
                'Saving...'
              ) : isEditing ? (
                'Save Changes'
              ) : (
                <>
                  <Check size={16} />
                  <span>Publish Event</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
