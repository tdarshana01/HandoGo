import React, { useState, useRef } from 'react';
import { FiX, FiUpload } from 'react-icons/fi';

const AddWorkerModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    workerName: '',
    email: '',
    phone: '',
    skill: '',
    location: '',
    availabilityStatus: 'Available',
    nationalId: ''
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const singleFileInputRef = useRef(null);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
    // revoke previous previews
    imagePreviews.forEach(u => URL.revokeObjectURL(u));
    const urls = files.map(f => URL.createObjectURL(f));
    setImagePreviews(urls);
    if (errors.image) setErrors(prev => ({ ...prev, image: '' }));
  };

  // Add a single image (one-by-one) — appends to existing images
  const handleSingleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // prevent duplicates by name+size
    const key = `${file.name}-${file.size}`;
    const exists = images.some(f => `${f.name}-${f.size}` === key);
    if (exists) {
      // reset input
      e.target.value = null;
      return;
    }

    const newImages = [...images, file];
    const newPreviews = [...imagePreviews, URL.createObjectURL(file)];
    setImages(newImages);
    setImagePreviews(newPreviews);
    if (errors.image) setErrors(prev => ({ ...prev, image: '' }));
    // reset the input so the same file can be selected again if removed
    e.target.value = null;
  };

  const handleAddImageClick = () => {
    if (singleFileInputRef.current) singleFileInputRef.current.click();
  };

  const removeImage = (index) => {
    const removedPreview = imagePreviews[index];
    if (removedPreview) URL.revokeObjectURL(removedPreview);
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.workerName.trim()) {
      newErrors.workerName = 'Worker name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.skill) {
      newErrors.skill = 'Skill/Service is required';
    }
    
    if (!formData.location) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.nationalId) {
      newErrors.nationalId = 'National ID is required';
    }
    
    if (!images || images.length === 0) {
      newErrors.image = 'At least one image is required';
    }
    
    return newErrors;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  

  const getAuthToken = () => {
    return (
      localStorage.getItem('authToken') ||
      localStorage.getItem('token') ||
      localStorage.getItem('accessToken') ||
      localStorage.getItem('auth_token') ||
      null
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const newErrors = validateForm();

    if (Object.keys(newErrors).length !== 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // prepare form data (multipart) so image can be uploaded
      const API_BASE = process.env.REACT_APP_WORKER_API || 'https://service-production-8a3c.up.railway.app';
      const token = getAuthToken();

      const fd = new FormData();
      fd.append('workerName', formData.workerName);
      fd.append('email', formData.email || '');
      fd.append('phone', formData.phone);
      fd.append('skill', formData.skill);
      fd.append('location', formData.location);
      fd.append('availabilityStatus', formData.availabilityStatus || 'Available');
      fd.append('nationalId', formData.nationalId || '');
      // append all selected images (field name: images)
      if (images && images.length) {
        images.forEach((f) => fd.append('images', f));
      }

      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/api/v1/workers`, {
        method: 'POST',
        headers,
        body: fd,
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setApiError(json.message || json.error || 'Failed to create worker');
        setIsSubmitting(false);
        return;
      }

      // success — call onSubmit with created worker if provided
      if (onSubmit) onSubmit(json.worker || json);
      handleClose();
    } catch (err) {
      console.error('Add worker error', err);
      setApiError('Network error creating worker');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      workerName: '',
      email: '',
      phone: '',
      skill: '',
      location: '',
      availabilityStatus: 'Available',
      nationalId: ''
    });
    setErrors({});
    // cleanup previews
    images.forEach(() => {});
    imagePreviews.forEach(u => URL.revokeObjectURL(u));
    setImages([]);
    setImagePreviews([]);
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleClose}></div>
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Add New Worker</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6">
            <div className="space-y-5">
              {/* Worker Information Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Worker Information</h3>
                <div className="space-y-4">
                  {/* Worker Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Worker Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="workerName"
                      value={formData.workerName}
                      onChange={handleChange}
                      placeholder="Enter worker name"
                      className={`w-full px-3 py-2 border ${
                        errors.workerName ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                    />
                    {errors.workerName && (
                      <p className="mt-1 text-sm text-red-500">{errors.workerName}</p>
                    )}
                  </div>

                  {/* Email and Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="worker@example.com"
                        className={`w-full px-3 py-2 border ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+94 XX XXX XXXX"
                        className={`w-full px-3 py-2 border ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Details Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Service Details</h3>
                <div className="space-y-4">
                  {/* Skill and Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Skill/Service <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="skill"
                        value={formData.skill}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${
                          errors.skill ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      >
                        <option value="">Select skill</option>
                        <option value="Plumbing">Plumbing</option>
                        <option value="Electrical">Electrical</option>
                        <option value="Cleaning">Cleaning</option>
                        <option value="Carpentry">Carpentry</option>
                        <option value="Painting">Painting</option>
                        <option value="HVAC">HVAC</option>
                      </select>
                      {errors.skill && (
                        <p className="mt-1 text-sm text-red-500">{errors.skill}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g., Colombo Central"
                        className={`w-full px-3 py-2 border ${
                          errors.location ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      />
                      {errors.location && (
                        <p className="mt-1 text-sm text-red-500">{errors.location}</p>
                      )}
                    </div>
                  </div>

                  {/* Availability Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Availability Status
                    </label>
                    <select
                      name="availabilityStatus"
                      value={formData.availabilityStatus}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="Available">Available</option>
                      <option value="On Job">On Job</option>
                      <option value="Unavailable">Unavailable</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Additional Information Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Additional Information</h3>
                <div className="space-y-4">
                  

                  {/* National ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      National ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nationalId"
                      value={formData.nationalId}
                      onChange={handleChange}
                      placeholder="Enter national ID number"
                      className={`w-full px-3 py-2 border ${
                        errors.nationalId ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                    />
                    {errors.nationalId && (
                      <p className="mt-1 text-sm text-red-500">{errors.nationalId}</p>
                    )}
                  </div>
                  {/* Images Upload (required, multiple) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      NIC Images (Front side & Back side)<span className="text-red-500">*</span>
                    </label>
                    <div className={`border-2 border-dashed ${errors.image ? 'border-red-300' : 'border-gray-300'} rounded-lg p-6 text-center hover:border-purple-400 transition-colors cursor-pointer relative`}>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImagesChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-0"
                      />
                      <div className="flex flex-col items-center">
                        <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-700">Upload images</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {images && images.length > 0 ? `${images.length} file(s) selected` : 'No files selected'}
                        </p>
                      </div>
                      {imagePreviews && imagePreviews.length > 0 && (
                        <div className="mt-4 grid grid-cols-4 gap-2 justify-center">
                          {imagePreviews.map((u, i) => (
                            <div key={i} className="relative">
                              <img src={u} alt={`preview-${i}`} className="w-20 h-20 object-cover rounded-lg mx-auto border-2 border-gray-200" />
                              <button type="button" onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-white p-1 rounded-full shadow">
                                <FiX className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add one-by-one button (always visible) */}
                      <div className="mt-3 flex items-center justify-center">
                        <button type="button" onClick={handleAddImageClick} className="px-3 py-2 bg-gray-100 border border-dashed rounded-lg hover:bg-gray-200 relative z-20">
                          Add image
                        </button>
                      </div>

                      {/* hidden single-file input used for one-by-one adds */}
                      <input type="file" accept="image/*" ref={singleFileInputRef} onChange={handleSingleImageChange} className="hidden" />
                    </div>
                    {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
              {apiError && (
                <div className="mr-auto text-sm text-red-600">{apiError}</div>
              )}
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Adding…' : 'Add Worker'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddWorkerModal;
