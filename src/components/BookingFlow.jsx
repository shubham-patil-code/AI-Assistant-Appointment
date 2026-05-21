import React, { useState } from 'react';
import {
  X, Brain, Stethoscope, Calendar, CheckCircle, ChevronRight,
  Mic, MessageSquare, Globe, Clock, MapPin,
  Star, ArrowLeft, Sparkles, Shield, Bell, Loader2,
  Check, Zap
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useNotifications } from '../NotificationContext';
import './BookingFlow.css';

const DEPARTMENTS = [
  { name: 'Cardiology', icon: '❤️', color: '#EF4444', bg: '#FEE2E2' },
  { name: 'Neurology', icon: '🧠', color: '#8B5CF6', bg: '#EDE9FE' },
  { name: 'Dermatology', icon: '🌿', color: '#10B981', bg: '#D1FAE5' },
  { name: 'General Medicine', icon: '🏥', color: '#3B82F6', bg: '#DBEAFE' },
  { name: 'Gynecology', icon: '🌸', color: '#EC4899', bg: '#FCE7F3' },
  { name: 'Pediatrics', icon: '👶', color: '#F59E0B', bg: '#FEF3C7' },
  { name: 'Orthopedics', icon: '🦴', color: '#6366F1', bg: '#EEF2FF' },
  { name: 'Ophthalmology', icon: '👁️', color: '#06B6D4', bg: '#CFFAFE' },
];

const DOCTORS = {
  'Cardiology': [
    { id: 'DR001', name: 'Dr. Sarah Johnson', specialty: 'Senior Cardiologist', exp: '12 Years', rating: 4.9, patients: 342, available: true, slots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'] },
    { id: 'DR004', name: 'Dr. Ravi Sharma', specialty: 'Interventional Cardiologist', exp: '15 Years', rating: 4.9, patients: 412, available: true, slots: ['10:00 AM', '12:00 PM', '03:00 PM'] },
  ],
  'Neurology': [
    { id: 'DR002', name: 'Dr. James Wilson', specialty: 'Neurologist', exp: '8 Years', rating: 4.7, patients: 218, available: true, slots: ['10:00 AM', '01:00 PM', '04:30 PM'] },
  ],
  'Dermatology': [
    { id: 'DR003', name: 'Dr. Emily Davis', specialty: 'Dermatologist', exp: '5 Years', rating: 4.8, patients: 156, available: true, slots: ['09:30 AM', '11:30 AM', '03:00 PM'] },
  ],
  'General Medicine': [
    { id: 'DR006', name: 'Dr. Amit Verma', specialty: 'General Physician', exp: '6 Years', rating: 4.5, patients: 198, available: false, slots: [] },
    { id: 'DR009', name: 'Dr. Priya Kapoor', specialty: 'General Physician', exp: '9 Years', rating: 4.7, patients: 255, available: true, slots: ['09:00 AM', '11:00 AM', '02:30 PM', '05:00 PM'] },
  ],
  'Gynecology': [
    { id: 'DR005', name: 'Dr. Neha Patil', specialty: 'Gynecologist', exp: '9 Years', rating: 4.6, patients: 287, available: true, slots: ['10:30 AM', '12:30 PM', '04:00 PM'] },
  ],
  'Pediatrics': [
    { id: 'DR007', name: 'Dr. Meera Kulkarni', specialty: 'Pediatrician', exp: '11 Years', rating: 4.8, patients: 326, available: true, slots: ['09:00 AM', '11:00 AM', '02:00 PM'] },
  ],
  'Orthopedics': [
    { id: 'DR008', name: 'Dr. Suresh Nair', specialty: 'Orthopedist', exp: '14 Years', rating: 4.7, patients: 389, available: true, slots: ['10:00 AM', '01:00 PM', '03:30 PM'] },
  ],
};

const DATES = (() => {
  const dates = [];
  const today = new Date(2025, 4, 16); // May 16 2025
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push({
      label: dayNames[d.getDay()],
      date: d.getDate(),
      month: monthNames[d.getMonth()],
      full: `${monthNames[d.getMonth()]} ${d.getDate()}, 2025`,
      isToday: i === 0,
    });
  }
  return dates;
})();

const SYMPTOM_SUGGESTIONS = [
  'Chest pain or tightness',
  'Severe headache',
  'Skin rash or itching',
  'Fever and cold',
  'Joint pain',
  'Abdominal pain',
  'Blurry vision',
  'Irregular heartbeat',
];

