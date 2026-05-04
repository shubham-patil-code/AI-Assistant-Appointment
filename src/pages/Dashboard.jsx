import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Users, CheckCircle, XCircle, UserX, MessageSquare, Phone, Mail, Calendar, MoreVertical, ChevronDown, Plus, Brain, Bell } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import BookingFlow from '../components/BookingFlow';
import './Dashboard.css';

const trendData = [
  { day: '15 May', bookings: 110, noShows: 40 },
  { day: '16 May', bookings: 150, noShows: 70 },
  { day: '17 May', bookings: 130, noShows: 55 },
  { day: '18 May', bookings: 215, noShows: 105 },
  { day: '19 May', bookings: 155, noShows: 65 },
  { day: '20 May', bookings: 160, noShows: 80 },
  { day: '21 May', bookings: 110, noShows: 55 },
];

const deptData = [
  { name: 'Cardiology', value: 35, color: '#5B4FD6' },
  { name: 'Orthopedics', value: 25, color: '#00C9A7' },
  { name: 'General Medicine', value: 20, color: '#FFA94D' },
  { name: 'Dental', value: 10, color: '#3B82F6' },
  { name: 'Others', value: 10, color: '#9CA3AF' },
];

const appointments = [
  { time: '10:00 AM', patient: 'Rahul Joshi', age: '35 Yrs, Male', doctor: 'Dr. Ravi Sharma', dept: 'Cardiology', type: 'OPD', status: 'confirmed' },
  { time: '10:30 AM', patient: 'Sneha Patil', age: '29 Yrs, Female', doctor: 'Dr. Neha Patil', dept: 'Cardiology', type: 'OPD', status: 'confirmed' },
  { time: '11:00 AM', patient: 'Amit Verma', age: '40 Yrs, Male', doctor: 'Dr. Amit Verma', dept: 'Cardiology', type: 'OPD', status: 'pending' },
  { time: '11:30 AM', patient: 'Priya Singh', age: '34 Yrs, Female', doctor: 'Dr. Meera Kulkarni', dept: 'General Medicine', type: 'OPD', status: 'confirmed' },
  { time: '12:00 PM', patient: 'Suresh Patil', age: '50 Yrs, Male', doctor: 'Dr. Amit Verma', dept: 'General Medicine', type: 'OPD', status: 'confirmed' },
];

const noShowRisks = [
  { name: 'Vikas Kumar', dept: 'Cardiology', risk: 'high', score: 78 },
  { name: 'Anjali Deshmukh', dept: 'Orthopedics', risk: 'medium', score: 65 },
  { name: 'Suresh Patil', dept: 'General Medicine', risk: 'medium', score: 60 },
];

const reminders = [
  { icon: MessageSquare, type: 'WhatsApp Reminder', count: '12 Pending', time: '10:00 AM', color: '#25D366' },
  { icon: MessageSquare, type: 'SMS Reminder', count: '8 Pending', time: '06:00 PM', color: '#3B82F6' },
  { icon: Phone, type: 'Voice Call Reminder', count: '5 Pending', time: '09:00 AM', color: '#F59E0B' },
  { icon: Mail, type: 'Email Reminder', count: '3 Pending', time: '07:00 PM', color: '#EF4444' },
];

const stats = [
  { label: 'Total Appointments', value: 128, change: 18.6, up: true, color: '#5B4FD6', bg: '#EEF0FF', icon: Calendar },
  { label: 'Confirmed', value: 96, change: 16.3, up: true, color: '#10B981', bg: '#D1FAE5', icon: CheckCircle },
  { label: 'Cancelled', value: 12, change: 4.2, up: false, color: '#EF4444', bg: '#FEE2E2', icon: XCircle },
  { label: 'No-Show', value: 20, change: 8.1, up: false, color: '#F59E0B', bg: '#FEF3C7', icon: UserX },
  { label: 'Walk-ins', value: 34, change: 11.4, up: true, color: '#3B82F6', bg: '#DBEAFE', icon: Users },
];

