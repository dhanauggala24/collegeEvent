import React, { useState, useEffect } from 'react';
import { X, Users, Download, Search, Mail, GraduationCap, Building2, Calendar, Loader2 } from 'lucide-react';
import { getEventAttendees } from '../services/api';

export default function AttendeesModal({ isOpen, onClose, eventId, eventTitle }) {
  if (!isOpen || !eventId) return null;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchAttendees() {
      try {
        setLoading(true);
        setError('');
        const res = await getEventAttendees(eventId);
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load attendees.');
      } finally {
        setLoading(false);
      }
    }
    fetchAttendees();
  }, [eventId]);

  const attendees = data?.attendees || [];

  const filteredAttendees = attendees.filter((a) => {
    const student = a.user || {};
    const q = search.toLowerCase().trim();
    return (
      (student.name && student.name.toLowerCase().includes(q)) ||
      (student.email && student.email.toLowerCase().includes(q)) ||
      (student.studentId && student.studentId.toLowerCase().includes(q)) ||
      (student.department && student.department.toLowerCase().includes(q))
    );
  });

  const handleExportCSV = () => {
    if (!attendees || attendees.length === 0) return;

    const headers = ['Student Name', 'Email', 'Role', 'Department', 'Student ID', 'Registered At'];
    const rows = attendees.map((a) => {
      const u = a.user || {};
      const dateStr = a.registeredAt ? new Date(a.registeredAt).toLocaleString() : 'N/A';
      return [
        `"${u.name || 'Anonymous'}"`,
        `"${u.email || ''}"`,
        `"${u.role || 'student'}"`,
        `"${u.department || 'N/A'}"`,
        `"${u.studentId || 'N/A'}"`,
        `"${dateStr}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${(eventTitle || 'Event').replace(/[^a-zA-Z0-9]/g, '_')}_Attendees.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '750px', maxHeight: '85vh' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} color="var(--primary)" />
              <h3 className="modal-title" style={{ fontSize: '1.2rem' }}>
                Registered Attendees
              </h3>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              {eventTitle}
            </p>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Action & Filter Bar */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid var(--border)',
            background: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-light)'
              }}
            />
            <input
              type="text"
              placeholder="Search by student name, roll no, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.3rem', fontSize: '0.825rem', height: '36px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Total: {attendees.length} / {data?.capacity || '∞'}
            </span>

            <button
              onClick={handleExportCSV}
              disabled={attendees.length === 0}
              className="btn-primary"
              style={{
                fontSize: '0.8rem',
                padding: '0.45rem 0.85rem',
                opacity: attendees.length === 0 ? 0.5 : 1,
                cursor: attendees.length === 0 ? 'not-allowed' : 'pointer'
              }}
              title="Download attendee roster as CSV"
            >
              <Download size={15} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Body / Table */}
        <div className="modal-body" style={{ padding: '1rem 1.5rem', overflowY: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              <Loader2
                size={30}
                style={{
                  margin: '0 auto 0.75rem',
                  color: 'var(--primary)',
                  animation: 'spin 1s linear infinite'
                }}
              />
              <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>Loading attendee roster...</p>
            </div>
          ) : error ? (
            <div
              style={{
                background: '#fef2f2',
                color: '#b91c1c',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem'
              }}
            >
              {error}
            </div>
          ) : filteredAttendees.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              <Users size={40} style={{ margin: '0 auto 0.75rem', color: '#cbd5e1' }} />
              <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                {search ? 'No attendees match your search query.' : 'No students have registered yet for this event.'}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.65rem 0.5rem', fontWeight: 700 }}>Student Name</th>
                    <th style={{ padding: '0.65rem 0.5rem', fontWeight: 700 }}>Email</th>
                    <th style={{ padding: '0.65rem 0.5rem', fontWeight: 700 }}>Roll No</th>
                    <th style={{ padding: '0.65rem 0.5rem', fontWeight: 700 }}>Department</th>
                    <th style={{ padding: '0.65rem 0.5rem', fontWeight: 700 }}>Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendees.map((item, idx) => {
                    const student = item.user || {};
                    const regDate = item.registeredAt
                      ? new Date(item.registeredAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'N/A';

                    return (
                      <tr
                        key={idx}
                        style={{
                          borderBottom: '1px solid var(--border)',
                          transition: 'background-color 0.15s ease'
                        }}
                      >
                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600, color: 'var(--text-main)' }}>
                          {student.name || 'Anonymous Student'}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>
                          <a
                            href={`mailto:${student.email}`}
                            style={{ color: 'var(--primary)', textDecoration: 'none' }}
                          >
                            {student.email || 'N/A'}
                          </a>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                          {student.studentId || '—'}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>
                          {student.department || 'General'}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-light)', fontSize: '0.8rem' }}>
                          {regDate}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
