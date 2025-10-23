import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiCalendar, FiMail, FiPhone } from 'react-icons/fi';
// header provides logo and sign out
import Header from '../components/Header';

const RequestService = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    gigType: '',
    location: '',
    email: '',
    phone: '',
    description: '',
    urgency: 'Normal',
    category: ''
  });
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [showWorkerSelect, setShowWorkerSelect] = useState(false);
  const [availableWorkers, setAvailableWorkers] = useState([]);
  const [loadingWorkers, setLoadingWorkers] = useState(false);
  const WORKER_API_BASE = process.env.REACT_APP_WORKER_API || 'https://service-production-8a3c.up.railway.app';

  // today's date string in yyyy-mm-dd for min attributes and comparisons
  const pad = (n) => n.toString().padStart(2, '0');
  const todayObj = new Date();
  const todayStr = `${todayObj.getFullYear()}-${pad(todayObj.getMonth() + 1)}-${pad(todayObj.getDate())}`;

  const categories = [
    { name: 'Plumbing', icon: '🔧' },
    { name: 'Electrical', icon: '⚡' },
    { name: 'Cleaning', icon: '🧹' },
    { name: 'Gardening', icon: '🌿' },
    { name: 'Painting', icon: '🎨' },
    { name: 'Carpentry', icon: '🪚' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setErrors({});

    // basic required-field validation
    const newErrors = {};
    if (!formData.gigType || !formData.gigType.trim()) newErrors.gigType = 'Gig Type is required.';
    if (!formData.location || !formData.location.trim()) newErrors.location = 'Location is required.';
    if (!formData.description || !formData.description.trim()) newErrors.description = 'Description is required.';
    if (!formData.preferredStart) newErrors.preferredStart = 'Please select a preferred start date.';
    if (!formData.email && !formData.phone) newErrors.contact = 'Please provide an email or phone number.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const { preferredStart, preferredEnd } = formData;
    const today = new Date();
    // normalize today's date to yyyy-mm-dd for comparison
    const pad = (n) => n.toString().padStart(2, '0');
    const yyyy = today.getFullYear();
    const mm = pad(today.getMonth() + 1);
    const dd = pad(today.getDate());
    const todayStr = `${yyyy}-${mm}-${dd}`;

    if (preferredStart && preferredStart < todayStr) {
      setError('Start date cannot be in the past.');
      return;
    }
    if (preferredEnd && preferredEnd < todayStr) {
      setError('End date cannot be in the past.');
      return;
    }
    if (preferredStart && preferredEnd && preferredEnd < preferredStart) {
      setError('End date cannot be earlier than start date.');
      return;
    }

    // After validation, navigate to confirmation page with the data
    console.log('Form submitted:', formData);
    navigate('/request/confirm', { state: { formData } });
  };

  // sign-out handled by shared Header

  // If navigated from a worker card, prefill assignedWorker
  useEffect(() => {
    const assigned = location.state?.assignedWorker;
    if (assigned) {
      setFormData((f) => ({ ...f, assignedWorker: assigned }));
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Submit Your Gig Request</h2>
              <p className="text-gray-600 mb-6">
                Let us know what you need and we'll connect you with the right professionals.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {formData.assignedWorker && (
                  <div className="p-3 bg-blue-50 rounded-md text-sm text-blue-800 flex items-center justify-between">
                    <div>Assigned Worker: <strong>{formData.assignedWorker}</strong></div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setFormData(f => ({ ...f, assignedWorker: undefined }))}
                        className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        Unassign
                      </button>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gig Type</label>
                  <input
                    type="text"
                    value={formData.gigType}
                    onChange={(e) => setFormData({...formData, gigType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Plumbing Repair, Graphic Design, Event Setup"
                  />
                  {errors.gigType && <p className="mt-1 text-xs text-red-600">{errors.gigType}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Colombo 07, Dehiwala-Mount Lavinia"
                  />
                  {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description of Work</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Provide a detailed description of the task, including any measurements, materials, or special instructions..."
                  />
                  {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Timing</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <FiCalendar className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="date"
                        value={formData.preferredStart || ''}
                        onChange={(e) => setFormData({...formData, preferredStart: e.target.value})}
                        min={todayStr}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        aria-label="Preferred start date"
                      />
                    </div>
                    <div className="relative">
                      <FiCalendar className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="date"
                        value={formData.preferredEnd || ''}
                        onChange={(e) => setFormData({...formData, preferredEnd: e.target.value})}
                        min={todayStr}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        aria-label="Preferred end date"
                      />
                    </div>
                  </div>
                  {errors.preferredStart && <p className="mt-1 text-xs text-red-600">{errors.preferredStart}</p>}
                </div>

                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={async () => {
                        // toggle and fetch workers when opening
                        if (!showWorkerSelect) {
                          setLoadingWorkers(true);
                          try {
                            const res = await fetch(`${WORKER_API_BASE}/api/v1/workers`);
                            const json = await res.json();
                            const list = json.workers || json || [];
                            const normalized = list.map(w => ({
                              id: w._id || w.id,
                              name: w.name || w.workerName || w.fullName || 'Unnamed',
                              role: w.specialty || w.skill || w.role || 'Worker',
                              skills: w.skills || (w.specialty ? [w.specialty] : []),
                              status: (w.status || 'Available')
                            }))
                            .filter(w => (w.status || '').toString().toLowerCase() === 'available');

                            // filter by form gig type if present
                            const svc = formData.gigType || formData.category || null;
                            const filtered = svc ? normalized.filter(w => {
                              const s = svc.toString().toLowerCase();
                              return (w.role && w.role.toLowerCase().includes(s)) || (Array.isArray(w.skills) && w.skills.some(k => k.toLowerCase().includes(s)));
                            }) : normalized;

                            setAvailableWorkers(filtered);
                          } catch (err) {
                            console.error('Fetch workers error', err);
                            setAvailableWorkers([]);
                          } finally {
                            setLoadingWorkers(false);
                            setShowWorkerSelect(true);
                          }
                        } else {
                          setShowWorkerSelect(false);
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md"
                    >
                      Select a Worker
                    </button>

                    {showWorkerSelect && (
                      <div className="absolute left-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded shadow p-3 z-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium">Available Workers{formData.gigType ? ` — ${formData.gigType}` : ''}</div>
                          <button type="button" onClick={() => setShowWorkerSelect(false)} className="text-xs text-gray-500 hover:text-gray-700">Close</button>
                        </div>
                        {loadingWorkers ? (
                          <div className="text-sm text-gray-600">Loading...</div>
                        ) : (
                          <div className="space-y-2 max-h-60 overflow-auto">
                            {availableWorkers.length === 0 && (
                              <div className="text-sm text-gray-500">No available workers found.</div>
                            )}
                            {availableWorkers.map(w => (
                              <div key={w.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold text-gray-700">
                                    {w.name.split(' ').map(p => p[0]).join('').slice(0,2)}
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium">{w.name}</div>
                                    <div className="text-xs text-gray-500">{w.role}</div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setFormData(f => ({ ...f, assignedWorker: w.name }));
                                      setShowWorkerSelect(false);
                                    }}
                                    className="px-3 py-1 bg-green-600 text-white text-xs rounded"
                                  >
                                    Select
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-md"
                  >
                    Optional*
                  </button>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Contact Information</h3>

                  <label className="block text-sm text-gray-600 mb-2">Email Address</label>
                  <div className="relative mb-4">
                    <FiMail className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <label className="block text-sm text-gray-600 mb-2">Phone Number</label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+94 77 123 4567"
                    />
                  </div>
                  {errors.contact && <p className="mt-1 text-xs text-red-600">{errors.contact}</p>}
                </div>

                <div>
                  {error && (
                    <div className="mb-3 text-sm text-red-600">{error}</div>
                  )}
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                  >
                    Submit Gig Request
                  </button>
                </div>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="mt-3 text-sm text-gray-600 underline"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* How it Works */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How it Works</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                  <div>
                    <p className="text-sm font-medium">Submit Your Request</p>
                    <p className="text-xs text-gray-600">Tell us what you need</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                  <div>
                    <p className="text-sm font-medium">Get Matched with Workers</p>
                    <p className="text-xs text-gray-600">We find qualified professionals</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                  <div>
                    <p className="text-sm font-medium">Choose and Connect</p>
                    <p className="text-xs text-gray-600">Select the best worker and schedule</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Gig Categories */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Gig Categories</h3>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category, idx) => (
                  <button
                    key={idx}
                    onClick={() => setFormData({...formData, gigType: category.name})}
                    className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 text-center transition-colors"
                  >
                    <div className="text-2xl mb-1">{category.icon}</div>
                    <div className="text-sm font-medium text-gray-700">{category.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* HandiGO Info */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">HandiGO</h3>
              <p className="text-sm text-gray-600 mb-4">
                HandiGO offers a versatile way to connect with skilled workers in your area. We ensure all workers are professionally verified, and the worker can upload photos of their work and the location of the work.
              </p>
              <div className="text-xs text-gray-500">
                <p>Available in Sri Lanka</p>
                <p>Contact: +94 76 36 14 566</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestService;
