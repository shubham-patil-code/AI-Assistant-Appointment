import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'alert', title: 'High No-Show Risk Detected', msg: 'Patient Vikas Kumar (Cardiology) has a 78% no-show risk for tomorrow\'s appointment.', time: '2 min ago', read: false, color: '#EF4444', bg: '#FEE2E2', channels: ['web'] },
    { id: 2, type: 'success', title: 'Appointment Confirmed', msg: 'John Smith\'s appointment with Dr. Sarah Johnson on May 16 at 5:00 PM has been confirmed.', time: '15 min ago', read: false, color: '#10B981', bg: '#D1FAE5', channels: ['web', 'email', 'sms', 'whatsapp'] },
  ]);

  const [activeAlert, setActiveAlert] = useState(null);

  const notify = useCallback(({ title, msg, type = 'info', channels = ['web'] }) => {
    const id = Date.now();
    const newNotif = {
      id,
      type,
      title,
      msg,
      time: 'Just now',
      read: false,
      channels,
      color: type === 'alert' ? '#EF4444' : type === 'success' ? '#10B981' : type === 'whatsapp' ? '#25D366' : '#3B82F6',
      bg: type === 'alert' ? '#FEE2E2' : type === 'success' ? '#D1FAE5' : type === 'whatsapp' ? '#DCFCE7' : '#DBEAFE',
    };

    setNotifications(prev => [newNotif, ...prev]);
    
    // Trigger visual hub alert
    setActiveAlert(newNotif);
    
    // Clear visual alert after 5 seconds
    setTimeout(() => {
      setActiveAlert(null);
    }, 5000);
  }, []);

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      notify, 
      markRead, 
      markAllRead, 
      removeNotification,
      activeAlert,
      setActiveAlert
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
