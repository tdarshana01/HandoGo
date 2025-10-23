import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiZap, FiHome, FiFeather, FiShoppingCart, FiBook, FiTruck, FiCoffee, FiCamera, FiEdit3, FiTool, FiHeart, FiMessageCircle, FiMapPin, FiSmile, FiPhone, FiMail } from 'react-icons/fi';
import { FaFacebook } from 'react-icons/fa';
import ProtectedRoute from './ProtectedRoute';
import Header from './Header';
import HeroImage from '../assets/Home.png';
// header provides logo and profile image
import ImgPlumber from '../assets/Experienced Plumber for Home Repairs.png';
import ImgElectrician from '../assets/Certified Electrician for Wiring & Repairs.png';
import ImgCleaning from '../assets/Deep Cleaning Services for Homes & Offices.png';
import ImgGardening from '../assets/Gardening & Landscaping Experts.png';
import ImgDelivery from '../assets/Reliable Package & Food Delivery.png';
import ImgTutoring from '../assets/Personalized Tutoring for All Subjects.png';

const DashboardContent = () => {
  const navigate = useNavigate();
  const categories = [
    { name: 'Plumbing', icon: FiTool },
    { name: 'Electrical', icon: FiZap },
    { name: 'Cleaning', icon: FiHome },
    { name: 'Gardening', icon: FiFeather },
    { name: 'Groceries', icon: FiShoppingCart },
    { name: 'Tutoring', icon: FiBook },
    { name: 'Delivery', icon: FiTruck },
    { name: 'Cooking', icon: FiCoffee },
    { name: 'Photography', icon: FiCamera },
    { name: 'Painting', icon: FiEdit3 },
    { name: 'Handyman', icon: FiTool },
    { name: 'Pet Care', icon: FiHeart },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="relative w-full">
        <div className="w-full h-[520px] relative">
          <img src={HeroImage} alt="Hero banner" className="w-full h-full object-cover" />
          <div className="absolute left-6 sm:left-10 md:left-16 top-1/2 transform -translate-y-1/2 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 max-w-4xl px-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-black drop-shadow-2xl">
              Connect with Skilled Workers, Instantly.
            </h1>
            <p className="mt-4 text-white/90 drop-shadow-md max-w-xl">
              Find trusted local professionals for any task, from plumbing to gardening. Fast, reliable, and fair.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Service Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="services">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Popular Service Categories</h2>
          <p className="mt-2 text-gray-600">Browse our most requested services</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.name}
                onClick={() => navigate('/workers', { state: { selectedService: category.name } })}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100 flex flex-col items-center justify-center space-y-3 text-left"
              >
                <div className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl text-blue-600 bg-blue-50">
                  <Icon className="w-6 h-6" aria-hidden="true" />
                </div>
                <div className="text-sm font-medium text-gray-800">{category.name}</div>
              </button>
            );
          })}
        </div>

        {/* divider + centered CTA */}
        <div className="mt-8 flex flex-col items-center">
          <button onClick={() => navigate('/request-service')} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700">Request a Service</button>
         <div className="w-full border-t border-gray-200" />
        </div>
      </section>

      {/* Featured Services Near You */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Services Near You</h2>
            <p className="mt-2 text-gray-600">Top-rated professionals ready to help</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Experienced Plumber for Home Repairs', img: ImgPlumber, workers: 12 },
              { title: 'Certified Electrician for Wiring & Repairs', img: ImgElectrician, workers: 8 },
              { title: 'Deep Cleaning Services for Homes & Offices', img: ImgCleaning, workers: 15 },
              { title: 'Gardening & Landscaping Experts', img: ImgGardening, workers: 7 },
              { title: 'Reliable Package & Food Delivery', img: ImgDelivery, workers: 20 },
              { title: 'Personalized Tutoring for All Subjects', img: ImgTutoring, workers: 5 },
            ].map((service, idx) => (
              <article key={idx} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <img src={service.img} alt={service.title} className="w-full h-40 object-cover rounded-t-lg" />
                <div className="p-5">
                  <h4 className="font-semibold text-gray-900 text-base md:text-lg mb-2">{service.title}</h4>
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10a8 8 0 1116 0A8 8 0 012 10zm8-4a1 1 0 00-1 1v3H6a1 1 0 000 2h5a1 1 0 001-1V7a1 1 0 00-1-1z" /></svg>
                      <span>{service.workers} Workers Available</span>
                    </div>
                    <div className="text-blue-600 text-sm">★ 4.8</div>
                  </div>
                  <button aria-label={`View details for ${service.title}`} className="mt-2 w-full px-4 py-2 border-2 border-blue-100 text-blue-600 rounded-md hover:bg-blue-50">View Details</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
                <FiMessageCircle className="w-6 h-6" aria-hidden="true" />
              </div>
              <h4 className="font-semibold">Post Your Job</h4>
              <p className="text-sm text-gray-500 mt-2">Describe your task and location, then post it in minutes.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
                <FiMapPin className="w-6 h-6" aria-hidden="true" />
              </div>
              <h4 className="font-semibold">Get Matched</h4>
              <p className="text-sm text-gray-500 mt-2">Receive offers from skilled workers near you.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
                <FiSmile className="w-6 h-6" aria-hidden="true" />
              </div>
              <h4 className="font-semibold">Hire & Relax</h4>
              <p className="text-sm text-gray-500 mt-2">Choose the best worker and get your task done.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">What Our Customers Say</h2>
            <p className="mt-2 text-gray-500">Hear from happy customers who found the perfect worker for their needs.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {[
              { name: 'Amara Silva', review: 'Colombo Worker Connect made finding a reliable plumber so easy! The job was done perfectly.', rating: 5, avatar: null },
              { name: 'Nimal Perera', review: 'I found a great electrician for my home. Quick response and excellent service. Highly recommend!', rating: 4, avatar: null },
              { name: 'Priya Fernando', review: 'The cleaning service was superb. My house has never been this spotless. Thank you!', rating: 5, avatar: null },
            ].map((t, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="mb-4 flex justify-center">
                  {[...Array(t.rating)].map((_, s) => (
                    <svg key={s} className="w-5 h-5 text-yellow-400 mx-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6">"{t.review}"</p>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <span className="text-lg font-bold text-gray-700">{t.name.split(' ').map(n=>n[0]).join('')}</span>
                  </div>
                  <div className="font-semibold text-gray-900">{t.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / Contact Block */}
      <footer className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-200 rounded-md py-8 px-6 text-center">
            <h3 className="text-2xl font-bold mb-4">Want to become a Gig Worker or a Coordinator</h3>
            <button className="mb-4 px-4 py-1.5 bg-white text-sm rounded border">Contact Us Now</button>
            <div className="mt-6 flex flex-col items-center gap-3 text-gray-700">
              <div className="flex items-center gap-3">
                <FiPhone className="w-5 h-5" />
                <span>+94 76 36 14 566</span>
              </div>
              <div className="flex items-center gap-3">
                <FiPhone className="w-5 h-5" />
                <span>+94 76 34 56 333</span>
              </div>
              <div className="flex items-center gap-3">
                <FaFacebook className="w-5 h-5" />
                <a className="text-blue-600 underline" href="https://www.facebook.com">www.facebook.com</a>
              </div>
              <div className="flex items-center gap-3">
                <FiMail className="w-5 h-5" />
                <a className="text-blue-600 underline" href="mailto:dineshlakindu3@gmail.com">dineshlakindu3@gmail.com</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const Dashboard = () => (
  <ProtectedRoute>
    <DashboardContent />
  </ProtectedRoute>
);

export default Dashboard;
