import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AIAssistant from './pages/AIAssistant';
import Appointments from './pages/Appointments';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Schedules from './pages/Schedules';
import Notifications from './pages/Notifications';
import Analytics from './pages/Analytics';
import Monitoring from './pages/Monitoring';
import Settings from './pages/Settings';
import { LanguageProvider } from './LanguageContext';
import { NotificationProvider } from './NotificationContext';
import NotificationHub from './components/NotificationHub';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <NotificationProvider>
        <Router>
          <NotificationHub />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="assistant" element={<AIAssistant />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="patients" element={<Patients />} />
              <Route path="doctors" element={<Doctors />} />
              <Route path="schedules" element={<Schedules />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="monitoring" element={<Monitoring />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </NotificationProvider>
    </LanguageProvider>
  );
}

export default App;
