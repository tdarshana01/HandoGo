import React, { useState, useEffect } from 'react';
import { FiSearch, FiCheck, FiX, FiClock, FiAlertCircle, FiUsers } from 'react-icons/fi';
import RequestDetailsModal from '../components/RequestDetailsModal';

const ServiceRequests = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [successMessage, setSuccessMessage] = useState('');

  // Requests loaded from backend
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_BASE = process.env.REACT_APP_API_URL || 'https://service-production-8a3c.up.railway.app';

  const getAuthToken = () => {
    return (
      localStorage.getItem('authToken') ||
      localStorage.getItem('token') ||
      localStorage.getItem('accessToken') ||
      localStorage.getItem('auth_token') ||
      null
    );
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/api/v1/requests/all`, { headers });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to fetch requests');
      }
      const data = await res.json();
      const fetched = data.requests || [];
      setRequests(fetched);
    } catch (error) {
      console.error('Fetch requests error:', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check URL for auth handoff from customer app
    try {
      const params = new URLSearchParams(window.location.search);
      const auth = params.get('auth');
      if (auth) {
        try {
          const decoded = JSON.parse(atob(decodeURIComponent(auth)));
          if (decoded.token) {
            localStorage.setItem('authToken', decoded.token);
          }
          if (decoded.user) {
            localStorage.setItem('user', JSON.stringify(decoded.user));
          }
        } catch (err) {
          console.warn('Failed to parse auth handoff:', err);
        }

        // remove auth param from URL without reloading
        params.delete('auth');
        const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
        window.history.replaceState({}, document.title, newUrl);
      }
    } catch (e) {
      /* ignore URL parsing errors */
    }

    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // compute dynamic stats from requests
  const now = new Date();
  const ms24 = 24 * 60 * 60 * 1000;
  const toLower = (s) => (s || '').toString().toLowerCase();
  const isSameDay = (d1, d2) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

  // Format a date/time string or Date object to a localized date-only string
  const formatDate = (value) => {
    if (!value) return '—';
    try {
      const d = (value instanceof Date) ? value : new Date(value);
      if (Number.isNaN(d.getTime())) return '—';
      // Use toLocaleDateString for date-only display (respects user locale)
      return d.toLocaleDateString();
    } catch (e) {
      return '—';
    }
  };

  const totalPending = requests.filter(r => {
    const s = toLower(r.status);
    return !(s === 'confirmed' || s === 'rejected');
  }).length;

  const todaysConfirmed = requests.filter(r => {
    const s = toLower(r.status);
    if (s !== 'confirmed') return false;
    const dt = new Date(r.updatedAt || r.confirmedAt || r.createdAt || Date.now());
    return isSameDay(dt, now);
  }).length;

  const recentlyRejected = requests.filter(r => {
    const s = toLower(r.status);
    if (s !== 'rejected') return false;
    const dt = new Date(r.updatedAt || r.rejectedAt || r.createdAt || Date.now());
    return (now - dt) <= ms24;
  }).length;

  const requestsInQueue = requests.length;

  const stats = [
    {
      label: 'Total Pending Requests',
      value: totalPending,
      subtext: 'Requests awaiting action',
      icon: FiClock,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500'
    },
    {
      label: "Today's Confirmed Jobs",
      value: todaysConfirmed,
      subtext: 'Jobs confirmed for today',
      icon: FiCheck,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500'
    },
    {
      label: 'Recently Rejected',
      value: recentlyRejected,
      subtext: 'Requests declined in last 24h',
      icon: FiAlertCircle,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-500'
    },
    {
      label: 'Requests in Queue',
      value: requestsInQueue,
      subtext: 'Total requests in pipeline',
      icon: FiUsers,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-500'
    }
  ];

  const handleConfirm = async (requestId) => {
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE}/api/v1/requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: 'Confirmed' }),
      });
      if (!res.ok) throw new Error('Failed to confirm request');
      const json = await res.json();
      // update local state
      setRequests((prev) => prev.map((r) => (r._id === requestId || r.id === requestId ? (json.request || { ...r, status: 'Confirmed' }) : r)));
      setSuccessMessage('Request confirmed successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Confirm error:', error);
      setSuccessMessage('Failed to confirm request');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleReject = async (requestId) => {
    // optimistic update: mark as Rejected in UI immediately
    const previous = requests.slice();
    setRequests((prev) => prev.map((r) => (r._id === requestId || r.id === requestId ? { ...r, status: 'Rejected' } : r)));
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE}/api/v1/requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: 'Rejected' }),
      });
      if (!res.ok) throw new Error('Failed to reject request');
      const json = await res.json();
      // update with server response if provided
      setRequests((prev) => prev.map((r) => (r._id === requestId || r.id === requestId ? (json.request || { ...r, status: 'Rejected' }) : r)));
      setSuccessMessage('Request rejected.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Reject error:', error);
      // revert optimistic update
      setRequests(previous);
      setSuccessMessage('Failed to reject request');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const openDetails = (req) => {
    setSelectedRequest(req);
    setIsDetailsOpen(true);
  };

  const closeDetails = () => {
    setSelectedRequest(null);
    setIsDetailsOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 text-green-700 px-6 py-3 rounded-lg shadow-lg">
          {successMessage}
        </div>
      )}

      {/* Header with Stats */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Service Requests</h1>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm font-medium text-gray-700 mb-1">{stat.label}</p>
                <p className="text-xs text-gray-500">{stat.subtext}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-6">
        {/* Section Header */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">New Incoming Requests</h2>
          <p className="text-sm text-gray-500">Manage and assign new service requests.</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Filter by Job Type */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">Filter by Job Type</span>
              <select
                value={jobTypeFilter}
                onChange={(e) => setJobTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="All">All Types</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Painting">Painting</option>
                <option value="Carpentry">Carpentry</option>
                <option value="Electrical">Electrical</option>
                <option value="Cleaning">Cleaning</option>
              </select>
            </div>

            {/* Sort by Date */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">Sort by Date</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="date">Latest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 flex items-center justify-center">
              <div className="text-gray-600">Loading requests...</div>
            </div>
          ) : (
            <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Job Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Requested Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requests.map((request) => {
                const idKey = request._id || request.id;
                const customerName = request.customerDisplay || request.customer?.fullName || request.customerName || request.customer?.name || request.customer || request.customerName || request.name || '—';
                return (
                  <tr key={idKey} onClick={() => openDetails(request)} className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{customerName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{request.jobType || request.serviceType || request.type || '—'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 max-w-xs truncate">{request.description || request.details || '—'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{formatDate(request.requestedDate || request.createdAt)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{request.location || request.address || '—'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {(() => {
                          const s = toLower(request.status);
                          if (s === 'confirmed') {
                            return (
                              <>
                                <button className="flex items-center space-x-1 px-4 py-2 bg-green-100 text-green-800 text-sm rounded-lg cursor-not-allowed" disabled onClick={(e) => e.stopPropagation()}>
                                  <FiCheck className="w-4 h-4" />
                                  <span>Confirmed</span>
                                </button>
                                <button className="p-2 text-gray-300 rounded-lg" disabled title="Reject" onClick={(e) => e.stopPropagation()}>
                                  <FiX className="w-5 h-5" />
                                </button>
                              </>
                            );
                          }
                          if (s === 'rejected') {
                            return (
                              <>
                                <div className="flex items-center">
                                  <span className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 text-sm rounded-lg" onClick={(e) => e.stopPropagation()}>Rejected</span>
                                </div>
                              </>
                            );
                          }
                          // default: allow both actions
                          return (
                            <>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleConfirm(idKey); }}
                                className="flex items-center space-x-1 px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                              >
                                <FiCheck className="w-4 h-4" />
                                <span>Confirm</span>
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleReject(idKey); }}
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <FiX className="w-5 h-5" />
                              </button>
                            </>
                          );
                        })()}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          )}
        </div>
        <RequestDetailsModal isOpen={isDetailsOpen} onClose={closeDetails} request={selectedRequest} />
      </div>
    </div>
  );
};

export default ServiceRequests;
