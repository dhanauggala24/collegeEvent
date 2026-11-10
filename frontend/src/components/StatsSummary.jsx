import React from 'react';
import { CalendarCheck2, Users, Flame, Layers } from 'lucide-react';

export default function StatsSummary({ stats, totalFiltered }) {
  const cards = [
    {
      label: 'Upcoming Events',
      value: stats?.upcomingEvents ?? 0,
      icon: CalendarCheck2,
      color: '#4f46e5',
      bg: '#eef2ff'
    },
    {
      label: 'Total Registered',
      value: stats?.totalRegistrations ?? 0,
      icon: Users,
      color: '#059669',
      bg: '#ecfdf5'
    },
    {
      label: 'Total Events Posted',
      value: stats?.totalEvents ?? 0,
      icon: Flame,
      color: '#d97706',
      bg: '#fffbeb'
    },
    {
      label: 'Categories Active',
      value: stats?.categoryBreakdown ? Object.keys(stats.categoryBreakdown).length : 0,
      icon: Layers,
      color: '#7c3aed',
      bg: '#f3e8ff'
    }
  ];

  return (
    <div className="stats-grid">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: c.bg, color: c.color }}>
              <Icon size={24} />
            </div>
            <div>
              <div className="stat-value">{c.value}</div>
              <div className="stat-label">{c.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
