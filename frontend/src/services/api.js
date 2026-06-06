import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// On any 401, clear auth state and redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── AUTH ──────────────────────────────────────────────────────────────────────
export const loginApi = ({ email, password }) =>
  api.post('/api/v1/auth/login', { email, password });

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
export const getDashboardStats = () =>
  api.get('/api/v1/dashboard/stats');

// ── CLIENTS ───────────────────────────────────────────────────────────────────
export const getClients = (params) =>
  api.get('/api/v1/clients', { params });

export const getClientById = (id) =>
  api.get(`/api/v1/clients/${id}`);

export const addClient = (data) =>
  api.post('/api/v1/clients/add', data);

export const updateClientStage = (id, stage, reason) =>
  api.patch(`/api/v1/clients/${id}/stage`, { stage, reason });

// ── NOTES ─────────────────────────────────────────────────────────────────────
export const getClientNotes = (id) =>
  api.get(`/api/v1/clients/${id}/notes`);

export const addClientNote = (id, note) =>
  api.post(`/api/v1/clients/${id}/notes`, note);

// ── MATCHES ───────────────────────────────────────────────────────────────────
export const getClientMatches = (id) =>
  api.get(`/api/v1/clients/${id}/matches`);

export const sendMatchProposal = (clientId, matchId, emailSubject, emailBody) =>
  api.post(`/api/v1/clients/${clientId}/matches/${matchId}/send`, {
    emailSubject,
    emailBody,
  });

// ── AI ────────────────────────────────────────────────────────────────────────
export const generateIntroEmail = (payload) =>
  api.post('/api/v1/ai/generate-intro-email', payload);

// ── MATCH HISTORY ─────────────────────────────────────────────────────────────
export const getMatchHistory = () =>
  api.get('/api/v1/matches/history');

export default api;
