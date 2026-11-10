import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, GraduationCap, Building2, KeyRound, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DEPARTMENTS = [
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

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onNotify }) {
  if (!isOpen) return null;

  const { login, register } = useAuth();

  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [role, setRole] = useState('student'); // 'student' or 'admin'

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: 'Computer Science',
    studentId: '',
    adminSecret: ''
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const fillDemoAccount = (demoRole) => {
    if (demoRole === 'admin') {
      setMode('login');
      setFormData((prev) => ({
        ...prev,
        email: 'admin@college.edu',
        password: 'Password123'
      }));
    } else {
      setMode('login');
      setFormData((prev) => ({
        ...prev,
        email: 'student@college.edu',
        password: 'Password123'
      }));
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      if (!formData.email.trim() || !formData.password) {
        setError('Please enter both email and password.');
        return;
      }

      try {
        setIsSubmitting(true);
        const res = await login(formData.email.trim(), formData.password);
        onNotify(`Welcome back, ${res.user.name}!`, 'success');
        onClose();
      } catch (err) {
        setError(err.message || 'Login failed. Please check your credentials.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Registration validation
      if (!formData.name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (!formData.email.trim()) {
        setError('Please enter a valid college email.');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      try {
        setIsSubmitting(true);
        const res = await register({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role,
          department: formData.department,
          studentId: role === 'student' ? formData.studentId.trim() : '',
          adminSecret: role === 'admin' ? formData.adminSecret.trim() : ''
        });
        onNotify(
          `🎉 Account created successfully! Signed in as ${role === 'admin' ? 'Faculty Admin' : 'Student'}.`,
          'success'
        );
        onClose();
      } catch (err) {
        setError(err.message || 'Registration failed. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '480px' }}
      >
        {/* Modal Header & Tabs */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '0.5rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
              }}
              style={{
                padding: '0.45rem 1.1rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                background: mode === 'login' ? '#ffffff' : 'transparent',
                color: mode === 'login' ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: mode === 'login' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError('');
              }}
              style={{
                padding: '0.45rem 1.1rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                background: mode === 'register' ? '#ffffff' : 'transparent',
                color: mode === 'register' ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: mode === 'register' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              Create Account
            </button>
          </div>

          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ padding: '1.5rem' }}>
          {/* Quick Demo Credentials Pill */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
              fontSize: '0.8rem'
            }}
          >
            <div style={{ fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              ⚡ Quick Demo Credentials:
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => fillDemoAccount('admin')}
                style={{
                  background: '#e0e7ff',
                  color: '#4338ca',
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }}
              >
                Fill Admin (Faculty)
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('student')}
                style={{
                  background: '#ecfdf5',
                  color: '#047857',
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }}
              >
                Fill Student
              </button>
            </div>
          </div>

          {/* Role Selector (Register Mode Only) */}
          {mode === 'register' && (
            <div style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ marginBottom: '0.4rem' }}>
                I am registering as:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${role === 'student' ? 'var(--primary)' : 'var(--border)'}`,
                    background: role === 'student' ? 'var(--primary-light)' : '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.35rem',
                    textAlign: 'center'
                  }}
                >
                  <GraduationCap size={22} color={role === 'student' ? 'var(--primary)' : '#64748b'} />
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: role === 'student' ? 'var(--primary)' : 'var(--text-main)' }}>
                    Student
                  </span>
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                    RSVP & attend events
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${role === 'admin' ? 'var(--accent)' : 'var(--border)'}`,
                    background: role === 'admin' ? '#f5f3ff' : '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.35rem',
                    textAlign: 'center'
                  }}
                >
                  <ShieldCheck size={22} color={role === 'admin' ? 'var(--accent)' : '#64748b'} />
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: role === 'admin' ? 'var(--accent)' : 'var(--text-main)' }}>
                    Faculty / Admin
                  </span>
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                    Create & manage events
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div
              style={{
                background: '#fef2f2',
                color: '#b91c1c',
                border: '1px solid #fecaca',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.825rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Name (Register Only) */}
            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label">
                  Full Name <span className="req">*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="e.g. Sarah Jenkins"
                    style={{ paddingLeft: '2.5rem' }}
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="form-group">
              <label className="form-label">
                College Email Address <span className="req">*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="e.g. name@college.edu"
                  style={{ paddingLeft: '2.5rem' }}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Department (Register Only) */}
            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label">
                  Department <span className="req">*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Building2 size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <select
                    name="department"
                    className="form-control"
                    style={{ paddingLeft: '2.5rem' }}
                    value={formData.department}
                    onChange={handleChange}
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Student ID (Register Student Only) */}
            {mode === 'register' && role === 'student' && (
              <div className="form-group">
                <label className="form-label">Student Roll No. / ID</label>
                <input
                  type="text"
                  name="studentId"
                  className="form-control"
                  placeholder="e.g. CS2026-042"
                  value={formData.studentId}
                  onChange={handleChange}
                />
              </div>
            )}

            {/* Admin Key (Register Admin Only) */}
            {mode === 'register' && role === 'admin' && (
              <div className="form-group">
                <label className="form-label">Admin Security Key</label>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <input
                    type="password"
                    name="adminSecret"
                    className="form-control"
                    placeholder="Enter admin key (default: ADMIN2026)"
                    style={{ paddingLeft: '2.5rem' }}
                    value={formData.adminSecret}
                    onChange={handleChange}
                  />
                </div>
                <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                  Default passcode is <code>ADMIN2026</code>
                </span>
              </div>
            )}

            {/* Password */}
            <div className="form-group">
              <label className="form-label">
                Password <span className="req">*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="••••••••"
                  style={{ paddingLeft: '2.5rem' }}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Confirm Password (Register Only) */}
            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label">
                  Confirm Password <span className="req">*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    placeholder="••••••••"
                    style={{ paddingLeft: '2.5rem' }}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '0.75rem',
                marginTop: '0.5rem',
                fontSize: '0.95rem'
              }}
            >
              {isSubmitting ? (
                'Processing...'
              ) : mode === 'login' ? (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              ) : (
                <>
                  <span>Create {role === 'admin' ? 'Admin' : 'Student'} Account</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Modal Footer Link */}
        <div
          style={{
            padding: '1rem 1.5rem',
            background: '#f8fafc',
            borderTop: '1px solid var(--border)',
            textAlign: 'center',
            fontSize: '0.85rem'
          }}
        >
          {mode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
                style={{ color: 'var(--primary)', fontWeight: 700 }}
              >
                Sign Up as Student or Admin
              </button>
            </span>
          ) : (
            <span>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                style={{ color: 'var(--primary)', fontWeight: 700 }}
              >
                Sign In to your account
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
