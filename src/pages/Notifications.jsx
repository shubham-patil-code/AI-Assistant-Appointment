import React, { useState } from 'react';
import { Bell, MessageSquare, Phone, Mail, CheckCheck, Trash2, Filter, ArrowRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { useNotifications } from '../NotificationContext';
import NotificationHub from '../components/NotificationHub'; // ✅ ADD
import './Notifications.css';

const filters = ['All', 'Unread', 'Alerts', 'Appointments', 'Reminders', 'System'];

export default function Notifications() {
  const { t } = useLanguage();
  const { notifications: items, markRead, markAllRead, removeNotification: remove } = useNotifications();
  const [active, setActive] = useState('All');

  const unread = items.filter(n => !n.read).length;

  const filtered = items.filter(n => {
    if (active === 'All') return true;
    if (active === 'Unread') return !n.read;
    if (active === 'Alerts') return n.type === 'alert';
    if (active === 'Appointments') return n.title?.toLowerCase().includes('appointment');
    if (active === 'Reminders') return n.title?.toLowerCase().includes('reminder');
    if (active === 'System') return n.type === 'info';
    return true;
  });

  return (
    <>
      <div className="notifs-page fade-in">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h1>{t('notifications')} <span className="notif-count">{unread}</span></h1>
            <p>{t('manageAlerts')}</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost" onClick={markAllRead}>
              <CheckCheck size={14} /> Mark All Read
            </button>
            <button className="btn btn-ghost">
              <Filter size={14} /> Filter
            </button>
          </div>
        </div>

        <div className="notif-layout">
          <div className="notif-main">
            <div className="notif-filters card">
              {filters.map(f => (
                <button key={f} className={`nf-btn ${active === f ? 'active' : ''}`} onClick={() => setActive(f)}>
                  {f}
                  {f === 'Unread' && unread > 0 && <span className="nf-badge">{unread}</span>}
                </button>
              ))}
            </div>

            <div className="notif-list">
              {filtered.map(n => (
                <div key={n.id} className={`notif-item card ${n.read ? 'read' : 'unread'}`}>
                  
                  {/* ✅ FIXED ICON */}
                  <div className="notif-icon" style={{ background: n.bg, color: n.color }}>
                    {n.icon ? <n.icon size={18} /> : <Bell size={18} />}
                  </div>

                  <div className="notif-content">
                    <div className="notif-header">
                      <p className="notif-title">{n.title}</p>
                      <div className="notif-actions">
                        <span className="notif-time">{n.time}</span>
                        {!n.read && (
                          <button onClick={() => markRead(n.id)}>
                            <CheckCheck size={13} />
                          </button>
                        )}
                        <button onClick={() => remove(n.id)}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <p className="notif-msg">{n.msg}</p>

                    {n.link && (
                      <NavLink to={n.link} onClick={() => markRead(n.id)}>
                        View details <ArrowRight size={11} />
                      </NavLink>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="notif-sidebar">
            <div className="card">
              <h3>Reminder Channels</h3>

              {[
                { icon: MessageSquare, label: 'WhatsApp', color: '#25D366' },
                { icon: Phone, label: 'SMS', color: '#6366F1' },
                { icon: Mail, label: 'Email', color: '#EF4444' },
              ].map(c => (
                <div key={c.label} className="channel-item">
                  
                  {/* ✅ SAFE ICON */}
                  <div className="channel-icon">
                    {c.icon && <c.icon size={15} />}
                  </div>

                  <p>{c.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ ADD THIS */}
      <NotificationHub />
    </>
  );
}