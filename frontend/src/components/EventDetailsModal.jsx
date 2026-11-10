import React from 'react';
import { X, Calendar, Clock, MapPin, User, Mail, Users, Tag, CheckCircle2, BookmarkCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function EventDetailsModal({
  event,
  onClose,
  onRegister,
  onCancelRsvp,
  onEdit,
  onPromptAuth,
  onOpenAttendees,
  registeringId
}) {
  const { user, isAuthenticated, isAdmin } = useAuth();

  if (!event) return null;

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
    organizerEmail,
    capacity,
    registrationCount = 0,
    status = 'Upcoming',
    tags = [],
    bannerUrl
  } = event;

  const eventDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const spotsRemaining = Math.max(0, capacity - registrationCount);
  const isFull = spotsRemaining === 0;
  const isRegistering = registeringId === _id;

  const isUserRegistered =
    isAuthenticated &&
    user?.registeredEvents?.some((eId) => {
      const idStr = typeof eId === 'string' ? eId : eId?._id;
      return idStr === _id;
    });

  const handleRsvpClick = () => {
    if (!isAuthenticated) {
      onClose();
      onPromptAuth('register');
      return;
    }
    onRegister(_id);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className={`badge badge-${category}`}>{category}</span>
            <span className={`status-badge status-${status}`}>{status}</span>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Banner image if present */}
        {bannerUrl && (
          <div style={{ width: '100%', height: '220px', overflow: 'hidden' }}>
            <img
              src={bannerUrl}
              alt={title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Body */}
        <div className="modal-body">
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>
            {department}
          </span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.4rem 0 1rem', color: 'var(--text-main)' }}>
            {title}
          </h2>

          <div
            style={{
              background: '#f8fafc',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
              <Calendar size={18} color="var(--primary)" style={{ marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Date</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{eventDate}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
              <Clock size={18} color="var(--primary)" style={{ marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Time</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{time}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
              <MapPin size={18} color="var(--primary)" style={{ marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Venue</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{venue}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
              <Users size={18} color="var(--primary)" style={{ marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Capacity</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                  {registrationCount} / {capacity} ({spotsRemaining} spots left)
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
              <User size={18} color="var(--primary)" style={{ marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Organizer</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{organizer}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
              <Mail size={18} color="var(--primary)" style={{ marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Contact Email</div>
                <a
                  href={`mailto:${organizerEmail}`}
                  style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none' }}
                >
                  {organizerEmail}
                </a>
              </div>
            </div>
          </div>

          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            About This Event
          </h4>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.65', whiteSpace: 'pre-line', marginBottom: '1.5rem' }}>
            {description}
          </p>

          {tags && tags.length > 0 && (
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.4rem' }}>
                Tags
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {tags.map((t, idx) => (
                  <span
                    key={idx}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      background: '#f1f5f9',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)'
                    }}
                  >
                    <Tag size={12} />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
          {isAdmin && (
            <>
              <button
                onClick={() => onOpenAttendees(event)}
                className="btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                title="View registered attendees list"
              >
                <Users size={16} />
                <span>Attendees ({registrationCount})</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onEdit(event);
                }}
                className="btn-secondary"
              >
                Edit Event
              </button>
            </>
          )}

          {isUserRegistered ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.55rem 0.95rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  background: '#ecfdf5',
                  color: '#059669',
                  border: '1px solid #a7f3d0'
                }}
              >
                <BookmarkCheck size={17} />
                <span>You are registered</span>
              </div>
              <button
                onClick={() => onCancelRsvp(_id)}
                className="btn-secondary"
                style={{ color: '#ef4444', borderColor: '#fca5a5', fontSize: '0.825rem' }}
                title="Cancel your RSVP"
              >
                Cancel RSVP
              </button>
            </div>
          ) : (
            <button
              onClick={handleRsvpClick}
              disabled={isFull || status === 'Cancelled' || isRegistering}
              className="btn-primary"
              style={{
                opacity: isFull || status === 'Cancelled' ? 0.6 : 1,
                cursor: isFull || status === 'Cancelled' ? 'not-allowed' : 'pointer'
              }}
            >
              {isRegistering
                ? 'Registering...'
                : isFull
                ? 'Event is Full'
                : isAuthenticated
                ? 'Register / RSVP Now'
                : 'Sign In to RSVP'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
