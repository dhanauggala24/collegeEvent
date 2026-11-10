import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Edit2,
  Trash2,
  ArrowRight,
  CheckCircle2,
  BookmarkCheck,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function EventCard({
  event,
  onViewDetails,
  onEdit,
  onDelete,
  onRegister,
  onPromptAuth,
  registeringId
}) {
  const { user, isAuthenticated, isAdmin } = useAuth();

  const {
    _id,
    title,
    description,
    category,
    department,
    date,
    time,
    venue,
    organizer,
    capacity,
    registrationCount = 0,
    status = 'Upcoming',
    bannerUrl,
    isFeatured
  } = event;

  // Format date components for floating date tile
  const eventDateObj = new Date(date);
  const monthStr = eventDateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const dayStr = eventDateObj.getDate();
  const weekdayStr = eventDateObj.toLocaleDateString('en-US', { weekday: 'short' });

  const spotsRemaining = Math.max(0, capacity - registrationCount);
  const percentFilled = Math.min(100, Math.round((registrationCount / capacity) * 100));
  const isFull = spotsRemaining === 0;
  const isRegistering = registeringId === _id;

  // Check if current user is already registered for this event
  const isUserRegistered =
    isAuthenticated &&
    user?.registeredEvents?.some((eId) => {
      const idStr = typeof eId === 'string' ? eId : eId?._id;
      return idStr === _id;
    });

  // Dynamic progress gradient
  const getProgressGradient = () => {
    if (percentFilled >= 100) return 'linear-gradient(90deg, #ef4444, #dc2626)';
    if (percentFilled >= 80) return 'linear-gradient(90deg, #f59e0b, #d97706)';
    return 'linear-gradient(90deg, #6366f1, #8b5cf6)';
  };

  // Default high-res college event fallback banners by category
  const categoryBanners = {
    Hackathon: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    Workshop: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    Cultural: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    Technical: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    Sports: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    Seminar: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80'
  };

  const defaultBanner =
    categoryBanners[category] ||
    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80';

  const handleRsvpClick = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      onPromptAuth('register');
      return;
    }
    onRegister(_id);
  };

  return (
    <div className="event-card-modern" onClick={() => onViewDetails(event)}>
      {/* Banner Media Container */}
      <div className="card-media-wrapper">
        <img
          src={bannerUrl && bannerUrl.startsWith('http') ? bannerUrl : defaultBanner}
          alt={title}
          className="card-media-img"
          loading="lazy"
        />
        <div className="card-media-overlay" />

        {/* Floating Calendar Date Badge */}
        <div className="date-badge-floating">
          <span className="date-month">{monthStr}</span>
          <span className="date-day">{dayStr}</span>
        </div>

        {/* Top Right Badges */}
        <div className="card-top-badges">
          {isFeatured && (
            <span className="badge-featured">
              <Sparkles size={11} />
              <span>Featured</span>
            </span>
          )}
          <span className={`badge-pill badge-${category || 'Other'}`}>{category}</span>
        </div>

        {/* Bottom Venue Strip */}
        <div className="card-media-footer">
          <div className="venue-chip">
            <MapPin size={13} />
            <span>{venue}</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="card-content-modern">
        {/* Department & Status */}
        <div className="card-header-row">
          <span className="dept-tag">
            <span className="dept-dot"></span>
            {department}
          </span>
          <span className={`status-chip status-${status}`}>{status}</span>
        </div>

        {/* Title */}
        <h3 className="event-title-modern" title={title}>
          {title}
        </h3>

        {/* Description snippet */}
        <p className="event-desc-modern">{description}</p>

        {/* Timing and Organizer */}
        <div className="event-info-chips">
          <div className="info-chip">
            <Clock size={14} className="info-icon" />
            <span>{time}</span>
          </div>
          <div className="info-chip">
            <User size={14} className="info-icon" />
            <span>By {organizer}</span>
          </div>
        </div>

        {/* Capacity Progress Bar */}
        <div className="event-capacity-section">
          <div className="capacity-meta-row">
            <span className="capacity-count">
              <strong>{registrationCount}</strong> / {capacity} seats
            </span>
            <span className={`capacity-status-text ${isFull ? 'full' : ''}`}>
              {isFull ? 'Sold Out' : `${spotsRemaining} left (${percentFilled}%)`}
            </span>
          </div>
          <div className="capacity-track">
            <div
              className="capacity-fill"
              style={{
                width: `${percentFilled}%`,
                background: getProgressGradient()
              }}
            />
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="card-actions-modern" onClick={(e) => e.stopPropagation()}>
        {/* Admin Actions */}
        <div className="admin-actions-left">
          {isAdmin && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(event);
                }}
                className="action-icon-btn edit"
                title="Edit event"
                aria-label="Edit event"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(_id, title);
                }}
                className="action-icon-btn delete"
                title="Delete event"
                aria-label="Delete event"
              >
                <Trash2 size={14} />
              </button>
            </>
          )}

          <button
            onClick={() => onViewDetails(event)}
            className="btn-details-link"
            title="View full event details"
          >
            <span>Details</span>
          </button>
        </div>

        {/* Primary RSVP Action */}
        <div className="rsvp-action-right">
          {isUserRegistered ? (
            <div className="registered-badge-pill">
              <BookmarkCheck size={14} />
              <span>Registered</span>
            </div>
          ) : (
            <button
              onClick={handleRsvpClick}
              disabled={isFull || status === 'Cancelled' || isRegistering}
              className={`btn-rsvp-primary ${isFull ? 'disabled' : ''}`}
            >
              {isRegistering ? (
                'Saving...'
              ) : isFull ? (
                'Full'
              ) : (
                <>
                  <span>{isAuthenticated ? 'RSVP' : 'RSVP Now'}</span>
                  <ArrowRight size={14} className="arrow-rsvp" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
