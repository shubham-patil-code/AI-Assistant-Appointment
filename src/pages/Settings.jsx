import React, { useState } from 'react';
import { User, Bell, Shield, Palette, Globe, Database, Bot, ChevronRight, Save, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import './Settings.css';

const settingsSections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'ai', label: 'AI Configuration', icon: Bot },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'language', label: 'Language & Region', icon: Globe },
  { id: 'data', label: 'Data & Backup', icon: Database },
];

function Toggle({ checked, onChange }) {
  return (
    <div className={`toggle ${checked ? 'on' : ''}`} onClick={() => onChange(!checked)}>
      <div className="toggle-thumb"></div>
    </div>
  );
}

function ProfileSection() {
  return (
    <div className="settings-section">
      <h2 className="section-title">Profile Settings</h2>
      <p className="section-desc">Manage your personal information and account details</p>
      <div className="profile-avatar-section">
        <div className="big-avatar">DA</div>
        <div>
          <p className="avatar-name">Dr. Admin</p>
          <p className="avatar-role">System Administrator</p>
          <button className="btn btn-outline" style={{ marginTop: 8, fontSize: 12 }}>Change Photo</button>
        </div>
      </div>
      <div className="form-grid">
        {[
          { label: 'First Name', value: 'Admin', type: 'text' },
          { label: 'Last Name', value: 'Singh', type: 'text' },
          { label: 'Email', value: 'admin@hospital.com', type: 'email' },
          { label: 'Phone', value: '+91 9876543210', type: 'tel' },
          { label: 'Designation', value: 'Administrator', type: 'text' },
          { label: 'Department', value: 'Administration', type: 'text' },
        ].map(f => (
          <div className="form-group" key={f.label}>
            <label className="form-label">{f.label}</label>
            <input className="form-input" type={f.type} defaultValue={f.value} />
          </div>
        ))}
      </div>
      <button className="btn btn-primary"><Save size={14} /> Save Changes</button>
    </div>
  );
}

function NotificationsSection() {
  const [notifs, setNotifs] = useState({
    emailAppt: true, smsAppt: true, whatsappAppt: true, pushAppt: false,
    emailReport: true, smsReport: false, dailyDigest: true, noShowAlert: true,
    systemAlert: true, newPatient: true,
  });
  const toggle = key => setNotifs(p => ({ ...p, [key]: !p[key] }));

  return (
    <div className="settings-section">
      <h2 className="section-title">Notification Preferences</h2>
      <p className="section-desc">Control how and when you receive notifications</p>
      {[
        { title: 'Appointment Notifications', items: [
          { key: 'emailAppt', label: 'Email reminders for appointments' },
          { key: 'smsAppt', label: 'SMS reminders for appointments' },
          { key: 'whatsappAppt', label: 'WhatsApp reminders' },
          { key: 'pushAppt', label: 'Push notifications' },
        ]},
        { title: 'Report Notifications', items: [
          { key: 'emailReport', label: 'Email weekly reports' },
          { key: 'smsReport', label: 'SMS urgent alerts' },
          { key: 'dailyDigest', label: 'Daily digest email' },
        ]},
        { title: 'System Notifications', items: [
          { key: 'noShowAlert', label: 'High no-show risk alerts' },
          { key: 'systemAlert', label: 'System health alerts' },
          { key: 'newPatient', label: 'New patient registrations' },
        ]},
      ].map(group => (
        <div className="notif-group" key={group.title}>
          <h3 className="group-title">{group.title}</h3>
          {group.items.map(item => (
            <div className="notif-row" key={item.key}>
              <span className="notif-row-label">{item.label}</span>
              <Toggle checked={notifs[item.key]} onChange={() => toggle(item.key)} />
            </div>
          ))}
        </div>
      ))}
      <button className="btn btn-primary"><Save size={14} /> Save Preferences</button>
    </div>
  );
}

function AISection() {
  const [settings, setSettings] = useState({
    enabled: true, autoBook: false, noShowPred: true, smartReminders: true,
    confidence: 75, reminderLead: 24,
  });

  return (
    <div className="settings-section">
      <h2 className="section-title">AI Configuration</h2>
      <p className="section-desc">Configure AI Appointment Assistant behavior and thresholds</p>

      <div className="ai-status-banner">
        <div className="ai-status-dot"></div>
        <div>
          <p className="ai-status-title">AI Assistant is Active</p>
          <p className="ai-status-sub">Model: Claude Sonnet 4 • Last training: May 10, 2025</p>
        </div>
        <Toggle checked={settings.enabled} onChange={v => setSettings(p => ({ ...p, enabled: v }))} />
      </div>

      <div className="notif-group">
        <h3 className="group-title">AI Features</h3>
        {[
          { key: 'autoBook', label: 'Auto-book confirmed appointments' },
          { key: 'noShowPred', label: 'No-show risk prediction' },
          { key: 'smartReminders', label: 'Smart reminder scheduling' },
        ].map(item => (
          <div className="notif-row" key={item.key}>
            <span className="notif-row-label">{item.label}</span>
            <Toggle checked={settings[item.key]} onChange={v => setSettings(p => ({ ...p, [item.key]: v }))} />
          </div>
        ))}
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Confidence Threshold (%)</label>
          <input className="form-input" type="number" value={settings.confidence} onChange={e => setSettings(p => ({ ...p, confidence: e.target.value }))} min="50" max="99" />
          <p className="form-hint">Minimum AI confidence to trigger automated actions</p>
        </div>
        <div className="form-group">
          <label className="form-label">Reminder Lead Time (hours)</label>
          <input className="form-input" type="number" value={settings.reminderLead} onChange={e => setSettings(p => ({ ...p, reminderLead: e.target.value }))} min="1" max="72" />
          <p className="form-hint">How many hours before appointment to send reminders</p>
        </div>
      </div>
      <button className="btn btn-primary"><Save size={14} /> Save AI Settings</button>
    </div>
  );
}

