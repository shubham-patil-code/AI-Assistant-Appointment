import React, { useState, useEffect } from 'react';
import { Activity, Cpu, Server, Wifi, Database, AlertTriangle, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useLanguage } from '../LanguageContext';
import './Monitoring.css';

const generateData = () => Array.from({ length: 20 }, (_, i) => ({
  t: i,
  cpu: Math.floor(30 + Math.random() * 40),
  memory: Math.floor(45 + Math.random() * 30),
  requests: Math.floor(80 + Math.random() * 60),
}));

const services = [
  { name: 'AI Engine Service', status: 'online', uptime: '99.9%', latency: '42ms', icon: Activity, desc: 'Symptom analysis & doctor matching' },
  { name: 'Booking Service', status: 'online', uptime: '99.8%', latency: '28ms', icon: Server, desc: 'Real-time slot management, Redis sync' },
  { name: 'User Service', status: 'online', uptime: '99.9%', latency: '18ms', icon: Server, desc: 'Auth, RBAC, session management' },
  { name: 'Notification Service', status: 'online', uptime: '99.5%', latency: '95ms', icon: Wifi, desc: 'SMS, Email, WhatsApp, Web Push' },
  { name: 'Analytics Service', status: 'degraded', uptime: '97.2%', latency: '380ms', icon: Activity, desc: 'Reports, ETL pipelines, ML insights' },
  { name: 'Redis Cache', status: 'online', uptime: '100%', latency: '2ms', icon: Database, desc: 'Sessions, slots, cache data' },
  { name: 'Primary Database', status: 'online', uptime: '99.9%', latency: '12ms', icon: Database, desc: 'MySQL/PostgreSQL cluster' },
  { name: 'API Gateway', status: 'online', uptime: '100%', latency: '8ms', icon: Wifi, desc: 'Token validation, rate limiting' },
];

const recentEvents = [
  { type: 'error', msg: 'Email service connection timeout', time: '2 min ago' },
  { type: 'warning', msg: 'Report generator response time >300ms', time: '15 min ago' },
  { type: 'success', msg: 'Daily backup completed successfully', time: '2 hours ago' },
  { type: 'info', msg: 'AI model inference cache refreshed', time: '3 hours ago' },
  { type: 'success', msg: 'Database optimization completed', time: '6 hours ago' },
  { type: 'warning', msg: 'Memory usage peaked at 78%', time: '8 hours ago' },
];

const statusColor = { online: 'var(--success)', degraded: 'var(--warning)', offline: 'var(--danger)' };
const statusBg = { online: '#D1FAE5', degraded: '#FEF3C7', offline: '#FEE2E2' };
const eventColor = { error: 'var(--danger)', warning: 'var(--warning)', success: 'var(--success)', info: 'var(--info)' };
const eventBg = { error: '#FEE2E2', warning: '#FEF3C7', success: '#D1FAE5', info: '#DBEAFE' };

