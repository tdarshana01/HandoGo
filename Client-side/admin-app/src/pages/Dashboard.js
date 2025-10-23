import React, { useEffect, useState } from 'react';
import { FiUser, FiCheckCircle, FiBriefcase, FiUsers } from 'react-icons/fi';
import AddCoordinatorModal from '../components/AddCoordinatorModal';

const API_BASE = 'https://service-production-8a3c.up.railway.app';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // total users is derived from users + workers
  const [totalCoordinators, setTotalCoordinators] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalWorkers, setTotalWorkers] = useState(0);
  const [workers, setWorkers] = useState([]);
  const [loadingWorkers, setLoadingWorkers] = useState(false);
  

  const getAuthToken = () => {
    return (
      localStorage.getItem('authToken') ||
      localStorage.getItem('token') ||
      localStorage.getItem('accessToken') ||
      localStorage.getItem('auth_token') ||
      null
    );
  };

  useEffect(() => {
    // fetch workers count separately
    const fetchWorkers = async () => {
      try {
  setLoadingWorkers(true);
        const API_WORKER = process.env.REACT_APP_WORKER_API || 'https://service-production-8a3c.up.railway.app';
        const token = getAuthToken();
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch(`${API_WORKER}/api/v1/workers`, { headers });
          if (!res.ok) {
            setTotalWorkers(0);
            setWorkers([]);
            setLoadingWorkers(false);
            return;
          }
        const json = await res.json();
        const fetched = json.workers || json;
        setTotalWorkers((fetched && fetched.length) || 0);
        setWorkers(fetched || []);
        setLoadingWorkers(false);
      } catch (err) {
  // ignore worker-specific error detail here, show combined message above if needed
        setTotalWorkers(0);
        setWorkers([]);
        setLoadingWorkers(false);
      }
    };
    fetchWorkers();
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const token = getAuthToken();
        if (!token) {
          setError('No auth token found. Please sign in.');
          setLoading(false);
          return;
        }
        const res = await fetch(`${API_BASE}/api/v1/auth/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const errBody = await res.json().catch(() => null);
          setError(`Failed to fetch users: ${res.status} ${errBody && errBody.message ? errBody.message : ''}`);
          setLoading(false);
          return;
        }
        const json = await res.json();
        const fetched = json.users || json;
  setUsers(fetched || []);
        setTotalCoordinators(fetched.filter(u => (u.role || '').toLowerCase() === 'coordinator').length || 0);
        setTotalCustomers(fetched.filter(u => (u.role || '').toLowerCase() === 'customer').length || 0);
        setLoading(false);
      } catch (err) {
        setError('Error fetching users.');
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All'); 


  const handleCoordinatorAdded = (newCoordinator) => {
    setUsers(prev => [newCoordinator, ...prev]);
    setTotalCoordinators(c => c + 1);
  };

  return (
    <div className="p-6">
      <AddCoordinatorModal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleCoordinatorAdded} />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Service Admin</h1>
        <button onClick={openModal} className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <FiUser /> Add New Coordinator
        </button>
      </div>

      
      {/* Search + Role filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
        <div className="flex items-center w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search by name, email or id..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="w-full md:w-1/4">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option>All</option>
            <option>Customers</option>
            <option>Coordinators</option>
            <option>Admins</option>
            <option>Workers</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between border">
          <div>
            <div className="text-sm text-gray-500">Total Users</div>
            <div className="text-2xl font-bold">{(users.length || 0) + (workers.length || 0)}</div>
          </div>
          <div className="p-3 bg-pink-50 rounded-md">
            <FiUser className="text-pink-400" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between border">
          <div>
            <div className="text-sm text-gray-500">Total Workers</div>
            <div className="text-2xl font-bold">{totalWorkers}</div>
          </div>
          <div className="p-3 bg-blue-50 rounded-md">
            <FiUsers className="text-blue-400" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between border">
          <div>
            <div className="text-sm text-gray-500">Total Coordinators</div>
            <div className="text-2xl font-bold">{totalCoordinators}</div>
          </div>
          <div className="p-3 bg-orange-50 rounded-md">
            <FiCheckCircle className="text-orange-400" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between border">
          <div>
            <div className="text-sm text-gray-500">Total Customers</div>
            <div className="text-2xl font-bold">{totalCustomers}</div>
          </div>
          <div className="p-3 bg-pink-50 rounded-md">
            <FiBriefcase className="text-pink-400" />
          </div>
        </div>
      </div>

      {/* Unified table for users and workers */}
      <div className="mt-6 bg-white rounded-lg border overflow-hidden">
        <div className="grid gap-6 p-4 text-xs text-gray-500 font-semibold" style={{ gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr' }}>
          <div>NAME</div>
          <div>EMAIL / WORKER ID</div>
          <div>ROLE / SKILL</div>
          <div>ID</div>
          <div>ACTIONS</div>
        </div>

        { (loading || loadingWorkers) ? (
          <div className="p-6 text-center">Loading...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">{error}</div>
        ) : ( (users.length === 0 && workers.length === 0) ? (
          <div className="p-6 text-center text-gray-400">No records yet — add entries to populate the list.</div>
        ) : (
          <div className="divide-y">
            {(() => {
              // build unified list: include users then workers
              const unified = [];
              unified.push(...users.map(u => ({
                kind: 'user',
                id: u.id || u._id,
                name: u.fullName || u.name,
                emailOrId: u.email || '',
                roleOrSkill: u.role || '',
                location: u.location || '',
                raw: u
              })));
              unified.push(...workers.map(w => ({
                kind: 'worker',
                id: w._id || w.id,
                name: w.name || w.fullName,
                emailOrId: w.email || w.workerId || (w._id || '').slice(0,8),
                roleOrSkill: 'Worker',
                location: w.area || w.location || '',
                raw: w
              })));
              // apply roleFilter and searchQuery
              const filtered = unified.filter(item => {
                // role filter
                if (roleFilter && roleFilter !== 'All') {
                  if (roleFilter === 'Users') {
                    if (item.kind !== 'user') return false;
                  } else if (roleFilter === 'Workers') {
                    if (item.kind !== 'worker') return false;
                  } else if (roleFilter === 'Customers') {
                    if ((item.roleOrSkill || '').toLowerCase() !== 'customer') return false;
                  } else if (roleFilter === 'Coordinators') {
                    if ((item.roleOrSkill || '').toLowerCase() !== 'coordinator') return false;
                  } else if (roleFilter === 'Admins') {
                    if ((item.roleOrSkill || '').toLowerCase() !== 'admin') return false;
                  }
                }
                // search filter (name, emailOrId)
                if (searchQuery && searchQuery.trim()) {
                  const q = searchQuery.trim().toLowerCase();
                  const hay = `${item.name || ''} ${item.emailOrId || ''} ${item.id || ''}`.toLowerCase();
                  if (!hay.includes(q)) return false;
                }
                return true;
              });
              return filtered.map(item => (
                <div key={item.id} className="grid gap-6 p-4 items-center text-sm" style={{ gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr' }}>
                  <div className="font-medium text-gray-900">{item.name || '—'}</div>
                  <div className="text-gray-600 break-words">{item.emailOrId}</div>
                  <div className="text-gray-600">{item.roleOrSkill}</div>
                  <div className="text-gray-600">{(item.id || '').toString().slice(0,8)}</div>
                  <div className="text-right">
                    {item.kind === 'user' && (item.roleOrSkill || '').toLowerCase() === 'customer' ? (
                      <button
                        className="text-xs bg-green-600 text-white px-2 py-1 rounded"
                        onClick={async () => {
                          const token = getAuthToken();
                          try {
                            const res = await fetch(`${API_BASE}/api/v1/auth/${item.id}/assign-coordinator`, {
                              method: 'PATCH',
                              headers: { Authorization: `Bearer ${token}` },
                            });
                            if (!res.ok) {
                              const err = await res.json().catch(() => null);
                              alert('Failed to assign coordinator: ' + (err && err.message ? err.message : res.status));
                              return;
                            }
                            await res.json().catch(() => null);
                            // update local users list
                            setUsers(prev => prev.map(p => (p.id === item.id || p._id === item.id) ? { ...p, role: 'Coordinator' } : p));
                            setTotalCoordinators(c => c + 1);
                            setTotalCustomers(c => Math.max(0, c - 1));
                          } catch (err) {
                            alert('Error assigning coordinator');
                          }
                        }}
                      >
                        Assign Coordinator
                      </button>
                    ) : (
                      <span className="text-sm text-gray-500">—</span>
                    )}
                  </div>
                </div>
              ));
            })()}
          </div>
        )) }
      </div>
      
    </div>
  );
};

export default Dashboard;

