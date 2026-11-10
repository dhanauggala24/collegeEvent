import React from 'react';
import { Calendar, Plus, Sparkles } from 'lucide-react';

export default function Navbar({ onOpenCreateModal }) {
  return (
    <header className="app-header">
      <div className="container header-content">
        <div className="logo-area">
          <div className="logo-badge">
            <Calendar size={24} />
          </div>
          <div className="logo-text">
            <h1>CampusConnect</h1>
            <p>College Event Portal</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={onOpenCreateModal}
            className="btn-primary"
            title="Create and publish a new college event"
          >
            <Plus size={18} />
            <span>Create Event</span>
          </button>
        </div>
      </div>
    </header>
  );
}
