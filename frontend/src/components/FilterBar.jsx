import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

const CATEGORIES = [
  'All',
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
  'All',
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

export default function FilterBar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  department,
  onDepartmentChange,
  upcomingOnly,
  onUpcomingOnlyChange,
  sortBy,
  onSortByChange
}) {
  return (
    <div className="filter-section">
      <div className="filter-row-top">
        {/* Search input */}
        <div className="search-input-wrapper">
          <Search size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by event title, venue, organizer..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Department selector */}
        <select
          className="select-filter"
          value={department}
          onChange={(e) => onDepartmentChange(e.target.value)}
          aria-label="Filter by department"
        >
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>
              {dept === 'All' ? '🏛️ All Departments' : dept}
            </option>
          ))}
        </select>

        {/* Sort by */}
        <select
          className="select-filter"
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          aria-label="Sort events"
        >
          <option value="date">📅 Sort by Date (Earliest)</option>
          <option value="createdAt">✨ Recently Added</option>
          <option value="capacity">👥 Capacity (Highest)</option>
          <option value="title">🔤 Title (A - Z)</option>
        </select>

        {/* Upcoming Only toggle */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', userSelect: 'none' }}>
          <input
            type="checkbox"
            checked={upcomingOnly}
            onChange={(e) => onUpcomingOnlyChange(e.target.checked)}
            style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
          />
          Upcoming Only
        </label>
      </div>

      {/* Category Pills */}
      <div className="category-pills">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`category-pill ${category === cat ? 'active' : ''}`}
            onClick={() => onCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
