import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Download } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import './Analytics.css';

const monthly = [
  { month: 'Jan', appointments: 320, revenue: 48000, noShows: 45 },
  { month: 'Feb', appointments: 285, revenue: 42750, noShows: 38 },
  { month: 'Mar', appointments: 410, revenue: 61500, noShows: 52 },
  { month: 'Apr', appointments: 380, revenue: 57000, noShows: 41 },
  { month: 'May', appointments: 450, revenue: 67500, noShows: 35 },
  { month: 'Jun', appointments: 390, revenue: 58500, noShows: 48 },
];

const deptRevenue = [
  { dept: 'Cardiology', value: 28500, color: '#5B4FD6' },
  { dept: 'Orthopedics', value: 19200, color: '#00C9A7' },
  { dept: 'Gen. Med', value: 14800, color: '#FFA94D' },
  { dept: 'Dermatology', value: 9600, color: '#3B82F6' },
  { dept: 'Pediatrics', value: 7400, color: '#EC4899' },
  { dept: 'Neurology', value: 6900, color: '#F59E0B' },
];

const noShowTrend = [
  { week: 'W1', risk: 18 }, { week: 'W2', risk: 22 }, { week: 'W3', risk: 15 },
  { week: 'W4', risk: 28 }, { week: 'W5', risk: 19 }, { week: 'W6', risk: 12 },
];

export default function Analytics() {
  const { t } = useLanguage();
  const [period, setPeriod] = useState('6M');
  
  const kpis = [
    { labelKey: 'totalRevenue', value: '₹67,500', change: 18.3, up: true },
    { labelKey: 'avgDailyAppts', value: '22.5', change: 8.6, up: true },
    { labelKey: 'noShowRate', value: '7.8%', change: 2.1, up: false },
    { labelKey: 'patientSatisfaction', value: '4.7/5', change: 0.3, up: true },
  ];

  return (
    <div className="analytics-page fade-in">
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div><h1>{t('analyticsTitle')}</h1><p>{t('performanceInsights')}</p></div>
        <div style={{ display: 'flex', gap: 10 }}>
          {['1M', '3M', '6M', '1Y'].map(p => (
            <button key={p} className={`period-btn ${period === p ? 'active' : ''}`} onClick={() => setPeriod(p)}>{p}</button>
          ))}
          <button className="btn btn-ghost"><Download size={14} /> {t('export')}</button>
        </div>
      </div>

      {/* AI System Flow KPIs */}
      <div className="flow-kpis fade-in-1">
        {[
          { labelKey: 'bookingCompletionRate', value: '85%', sub: 'Symptom to confirmed', color: '#5B4FD6', bg: '#EEF0FF', bar: 85 },
          { labelKey: 'noShowRate', value: '15%', sub: 'AI-predicted high-risk', color: '#EF4444', bg: '#FEE2E2', bar: 15 },
          { label: 'Average Rating', value: '4.6★', sub: 'Patient feedback', color: '#F59E0B', bg: '#FEF3C7', bar: 92 },
          { label: 'Peak vs Off-Peak', value: '2.3x', sub: 'Traffic ratio', color: '#10B981', bg: '#D1FAE5', bar: 70 },
          { label: 'Slot Consistency', value: '99.9%', sub: 'Via distributed locking', color: '#06B6D4', bg: '#CFFAFE', bar: 99.9 },
          { labelKey: 'avgResponseTime', value: '<50ms', sub: 'Slot availability queries', color: '#8B5CF6', bg: '#EDE9FE', bar: 95 },
        ].map(k => (
          <div className="flow-kpi-card card" key={k.labelKey || k.label}>
            <p className="fkpi-label">{k.labelKey ? t(k.labelKey) : k.label}</p>
            <p className="fkpi-value" style={{ color: k.color }}>{k.value}</p>
            <div className="fkpi-bar-track">
              <div className="fkpi-bar-fill" style={{ width: k.bar + '%', background: k.color }} />
            </div>
            <p className="fkpi-sub">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* KPIs */}
      <div className="kpi-grid fade-in-1">
        {kpis.map(k => (
          <div className="card kpi-card" key={k.labelKey}>
            <p className="kpi-label">{t(k.labelKey)}</p>
            <p className="kpi-value">{k.value}</p>
            <p className={`kpi-change ${k.up ? 'up' : 'down'}`}>
              {k.up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {k.up ? '+' : '-'}{k.change}% {t('vsLastPeriod')}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="analytics-grid fade-in-2">
        <div className="card chart-full">
          <div className="card-header">
            <h3>{t('revenueTrends')}</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthly}>
              <defs>
                <linearGradient id="apptGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5B4FD6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#5B4FD6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00C9A7" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#00C9A7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E8FF" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E4E8FF', fontSize: 12 }} />
              <Legend />
              <Area type="monotone" dataKey="appointments" stroke="#5B4FD6" strokeWidth={2.5} fill="url(#apptGrad)" name="Appointments" />
              <Area type="monotone" dataKey="noShows" stroke="#EF4444" strokeWidth={2} fill="none" strokeDasharray="5 5" name="No-Shows" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header"><h3>{t('revenueByDept')}</h3></div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={deptRevenue} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E8FF" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="dept" type="category" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E4E8FF', fontSize: 12 }} formatter={v => [`₹${v.toLocaleString()}`, 'Revenue']} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {deptRevenue.map((entry, index) => <Cell key={index} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header"><h3>{t('noShowRiskTrend')}</h3></div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={noShowTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E8FF" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E4E8FF', fontSize: 12 }} />
              <Line type="monotone" dataKey="risk" stroke="#EF4444" strokeWidth={2.5} dot={{ fill: '#EF4444', r: 5 }} name="High Risk Patients" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header"><h3>{t('topDoctors')}</h3></div>
          <div className="doctor-perf-list">
            {[
              { name: 'Dr. Ravi Sharma', dept: 'Cardiology', appts: 42, rating: 4.9, revenue: 18200 },
              { name: 'Dr. Sarah Johnson', dept: 'Cardiology', appts: 38, rating: 4.9, revenue: 16500 },
              { name: 'Dr. Meera Kulkarni', dept: 'Pediatrics', appts: 35, rating: 4.8, revenue: 14200 },
              { name: 'Dr. Suresh Nair', dept: 'Orthopedics', appts: 31, rating: 4.7, revenue: 12800 },
            ].map((doc, i) => (
              <div key={doc.name} className="doc-perf-row">
                <span className="perf-rank">#{i + 1}</span>
                <div className="perf-info">
                  <p className="perf-name">{doc.name}</p>
                  <p className="perf-dept">{doc.dept}</p>
                </div>
                <div className="perf-stats">
                  <p className="perf-val">{doc.appts} appts</p>
                  <p className="perf-rev">₹{doc.revenue.toLocaleString()}</p>
                </div>
                <div className="perf-rating">⭐ {doc.rating}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
