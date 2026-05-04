import React, { useEffect, useState } from 'react';
import { useNotifications } from '../NotificationContext';
import { MessageSquare, Phone, Mail, Bell, CheckCircle, X } from 'lucide-react';
import './NotificationHub.css';

export default function NotificationHub() {
  const { activeAlert, setActiveAlert } = useNotifications();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (activeAlert) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [activeAlert]);

  if (!activeAlert) return null;

  const channels = activeAlert.channels || ['web'];

  return (
    <div className={`notification-hub-overlay ${visible ? 'visible' : ''}`}>
      <div className="notification-hub-card card">
        <div className="nh-header">
          <div className="nh-title-wrap">
            <div className="nh-status-icon" style={{ background: activeAlert.bg, color: activeAlert.color }}>
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="nh-label">Multi-Channel Alert Sent</p>
              <h4 className="nh-title">{activeAlert.title}</h4>
            </div>
          </div>
          <button className="nh-close" onClick={() => setActiveAlert(null)}><X size={16} /></button>
        </div>
        
        <p className="nh-msg">{activeAlert.msg}</p>

        <div className="nh-channels">
          {[
            { id: 'web', icon: Bell, label: 'Web Push', color: '#3B82F6' },
            { id: 'sms', icon: Phone, label: 'SMS', color: '#6366F1' },
            { id: 'whatsapp', icon: MessageSquare, label: 'WhatsApp', color: '#25D366' },
            { id: 'email', icon: Mail, label: 'Email', color: '#EF4444' },
          ].map(ch => {
            const isActive = channels.includes(ch.id);
            return (
              <div key={ch.id} className={`nh-channel ${isActive ? 'active' : 'disabled'}`}>
                <div className="nh-ch-icon" style={{ background: isActive ? ch.color + '20' : '#f3f4f6', color: isActive ? ch.color : '#9ca3af' }}>
                  <ch.icon size={16} />
                </div>
                <div className="nh-ch-info">
                  <p className="nh-ch-label">{ch.label}</p>
                  <p className="nh-ch-status">{isActive ? 'Delivered' : 'Not Opted'}</p>
                </div>
                {isActive && <div className="nh-ch-check">✓</div>}
              </div>
            );
          })}
        </div>

        <div className="nh-footer">
          <span className="nh-timestamp">Sent via Notification Hub • Just now</span>
        </div>
      </div>
    </div>
  );
}
