const API_BASE = process.env.REACT_APP_API_URL || 'https://service-production-8a3c.up.railway.app';

export async function createWorker(payload, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/api/v1/workers`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to create worker');
  }
  return res.json();
}

const workerService = { createWorker };

export default workerService;
