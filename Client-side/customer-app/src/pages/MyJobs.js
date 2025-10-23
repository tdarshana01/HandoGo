import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiPhone } from 'react-icons/fi';
import Header from '../components/Header';


const Badge = ({ status }) => {
  const s = (status || '').toLowerCase();
  const base = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold';
  if (s === 'completed') return <span className={base + ' bg-green-100 text-green-800'}>Completed</span>;
  if (s === 'pending') return <span className={base + ' bg-yellow-100 text-yellow-800'}>Pending</span>;
  if (s === 'in progress' || s === 'assigned') return <span className={base + ' bg-blue-100 text-blue-800'}>In Progress</span>;
  if (s === 'new') return <span className={base + ' bg-gray-100 text-gray-800'}>New</span>;
  return <span className={base + ' bg-gray-100 text-gray-800'}>{status}</span>;
};

const formatDate = (d) => {
  if (!d) return '-';
  try {
    const dt = new Date(d);
    return dt.toLocaleDateString();
  } catch (e) { return '-'; }
};

const MyJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const API_BASE = process.env.REACT_APP_API_BASE || 'https://service-production-8a3c.up.railway.app';
        const url = `${API_BASE.replace(/\/$/, '')}/api/v1/requests/customer`;

        const res = await fetch(url, { headers });
        const text = await res.text();
        let body;
        try { body = text ? JSON.parse(text) : {}; } catch (e) { body = { raw: text }; }

        if (!res.ok) {
          console.error('Failed fetching customer requests', { status: res.status, body });
          if (res.status === 401) {
            setError('Unauthorized — please sign in.');
          } else {
            setError(body.message || body.error || `Server returned ${res.status}`);
          }
          setLoading(false);
          return;
        }

        setJobs(body.requests || []);
        setLoading(false);
      } catch (err) {
        console.error('Error loading jobs:', err);
        setError('Failed to load jobs — see console for details');
        setLoading(false);
      }
    };
    load();
  }, []);

  const inProgressCount = jobs.filter(j => (j.status || '').toLowerCase() === 'in progress' || (j.status || '').toLowerCase() === 'assigned').length;
  const rejectedCount = jobs.filter(j => (j.status || '').toLowerCase() === 'rejected').length;
  const confirmedCount = jobs.filter(j => (j.status || '').toLowerCase() === 'confirmed').length;

  // navigation helpers moved to shared Header where needed

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Jobs Dashboard</h2>
          <p className="text-sm text-gray-600">Manage your posted jobs, track progress, and communicate with hired workers.</p>
        </div>

        {/* Stats Cards: Total Jobs, Jobs Confirmed, Jobs In Progress */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path d="M3 3h14v2H3zM3 7h14v2H3zM3 11h14v6H3z"/></svg>
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Jobs</div>
                <div className="text-2xl font-bold">{jobs.length}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8z" clipRule="evenodd"/></svg>
              </div>
              <div>
                <div className="text-sm text-gray-600">Jobs Confirmed</div>
                <div className="text-2xl font-bold">{confirmedCount}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v7h7a1 1 0 110 2h-8a1 1 0 01-1-1V3a1 1 0 011-1z"/></svg>
              </div>
              <div>
                <div className="text-sm text-gray-600">Jobs In Progress</div>
                <div className="text-2xl font-bold">{inProgressCount}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Jobs Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold">Current and Pending Jobs</h3>
                <p className="text-sm text-gray-500">Overview of your active and upcoming service requests.</p>
              </div>

              <div className="overflow-x-auto">
                {loading && <div className="p-6 text-sm text-gray-600">Loading...</div>}
                {error && <div className="p-6 text-sm text-red-600">{error}</div>}

                {!loading && !error && (
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Worker</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {jobs.length === 0 && (
                        <tr><td colSpan="5" className="px-6 py-4 text-sm text-gray-600 text-center">No jobs found.</td></tr>
                      )}
                      {jobs.map((job) => {
                        const workerRaw = job.assignedWorker;
                        const workerName = workerRaw ? (typeof workerRaw === 'string' ? workerRaw : (workerRaw.name || '')) : '';
                        return (
                          <tr key={job._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{job.serviceType || job.gigType || 'Service'}</td>

                            <td className="px-6 py-4 align-top">
                              {workerName ? (
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-700">
                                    {workerName[0].toUpperCase()}
                                  </div>
                                  <div>
                                    <div
                                      onClick={() => navigate('/workers', { state: { focusWorker: workerName } })}
                                      className="text-sm font-medium text-gray-900 cursor-pointer hover:underline"
                                    >
                                      {workerName}
                                    </div>
                                    {job.assignedWorkerLocation && <div className="text-xs text-gray-500">{job.assignedWorkerLocation}</div>}
                                    <div className="flex items-center gap-3 mt-1">
                                      {job.contact?.email && (
                                        <a href={`mailto:${job.contact.email}`} className="text-xs text-blue-600 hover:underline flex items-center gap-1"><FiMail /> <span>Email</span></a>
                                      )}
                                      {job.contact?.phone && (
                                        <a href={`tel:${job.contact.phone}`} className="text-xs text-blue-600 hover:underline flex items-center gap-1"><FiPhone /> <span>Call</span></a>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">U</div>
                                  <div>
                                    <div className="text-sm">Unassigned</div>
                                    <button onClick={() => navigate('/workers', { state: { jobId: job._id } })} className="text-xs text-blue-600 underline mt-1">Find Worker</button>
                                  </div>
                                </div>
                              )}
                            </td>

                            <td className="px-6 py-4"><Badge status={job.status} /></td>
                            {/* progress column removed per request */}
                            <td className="px-6 py-4 text-sm text-gray-600">{formatDate(job.preferredEnd || job.createdAt)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Charts */}
          <div className="space-y-6">
            {/* Job Status Distribution */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Job Status Distribution</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span>In Progress</span>
                    </div>
                    <span className="font-medium">{inProgressCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span>Rejected</span>
                    </div>
                    <span className="font-medium">{rejectedCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>Confirmed</span>
                    </div>
                    <span className="font-medium">{confirmedCount}</span>
                  </div>
                </div>
            </div>

            {/* Jobs by Price Range panel removed per user request */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyJobs;
