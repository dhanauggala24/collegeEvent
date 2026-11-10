const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Get stored auth token
 */
export function getAuthToken() {
  return localStorage.getItem('portal_token') || '';
}

/**
 * Save auth session
 */
export function setAuthSession(token, user) {
  if (token) localStorage.setItem('portal_token', token);
  if (user) localStorage.setItem('portal_user', JSON.stringify(user));
}

/**
 * Clear auth session
 */
export function clearAuthSession() {
  localStorage.removeItem('portal_token');
  localStorage.removeItem('portal_user');
}

/**
 * Handle HTTP response and throw friendly error messages
 */
async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg =
      (data.errors && data.errors.join(', ')) ||
      data.message ||
      `Request failed with status ${response.status}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }
  return data;
}

/**
 * Helper to get default headers with optional auth Bearer token
 */
function getHeaders(extraHeaders = {}) {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders
  };
}

// ----------------- AUTHENTICATION APIS -----------------

/**
 * Register new user (Student or Admin)
 */
export async function registerUser(userData) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return handleResponse(res);
}

/**
 * Login user (Student or Admin)
 */
export async function loginUser(credentials) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  return handleResponse(res);
}

/**
 * Get current user profile
 */
export async function getCurrentUser() {
  const token = getAuthToken();
  if (!token) return null;

  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: getHeaders()
  });
  return handleResponse(res);
}

// ----------------- EVENT APIS -----------------

/**
 * Get all events with optional filters & query params
 */
export async function getEvents(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '' && val !== 'All') {
      query.append(key, val);
    }
  });

  const url = `${API_BASE}/events${query.toString() ? `?${query.toString()}` : ''}`;
  const res = await fetch(url, {
    headers: getHeaders()
  });
  return handleResponse(res);
}

/**
 * Get event details by ID
 */
export async function getEventById(id) {
  const res = await fetch(`${API_BASE}/events/${id}`, {
    headers: getHeaders()
  });
  return handleResponse(res);
}

/**
 * Create a new event (Admin)
 */
export async function createEvent(eventData) {
  const res = await fetch(`${API_BASE}/events`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(eventData)
  });
  return handleResponse(res);
}

/**
 * Update existing event (Admin)
 */
export async function updateEvent(id, eventData) {
  const res = await fetch(`${API_BASE}/events/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(eventData)
  });
  return handleResponse(res);
}

/**
 * Delete an event (Admin)
 */
export async function deleteEvent(id) {
  const res = await fetch(`${API_BASE}/events/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return handleResponse(res);
}

/**
 * Register attendee for an event (Student / Attendee)
 */
export async function registerForEvent(id) {
  const res = await fetch(`${API_BASE}/events/${id}/register`, {
    method: 'POST',
    headers: getHeaders()
  });
  return handleResponse(res);
}

/**
 * Cancel RSVP for an event (Student / Attendee)
 */
export async function cancelEventRsvp(id) {
  const res = await fetch(`${API_BASE}/events/${id}/cancel-rsvp`, {
    method: 'POST',
    headers: getHeaders()
  });
  return handleResponse(res);
}

/**
 * Get registered attendees for an event (Admin only)
 */
export async function getEventAttendees(id) {
  const res = await fetch(`${API_BASE}/events/${id}/attendees`, {
    headers: getHeaders()
  });
  return handleResponse(res);
}

/**
 * Get portal analytics & summary stats
 */
export async function getEventStats() {
  const res = await fetch(`${API_BASE}/events/stats`, {
    headers: getHeaders()
  });
  return handleResponse(res);
}
