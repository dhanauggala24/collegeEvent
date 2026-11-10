import React from 'react';
import {
  Calendar,
  Plus,
  LogIn,
  UserPlus,
  LogOut,
  ShieldCheck,
  GraduationCap,
  BookmarkCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({
  onOpenCreateModal,
  onOpenAuthModal,
  filterMyEvents,
  onToggleMyEvents
}) {
  const { user, isAuthenticated, isAdmin, isStudent, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="container header-content">
        {/* Logo */}
        <div className="logo-area">
          <div className="logo-badge">
            <Calendar size={24} />
          </div>
          <div className="logo-text">
            <h1>CampusConnect</h1>
            <p>College Event Portal</p>
          </div>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          {isAuthenticated ? (
            <>
              {/* Student "My RSVPs" filter */}
              {isStudent && (
                <button
                  type="button"
                  onClick={onToggleMyEvents}
                  className={`btn-secondary ${filterMyEvents ? 'active' : ''}`}
                  style={{
                    borderColor: filterMyEvents ? 'var(--primary)' : 'var(--border)',
                    background: filterMyEvents ? 'var(--primary-light)' : '#ffffff',
                    color: filterMyEvents ? 'var(--primary-text)' : 'var(--text-main)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.5rem 0.9rem',
                    fontSize: '0.825rem'
                  }}
                  title="View only events you have registered for"
                >
                  <BookmarkCheck size={16} />
                  <span>My RSVPs ({user.registeredEvents ? user.registeredEvents.length : 0})</span>
                </button>
              )}

              {/* Admin Create Event */}
              {isAdmin && (
                <button
                  onClick={onOpenCreateModal}
                  className="btn-primary"
                  title="Create and publish a new college event"
                >
                  <Plus size={18} />
                  <span>Create Event</span>
                </button>
              )}

              {/* User Profile Pill */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  background: '#f8fafc',
                  border: '1px solid var(--border)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)'
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isAdmin ? '#f3e8ff' : '#ecfdf5',
                    color: isAdmin ? '#7e22ce' : '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}
                >
                  {isAdmin ? <ShieldCheck size={18} /> : <GraduationCap size={18} />}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.825rem', fontWeight: 700, lineHeight: 1.1 }}>
                    {user.name}
                  </span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: isAdmin ? '#7e22ce' : '#059669',
                      textTransform: 'uppercase'
                    }}
                  >
                    {isAdmin ? 'Faculty Admin' : 'Student'}
                  </span>
                </div>
              </div>

              {/* Logout button */}
              <button
                onClick={logout}
                className="btn-secondary"
                style={{ padding: '0.5rem 0.75rem', color: '#ef4444' }}
                title="Sign out of your account"
                aria-label="Sign out"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              {/* Unauthenticated Actions */}
              <button
                onClick={() => onOpenAuthModal('login')}
                className="btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <LogIn size={16} />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => onOpenAuthModal('register')}
                className="btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <UserPlus size={16} />
                <span>Sign Up</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
