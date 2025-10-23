import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FiSearch, FiUserPlus } from 'react-icons/fi';
import { BsPerson, BsCheckCircle, BsBriefcase } from 'react-icons/bs';
import AddWorkerModal from '../components/AddWorkerModal';
import WorkerDetailsModal from '../components/WorkerDetailsModal';
import { FiChevronDown } from 'react-icons/fi';

const Workers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('All Skills');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [workers, setWorkers] = useState([]);
  const [loadingWorkers, setLoadingWorkers] = useState(false);
  const [workersError, setWorkersError] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  // menuPortal: { id, left, top, direction } when a menu is open via portal
  const [menuPortal, setMenuPortal] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const getAuthToken = () => {
    return (
      localStorage.getItem('authToken') ||
      localStorage.getItem('token') ||
      localStorage.getItem('accessToken') ||
      localStorage.getItem('auth_token') ||
      null
    );
  };

  const fetchWorkers = React.useCallback(async () => {
    setLoadingWorkers(true);
    setWorkersError('');
    try {
      const API_BASE = process.env.REACT_APP_WORKER_API || 'https://service-production-8a3c.up.railway.app';
      const token = getAuthToken();
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/api/v1/workers`, { headers });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to fetch workers');
      }
      const data = await res.json();
      setWorkers(data.workers || []);
    } catch (err) {
      console.error('Fetch workers error', err);
      setWorkersError(err.message || 'Failed to load workers');
      setWorkers([]);
    } finally {
      setLoadingWorkers(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  const fetchWorkerDetails = async (workerId) => {
    try {
      const API_BASE = process.env.REACT_APP_WORKER_API || 'http://localhost:5002';
      const token = getAuthToken();
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/api/v1/workers/${workerId}`, { headers });
      if (!res.ok) { throw new Error('Failed to fetch worker'); }
      const data = await res.json();
      return data.worker || data;
    } catch (err) {
      console.error('Fetch worker details error', err);
      return null;
    }
  };

  useEffect(() => {
    const onDocClick = () => {
      setOpenMenuId(null);
      setMenuPortal(null);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const totalWorkers = workers.length;
  const availableNow = workers.filter(w => (w.status || '').toString().toLowerCase() === 'available').length;
  const onJob = workers.filter(w => (w.status || '').toString().toLowerCase() === 'on job' || (w.status || '').toString().toLowerCase() === 'onjob').length;

  const stats = [
    {
      label: 'Total Workers',
      value: totalWorkers,
      icon: BsPerson,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-500'
    },
    {
      label: 'Available Now',
      value: availableNow,
      icon: BsCheckCircle,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-500'
    },
    {
      label: 'On Job',
      value: onJob,
      icon: BsBriefcase,
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-500'
    }
  ];


  const handleAddWorker = (createdWorker) => {
    // createdWorker comes from AddWorkerModal onSubmit after successful POST
    if (createdWorker) {
      // ensure consistent shape: use ._id as key if present
      setWorkers(prev => [createdWorker, ...prev]);
      setSuccessMessage('Worker added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      // fallback: refresh the list
      fetchWorkers();
      setSuccessMessage('Worker added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const updateWorkerStatus = async (workerId, newStatus) => {
    // optimistic update
    setWorkers(prev => prev.map(w => (w._id === workerId || w.id === workerId ? { ...w, status: newStatus } : w)));
    try {
      const API_BASE = process.env.REACT_APP_WORKER_API || 'http://localhost:5002';
      const token = getAuthToken();
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/api/v1/workers/${workerId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to update status');
      }
      // optionally replace with returned worker
      const data = await res.json().catch(() => ({}));
      if (data.worker) {
        setWorkers(prev => prev.map(w => (w._id === workerId || w.id === workerId ? data.worker : w)));
      }
    } catch (err) {
      console.error('Update status error', err);
      // revert optimistic update on error
      fetchWorkers();
      alert(err.message || 'Failed to update worker status');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 text-green-700 px-6 py-3 rounded-lg shadow-lg">
          {successMessage}
        </div>
      )}

      {/* Add Worker Modal */}
      <AddWorkerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddWorker}
      />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Worker Directory</h1>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <FiUserPlus className="w-5 h-5" />
              <span className="font-medium">Add New Worker</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-6">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search workers by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Skill Filter */}
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option>All Skills</option>
              <option>Plumbing</option>
              <option>Electrical</option>
              <option>Cleaning</option>
              <option>Carpentry</option>
            </select>

            {/* Location Filter */}
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option>All Locations</option>
              <option>Colombo Central</option>
              <option>Dehiwala</option>
              <option>Mount Lavinia</option>
              <option>Nugegoda</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option>All Statuses</option>
              <option>Available</option>
              <option>On Job</option>
            </select>
          </div>
        </div>

        {/* Worker Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loadingWorkers ? (
            <div className="p-8 text-center text-gray-600">Loading workers...</div>
          ) : workersError ? (
            <div className="p-8 text-center text-red-600">{workersError}</div>
          ) : (
            <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Worker ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Skill
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {workers.map((worker) => {
                const key = worker._id || worker.id || worker.workerId;
                return (
                <tr key={key} className="hover:bg-gray-50 transition-colors" onClick={async () => { const w = await fetchWorkerDetails(worker._id || worker.id || worker.workerId); setSelectedWorker(w); setIsDetailsOpen(true); }}>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{worker.name || worker.fullName || '—'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{worker.workerId || (worker._id || '').slice(0,8)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{worker.specialty || worker.skill || '—'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{worker.area || worker.location || '—'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{worker.contactNumber || worker.phone || worker.phoneNumber || '—'}</p>
                  </td>
                  <td className="px-6 py-4 relative">
                    <div className="flex items-center space-x-2">
                      {(() => {
                        const s = (worker.status || '').toString().toLowerCase();
                        if (s === 'available') {
                          return (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">✓ Available</span>
                          );
                        }
                        if (s === 'on job' || s === 'onjob') {
                          return (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">On Job</span>
                          );
                        }
                        return (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Unavailable</span>
                        );
                      })()}

                      {/* Status change menu */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const id = (worker._id || worker.id);
                            const rect = e.currentTarget.getBoundingClientRect();
                            const menuLeft = rect.right - 160; // align right edge
                            const spaceBelow = window.innerHeight - rect.bottom;
                            const direction = spaceBelow < 120 ? 'up' : 'down';
                            setOpenMenuId(openMenuId === id ? null : id);
                            setMenuPortal(openMenuId === id ? null : { id, left: menuLeft, top: direction === 'down' ? rect.bottom + 6 : rect.top - 126, direction });
                          }}
                          className="ml-1 text-gray-400 hover:text-gray-600 flex items-center"
                          aria-haspopup="true"
                        >
                          <FiChevronDown className="w-4 h-4" />
                        </button>
                        {menuPortal && menuPortal.id === (worker._id || worker.id) && ReactDOM.createPortal(
                          <div style={{ left: menuPortal.left, top: menuPortal.top }} className="absolute z-50" onClick={(e) => e.stopPropagation()}>
                            <div className="w-40 bg-white border border-gray-200 rounded-md shadow-lg">
                              <button onClick={() => updateWorkerStatus(worker._id || worker.id, 'Available')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Set Available</button>
                              <button onClick={() => updateWorkerStatus(worker._id || worker.id, 'On Job')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Set On Job</button>
                              <button onClick={() => updateWorkerStatus(worker._id || worker.id, 'Unavailable')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Set Unavailable</button>
                            </div>
                          </div>,
                          document.body
                        )}
                      </div>
                    </div>
                  </td>
                  
                </tr>
                )
              })}
            </tbody>
          </table>
          )}
        </div>
      </div>
      <WorkerDetailsModal worker={selectedWorker} open={isDetailsOpen} onClose={() => { setIsDetailsOpen(false); setSelectedWorker(null); }} />
    </div>
  );
};

export default Workers;
