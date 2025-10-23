import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const RequestConfirm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const data = state?.formData || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    setError('');
    setLoading(true);
    try {
      // Check common localStorage keys for auth token
      const token = localStorage.getItem('token')
        || localStorage.getItem('authToken')

      if (!token) {
        setLoading(false);
        setError('Not authorized: no token found locally. Please sign in.');
        console.error('No token found in localStorage (checked token, authToken, accessToken, auth_token)');
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      console.debug('POST /api/v1/requests headers:', headers);

      const res = await fetch('https://service-production-8a3c.up.railway.app/api/v1/requests', {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (res.status === 401) {
          setError(body.message || 'Unauthorized — token missing/invalid/expired. Please log in again.');
          setLoading(false);
          console.error('Server returned 401 Unauthorized:', body);
          return;
        }
        throw new Error(body.message || `Request failed with status ${res.status}`);
      }

      const json = await res.json().catch(() => ({}));
      console.log('Request created', json);
      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to submit request');
      console.error('RequestConfirm error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Header />
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-md shadow p-8 text-center relative">
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Submit Your Request?</h2>
          <p className="text-sm text-gray-600 mb-6">One last step to connect with top-rated gig workers in your area.</p>
        </div>

        <div className="bg-white rounded-md shadow mt-6 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Details Summary</h3>
          <div className="text-sm text-gray-700 space-y-3">
            <div><strong>Service Type:</strong> {data.gigType || '—'}</div>
            <div><strong>Location:</strong> {data.location || '—'}</div>
            <div><strong>Description:</strong>
              <div className="mt-2 p-3 bg-gray-50 rounded text-sm text-gray-600">{data.description || '—'}</div>
            </div>
            <div><strong>Date & Time:</strong> {data.preferredStart ? `${data.preferredStart}` : '—'}{data.preferredEnd ? ` — ${data.preferredEnd}` : ''}</div>
            <div className="text-xs text-gray-500 mt-2">Ensure all details are accurate before proceeding.</div>
            {error && <div className="text-sm text-red-600">{error}</div>}
          </div>

          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md"
            >
              Back
            </button>

            <button
              onClick={handleConfirm}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Confirm & Submit Request'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestConfirm;