export default function Dashboard() {
  const { t } = useLanguage();
  const [showBooking, setShowBooking] = useState(false);

  return (
    <div className="dashboard fade-in">
      {showBooking && (
        <BookingFlow
          onClose={() => setShowBooking(false)}
          onConfirm={() => setShowBooking(false)}
        />
      )}
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1>{t('dashboard')}</h1>
          <p>{t('welcome')}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <NavLink to="/assistant" className="btn btn-ghost" style={{ fontSize: 13 }}>
            <Brain size={15} /> {t('assistant')}
          </NavLink>
          <button className="btn btn-primary" onClick={() => setShowBooking(true)}>
            <Plus size={15} /> {t('newAppt')}
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-row">
        {stats.map((s, i) => (
          <div className="stat-card card fade-in" style={{ animationDelay: `${i * 0.06}s` }} key={s.label}>
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>
              <s.icon size={20} />
            </div>
            <div className="stat-info">
              <p className="stat-label">{t(s.label.toLowerCase().replace(/ /g, '').replace(/-/g, ''))}</p>
              <p className="stat-value">{s.value}</p>
              <p className={`stat-change ${s.up ? 'up' : 'down'}`}>
                {s.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {s.change}% {t('fromLastWeek')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Mid Row */}
      <div className="mid-row fade-in-2">
        {/* Trend Chart */}
        <div className="card chart-card">
          <div className="card-header">
            <h3>{t('apptTrend')}</h3>
            <button className="btn btn-ghost" style={{ fontSize: 12, padding: '6px 12px' }}>
              This Week <ChevronDown size={13} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E8FF" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E4E8FF', fontSize: 12 }} />
              <Line type="monotone" dataKey="bookings" stroke="#5B4FD6" strokeWidth={2.5} dot={{ fill: '#5B4FD6', r: 4 }} name="Bookings" />
              <Line type="monotone" dataKey="noShows" stroke="#00C9A7" strokeWidth={2.5} dot={{ fill: '#00C9A7', r: 4 }} name="No-Shows" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Dept Load */}
        <div className="card dept-card">
          <div className="card-header">
            <h3>{t('deptLoad')}</h3>
          </div>
          <div className="dept-content">
            <PieChart width={140} height={140}>
              <Pie data={deptData} cx={65} cy={65} innerRadius={45} outerRadius={65} dataKey="value" stroke="none">
                {deptData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
              </Pie>
            </PieChart>
            <div className="dept-legend">
              {deptData.map(d => (
                <div key={d.name} className="legend-item">
                  <span className="legend-dot" style={{ background: d.color }}></span>
                  <span className="legend-name">{d.name}</span>
                  <span className="legend-pct">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="peak-time">
            <Bell size={14} />
            <div>
              <p className="peak-label">Peak Load Time</p>
              <p className="peak-value">10:00 AM – 01:00 PM</p>
            </div>
          </div>
        </div>

        {/* No-Show Prediction */}
        <div className="card noshow-card">
          <div className="card-header">
            <h3>{t('noShowPred')}</h3>
            <NavLink to="/analytics" className="view-all">{t('viewAll')}</NavLink>
          </div>
          <div className="noshow-list">
            {noShowRisks.map(r => (
              <div key={r.name} className="noshow-item">
                <div className="patient-avatar-sm">{r.name.split(' ').map(n => n[0]).join('')}</div>
                <div className="noshow-info">
                  <p className="noshow-name">{r.name}</p>
                  <p className="noshow-dept">{r.dept}</p>
                </div>
                <span className={`badge ${r.risk}`} style={{ textTransform: 'capitalize' }}>
                  {r.risk === 'high' ? 'High Risk' : 'Medium Risk'}
                </span>
                <div className="noshow-score">
                  <p className="score-val">{r.score}%</p>
                  <p className="score-label">Risk Score</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="bottom-row fade-in-3">
        {/* Upcoming Appointments */}
        <div className="card appt-table-card">
          <div className="card-header">
            <h3>{t('upcomingAppts')}</h3>
            <NavLink to="/appointments" className="view-all">{t('viewAll')}</NavLink>
          </div>
          <table className="appt-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Type</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a, i) => (
                <tr key={i}>
                  <td className="appt-time">{a.time}</td>
                  <td>
                    <div className="patient-cell">
                      <div className="patient-avatar-sm">{a.patient[0]}</div>
                      <div>
                        <p className="patient-name-sm">{a.patient}</p>
                        <p className="patient-age">{a.age}</p>
                      </div>
                    </div>
                  </td>
                  <td>{a.doctor}</td>
                  <td>{a.dept}</td>
                  <td><span className="type-tag">{a.type}</span></td>
                  <td><span className={`badge ${a.status}`} style={{ textTransform: 'capitalize' }}>{a.status}</span></td>
                  <td><button className="icon-action"><MoreVertical size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="right-col">
          {/* Reminders */}
          <div className="card reminders-card">
            <div className="card-header">
              <h3>{t('todaysReminders')}</h3>
              <button className="view-all" style={{ background: 'none', border: 'none', color: 'var(--primary)', padding: 0, cursor: 'pointer', fontSize: 12 }}>{t('viewAll')}</button>
            </div>
            <div className="reminder-list">
              {reminders.map(r => (
                <div key={r.type} className="reminder-item">
                  <div className="reminder-icon" style={{ background: r.color + '20', color: r.color }}>
                    <r.icon size={16} />
                  </div>
                  <div className="reminder-info">
                    <p className="reminder-type">{r.type}</p>
                    <p className="reminder-count">{r.count}</p>
                  </div>
                  <span className="reminder-time">{r.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="card ai-insights-card">
            <div className="card-header">
              <h3>{t('aiInsights')}</h3>
              <button className="view-all" style={{ background: 'none', border: 'none', color: 'var(--primary)', padding: 0, cursor: 'pointer', fontSize: 12 }}>{t('viewAll')}</button>
            </div>
            <div className="insights-list">
              <div className="insight-item">
                <div className="insight-icon calendar"><Calendar size={16} /></div>
                <div>
                  <p className="insight-label">Best Response Time</p>
                  <p className="insight-value primary">06:00 PM – 08:00 PM</p>
                </div>
              </div>
              <div className="insight-item">
                <div className="insight-icon whatsapp"><MessageSquare size={16} /></div>
                <div>
                  <p className="insight-label">Preferred Channel</p>
                  <p className="insight-value success">WhatsApp</p>
                </div>
              </div>
              <div className="insight-item">
                <div className="insight-icon risk"><UserX size={16} /></div>
                <div>
                  <p className="insight-label">High No-Show Risk</p>
                  <p className="insight-value danger">7 Patients</p>
                </div>
              </div>
              <div className="insight-item">
                <div className="insight-icon pred"><TrendingUp size={16} /></div>
                <div>
                  <p className="insight-label">Predicted Appointments</p>
                  <p className="insight-value primary">142</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
