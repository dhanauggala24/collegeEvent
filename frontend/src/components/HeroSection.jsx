import React from 'react';
import { Sparkles, Calendar, BookmarkCheck, ArrowRight, Compass, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function HeroSection({
  onSelectCategory,
  onOpenCreateModal,
  onOpenAuthModal,
  activeCategory
}) {
  const { user, isAuthenticated, isStudent, isAdmin } = useAuth();

  const quickPills = [
    { label: 'All Events', val: 'All', icon: '🌟' },
    { label: 'Hackathons', val: 'Hackathon', icon: '⚡' },
    { label: 'Cultural Gala', val: 'Cultural', icon: '🎭' },
    { label: 'Workshops', val: 'Workshop', icon: '🛠️' },
    { label: 'Technical', val: 'Technical', icon: '💻' },
    { label: 'Sports', val: 'Sports', icon: '🏆' },
    { label: 'Seminars', val: 'Seminar', icon: '🎤' }
  ];

  return (
    <section className="hero-banner">
      <div className="hero-glow-1"></div>
      <div className="hero-glow-2"></div>

      <div className="hero-content">
        {/* Top Announcement Pill */}
        <div className="hero-pill">
          <Sparkles size={14} className="hero-sparkle-icon" />
          <span>CampusConnect • University Event Portal 2026-27</span>
        </div>

        {/* Main Headline */}
        <h1 className="hero-title">
          Experience Campus Life,{' '}
          <span className="gradient-text">One Event at a Time</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          Discover national hackathons, cultural festivals, tech workshops, and sports championships.
          Stay engaged, learn from industry pioneers, and RSVP in seconds.
        </p>

        {/* Dynamic Welcome Card for Logged-In User */}
        {isAuthenticated ? (
          <div className="hero-user-card">
            <div className="hero-user-avatar">
              {isAdmin ? '🛡️' : '🎓'}
            </div>
            <div className="hero-user-info">
              <div className="hero-user-name">
                Welcome back, {user?.name || 'Student'}!
              </div>
              <div className="hero-user-desc">
                {isAdmin
                  ? 'Faculty Admin Portal • You have publishing and attendee management permissions.'
                  : `You are registered for ${user?.registeredEvents?.length || 0} campus events. Browse what’s coming up next!`}
              </div>
            </div>
            {isAdmin && (
              <button onClick={onOpenCreateModal} className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
                <span>+ Publish New Event</span>
              </button>
            )}
          </div>
        ) : (
          <div className="hero-cta-group">
            <button onClick={() => onOpenAuthModal('register')} className="btn-hero-primary">
              <span>Get Started as Student</span>
              <ArrowRight size={16} />
            </button>
            <button onClick={() => onOpenAuthModal('login')} className="btn-hero-secondary">
              <span>Faculty Admin Login</span>
            </button>
          </div>
        )}

        {/* Quick Filter Chips */}
        <div className="hero-quick-filters">
          <span className="quick-filter-label">Quick Browse:</span>
          <div className="quick-filter-chips">
            {quickPills.map((pill) => (
              <button
                key={pill.val}
                onClick={() => onSelectCategory(pill.val)}
                className={`quick-chip ${activeCategory === pill.val ? 'active' : ''}`}
              >
                <span>{pill.icon}</span>
                <span>{pill.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