export default function Monitoring() {
  const { t } = useLanguage();
  const [metrics, setMetrics] = useState(generateData());
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => {
      setMetrics(prev => {
        const next = [...prev.slice(1), {
          t: prev[prev.length - 1].t + 1,
          cpu: Math.floor(30 + Math.random() * 40),
          memory: Math.floor(45 + Math.random() * 30),
          requests: Math.floor(80 + Math.random() * 60),
        }];
        return next;
      });
      setLastUpdate(new Date());
    }, 3000);
    return () => clearInterval(id);
  }, [autoRefresh]);

  const latest = metrics[metrics.length - 1];

  return (
    <div className="monitoring-page fade-in">
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div><h1>{t('monitoringTitle')}</h1><p>{t('realTimeInsights')}</p></div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span className="last-update"><Clock size={13} /> Updated {lastUpdate.toLocaleTimeString()}</span>
          <button
            className={`btn ${autoRefresh ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setAutoRefresh(r => !r)}
          >
            <RefreshCw size={14} className={autoRefresh ? 'spin' : ''} />
            {autoRefresh ? 'Live' : 'Paused'}
          </button>
        </div>
      </div>

      {/* System Health */}
      <div className="health-grid fade-in-1">
        {[
          { label: 'CPU Usage', value: latest.cpu, unit: '%', color: latest.cpu > 70 ? 'var(--danger)' : 'var(--primary)', icon: Cpu },
          { label: 'Memory Usage', value: latest.memory, unit: '%', color: latest.memory > 70 ? 'var(--warning)' : 'var(--success)', icon: Server },
          { label: 'API Requests/min', value: latest.requests, unit: '/min', color: 'var(--info)', icon: Activity },
          { label: 'Active Sessions', value: 48, unit: '', color: 'var(--accent)', icon: Wifi },
        ].map(m => (
          <div className="card health-card" key={m.label}>
            <div className="hc-header">
              <span className="hc-label">{m.label}</span>
              <div className="hc-icon" style={{ background: m.color + '20', color: m.color }}><m.icon size={16} /></div>
            </div>
            <p className="hc-value" style={{ color: m.color }}>{m.value}<span className="hc-unit">{m.unit}</span></p>
            <div className="hc-bar">
              <div className="hc-fill" style={{ width: `${Math.min(m.value, 100)}%`, background: m.color }}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="monitoring-grid fade-in-2">
        {/* CPU / Memory Chart */}
        <div className="card chart-card-mon">
          <div className="card-header-mon">
            <h3>CPU & Memory Usage</h3>
            <span className="live-badge">● LIVE</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={metrics}>
              <defs>
                <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5B4FD6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#5B4FD6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00C9A7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00C9A7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E8FF" />
              <XAxis dataKey="t" tick={false} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E4E8FF', fontSize: 12 }} />
              <Area type="monotone" dataKey="cpu" stroke="#5B4FD6" fill="url(#cpuGrad)" strokeWidth={2} name="CPU %" />
              <Area type="monotone" dataKey="memory" stroke="#00C9A7" fill="url(#memGrad)" strokeWidth={2} name="Memory %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Services */}
        <div className="card">
          <div className="card-header-mon" style={{ marginBottom: 14 }}>
            <h3>Service Status</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <span className="status-legend online">● Online</span>
              <span className="status-legend degraded">● Degraded</span>
              <span className="status-legend offline">● Offline</span>
            </div>
          </div>
          <div className="service-list">
            {services.map(svc => (
              <div key={svc.name} className="service-row">
                <div className="svc-indicator" style={{ background: statusColor[svc.status] }}></div>
                <svc.icon size={15} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
                <div className="svc-info">
                  <p className="svc-name">{svc.name}</p>
                  <p className="svc-uptime">Uptime: {svc.uptime}</p>
                </div>
                <div className="svc-right">
                  <span className="svc-latency">{svc.latency}</span>
                  <span className="badge" style={{ background: statusBg[svc.status], color: statusColor[svc.status], textTransform: 'capitalize' }}>{svc.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Events */}
        <div className="card events-card">
          <div className="card-header-mon" style={{ marginBottom: 14 }}>
            <h3>Recent Events</h3>
          </div>
          <div className="events-list">
            {recentEvents.map((ev, i) => (
              <div key={i} className="event-row">
                <div className="event-dot" style={{ background: eventColor[ev.type] }}></div>
                <div className="event-icon-wrap" style={{ background: eventBg[ev.type], color: eventColor[ev.type] }}>
                  {ev.type === 'error' || ev.type === 'warning' ? <AlertTriangle size={12} /> : <CheckCircle size={12} />}
                </div>
                <p className="event-msg">{ev.msg}</p>
                <span className="event-time">{ev.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* API Requests Chart */}
        <div className="card">
          <div className="card-header-mon" style={{ marginBottom: 14 }}>
            <h3>API Request Volume</h3>
            <span className="live-badge">● LIVE</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E8FF" />
              <XAxis dataKey="t" tick={false} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E4E8FF', fontSize: 12 }} />
              <Line type="monotone" dataKey="requests" stroke="#3B82F6" strokeWidth={2.5} dot={false} name="Requests/min" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
