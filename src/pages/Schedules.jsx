import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import BookingFlow from '../components/BookingFlow';
import './Schedules.css';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const hours = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
const dates = [15, 16, 17, 18, 19, 20];

const events = [
  { day: 0, hour: 0, duration: 1, title: 'Dr. Ravi - Cardiology', type: 'cardiology', patient: 'John Smith' },
  { day: 0, hour: 1, duration: 2, title: 'Dr. Neha - Gynecology', type: 'gynecology', patient: 'Emily Davis' },
  { day: 1, hour: 0, duration: 1, title: 'Dr. James - Neurology', type: 'neurology', patient: 'Michael Brown' },
  { day: 1, hour: 2, duration: 1, title: 'Dr. Sarah - Cardiology', type: 'cardiology', patient: 'Sarah Wilson' },
  { day: 2, hour: 1, duration: 2, title: 'Dr. Emily - Dermatology', type: 'dermatology', patient: 'David Johnson' },
  { day: 2, hour: 4, duration: 1, title: 'Dr. Meera - Pediatrics', type: 'pediatrics', patient: 'Lisa Anderson' },
  { day: 3, hour: 0, duration: 1, title: 'Dr. Suresh - Orthopedics', type: 'orthopedics', patient: 'Robert Taylor' },
  { day: 3, hour: 3, duration: 2, title: 'Dr. Sarah - Cardiology', type: 'cardiology', patient: 'Jennifer Martinez' },
  { day: 4, hour: 1, duration: 1, title: 'Dr. James - Neurology', type: 'neurology', patient: 'John Smith' },
  { day: 5, hour: 2, duration: 1, title: 'Dr. Ravi - Cardiology', type: 'cardiology', patient: 'Emily Davis' },
];

const typeColors = {
  cardiology: { bg: '#EEF0FF', color: '#5B4FD6', border: '#C7D0FF' },
  neurology: { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' },
  gynecology: { bg: '#FCE7F3', color: '#9D174D', border: '#FBCFE8' },
  dermatology: { bg: '#D1FAE5', color: '#065F46', border: '#A7F3D0' },
  pediatrics: { bg: '#DBEAFE', color: '#1E40AF', border: '#BFDBFE' },
  orthopedics: { bg: '#FEE2E2', color: '#991B1B', border: '#FECACA' },
};

const doctors = [
  { name: 'Dr. Sarah Johnson', specialty: 'Cardiology', slots: 8, booked: 6, color: '#5B4FD6' },
  { name: 'Dr. James Wilson', specialty: 'Neurology', slots: 6, booked: 4, color: '#F59E0B' },
  { name: 'Dr. Emily Davis', specialty: 'Dermatology', slots: 7, booked: 5, color: '#10B981' },
  { name: 'Dr. Ravi Sharma', specialty: 'Cardiology', slots: 10, booked: 8, color: '#3B82F6' },
  { name: 'Dr. Neha Patil', specialty: 'Gynecology', slots: 8, booked: 7, color: '#EC4899' },
];

export default function Schedules() {
  const { t } = useLanguage();
  const [showBooking, setShowBooking] = useState(false);

  return (
    <div className="schedules-page fade-in">
      {showBooking && <BookingFlow onClose={() => setShowBooking(false)} onConfirm={() => setShowBooking(false)} />}
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div><h1>{t('schedules')}</h1><p>{t('viewSchedules')}</p></div>
        <button className="btn btn-primary"><Plus size={15} /> Add Schedule</button>
      </div>

      <div className="schedule-layout">
        <div className="calendar-section fade-in-1">
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="cal-header">
              <button className="icon-btn" onClick={() => {}}><ChevronLeft size={16} /></button>
              <span className="week-label">May 15 – 20, 2025</span>
              <button className="icon-btn" onClick={() => {}}><ChevronRight size={16} /></button>
              <button className="btn btn-ghost" style={{ marginLeft: 'auto', fontSize: 12 }}>Today</button>
            </div>

            <div className="cal-grid">
              {/* Header */}
              <div className="cal-time-col"></div>
              {days.map((d, i) => (
                <div key={d} className={`cal-day-header ${i === 1 ? 'today' : ''}`}>
                  <span className="cal-day-name">{d}</span>
                  <span className={`cal-date ${i === 1 ? 'today-date' : ''}`}>{dates[i]}</span>
                </div>
              ))}

              {/* Time slots */}
              {hours.map((h, hi) => (
                <React.Fragment key={h}>
                  <div className="cal-time">{h}</div>
                  {days.map((_, di) => {
                    const event = events.find(e => e.day === di && e.hour === hi);
                    return (
                      <div key={di} className="cal-cell">
                        {event && (
                          <div
                            className="cal-event"
                            style={{
                              background: typeColors[event.type]?.bg,
                              color: typeColors[event.type]?.color,
                              borderLeft: `3px solid ${typeColors[event.type]?.color}`,
                              height: `${event.duration * 100}%`,
                            }}
                          >
                            <p className="event-title">{event.title}</p>
                            <p className="event-patient">{event.patient}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="schedule-sidebar fade-in-2">
          <div className="card">
            <h3 style={{ fontSize: 14, marginBottom: 16 }}>Doctor Availability</h3>
            <div className="availability-list">
              {doctors.map(doc => (
                <div key={doc.name} className="avail-item">
                  <div className="avail-dot" style={{ background: doc.color }}></div>
                  <div className="avail-info">
                    <p className="avail-name">{doc.name}</p>
                    <p className="avail-spec">{doc.specialty}</p>
                    <div className="avail-bar">
                      <div className="avail-fill" style={{ width: `${(doc.booked/doc.slots)*100}%`, background: doc.color }}></div>
                    </div>
                    <p className="avail-slots">{doc.booked}/{doc.slots} slots booked</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: 14, marginBottom: 14 }}>Legend</h3>
            <div className="legend-items">
              {Object.entries(typeColors).map(([type, colors]) => (
                <div key={type} className="leg-item">
                  <div className="leg-color" style={{ background: colors.bg, border: `2px solid ${colors.color}` }}></div>
                  <span style={{ textTransform: 'capitalize', fontSize: 12 }}>{type}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card today-summary">
            <h3 style={{ fontSize: 14, marginBottom: 14 }}>Today's Summary</h3>
            {[
              { label: 'Total Appointments', value: '24', icon: '📅' },
              { label: 'Completed', value: '8', icon: '✅' },
              { label: 'In Progress', value: '3', icon: '🔄' },
              { label: 'Upcoming', value: '13', icon: '⏰' },
            ].map(s => (
              <div key={s.label} className="today-row">
                <span>{s.icon}</span>
                <span className="today-label">{s.label}</span>
                <span className="today-val">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
