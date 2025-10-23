import React from 'react';
import { FiX } from 'react-icons/fi';

const RequestDetailsModal = ({ isOpen, onClose, request }) => {
  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-40" onClick={onClose}></div>
      <div className="flex items-center justify-center min-h-full p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Request Details</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><FiX className="w-5 h-5" /></button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <p className="text-sm text-gray-500">Customer</p>
              <p className="font-medium">{request.customerDisplay || request.customer?.fullName || request.customerName || '—'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Job Type</p>
              <p className="font-medium">{request.jobType || request.serviceType || request.type || '—'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p className="font-medium whitespace-pre-wrap">{request.description || request.details || '—'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Requested Date</p>
                <p className="font-medium">{request.requestedDate || request.createdAt || '—'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{request.location || request.address || '—'}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium">{request.status || '—'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Contact</p>
              <p className="font-medium">{(request.contact && (request.contact.phone || request.contact.email)) || request.contact?.phone || request.contact?.email || '—'}</p>
            </div>

            {request.assignedWorker && (
              <div>
                <p className="text-sm text-gray-500">Assigned Worker</p>
                <p className="font-medium">
                  {typeof request.assignedWorker === 'string'
                    ? request.assignedWorker
                    : (request.assignedWorker.fullName || request.assignedWorker.name || JSON.stringify(request.assignedWorker))}
                </p>
              </div>
            )}

            {/* show assigner(s) if present under several possible field names */}
            {(request.assigners || request.assigner || request.assignedBy) && (
              <div>
                <p className="text-sm text-gray-500">Assigners</p>
                <div className="font-medium">
                  {Array.isArray(request.assigners) && request.assigners.length > 0 ? (
                    request.assigners.map((a, i) => (
                      <div key={i}>{typeof a === 'string' ? a : (a.fullName || a.name || JSON.stringify(a))}</div>
                    ))
                  ) : request.assigner ? (
                    <div>{typeof request.assigner === 'string' ? request.assigner : (request.assigner.fullName || request.assigner.name || JSON.stringify(request.assigner))}</div>
                  ) : (
                    <div>{typeof request.assignedBy === 'string' ? request.assignedBy : (request.assignedBy?.fullName || request.assignedBy?.name || JSON.stringify(request.assignedBy))}</div>
                  )}
                </div>
              </div>
            )}

          </div>

          <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200">
            <button onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsModal;
