import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown, Calendar, RotateCcw } from 'lucide-react';

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
  onSortByChange,
  totalResults = 0
}) {
  const hasActiveFilters = search || category !== 'All' || department !== 'All' || !upcomingOnly;

  const handleResetFilters = () => {
    onSearchChange('');
    onCategoryChange('All');
    onDepartmentChange('All');
    onUpcomingOnlyChange(true);
    onSortByChange('date');
  };

  return (
    <div className="filter-card-modern">
      {/* Top Search & Dropdown Controls */}
      <div className="filter-controls-row">
        {/* Search input with clear button */}
        <div className="search-field-modern">
          <Search size={18} className="search-field-icon" />
          <input
            type="text"
            className="search-field-input"
            placeholder="Search events, organizers, topics, venues..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="search-field-clear"
              title="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Department Dropdown */}
        <div className="filter-select-wrapper">
          <select
            className="modern-select"
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
        </div>

        {/* Sort Dropdown */}
        <div className="filter-select-wrapper">
          <select
            className="modern-select"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            aria-label="Sort events"
          >
            <option value="date">📅 Date (Earliest First)</option>
            <option value="createdAt">✨ Recently Added</option>
            <option value="capacity">👥 Capacity (Highest)</option>
            <option value="title">🔤 Title (A - Z)</option>
          </select>
        </div>

        {/* Upcoming Only Toggle */}
        <label className="toggle-checkbox-label">
          <input
            type="checkbox"
            checked={upcomingOnly}
            onChange={(e) => onUpcomingOnlyChange(e.target.checked)}
            className="toggle-checkbox"
          />
          <span className="toggle-text">Upcoming Only</span>
        </label>
      </div>

      {/* Category Horizontal Pills */}
      <div className="category-scroll-strip">
        <div className="category-pills-list">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`modern-pill ${category === cat ? 'active' : ''}`}
              onClick={() => onCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Counter & Reset */}
        <div className="filter-status-row">
          <span className="results-count-text">
            Found <strong>{totalResults}</strong> {totalResults === 1 ? 'event' : 'events'}
          </span>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="btn-reset-filters"
              title="Reset all search filters"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
