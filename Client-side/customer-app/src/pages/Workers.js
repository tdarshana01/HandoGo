import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';

// We'll load workers from the worker-data-service. Fields will be mapped to the UI shape.
const WORKER_API_BASE = process.env.REACT_APP_WORKER_API || 'https://service-production-8a3c.up.railway.app';

const Workers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState('All Workers');

  const services = [
    { name: 'All Workers', icon: '👥' },
    { name: 'Plumbing', icon: '🔧' },
    { name: 'Electrical', icon: '⚡' },
    { name: 'Cleaning', icon: '🧹' },
    { name: 'Carpentry', icon: '🪚' },
    { name: 'Painting', icon: '🎨' },
    { name: 'HVAC', icon: '❄️' }
  ];

  const normalize = (str = '') => str.toString().toLowerCase().replace(/[^a-z0-9]+/g, '');

  const matchesService = (worker, serviceName) => {
    if (!serviceName || serviceName === 'All Workers') return true;
    const sRoot = normalize(serviceName);
    const roleRoot = normalize(worker.role || '');
    if (roleRoot && (roleRoot.includes(sRoot) || sRoot.includes(roleRoot))) return true;
    if (Array.isArray(worker.skills)) {
      if (worker.skills.some(k => normalize(k).includes(sRoot) || sRoot.includes(normalize(k)))) return true;
    }
    // also check name/title fields
    if (worker.name && normalize(worker.name).includes(sRoot)) return true;
    return false;
  };

  const serviceCounts = services.reduce((acc, svc) => {
    if (svc.name === 'All Workers') {
      acc[svc.name] = workers.length;
    } else {
      acc[svc.name] = workers.filter(w => matchesService(w, svc.name)).length;
    }
    return acc;
  }, {});

  // workers to render (filtered by selectedService)
  const displayedWorkers = selectedService && selectedService !== 'All Workers'
    ? workers.filter(w => matchesService(w, selectedService))
    : workers;

  useEffect(() => {
    // if the dashboard navigated here with a selectedService, use it
    try {
      const navState = (location && location.state && location.state.selectedService) || null;
      if (navState) setSelectedService(navState === 'All Workers' ? 'All Workers' : navState);
      // also accept ?service= query param
      const qs = new URLSearchParams(window.location.search);
      const qService = qs.get('service');
      if (qService) setSelectedService(qService === 'All Workers' ? 'All Workers' : qService);
    } catch (e) { /* ignore */ }

    let mounted = true;
    const fetchWorkers = async () => {
      try {
        const res = await fetch(`${WORKER_API_BASE}/api/v1/workers`);
        if (!res.ok) throw new Error('Failed to fetch workers');
        const json = await res.json();
        const list = json.workers || json || [];
        // normalize each worker to the UI shape and only include available ones
        const normalized = list.map(w => ({
          id: w._id || w.id,
          name: w.name || w.workerName || w.fullName || 'Unnamed',
          role: w.specialty || w.skill || w.role || 'Worker',
          rating: w.rating || 4.5,
          location: w.area || w.location || '—',
          image: w.avatar || null,
          skills: w.skills || (w.specialty ? [w.specialty] : []),
          rate: w.rate || 1500,
          rateType: w.rateType || 'hr',
          status: (w.status || 'Available')
        }))
        .filter(w => (w.status || '').toString().toLowerCase() === 'available');

        if (mounted) {
          setWorkers(normalized);
          setLoading(false);
        }
      } catch (err) {
        console.error('Workers fetch error', err);
        if (mounted) {
          setWorkers([]);
          setLoading(false);
        }
      }
    };

    fetchWorkers();

    return () => { mounted = false; };
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Services */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Find Your Gig Worker</h3>
              <div className="space-y-1">
                {services.map((service, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedService(service.name === 'All Workers' ? null : service.name)}
                    className={`w-full text-left px-3 py-2 text-sm rounded flex items-center justify-between ${selectedService === service.name ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{service.icon}</span>
                      <span>{service.name}</span>
                    </div>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{service.name === 'All Workers' ? workers.length : serviceCounts[service.name] || 0}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center - Worker Cards */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Featured Gig Workers</h2>
              <p className="text-sm text-gray-600 mt-1">Browse profiles and hire the best professionals for your needs</p>
            </div>

            {loading && (
              <div className="text-center py-12">
                <div className="text-gray-600">Loading workers...</div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {!loading && displayedWorkers.map((worker) => (
                <div key={worker.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
                  {/* Worker Image */}
                  <div className="h-40 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center relative">
                    {worker.image ? (
                      <img src={worker.image} alt={worker.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-gray-700">
                        {worker.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full flex items-center space-x-1 text-sm font-semibold">
                      <span className="text-yellow-500">★</span>
                      <span>{worker.rating}</span>
                    </div>
                  </div>

                  {/* Worker Details */}
                  <div className="p-5">
                    <h4 className="text-lg font-bold text-gray-900">{worker.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{worker.role}</p>
                    <div className="flex items-center text-xs text-gray-500 mb-3">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                      </svg>
                      {worker.location}
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {worker.skills.slice(0, 4).map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {skill}
                        </span>
                      ))}
                    </div>

                    

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate('/request-service', { state: { assignedWorker: worker.name } })}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
                      >
                        Request This Worker →
                      </button>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar - CTAs */}
          <div className="lg:col-span-1 space-y-6">
            {/* Need Something Specific */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Need Something Specific?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Couldn't find what you're looking for? Post a custom gig request.
              </p>
              <button 
                onClick={() => navigate('/request-service')}
                className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
              >
                Request a Gig
              </button>
            </div>

            {/* Help Section */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900">Need Help?</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Our support team is here to assist you with finding the right worker.
              </p>
              <button className="text-sm text-blue-600 font-medium hover:underline">
                Contact Support →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workers;