const urgencyColors = {
  high: { color: '#EF4444', bg: '#FEE2E2', label: 'High Urgency', icon: '🔴' },
  medium: { color: '#F59E0B', bg: '#FEF3C7', label: 'Medium Urgency', icon: '🟡' },
  low: { color: '#10B981', bg: '#D1FAE5', label: 'Low Urgency', icon: '🟢' },
};

const STEPS = [
  { id: 1, label: 'Symptoms', icon: MessageSquare },
  { id: 2, label: 'AI Analysis', icon: Brain },
  { id: 3, label: 'Select Doctor', icon: Stethoscope },
  { id: 4, label: 'Date & Time', icon: Calendar },
  { id: 5, label: 'Confirm', icon: CheckCircle },
];

export default function BookingFlow({ onClose, onConfirm }) {
  const { t, currentLanguage, setCurrentLanguage } = useLanguage();
  const { notify } = useNotifications();
  const [step, setStep] = useState(1);

  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const [patientName, setPatientName] = useState('');
  const [patientNameError, setPatientNameError] = useState('');
  const [symptomText, setSymptomText] = useState('');

  const analyzeSymptoms = async () => {
    setAnalyzing(true);
    setStep(2);

    // Simulate AI analysis
    await new Promise(r => setTimeout(r, 2200));

    // Map symptoms to departments
    const text = symptomText.toLowerCase();
    let dept = 'General Medicine';
    let urgency = 'low';
    let confidence = 82;

    if (text.includes('chest') || text.includes('heart') || text.includes('cardiac') || text.includes('palpitat')) {
      dept = 'Cardiology';
      urgency = 'high';
      confidence = 94;
    } else if (text.includes('head') || text.includes('neuro') || text.includes('seizure') || text.includes('dizz')) {
      dept = 'Neurology';
      urgency = 'medium';
      confidence = 88;
    } else if (text.includes('skin') || text.includes('rash') || text.includes('itch') || text.includes('acne')) {
      dept = 'Dermatology';
      urgency = 'low';
      confidence = 91;
    } else if (text.includes('joint') || text.includes('bone') || text.includes('fracture') || text.includes('spine')) {
      dept = 'Orthopedics';
      urgency = 'medium';
      confidence = 87;
    } else if (text.includes('fever') || text.includes('cold') || text.includes('cough') || text.includes('flu')) {
      dept = 'General Medicine';
      urgency = 'low';
      confidence = 85;
    } else if (text.includes('eye') || text.includes('vision') || text.includes('blur')) {
      dept = 'Ophthalmology';
      urgency = 'medium';
      confidence = 90;
    }

    setAiResult({ department: dept, urgency, confidence });
    setSelectedDept(dept);
    setAnalyzing(false);
  };

  const handleAnalyze = () => {
    if (!patientName.trim()) {
      setPatientNameError('Patient name is required');
      return;
    }
    setPatientNameError('');
    analyzeSymptoms();
  };
  const goToDoctor = () => setStep(3);
  const goToDateTime = () => { if (selectedDoctor) setStep(4); };
  const goToConfirm = () => { if (selectedDate && selectedTime) setStep(5); };

  const handleConfirm = async () => {
    setConfirming(true);
    await new Promise(r => setTimeout(r, 1800));
    setConfirming(false);
    setConfirmed(true);

    // Trigger Multi-Channel Notification
    notify({
      title: 'Appointment Booked Successfully',
      msg: `Your appointment with ${selectedDoctor?.name} on ${selectedDate?.full} at ${selectedTime} has been confirmed.`,
      type: 'success',
      channels: ['web', 'email', 'sms', 'whatsapp']
    });

    setTimeout(() => {
      onConfirm && onConfirm({
        doctor: selectedDoctor,
        date: selectedDate,
        time: selectedTime,
        dept: selectedDept,
        patientName: patientName,
      });
    }, 1500);
  };

  const deptDoctors = DOCTORS[selectedDept] || [];

  return (
    <div className="booking-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="booking-modal">
        {/* Header */}
        <div className="booking-header">
          <div className="booking-title-area">
            <div className="booking-icon"><Sparkles size={18} /></div>
            <div>
              <h2>{t('bookAppointment')}</h2>
              <p>{t('aiBookingSub') || 'AI-powered intelligent booking'}</p>
            </div>
          </div>
          <button className="booking-close" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Step Progress */}
        <div className="booking-steps">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className={`bstep ${step === s.id ? 'active' : step > s.id ? 'done' : ''}`}>
                <div className="bstep-circle">
                  {step > s.id ? <Check size={14} /> : <s.icon size={14} />}
                </div>
                <span className="bstep-label">{t(s.label.toLowerCase().replace(/ /g, '').replace('&', 'And'))}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`bstep-line ${step > s.id ? 'done' : ''}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        <div className="booking-body">

          {/* STEP 1: Symptom Input */}
          {step === 1 && (
            <div className="bstep-content fade-in">
              <div className="bstep-heading">
                <h3>{t('describeSymptoms')}</h3>
                <p>{t('describeSymptomsSub')}</p>
              </div>

              <div className="lang-row">
                <span className="lang-label"><Globe size={13} /> {t('selectLanguage') || 'Language'}:</span>
                {[
                  { code: 'en', label: 'EN' },
                  { code: 'hi', label: 'HI' },
                  { code: 'mr', label: 'MR' }
                ].map(l => (
                  <button
                    key={l.code}
                    className={`lang-btn ${currentLanguage === l.code ? 'active' : ''}`}
                    onClick={() => setCurrentLanguage(l.code)}
                  >
                    {l.label}
                  </button>
                ))}
              </div>

              <div className="patient-name-input">
                <label className="patient-name-label">{t('patientName') || 'Patient Name'}:</label>
                <input
                  type="text"
                  className="patient-name-field"
                  placeholder={t('enterPatientName') || 'Enter patient name'}
                  value={patientName}
                  onChange={e => setPatientName(e.target.value)}
                  required
                  aria-describedby="patient-name-error"
                />
                {patientNameError && <p id="patient-name-error" className="patient-name-error">{patientNameError}</p>}
              </div>
              <div className="symptom-input-wrap">
                <textarea
                  className="symptom-textarea"
                  placeholder={t('symptomPlaceholder') || "Describe your symptoms..."}
                  value={symptomText}
                  onChange={e => setSymptomText(e.target.value)}
                  rows={4}
                />
                <button className="mic-btn"><Mic size={16} /></button>
              </div>

              <div className="symptom-suggestions">
                <p className="suggestions-label">{t('commonSymptoms')}:</p>
                <div className="suggestions-grid">
                  {SYMPTOM_SUGGESTIONS.map(s => (
                    <button key={s} className="suggestion-chip" onClick={() => setSymptomText(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bstep-footer">
                <button
                  className="btn-booking-primary"
                  onClick={handleAnalyze}
                  disabled={!symptomText.trim()}
                >
                  <Brain size={16} /> {t('analyzeWithAI') || 'Analyze with AI'}
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: AI Analysis */}
          {step === 2 && (
            <div className="bstep-content fade-in">
              <div className="bstep-heading">
                <h3>{t('aiSymptomAnalysis')}</h3>
                <p>{t('aiSymptomAnalysisSub')}</p>
              </div>

              {analyzing ? (
                <div className="analyzing-state">
                  <div className="ai-brain-anim">
                    <div className="brain-ring ring1" />
                    <div className="brain-ring ring2" />
                    <div className="brain-ring ring3" />
                    <Brain size={32} className="brain-icon" />
                  </div>
                  <div className="analysis-steps">
                    {[
                      'Symptom Understanding',
                      'Department Mapping',
                      'Urgency Prediction',
                      'Doctor Recommendation',
                    ].map((s, i) => (
                      <div key={s} className="analysis-step" style={{ animationDelay: `${i * 0.4}s` }}>
                        <Loader2 size={14} className="spin" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : aiResult && (
                <div className="ai-result">
                  <div className="ai-result-header">
                    <div className="ai-result-icon"><CheckCircle size={22} /></div>
                    <div>
                      <p className="ai-result-title">{t('analysisComplete')}</p>
                      <p className="ai-result-sub">{t('confidence')}: {aiResult.confidence}%</p>
                    </div>
                  </div>

                  <div className="ai-cards">
                    <div className="ai-card dept-card-result">
                      <p className="ai-card-label">{t('recommendedDept')}</p>
                      <div className="ai-card-value">
                        {DEPARTMENTS.find(d => d.name === aiResult.department)?.icon || '🏥'}
                        <strong>{aiResult.department}</strong>
                      </div>
                    </div>
                    <div className="ai-card" style={{ background: urgencyColors[aiResult.urgency].bg }}>
                      <p className="ai-card-label">{t('urgencyLevel')}</p>
                      <div className="ai-card-value" style={{ color: urgencyColors[aiResult.urgency].color }}>
                        {urgencyColors[aiResult.urgency].icon}
                        <strong>{t(`${aiResult.urgency}Urgency`)}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="symptoms-review">
                    <p className="sr-label">{t('symptomsAnalyzed')}:</p>
                    <p className="sr-text">"{symptomText}"</p>
                  </div>

                  <div className="dept-selector">
                    <p className="ds-label">{t('changeDeptOptional')}:</p>
                    <div className="dept-chips">
                      {DEPARTMENTS.map(d => (
                        <button
                          key={d.name}
                          className={`dept-chip ${selectedDept === d.name ? 'active' : ''}`}
                          onClick={() => setSelectedDept(d.name)}
                          style={selectedDept === d.name ? { background: d.bg, color: d.color, borderColor: d.color } : {}}
                        >
                          {d.icon} {d.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bstep-footer">
                    <button className="btn-booking-ghost" onClick={() => setStep(1)}>
                      <ArrowLeft size={15} /> {t('back')}
                    </button>
                    <button className="btn-booking-primary" onClick={goToDoctor}>
                      <Stethoscope size={16} /> {t('selectDoctor')}
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Doctor Selection */}
          {step === 3 && (
            <div className="bstep-content fade-in">
              <div className="bstep-heading">
                <h3>{t('selectDoctor')}</h3>
                <p>{t('availableDoctorsIn')} <strong>{selectedDept}</strong></p>
              </div>

              <div className="doctor-list">
                {deptDoctors.length > 0 ? deptDoctors.map(doc => (
                  <div
                    key={doc.id}
                    className={`doctor-option ${selectedDoctor?.id === doc.id ? 'selected' : ''} ${!doc.available ? 'unavailable' : ''}`}
                    onClick={() => doc.available && setSelectedDoctor(doc)}
                  >
                    <div className="doc-opt-avatar">{doc.name.replace('Dr. ', '').split(' ').map(n => n[0]).join('')}</div>
                    <div className="doc-opt-info">
                      <p className="doc-opt-name">{doc.name}</p>
                      <p className="doc-opt-spec">{doc.specialty}</p>
                      <div className="doc-opt-meta">
                        <span><Clock size={11} />{doc.exp}</span>
                        <span><Users2 size={11} />{doc.patients} {t('patients')}</span>
                        <span className="doc-opt-slots">
                          {doc.available ? `${doc.slots.length} ${t('slots')}` : t('notAvailable')}
                        </span>
                      </div>
                    </div>
                    <div className="doc-opt-right">
                      <div className="doc-opt-rating">
                        <Star size={13} fill="#F59E0B" stroke="none" />
                        <span>{doc.rating}</span>
                      </div>
                      {!doc.available && <span className="badge warning" style={{ fontSize: 10 }}>{t('onLeave')}</span>}
                      {selectedDoctor?.id === doc.id && <div className="selected-check"><Check size={14} /></div>}
                    </div>
                  </div>
                )) : (
                  <div className="no-doctors">
                    <Stethoscope size={32} />
                    <p>No doctors available for {selectedDept}</p>
                    <button onClick={() => setStep(2)}>Change Department</button>
                  </div>
                )}
              </div>

              <div className="bstep-footer">
                <button className="btn-booking-ghost" onClick={() => setStep(2)}>
                  <ArrowLeft size={15} /> {t('back')}
                </button>
                <button className="btn-booking-primary" onClick={goToDateTime} disabled={!selectedDoctor}>
                  <Calendar size={16} /> {t('pickDateAndTime')}
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Date & Time */}
          {step === 4 && (
            <div className="bstep-content fade-in">
              <div className="bstep-heading">
                <h3>{t('pickDateAndTime')}</h3>
                <p>{t('availableDoctorsIn')} <strong>{selectedDoctor?.name}</strong></p>
              </div>

              <div className="date-picker">
                <p className="picker-label">{t('chooseDate')}:</p>
                <div className="dates-row">
                  {DATES.map(d => (
                    <button
                      key={d.full}
                      className={`date-btn ${selectedDate?.full === d.full ? 'selected' : ''}`}
                      onClick={() => setSelectedDate(d)}
                    >
                      <span className="date-day">{d.label}</span>
                      <span className="date-num">{d.date}</span>
                      <span className="date-month">{d.month}</span>
                      {d.isToday && <span className="today-dot" />}
                    </button>
                  ))}
                </div>
              </div>

              {selectedDate && (
                <div className="time-picker">
                  <p className="picker-label">{t('availableTimeSlots')}:</p>
                  <div className="slots-grid">
                    {selectedDoctor.slots.map(slot => (
                      <button
                        key={slot}
                        className={`slot-btn ${selectedTime === slot ? 'selected' : ''}`}
                        onClick={() => setSelectedTime(slot)}
                      >
                        <Clock size={12} />
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedDate && !selectedTime && (
                <p className="hint-text">{t('selectTimeHint')}</p>
              )}

              <div className="bstep-footer">
                <button className="btn-booking-ghost" onClick={() => setStep(3)}>
                  <ArrowLeft size={15} /> {t('back')}
                </button>
                <button className="btn-booking-primary" onClick={goToConfirm} disabled={!selectedDate || !selectedTime}>
                  <CheckCircle size={16} /> {t('reviewBooking')}
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Confirm */}
          {step === 5 && (
            <div className="bstep-content fade-in">
              {!confirmed ? (
                <>
                  <div className="bstep-heading">
                    <h3>{t('confirmAppointment')}</h3>
                    <p>{t('reviewDetails')}</p>
                  </div>

                  <div className="confirm-card">
                    <div className="confirm-header">
                      <div className="confirm-doc-avatar">
                        {selectedDoctor?.name.replace('Dr. ', '').split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="confirm-doc-name">{selectedDoctor?.name}</p>
                        <p className="confirm-doc-spec">{selectedDoctor?.specialty}</p>
                        <div className="confirm-doc-rating">
                          <Star size={12} fill="#F59E0B" stroke="none" />
                          <span>{selectedDoctor?.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="confirm-details">
                      <div className="confirm-detail-row">
                        <div className="cd-icon"><Calendar size={15} /></div>
                        <div>
                          <p className="cd-label">{t('date')}</p>
                          <p className="cd-value">{selectedDate?.full}</p>
                        </div>
                      </div>
                      <div className="confirm-detail-row">
                        <div className="cd-icon"><Clock size={15} /></div>
                        <div>
                          <p className="cd-label">{t('time')}</p>
                          <p className="cd-value">{selectedTime}</p>
                        </div>
                      </div>
                      <div className="confirm-detail-row">
                        <div className="cd-icon"><Stethoscope size={15} /></div>
                        <div>
                          <p className="cd-label">{t('recommendedDept')}</p>
                          <p className="cd-value">{selectedDept}</p>
                        </div>
                      </div>
                      <div className="confirm-detail-row">
                        <div className="cd-icon"><MapPin size={15} /></div>
                        <div>
                          <p className="cd-label">{t('location')}</p>
                          <p className="cd-value">{t('hospitalLocation')}</p>
                        </div>
                      </div>
                    </div>

                    <div className="notification-pref">
                      <p className="np-title"><Bell size={13} /> {t('remindersVia')}:</p>
                      <div className="np-channels">
                        <span>📱 {t('sms')}</span>
                        <span>✉️ {t('email')}</span>
                        <span>💬 {t('whatsapp')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="security-note">
                    <Shield size={13} />
                    <span>{t('securityNote')}</span>
                  </div>

                  <div className="bstep-footer">
                    <button className="btn-booking-ghost" onClick={() => setStep(4)}>
                      <ArrowLeft size={15} /> {t('back')}
                    </button>
                    <button
                      className="btn-booking-primary confirm-final"
                      onClick={handleConfirm}
                      disabled={confirming}
                    >
                      {confirming ? (
                        <><Loader2 size={16} className="spin" /> {t('confirming')}</>
                      ) : (
                        <><CheckCircle size={16} /> {t('confirmBooking')}</>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="success-state">
                  <div className="success-anim">
                    <div className="success-ring" />
                    <CheckCircle size={48} className="success-icon" />
                  </div>
                  <h3>{t('bookingConfirmed')}</h3>
                  <p>{t('bookingSuccessMsg')}</p>
                  <div className="success-id">
                    <Zap size={13} />
                    {t('appointmentId')}: <strong>APT{Math.floor(Math.random() * 90000 + 10000)}</strong>
                  </div>
                  <p className="success-sub">{t('confirmationSentMsg')}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Inline component since lucide doesn't export Users2 reliably
function Users2({ size = 14 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
}
