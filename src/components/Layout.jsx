import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import {
  LayoutDashboard, Bot, CalendarDays, Users, Stethoscope, Clock,
  Bell, BarChart3, Activity, Settings, ChevronDown, Search,
  MessageSquare, Calendar, Globe, Sparkles, Plus
} from 'lucide-react';
import BookingFlow from './BookingFlow';
import './Layout.css';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, labelKey: 'dashboard' },
  { path: '/assistant', icon: Bot, labelKey: 'assistant', badge: 'AI' },
  { path: '/appointments', icon: CalendarDays, labelKey: 'appointments' },
  { path: '/patients', icon: Users, labelKey: 'patients' },
  { path: '/doctors', icon: Stethoscope, labelKey: 'doctors' },
  { path: '/schedules', icon: Clock, labelKey: 'schedules' },
  { path: '/notifications', icon: Bell, labelKey: 'notifications', count: 12 },
  { path: '/analytics', icon: BarChart3, labelKey: 'analytics' },
  { path: '/monitoring', icon: Activity, labelKey: 'monitoring' },
  { path: '/settings', icon: Settings, labelKey: 'settings' },
];

export default function Layout() {
  const { currentLanguage, setCurrentLanguage, t } = useLanguage();
  const [searchVal, setSearchVal] = useState('');
  const [showBooking, setShowBooking] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);


  return (
    <div className="layout">
      {showBooking && (
        <BookingFlow
          onClose={() => setShowBooking(false)}
          onConfirm={() => setShowBooking(false)}
        />
      )}
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Sparkles size={18} />
          </div>
          <div className="brand-text">
            <span className="brand-name">AI Appointment</span>
            <span className="brand-sub">Assistant</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={18} />
              <span>{t(item.labelKey)}</span>
              {item.badge && <span className="nav-badge ai-badge">{item.badge}</span>}
              {item.count && <span className="nav-count">{item.count}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="ai-bot-card">
            <div className="bot-avatar-sm">
              <Bot size={20} />
            </div>
            <div>
              <p className="bot-title">{t('needHelp')}</p>
              <p className="bot-sub">{t('askAI')}</p>
            </div>
            <NavLink to="/assistant" className="bot-arrow">→</NavLink>
          </div>
          
          <div className="lang-container" style={{ position: 'relative' }}>
            <div className="lang-select" onClick={() => setShowLangMenu(!showLangMenu)}>
              <Globe size={14} />
              <span>{currentLanguage === 'en' ? 'English' : currentLanguage === 'hi' ? 'Hindi' : 'Marathi'}</span>
              <ChevronDown size={13} style={{ transform: showLangMenu ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
            </div>
            
            {showLangMenu && (
              <div className="lang-dropdown" style={{
                position: 'absolute',
                bottom: '100%',
                left: 0,
                width: '100%',
                background: '#fff',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                marginBottom: '5px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                zIndex: 100
              }}>
                {[
                  { code: 'en', label: 'English' },
                  { code: 'hi', label: 'Hindi (हिंदी)' },
                  { code: 'mr', label: 'Marathi (मराठी)' }
                ].map(lang => (
                  <div
                    key={lang.code}
                    className={`lang-option ${currentLanguage === lang.code ? 'active' : ''}`}
                    onClick={() => {
                      setCurrentLanguage(lang.code);
                      setShowLangMenu(false);
                    }}
                    style={{
                      padding: '10px 12px',
                      fontSize: '13px',
                      cursor: 'pointer',
                      background: currentLanguage === lang.code ? 'var(--primary-bg)' : 'transparent',
                      color: currentLanguage === lang.code ? 'var(--primary)' : 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    {lang.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="main-wrap">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <div className="search-bar">
              <Search size={15} />
              <input
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder={t('searchPlaceholderGeneral') || 'Search patients, appointments...'}
              />
            </div>
          </div>
          <div className="header-right">
            <button className="btn btn-primary" style={{ fontSize: 12, padding: '8px 14px', gap: 6 }} onClick={() => setShowBooking(true)}>
              <Plus size={14} /> {t('book')}
            </button>
            <button className="icon-btn"><Calendar size={18} /></button>
            <button className="icon-btn notify-btn">
              <MessageSquare size={18} />
              <span className="dot">5</span>
            </button>
            <button className="icon-btn notify-btn">
              <Bell size={18} />
              <span className="dot danger">8</span>
            </button>
            <div className="user-chip">
              <div className="user-avatar">DA</div>
              <div className="user-info">
                <span className="user-name">Dr. Admin</span>
                <span className="user-role">Administrator</span>
              </div>
              <ChevronDown size={14} />
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
