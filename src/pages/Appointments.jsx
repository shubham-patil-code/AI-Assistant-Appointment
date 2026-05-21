import React, { useState } from 'react';
import { Plus, Search, Eye, MoreVertical, Calendar, Filter, ChevronLeft, ChevronRight, Brain, CheckCircle, XCircle, Clock } from 'lucide-react';
import BookingFlow from '../components/BookingFlow';
import { useLanguage } from '../LanguageContext';
import './Appointments.css';

const all = [
  { id: 'PT001234', patient: 'John Smith', doctor: 'Dr. Sarah Johnson', specialty: 'Cardiologist', date: 'May 16, 2025', time: '05:00 PM', type: 'Consultation', status: 'confirmed' },
  { id: 'PT001235', patient: 'Emily Davis', doctor: 'Dr. Sarah Johnson', specialty: 'Cardiologist', date: 'May 16, 2025', time: '06:00 PM', type: 'Follow-up', status: 'scheduled' },
  { id: 'PT001236', patient: 'Michael Brown', doctor: 'Dr. James Wilson', specialty: 'Neurologist', date: 'May 17, 2025', time: '10:00 AM', type: 'Consultation', status: 'scheduled' },
  { id: 'PT001237', patient: 'Sarah Wilson', doctor: 'Dr. Emily Davis', specialty: 'Dermatologist', date: 'May 17, 2025', time: '11:30 AM', type: 'Skin Check', status: 'scheduled' },
  { id: 'PT001238', patient: 'David Johnson', doctor: 'Dr. Sarah Johnson', specialty: 'Cardiologist', date: 'May 17, 2025', time: '02:00 PM', type: 'Follow-up', status: 'confirmed' },
  { id: 'PT001239', patient: 'Lisa Anderson', doctor: 'Dr. James Wilson', specialty: 'Neurologist', date: 'May 18, 2025', time: '09:00 AM', type: 'Consultation', status: 'cancelled' },
  { id: 'PT001240', patient: 'Robert Taylor', doctor: 'Dr. Emily Davis', specialty: 'Dermatologist', date: 'May 18, 2025', time: '10:30 AM', type: 'Consultation', status: 'scheduled' },
  { id: 'PT001241', patient: 'Jennifer Martinez', doctor: 'Dr. Sarah Johnson', specialty: 'Cardiologist', date: 'May 18, 2025', time: '03:00 PM', type: 'ECG Test', status: 'scheduled' },
];

export default function Appointments() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState('');
  const [showBooking, setShowBooking] = useState(false);
  
  const tabs = [t('allAppts'), t('today'), t('tomorrow'), t('thisWeek'), t('thisMonth')];
  const tabCounts = [24, 6, 8, 18, 45];
  const [appointments, setAppointments] = useState(all);

  const filtered = appointments.filter(a =>
    a.patient.toLowerCase().includes(search.toLowerCase()) ||
    a.doctor.toLowerCase().includes(search.toLowerCase())
  );

  const handleConfirm = (booking) => {
    if (booking) {
      const newAppt = {
        id: `PT00${Math.floor(Math.random() * 9000 + 1000)}`,
        patient: booking.patientName || 'AI Patient',
        doctor: booking.doctor?.name || 'TBD',
        specialty: booking.doctor?.specialty || booking.dept,
        date: booking.date?.full || 'TBD',
        time: booking.time || 'TBD',
        type: 'Consultation',
        status: 'confirmed',
      };
      setAppointments(prev => [newAppt, ...prev]);
    }
    setShowBooking(false);
  };

  return (
    <div className="appointments-page fade-in">
      {showBooking && (
        <BookingFlow
          onClose={() => setShowBooking(false)}
          onConfirm={handleConfirm}
        />
      )}

      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1>{t('appointments')}</h1>
          <p>{t('manageAppts')}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => setShowBooking(true)}>
            <Brain size={15} /> {t('aiBook')}
          </button>
          <button className="btn btn-primary" onClick={() => setShowBooking(true)}>
            <Plus size={15} /> {t('newAppt')}
          </button>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="appt-quick-stats fade-in-1">
        {[
          { labelKey: 'totalToday', value: '24', icon: Calendar, color: 'var(--primary)', bg: 'var(--primary-bg)' },
          { labelKey: 'confirmed', value: '18', icon: CheckCircle, color: 'var(--success)', bg: '#D1FAE5' },
          { labelKey: 'pending', value: '4', icon: Clock, color: 'var(--warning)', bg: '#FEF3C7' },
          { labelKey: 'cancelled', value: '2', icon: XCircle, color: 'var(--danger)', bg: '#FEE2E2' },
        ].map(s => (
          <div key={s.labelKey} className="aqs-card card">
            <div className="aqs-icon" style={{ background: s.bg, color: s.color }}><s.icon size={16} /></div>
            <div>
              <p className="aqs-value" style={{ color: s.color }}>{s.value}</p>
              <p className="aqs-label">{t(s.labelKey)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card fade-in-2" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Tabs & Search */}
        <div className="appt-toolbar">
          <div className="appt-tabs">
            {tabs.map((t, i) => (
              <button key={t} className={`appt-tab ${activeTab === i ? 'active' : ''}`} onClick={() => setActiveTab(i)}>
                <Calendar size={13} />{t}
                <span className="tab-count">{tabCounts[i]}</span>
              </button>
            ))}
          </div>
          <div className="toolbar-actions">
            <div className="search-bar" style={{ width: 260 }}>
              <Search size={14} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('searchPlaceholderAppts')} />
            </div>
            <button className="btn btn-ghost"><Filter size={14} /> {t('filter')}</button>
          </div>
        </div>

        {/* Table */}
        <table className="main-table">
          <thead>
            <tr>
              <th>{t('patient')}</th>
              <th>{t('doctor')}</th>
              <th>{t('dateTime')}</th>
              <th>{t('type')}</th>
              <th>{t('status')}</th>
              <th>{t('action')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id}>
                <td>
                  <div className="patient-cell">
                    <div className="patient-avatar">{a.patient.split(' ').map(n => n[0]).join('')}</div>
                    <div>
                      <p className="p-name">{a.patient}</p>
                      <p className="p-id">ID: {a.id}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="doctor-cell">
                    <div className="doctor-avatar">{a.doctor.replace('Dr. ', '').split(' ').map(n => n[0]).join('')}</div>
                    <div>
                      <p className="p-name">{a.doctor}</p>
                      <p className="p-id">{a.specialty}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="datetime-cell">
                    <p className="date-val"><Calendar size={12} /> {a.date}</p>
                    <p className="time-val"><span style={{fontSize:12}}>🕐</span> {a.time}</p>
                  </div>
                </td>
                <td><span className="type-pill">{a.type}</span></td>
                <td><span className={`badge ${a.status}`} style={{ textTransform: 'capitalize' }}>{a.status}</span></td>
                <td>
                  <div className="action-btns">
                    <button className="icon-action"><Eye size={14} /></button>
                    <button className="icon-action"><MoreVertical size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="table-footer">
          <p className="footer-info">{t('showing')} 1 {t('of')} {filtered.length} {t('of')} {appointments.length} {t('appointments')}</p>
          <div className="pagination">
            <button className="page-btn"><ChevronLeft size={14} /></button>
            {[1, 2, 3].map(p => <button key={p} className={`page-btn ${p === 1 ? 'active' : ''}`}>{p}</button>)}
            <button className="page-btn"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
