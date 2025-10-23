import React from 'react';

const WorkerDetailsModal = ({ worker, open, onClose }) => {
  if (!open) return null;
  if (!worker) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-20" onClick={onClose}></div>
      <div className="bg-white p-6 rounded-lg shadow-lg z-60 max-w-lg w-full">Loading...</div>
    </div>
  );

  // normalize images into array of URLs
  const imageUrls = [];
  if (Array.isArray(worker.images)) {
    worker.images.forEach(img => {
      if (!img) return;
      if (typeof img === 'string') imageUrls.push(img);
      else if (img.url) imageUrls.push(img.url);
      else if (img.secure_url) imageUrls.push(img.secure_url);
      else if (img.path) imageUrls.push(img.path);
    });
  }
  if (worker.avatar) {
    const a = worker.avatar;
    if (typeof a === 'string') imageUrls.push(a);
    else if (a.url) imageUrls.push(a.url);
    else if (a.secure_url) imageUrls.push(a.secure_url);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-20" onClick={onClose}></div>
      <div className="bg-white p-6 rounded-lg shadow-lg z-60 max-w-lg w-full max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold">{worker.name || worker.fullName || 'Worker Details'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Close</button>
        </div>
        <div className="space-y-3 text-sm text-gray-700">
          <div><strong>ID:</strong> {worker._id || worker.id}</div>
          <div><strong>Skill:</strong> {worker.specialty || worker.skill || '—'}</div>
          <div><strong>Location:</strong> {worker.area || worker.location || '—'}</div>
          <div><strong>Phone:</strong> {worker.contactNumber || worker.phone || worker.phoneNumber || '—'}</div>
          <div><strong>Status:</strong> {worker.status || '—'}</div>
          <div><strong>Description:</strong> {worker.description || worker.bio || '—'}</div>
          {imageUrls.length > 0 && (
            <div className="mt-3">
              <strong>Images:</strong>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {imageUrls.map((src, i) => (
                  <a key={i} href={src} target="_blank" rel="noreferrer">
                    <img src={src} alt={`worker-${i}`} className="w-full h-24 object-cover rounded" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerDetailsModal;
