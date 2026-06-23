import { createContext, useContext, useEffect, useState } from 'react';
import useSocket from '../hooks/useSocket';
import { apiService } from '../utils/api.js';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { socket, isConnected } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [displayedNotifications, setDisplayedNotifications] = useState([]);

  // Listen for socket events globally
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (payload) => {
      console.log('🔔 New notification received:', payload);

      const newNotification = {
        id: payload.id,
        type: payload.type || 'contact',
        ...payload,
        timestamp: new Date(),
        read: false,
      };

      // Add to main notifications list
      setNotifications((prev) => {
        const updated = [newNotification, ...prev].slice(0, 50);
        return updated;
      });

      // Add to displayed notifications (toast)
      setDisplayedNotifications((prev) => [...prev, newNotification]);
    };

    socket.on('new-contact', handleNewNotification);
    socket.on('new-testimonial', handleNewNotification);

    return () => {
      socket.off('new-contact', handleNewNotification);
      socket.off('new-testimonial', handleNewNotification);
    };
  }, [socket]);

  const addNotification = (notification) => {
    const newNotification = {
      id: notification.id,
      type: notification.type || 'contact',
      ...notification,
      timestamp: new Date(),
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev].slice(0, 50));
    setDisplayedNotifications((prev) => [...prev, newNotification]);
  };

  const removeDisplayedNotification = (id) => {
    setDisplayedNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAsRead = (id) => {
    setNotifications((prev) => {
      // Find the notification in the freshest state array to check its type
      const notification = prev.find((n) => n.id === id);
      if (notification && notification.type === 'contact') {
        // Persist the status update to 'read' on the backend server
        apiService.updateContact(id, { status: 'read' })
          .catch((err) => console.error('Failed to update contact status on server:', err));
      }
      return prev.map((n) => (n.id === id ? { ...n, read: true } : n));
    });
  };

  const clearNotifications = () => {
    setNotifications([]);
    setDisplayedNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        displayedNotifications,
        addNotification,
        removeDisplayedNotification,
        markAsRead,
        clearNotifications,
        isConnected,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};
