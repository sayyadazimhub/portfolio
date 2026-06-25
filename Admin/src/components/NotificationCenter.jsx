import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import ContactNotification from './ContactNotification';

const NotificationCenter = () => {
  const { displayedNotifications, removeDisplayedNotification, isConnected } = useNotifications();

  return (
    <>
      {/* Toast Notifications */}
      <div className="fixed top-4 right-0 left-0 sm:left-auto z-50 p-4 space-y-3 w-full sm:w-auto max-w-full flex flex-col pointer-events-none sm:items-end">
        {displayedNotifications.map((notification) => (
          <ContactNotification
            key={notification.id}
            notification={notification}
            onClose={() => removeDisplayedNotification(notification.id)}
          />
        ))}
      </div>

      {/* Connection Status Indicator */}
      <div className="fixed bottom-4 right-4 flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-full text-xs">
        <div
          className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
        />
        <span className="text-gray-300">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
    </>
  );
};

export default NotificationCenter;
