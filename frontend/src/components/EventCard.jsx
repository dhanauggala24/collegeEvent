import React from 'react';
import { Calendar, Clock, MapPin, User, Edit2, Trash2, ArrowRight, CheckCircle2, BookmarkCheck } from 'lucide-react';
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
  const { user, isAuthenticated, isAdmin, isStudent } = useAuth();

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
    bannerUrl
  } = event;

  // Format date
  const eventDate = new Date(date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const spotsRemaining = Math.max(0, capacity - registrationCount);
  const percentFilled = Math.min(100, Math.round((registrationCount / capacity) * 100));
  const isFull = spotsRemaining === 0;
  const isRegistering = registeringId === _id;

  // Check if current logged-in user is already registered for this event
  const isUserRegistered =
    isAuthenticated &&
    user?.registeredEvents?.some((eId) => {
      const idStr = typeof eId === 'string' ? eId : eId?._id;
      return idStr === _id;
    });

  // Progress bar color based on fullness
  const getProgressColor = () => {
    if (percentFilled >= 100) return '#ef4444'; // Red
    if (percentFilled >= 80) return '#f59e0b'; // Amber
    return '#10b981'; // Green
  };

  // Fallback banner image if not provided
  const defaultBanner =
    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80';

  const handleRsvpClick = () => {
    if (!isAuthenticated) {
      onPromptAuth('register');
      return;
    }
    onRegister(_id);
  };

  return (
    <div className="event-card">
      {/* Banner */}
      <div
        className="card-banner"
        style={{
          backgroundImage: `url(${bannerUrl && bannerUrl.startsWith('http') ? bannerUrl : defaultBanner})`
        }}
      >
        <div className="card-banner-overlay">
          <span className={`badge badge-${category || 'Other'}`}>{category}</span>
          <span className={`status-badge status-${status}`}>{status}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body">
        <div className="card-department">{department}</div>
        <h3 className="card-title" title={title}>
          {title}
        </h3>
        <p className="card-desc">{description}</p>

        {/* Metadata */}
        <div className="card-meta-list">
          <div className="card-meta-item">
            <Calendar size={16} />
            <span>{formattedDate}</span>
          </div>
          <div className="card-meta-item">
            <Clock size={16} />
            <span>{time}</span>
          </div>
          <div className="card-meta-item">
            <MapPin size={16} />
            <span>{venue}</span>
          </div>
          <div className="card-meta-item">
            <User size={16} />
            <span>Organized by {organizer}</span>
          </div>
        </div>

        {/* Capacity Bar */}
        <div className="capacity-container">
          <div className="capacity-labels">
            <span>
              {registrationCount} / {capacity} Registered
            </span>
            <span style={{ color: isFull ? 'var(--danger)' : 'var(--text-muted)' }}>
              {isFull ? 'Sold Out' : `${spotsRemaining} spots left`}
            </span>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{
                width: `${percentFilled}%`,
                backgroundColor: getProgressColor()
              }}
            />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="card-footer">
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {/* Admin only: Edit and Delete buttons */}
          {isAdmin && (
            <>
              <button
                onClick={() => onEdit(event)}
                className="btn-card-action"
                style={{ color: '#475569', background: '#f1f5f9' }}
                title="Edit event"
                aria-label="Edit event"
              >
                <Edit2 size={15} />
              </button>
              <button
                onClick={() => onDelete(_id, title)}
                className="btn-card-action"
                style={{ color: '#ef4444', background: '#fef2f2' }}
                title="Delete event"
                aria-label="Delete event"
              >
                <Trash2 size={15} />
              </button>
            </>
          )}

          <button
            onClick={() => onViewDetails(event)}
            className="btn-card-action"
            style={{ color: 'var(--text-main)', background: '#f1f5f9' }}
            title="View details"
          >
            <span>Details</span>
          </button>
        </div>

        {/* RSVP Button / Status */}
        {isUserRegistered ? (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: 700,
              background: '#ecfdf5',
              color: '#059669',
              border: '1px solid #a7f3d0'
            }}
          >
            <BookmarkCheck size={15} />
            <span>Registered</span>
          </span>
        ) : (
          <button
            onClick={handleRsvpClick}
            disabled={isFull || status === 'Cancelled' || isRegistering}
            className="btn-primary"
            style={{
              padding: '0.45rem 0.9rem',
              fontSize: '0.8rem',
              opacity: isFull || status === 'Cancelled' ? 0.6 : 1,
              cursor: isFull || status === 'Cancelled' ? 'not-allowed' : 'pointer'
            }}
          >
            {isRegistering ? (
              'Registering...'
            ) : isFull ? (
              'Full'
            ) : (
              <>
                <span>{isAuthenticated ? 'RSVP' : 'Sign In to RSVP'}</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
