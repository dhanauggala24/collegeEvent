import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatsSummary from './components/StatsSummary';
import FilterBar from './components/FilterBar';
import EventCard from './components/EventCard';
import EventDetailsModal from './components/EventDetailsModal';
import EventFormModal from './components/EventFormModal';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import { useAuth } from './context/AuthContext';
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getEventStats
} from './services/api';
import { CalendarX, Loader2, Sparkles, BookmarkCheck } from 'lucide-react';

export default function App() {
  const { user, isAuthenticated, isAdmin, isStudent, refreshUser } = useAuth();

  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState(null);

  // Filter States
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [department, setDepartment] = useState('All');
  const [upcomingOnly, setUpcomingOnly] = useState(true);
  const [sortBy, setSortBy] = useState('date');
  const [filterMyEvents, setFilterMyEvents] = useState(false);

  // Modals & Popups
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [detailEvent, setDetailEvent] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' or 'register'
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  // Load stats
  const loadStats = useCallback(async () => {
    try {
      const res = await getEventStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.warn('Could not load stats:', err.message);
    }
  }, []);

  // Load events
  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        search,
        category,
        department,
        upcomingOnly,
        sortBy,
        sortOrder: sortBy === 'title' ? 'asc' : sortBy === 'capacity' ? 'desc' : 'asc'
      };

      const res = await getEvents(params);
      if (res.success) {
        setEvents(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch events from backend', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, category, department, upcomingOnly, sortBy]);

  // Initial load
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Load events on filter change with debounce on search
  useEffect(() => {
    const timer = setTimeout(() => {
      loadEvents();
    }, 250);
    return () => clearTimeout(timer);
  }, [loadEvents]);

  // Filter events by registered IDs if "My RSVPs" is active
  const displayedEvents = filterMyEvents
    ? events.filter((e) =>
        user?.registeredEvents?.some((reg) => {
          const idStr = typeof reg === 'string' ? reg : reg?._id;
          return idStr === e._id;
        })
      )
    : events;

  // Handle Event Create or Update
  const handleSaveEvent = async (formData, id) => {
    try {
      if (id) {
        const res = await updateEvent(id, formData);
        showToast('Event updated successfully!', 'success');
        if (detailEvent?._id === id) {
          setDetailEvent(res.data);
        }
      } else {
        await createEvent(formData);
        showToast('🎉 New college event published successfully!', 'success');
      }
      loadEvents();
      loadStats();
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
      throw err;
    }
  };

  // Handle Delete Event
  const handleDeleteEvent = async (id, title) => {
    if (!window.confirm(`Are you sure you want to remove "${title}"? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteEvent(id);
      showToast('Event removed successfully', 'info');
      if (detailEvent?._id === id) {
        setDetailEvent(null);
      }
      loadEvents();
      loadStats();
    } catch (err) {
      showToast(err.message || 'Failed to delete event', 'error');
    }
  };

  // Handle Register (RSVP)
  const handleRegisterEvent = async (id) => {
    if (!isAuthenticated) {
      setAuthModalMode('register');
      setIsAuthModalOpen(true);
      return;
    }

    try {
      setRegisteringId(id);
      const res = await registerForEvent(id);
      showToast('🎉 RSVP confirmed! See you at the event.', 'success');

      // Update state locally
      setEvents((prev) =>
        prev.map((e) => (e._id === id ? { ...e, registrationCount: res.data.registrationCount } : e))
      );
      if (detailEvent?._id === id) {
        setDetailEvent(res.data);
      }
      // Refresh current user profile so registeredEvents array is up to date
      await refreshUser();
      loadStats();
    } catch (err) {
      showToast(err.message || 'Could not complete registration', 'error');
    } finally {
      setRegisteringId(null);
    }
  };

  // Modal Triggers
  const handleOpenCreateModal = () => {
    if (!isAuthenticated) {
      showToast('Please sign in as a Faculty Admin to publish events.', 'info');
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      return;
    }
    if (!isAdmin) {
      showToast('Only Faculty Admins can create events.', 'error');
      return;
    }
    setEventToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (event) => {
    setEventToEdit(event);
    setIsFormModalOpen(true);
  };

  const handleViewDetails = (event) => {
    setDetailEvent(event);
  };

  const handleOpenAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Header */}
      <Navbar
        onOpenCreateModal={handleOpenCreateModal}
        onOpenAuthModal={handleOpenAuthModal}
        filterMyEvents={filterMyEvents}
        onToggleMyEvents={() => setFilterMyEvents((prev) => !prev)}
      />

      {/* Main Content */}
      <main className="container" style={{ flex: 1, paddingBottom: '3rem' }}>
        {/* Statistics Bar - Hidden for student login */}
        {!isStudent && <StatsSummary stats={stats} totalFiltered={displayedEvents.length} />}

        {/* Banner if My RSVPs Filter is Active */}
        {filterMyEvents && (
          <div
            style={{
              background: 'var(--primary-light)',
              border: '1px solid #c7d2fe',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1.25rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <BookmarkCheck size={20} color="var(--primary)" />
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary-text)' }}>
                Showing your RSVP'd events ({displayedEvents.length})
              </span>
            </div>
            <button
              onClick={() => setFilterMyEvents(false)}
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--primary)',
                textDecoration: 'underline'
              }}
            >
              Show All Events
            </button>
          </div>
        )}

        {/* Filter Bar */}
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          department={department}
          onDepartmentChange={setDepartment}
          upcomingOnly={upcomingOnly}
          onUpcomingOnlyChange={setUpcomingOnly}
          sortBy={sortBy}
          onSortByChange={setSortBy}
        />

        {/* Events Section */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
            <Loader2
              size={36}
              style={{
                margin: '0 auto 1rem',
                color: 'var(--primary)',
                animation: 'spin 1s linear infinite'
              }}
            />
            <p style={{ fontWeight: 600 }}>Loading college events...</p>
          </div>
        ) : displayedEvents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <CalendarX size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              {filterMyEvents ? 'No RSVPs Yet' : 'No Events Found'}
            </h3>
            <p
              style={{
                color: 'var(--text-muted)',
                maxWidth: '420px',
                margin: '0 auto 1.5rem',
                fontSize: '0.9rem'
              }}
            >
              {filterMyEvents
                ? "You haven't registered for any events yet. Explore upcoming hackathons, fests, and workshops and click RSVP!"
                : search || category !== 'All' || department !== 'All'
                ? "We couldn't find any events matching your filter criteria. Try resetting filters or searching with different keywords."
                : 'No college events are currently scheduled. Be the first to publish an event!'}
            </p>
            {filterMyEvents ? (
              <button onClick={() => setFilterMyEvents(false)} className="btn-primary">
                Explore All Events
              </button>
            ) : search || category !== 'All' || department !== 'All' ? (
              <button
                onClick={() => {
                  setSearch('');
                  setCategory('All');
                  setDepartment('All');
                  setUpcomingOnly(false);
                }}
                className="btn-secondary"
              >
                Clear All Filters
              </button>
            ) : isAdmin ? (
              <button onClick={handleOpenCreateModal} className="btn-primary">
                <Sparkles size={16} />
                <span>Publish First Event</span>
              </button>
            ) : (
              <button onClick={() => handleOpenAuthModal('login')} className="btn-secondary">
                Sign In as Admin to Create Events
              </button>
            )}
          </div>
        ) : (
          <div className="events-grid">
            {displayedEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onViewDetails={handleViewDetails}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteEvent}
                onRegister={handleRegisterEvent}
                onPromptAuth={handleOpenAuthModal}
                registeringId={registeringId}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border)',
          background: '#ffffff',
          padding: '1.5rem 0',
          textAlign: 'center',
          fontSize: '0.825rem',
          color: 'var(--text-muted)'
        }}
      >
        <div className="container">
          <p>© 2026 CampusConnect • Production-Ready College Event Portal (MERN Stack)</p>
        </div>
      </footer>

      {/* Modals */}
      <EventFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSaveEvent}
        eventToEdit={eventToEdit}
      />

      <EventDetailsModal
        event={detailEvent}
        onClose={() => setDetailEvent(null)}
        onRegister={handleRegisterEvent}
        onEdit={handleOpenEditModal}
        onPromptAuth={handleOpenAuthModal}
        registeringId={registeringId}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onNotify={showToast}
      />

      {/* Toast notifications */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
