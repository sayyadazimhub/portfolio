import React, { useEffect } from 'react';

const ContactNotification = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 6000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const title = notification.type === 'testimonial' ? 'New Testimonial' : 'New Contact Message';
  const details = notification.type === 'testimonial'
    ? `${notification.role || 'No role provided'} at ${notification.company || 'No company provided'}`
    : notification.email;

  return (
    <div className="pointer-events-auto bg-white rounded-lg shadow-xl p-4 w-full sm:max-w-sm border border-gray-100 z-50 animate-slideIn transition-all">
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-gray-800">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl leading-none"
            >
              &times;
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-semibold text-gray-800">{notification.name}</span>
          </p>
          <p className="text-xs text-gray-500 mb-2">{details}</p>
          <p className="text-sm text-gray-700 line-clamp-2">{notification.message}</p>
        </div>
      </div>
    </div>
  );
};

export default ContactNotification;
