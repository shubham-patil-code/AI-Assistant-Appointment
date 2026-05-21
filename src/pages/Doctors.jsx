import React, { useState } from 'react';
import { Search, Plus, Star, Phone, Mail, Calendar, Users } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import BookingFlow from '../components/BookingFlow';
import AddDoctorModal from '../components/AddDoctorModal';
import './Doctors.css';

const doctors = [
  { id: 'DR001', name: 'Dr. Sarah Johnson', specialty: 'Cardiologist', dept: 'Cardiology', experience: '12 Years', patients: 342, rating: 4.9, status: 'active', today: 8, phone: '+1 234-567-0001', email: 'sarah@hospital.com' },
  { id: 'DR002', name: 'Dr. James Wilson', specialty: 'Neurologist', dept: 'Neurology', experience: '8 Years', patients: 218, rating: 4.7, status: 'active', today: 6, phone: '+1 234-567-0002', email: 'james@hospital.com' },
  { id: 'DR003', name: 'Dr. Emily Davis', specialty: 'Dermatologist', dept: 'Dermatology', experience: '5 Years', patients: 156, rating: 4.8, status: 'active', today: 5, phone: '+1 234-567-0003', email: 'emily@hospital.com' },
  { id: 'DR004', name: 'Dr. Ravi Sharma', specialty: 'Cardiologist', dept: 'Cardiology', experience: '15 Years', patients: 412, rating: 4.9, status: 'active', today: 10, phone: '+1 234-567-0004', email: 'ravi@hospital.com' },
  { id: 'DR005', name: 'Dr. Neha Patil', specialty: 'Gynecologist', dept: 'Gynecology', experience: '9 Years', patients: 287, rating: 4.6, status: 'active', today: 7, phone: '+1 234-567-0005', email: 'neha@hospital.com' },
  { id: 'DR006', name: 'Dr. Amit Verma', specialty: 'General Medicine', dept: 'Gen. Medicine', experience: '6 Years', patients: 198, rating: 4.5, status: 'on-leave', today: 0, phone: '+1 234-567-0006', email: 'amit@hospital.com' },
  { id: 'DR007', name: 'Dr. Meera Kulkarni', specialty: 'Pediatrician', dept: 'Pediatrics', experience: '11 Years', patients: 326, rating: 4.8, status: 'active', today: 9, phone: '+1 234-567-0007', email: 'meera@hospital.com' },
  { id: 'DR008', name: 'Dr. Suresh Nair', specialty: 'Orthopedist', dept: 'Orthopedics', experience: '14 Years', patients: 389, rating: 4.7, status: 'active', today: 8, phone: '+1 234-567-0008', email: 'suresh@hospital.com' },
];

const depts = ['All', 'Cardiology', 'Neurology', 'Dermatology', 'Gynecology', 'Gen. Medicine', 'Pediatrics', 'Orthopedics'];

export default function Doctors() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');
  const [view, setView] = useState('card');
  const [showBooking, setShowBooking] = React.useState(false);
  const [showAddDoctor, setShowAddDoctor] = useState(false);

  const filtered = doctors.filter(d =>
    (dept === 'All' || d.dept === dept) &&
    (d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="doctors-page fade-in">
      {showAddDoctor && <AddDoctorModal onClose={() => setShowAddDoctor(false)} />}
      {showBooking && (
        <BookingFlow
          onClose={() => setShowBooking(false)}
          onConfirm={() => setShowBooking(false)}
        />
      )}
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div><h1>{t('doctors')}</h1><p>{t('manageDoctors')}</p></div>
        <button className="btn btn-primary" onClick={() => setShowAddDoctor(true)}><Plus size={15} /> {t('addDoctor') || 'Add Doctor'}</button>
      </div>

      <div className="doctors-toolbar fade-in-1">
        <div className="search-bar" style={{ flex: 1, maxWidth: 320 }}>
          <Search size={14} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('searchPlaceholderDoctors') || 'Search doctors...'} />
        </div>
        <div className="dept-filters">
          {depts.map(d => (
            <button key={d} className={`dept-btn ${dept === d ? 'active' : ''}`} onClick={() => setDept(d)}>{d}</button>
          ))}
        </div>
        <div className="view-toggle">
          <button className={`vt-btn ${view === 'card' ? 'active' : ''}`} onClick={() => setView('card')}>⊞</button>
          <button className={`vt-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>☰</button>
        </div>
      </div>

      <div className={`doctors-grid fade-in-2 ${view}`}>
        {filtered.map(doc => (
          <div className="doctor-card card" key={doc.id}>
            <div className="doctor-card-header">
              <div className="doc-avatar">{doc.name.replace('Dr. ', '').split(' ').map(n => n[0]).join('')}</div>
              <span className={`badge ${doc.status === 'active' ? 'active' : 'warning'}`} style={{ textTransform: 'capitalize' }}>
                {doc.status === 'on-leave' ? 'On Leave' : 'Active'}
              </span>
            </div>
            <h3 className="doc-name">{doc.name}</h3>
            <p className="doc-specialty">{doc.specialty}</p>
            <p className="doc-dept">{doc.dept}</p>

            <div className="doc-rating">
              <Star size={13} fill="#F59E0B" stroke="none" />
              <span>{doc.rating}</span>
              <span className="doc-exp">• {doc.experience}</span>
            </div>

            <div className="doc-stats">
              <div className="ds-item">
                <Users size={13} />
                <span>{doc.patients}</span>
                <span className="ds-label">Patients</span>
              </div>
              <div className="ds-item">
                <Calendar size={13} />
                <span>{doc.today}</span>
                <span className="ds-label">Today</span>
              </div>
            </div>

            <div className="doc-contact">
              <button className="contact-btn"><Phone size={13} /></button>
              <button className="contact-btn"><Mail size={13} /></button>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '7px', fontSize: 12 }} onClick={() => setShowBooking(true)} disabled={doc.status === 'on-leave'}>{t('bookAppt')}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}