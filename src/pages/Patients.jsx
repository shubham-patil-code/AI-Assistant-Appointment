import React, { useState } from 'react';
import { Search, Plus, Filter, Eye, Edit, Trash2, Calendar } from 'lucide-react';
import BookingFlow from '../components/BookingFlow';
import { useLanguage } from '../LanguageContext';
import './Patients.css';

const patients = [
  { id: 'PT001234', name: 'John Smith', age: 45, gender: 'Male', blood: 'A+', phone: '+1 234-567-8901', email: 'john@email.com', condition: 'Hypertension', doctor: 'Dr. Sarah Johnson', visits: 8, status: 'active' },
  { id: 'PT001235', name: 'Emily Davis', age: 32, gender: 'Female', blood: 'B+', phone: '+1 234-567-8902', email: 'emily@email.com', condition: 'Diabetes Type 2', doctor: 'Dr. Sarah Johnson', visits: 12, status: 'active' },
  { id: 'PT001236', name: 'Michael Brown', age: 58, gender: 'Male', blood: 'O-', phone: '+1 234-567-8903', email: 'michael@email.com', condition: 'Migraine', doctor: 'Dr. James Wilson', visits: 5, status: 'active' },
  { id: 'PT001237', name: 'Sarah Wilson', age: 28, gender: 'Female', blood: 'AB+', phone: '+1 234-567-8904', email: 'sarah@email.com', condition: 'Eczema', doctor: 'Dr. Emily Davis', visits: 3, status: 'active' },
  { id: 'PT001238', name: 'David Johnson', age: 67, gender: 'Male', blood: 'A-', phone: '+1 234-567-8905', email: 'david@email.com', condition: 'Heart Disease', doctor: 'Dr. Sarah Johnson', visits: 22, status: 'critical' },
  { id: 'PT001239', name: 'Lisa Anderson', age: 41, gender: 'Female', blood: 'B-', phone: '+1 234-567-8906', email: 'lisa@email.com', condition: 'Epilepsy', doctor: 'Dr. James Wilson', visits: 9, status: 'inactive' },
  { id: 'PT001240', name: 'Robert Taylor', age: 35, gender: 'Male', blood: 'O+', phone: '+1 234-567-8907', email: 'robert@email.com', condition: 'Psoriasis', doctor: 'Dr. Emily Davis', visits: 6, status: 'active' },
  { id: 'PT001241', name: 'Jennifer Martinez', age: 52, gender: 'Female', blood: 'A+', phone: '+1 234-567-8908', email: 'jennifer@email.com', condition: 'Arrhythmia', doctor: 'Dr. Sarah Johnson', visits: 14, status: 'active' },
];

export default function Patients() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [showBooking, setShowBooking] = useState(false);
  
  const summaryStats = [
    { labelKey: 'totalPatients', value: '2,847', color: 'var(--primary)', bg: 'var(--primary-bg)' },
    { labelKey: 'active', value: '2,301', color: 'var(--success)', bg: '#D1FAE5' },
    { labelKey: 'critical', value: '48', color: 'var(--danger)', bg: '#FEE2E2' },
    { labelKey: 'newThisMonth', value: '127', color: 'var(--info)', bg: '#DBEAFE' },
  ];
  const filtered = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.id.includes(search));

  return (
    <div className="patients-page fade-in">
      {showBooking && (
        <BookingFlow
          onClose={() => setShowBooking(false)}
          onConfirm={() => setShowBooking(false)}
        />
      )}
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div><h1>{t('patients')}</h1><p>{t('managePatients')}</p></div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => setShowBooking(true)}><Calendar size={15} /> {t('bookAppt')}</button>
          <button className="btn btn-primary"><Plus size={15} /> {t('addPatient')}</button>
        </div>
      </div>

      <div className="summary-stats fade-in-1">
        {summaryStats.map(s => (
          <div className="card summary-stat" key={s.labelKey}>
            <p className="ss-value" style={{ color: s.color }}>{s.value}</p>
            <p className="ss-label">{t(s.labelKey)}</p>
          </div>
        ))}
      </div>

      <div className="card fade-in-2" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="toolbar">
          <div className="search-bar">
            <Search size={14} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('searchPlaceholderPatients')} />
          </div>
          <button className="btn btn-ghost"><Filter size={14} /> {t('filter')}</button>
        </div>
        <table className="main-table">
          <thead>
            <tr>
              <th>{t('patient')}</th>
              <th>{t('ageGender')}</th>
              <th>{t('bloodType')}</th>
              <th>{t('condition')}</th>
              <th>{t('doctor')}</th>
              <th>{t('visits')}</th>
              <th>{t('status')}</th>
              <th>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td>
                  <div className="patient-cell">
                    <div className="patient-avatar">{p.name.split(' ').map(n => n[0]).join('')}</div>
                    <div>
                      <p className="p-name">{p.name}</p>
                      <p className="p-id">{p.id}</p>
                    </div>
                  </div>
                </td>
                <td><span>{p.age} Yrs, {p.gender}</span></td>
                <td><span className="blood-badge">{p.blood}</span></td>
                <td><span className="condition-tag">{p.condition}</span></td>
                <td>{p.doctor}</td>
                <td><span className="visits-badge">{p.visits}</span></td>
                <td><span className={`badge ${p.status}`} style={{ textTransform: 'capitalize' }}>{p.status}</span></td>
                <td>
                  <div className="action-btns">
                    <button className="icon-action" title="Book Appointment" onClick={() => setShowBooking(true)}><Calendar size={14} /></button>
                    <button className="icon-action"><Eye size={14} /></button>
                    <button className="icon-action"><Edit size={14} /></button>
                    <button className="icon-action danger-action"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="table-footer">
          <p className="footer-info">{t('showing')} {filtered.length} {t('of')} 2,847 {t('patients')}</p>
        </div>
      </div>
    </div>
  );
}
