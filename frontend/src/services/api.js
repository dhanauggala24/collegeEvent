const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

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
  const res = await fetch(url);
  return handleResponse(res);
}

/**
 * Get event details by ID
 */
export async function getEventById(id) {
  const res = await fetch(`${API_BASE}/events/${id}`);
  return handleResponse(res);
}

/**
 * Create a new event
 */
export async function createEvent(eventData) {
  const res = await fetch(`${API_BASE}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData)
  });
  return handleResponse(res);
}

/**
 * Update existing event
 */
export async function updateEvent(id, eventData) {
  const res = await fetch(`${API_BASE}/events/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData)
  });
  return handleResponse(res);
}

/**
 * Delete an event
 */
export async function deleteEvent(id) {
  const res = await fetch(`${API_BASE}/events/${id}`, {
    method: 'DELETE'
  });
  return handleResponse(res);
}

/**
 * Register attendee for an event
 */
export async function registerForEvent(id) {
  const res = await fetch(`${API_BASE}/events/${id}/register`, {
    method: 'POST'
  });
  return handleResponse(res);
}

/**
 * Get portal analytics & summary stats
 */
export async function getEventStats() {
  const res = await fetch(`${API_BASE}/events/stats`);
  return handleResponse(res);
}