function SecuritySection() {
  const [showPass, setShowPass] = useState(false);
  const [twoFA, setTwoFA] = useState(true);
  return (
    <div className="settings-section">
      <h2 className="section-title">Security Settings</h2>
      <p className="section-desc">Manage your account security and access controls</p>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Current Password</label>
          <div className="pass-input">
            <input className="form-input" type={showPass ? 'text' : 'password'} defaultValue="••••••••" />
            <button className="pass-eye" onClick={() => setShowPass(v => !v)}>{showPass ? <EyeOff size={15} /> : <Eye size={15} />}</button>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">New Password</label>
          <input className="form-input" type="password" placeholder="Enter new password" />
        </div>
      </div>
      <div className="notif-group">
        <h3 className="group-title">Two-Factor Authentication</h3>
        <div className="notif-row">
          <div>
            <span className="notif-row-label">Enable 2FA</span>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Requires OTP on every login</p>
          </div>
          <Toggle checked={twoFA} onChange={setTwoFA} />
        </div>
      </div>
      <div className="session-list">
        <h3 className="group-title">Active Sessions</h3>
        {[
          { device: 'Chrome - Windows 11', location: 'Pune, India', time: 'Current session', current: true },
          { device: 'Mobile - Android', location: 'Mumbai, India', time: '2 hours ago', current: false },
        ].map(s => (
          <div key={s.device} className="session-row">
            <div style={{ flex: 1 }}>
              <p className="svc-name">{s.device}</p>
              <p className="svc-uptime">{s.location} • {s.time}</p>
            </div>
            {s.current ? <span className="badge active">Current</span> : <button className="btn btn-danger" style={{ fontSize: 11, padding: '4px 10px' }}>Revoke</button>}
          </div>
        ))}
      </div>
      <button className="btn btn-primary"><Save size={14} /> Update Password</button>
    </div>
  );
}

function AppearanceSection() {
  const [theme, setTheme] = useState('light');
  const [accent, setAccent] = useState('#5B4FD6');
  const accents = ['#5B4FD6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];
  return (
    <div className="settings-section">
      <h2 className="section-title">Appearance</h2>
      <p className="section-desc">Customize the look and feel of your dashboard</p>
      <div className="notif-group">
        <h3 className="group-title">Theme</h3>
        <div className="theme-options">
          {['light', 'dark', 'system'].map(t => (
            <button key={t} className={`theme-btn ${theme === t ? 'active' : ''}`} onClick={() => setTheme(t)}>
              <div className={`theme-preview ${t}`}></div>
              <span style={{ textTransform: 'capitalize' }}>{t}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="notif-group">
        <h3 className="group-title">Accent Color</h3>
        <div className="accent-options">
          {accents.map(c => (
            <button key={c} className={`accent-btn ${accent === c ? 'active' : ''}`} style={{ background: c }} onClick={() => setAccent(c)}>
              {accent === c && <span className="accent-check">✓</span>}
            </button>
          ))}
        </div>
      </div>
      <button className="btn btn-primary"><Save size={14} /> Save Appearance</button>
    </div>
  );
}

const sectionComponents = {
  profile: ProfileSection,
  notifications: NotificationsSection,
  ai: AISection,
  security: SecuritySection,
  appearance: AppearanceSection,
  language: () => <div className="settings-section"><h2 className="section-title">Language & Region</h2><p className="section-desc">Localization settings coming soon.</p></div>,
  data: () => <div className="settings-section"><h2 className="section-title">Data & Backup</h2><p className="section-desc">Backup and export settings coming soon.</p></div>,
};

export default function Settings() {
  const [active, setActive] = useState('profile');
  const ActiveSection = sectionComponents[active];
  const { t } = useLanguage();

  return (
    <div className="settings-page fade-in">
      <div className="page-header">
        <h1>{t('settingsTitle')}</h1>
        <p>{t('configureApp')}</p>
      </div>
      <div className="settings-layout">
        <div className="settings-nav card fade-in-1">
          {settingsSections.map(s => (
            <button key={s.id} className={`settings-nav-item ${active === s.id ? 'active' : ''}`} onClick={() => setActive(s.id)}>
              <s.icon size={16} />
              <span>{s.label}</span>
              <ChevronRight size={14} className="nav-arrow" />
            </button>
          ))}
        </div>
        <div className="card fade-in-2" style={{ padding: 0 }}>
          <ActiveSection />
        </div>
      </div>
    </div>
  );
}
