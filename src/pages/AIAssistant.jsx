import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Paperclip, Mic, Trash2, CheckCircle, Calendar, Clock, MapPin, User, ChevronRight } from 'lucide-react';
import BookingFlow from '../components/BookingFlow';
import { useLanguage } from '../LanguageContext';
import { useNotifications } from '../NotificationContext';
import './AIAssistant.css';

const SAMPLE_ACTION_KEYS = [
  'actionBook',
  'actionSchedule',
  'actionHistory',
  'actionHelp',
  'actionLoad',
];

const DUMMY_REPLIES = {
  en: {
    booking: (doctor) => `I've found an available slot for you with ${doctor}. Would you like to proceed with the booking?`,
    schedule: "Today's schedule is quite busy with 24 total appointments. 18 are confirmed and 4 are still pending. Is there a specific doctor's schedule you'd like to see?",
    patient: "I've retrieved the patient records for Rahul Joshi. He has a history of hypertension but his vitals have been stable in the last 3 visits. His last appointment was on April 20th.",
    help: "I can help you with booking appointments, checking doctor availability, viewing patient histories, and managing the hospital's daily schedule. Just let me know what you need!",
    generic: [
      "That's a great question. I'm here to assist you with all your healthcare administrative tasks. What else can I do for you?",
      "I understand. I'm processing that information. Do you have any other requests regarding the hospital management?",
      "I'm your dedicated AI assistant. I can help streamline your workflow. Would you like to check today's analytics or book a new appointment?",
      "Got it! Is there anything specific about the patients or doctors you'd like to discuss?"
    ]
  },
  hi: {
    booking: (doctor) => `मैंने ${doctor} के साथ आपके लिए एक उपलब्ध स्लॉट ढूंढ लिया है। क्या आप बुकिंग के साथ आगे बढ़ना चाहेंगे?`,
    schedule: "आज का शेड्यूल काफी व्यस्त है, कुल 24 नियुक्तियाँ हैं। 18 की पुष्टि हो गई है और 4 अभी भी लंबित हैं। क्या आप किसी विशिष्ट डॉक्टर का शेड्यूल देखना चाहेंगे?",
    patient: "मैंने राहुल जोशी के मरीज रिकॉर्ड प्राप्त कर लिए हैं। उनका उच्च रक्तचाप का इतिहास रहा है लेकिन पिछली 3 यात्राओं में उनके महत्वपूर्ण लक्षण स्थिर रहे हैं। उनकी आखिरी नियुक्ति 20 अप्रैल को थी।",
    help: "मैं नियुक्तियाँ बुक करने, डॉक्टर की उपलब्धता जाँचने, मरीज के इतिहास देखने और अस्पताल के दैनिक शेड्यूल को प्रबंधित करने में आपकी मदद कर सकता हूँ। बस मुझे बताएं कि आपको क्या चाहिए!",
    generic: [
      "यह एक बहुत अच्छा सवाल है। मैं आपके सभी स्वास्थ्य सेवा प्रशासनिक कार्यों में आपकी सहायता करने के लिए यहाँ हूँ। मैं आपके लिए और क्या कर सकता हूँ?",
      "मैं समझ गया। मैं उस जानकारी को संसाधित कर रहा हूँ। क्या आपके पास अस्पताल प्रबंधन के संबंध में कोई अन्य अनुरोध है?",
      "मैं आपका समर्पित एआई सहायक हूँ। मैं आपके कार्यप्रवाह को सुव्यवस्थित करने में मदद कर सकता हूँ। क्या आप आज के विश्लेषण की जाँच करना चाहेंगे या नई नियुक्ति बुक करना चाहेंगे?",
      "समझ गया! क्या मरीजों या डॉक्टरों के बारे में कुछ खास है जिस पर आप चर्चा करना चाहेंगे?"
    ]
  },
  mr: {
    booking: (doctor) => `मी तुमच्यासाठी ${doctor} सोबत एक उपलब्ध स्लॉट शोधला आहे. तुम्ही बुकिंगसह पुढे जाऊ इच्छिता का?`,
    schedule: "आजचे वेळापत्रक एकूण २४ अपॉइंटमेंटसह खूप व्यस्त आहे. १८ निश्चित झाले आहेत आणि ४ अजूनही प्रलंबित आहेत. तुम्हाला एखाद्या विशिष्ट डॉक्टरांचे वेळापत्रक पाहायचे आहे का?",
    patient: "मी राहुल जोशी यांच्या रुग्णांच्या नोंदी मिळवल्या आहेत. त्यांना उच्च रक्तदाबाचा इतिहास आहे पण गेल्या ३ भेटींमध्ये त्यांचे महत्वाचे घटक स्थिर आहेत. त्यांची शेवटची अपॉइंटमेंट २० एप्रिल रोजी होती.",
    help: "मी तुम्हाला अपॉइंटमेंट बुक करण्यात, डॉक्टरांची उपलब्धता तपासण्यात, रुग्णांचा इतिहास पाहण्यात आणि हॉस्पिटलचे दैनंदिन वेळापत्रक व्यवस्थापित करण्यात मदत करू शकतो. तुम्हाला काय हवे आहे ते मला कळवा!",
    generic: [
      "हा एक चांगला प्रश्न आहे. मी तुमच्या सर्व आरोग्य सेवा प्रशासकीय कामांमध्ये तुम्हाला मदत करण्यासाठी येथे आहे. मी तुमच्यासाठी अजून काय करू शकतो?",
      "मला समजले. मी त्या माहितीवर प्रक्रिया करत आहे. हॉस्पिटल मॅनेजमेंटच्या संदर्भात तुमच्याकडे इतर काही विनंत्या आहेत का?",
      "मी तुमचा समर्पित एआई सहाय्यक आहे. मी तुमचा वर्कफ्लो सुव्यवस्थित करण्यात मदत करू शकतो. तुम्हाला आजचे विश्लेषण तपासायचे आहे की नवीन अपॉइंटमेंट बुक करायची आहे?",
      "समजले! तुम्हाला रुग्ण किंवा डॉक्टरांबद्दल काही विशिष्ट चर्चा करायची आहे का?"
    ]
  }
};

const getSystemPrompt = (t, lang) => `You are an AI Appointment Assistant for a healthcare management system called "AI Appointment Assistant". 
Current language: ${lang === 'hi' ? 'Hindi' : lang === 'mr' ? 'Marathi' : 'English'}.
You must respond in ${lang === 'hi' ? 'Hindi' : lang === 'mr' ? 'Marathi' : 'English'}.

You help with:
- ${t('assistantGoal1') || 'Booking and managing medical appointments'}
- ${t('assistantGoal2') || 'Providing information about doctors, departments, and schedules'}
- ${t('assistantGoal3') || 'Checking patient histories and appointment statuses'}
- ${t('assistantGoal4') || 'Answering healthcare administrative questions'}

When a user asks to book an appointment, extract details and respond in this JSON format inside <appointment> tags:
<appointment>{"doctor": "...", "department": "...", "date": "...", "time": "...", "location": "City Care Hospital, Main Street"}</appointment>

Otherwise respond helpfully and concisely. Keep responses professional and medical-context appropriate.`;

function AppointmentCard({ data }) {
  const { t } = useLanguage();
  const parsed = (() => { try { return JSON.parse(data); } catch { return null; } })();
  if (!parsed) return null;
  return (
    <div className="appt-ready-card">
      <div className="appt-ready-header">
        <div className="appt-ready-icon"><CheckCircle size={22} /></div>
        <div>
          <p className="appt-ready-title">{t('apptReadyTitle') || 'Appointment Ready!'}</p>
          <p className="appt-ready-sub">{t('apptReadySub') || 'Please confirm your appointment details.'}</p>
        </div>
      </div>
      <div className="appt-details">
        {parsed.doctor && <div className="appt-detail-row"><User size={15} /><span className="detail-label">{t('doctor')}</span><span className="detail-val">{parsed.doctor}</span></div>}
        {parsed.date && <div className="appt-detail-row"><Calendar size={15} /><span className="detail-label">{t('date') || 'Date'}</span><span className="detail-val">{parsed.date}</span></div>}
        {parsed.time && <div className="appt-detail-row"><Clock size={15} /><span className="detail-label">{t('time') || 'Time'}</span><span className="detail-val">{parsed.time}</span></div>}
        {parsed.location && <div className="appt-detail-row"><MapPin size={15} /><span className="detail-label">{t('location') || 'Location'}</span><span className="detail-val">{parsed.location}</span></div>}
      </div>
      <button className="btn btn-primary confirm-btn" onClick={() => window.dispatchEvent(new CustomEvent('open-booking'))}><CheckCircle size={16} /> {t('bookNowAI') || 'Book Now via AI Flow'}</button>
      <p className="appt-secure">🔒 {t('dataSecure') || 'Your data is secure and protected'}</p>
    </div>
  );
}

function Message({ msg }) {
  const isUser = msg.role === 'user';
  // Extract appointment data
  const apptMatch = msg.content.match(/<appointment>([\s\S]*?)<\/appointment>/);
  const cleanContent = msg.content.replace(/<appointment>[\s\S]*?<\/appointment>/g, '').trim();

  return (
    <div className={`msg-row ${isUser ? 'user' : 'bot'}`}>
      {!isUser && (
        <div className="bot-avatar">
          <Bot size={18} />
        </div>
      )}
      <div className={`msg-bubble ${isUser ? 'user-bubble' : 'bot-bubble'}`}>
        {cleanContent && <p>{cleanContent}</p>}
        {apptMatch && <AppointmentCard data={apptMatch[1]} />}
        <span className="msg-time">{msg.time}</span>
      </div>
    </div>
  );
}

function TypingIndicator() {
  const { t } = useLanguage();
  return (
    <div className="msg-row bot">
      <div className="bot-avatar"><Bot size={18} /></div>
      <div className="msg-bubble bot-bubble typing-bubble">
        <div className="typing-dots">
          <span></span><span></span><span></span>
        </div>
        <p className="typing-label">{t('extractingDetails') || 'Extracting appointment details...'}</p>
      </div>
    </div>
  );
}

export default function AIAssistant() {
  const { t, currentLanguage } = useLanguage();
  const { notify } = useNotifications();
  const [showBooking, setShowBooking] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: t('welcomeAssistant') || 'Hello! I\'m your AI Appointment Assistant. I can help you book appointments, manage schedules, check patient records, and more. How can I help you today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      const langMap = { en: 'en-US', hi: 'hi-IN', mr: 'mr-IN' };
      recognitionRef.current.lang = langMap[currentLanguage] || 'en-US';
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Update initial message when language changes if it's the only message
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].role === 'assistant') {
        return [{
          ...prev[0],
          content: t('welcomeAssistant')
        }];
      }
      return prev;
    });
  }, [currentLanguage, t]);

  useEffect(() => {
    const handler = () => setShowBooking(true);
    window.addEventListener('open-booking', handler);
    return () => window.removeEventListener('open-booking', handler);
  }, []);

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;
    setInput('');

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessages = [...messages, { role: 'user', content: userMsg, time }];
    setMessages(newMessages);
    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      let replyText = '';
      const lowerMsg = userMsg.toLowerCase();
      const lang = currentLanguage || 'en';
      const replies = DUMMY_REPLIES[lang] || DUMMY_REPLIES.en;

      // Simple dummy logic to generate responses
      if (lowerMsg.includes('book') || lowerMsg.includes('appointment') || lowerMsg.includes('doctor')) {
        const doctors = ['Dr. Rahul Sharma', 'Dr. Priya Patel', 'Dr. Anjali Deshmukh', 'Dr. Sameer Kulkarni'];
        const depts = ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics'];
        const selectedDoctor = doctors[Math.floor(Math.random() * doctors.length)];
        const selectedDept = depts[Math.floor(Math.random() * depts.length)];
        
        const bookingPrompt = replies.booking(selectedDoctor);
        replyText = `${bookingPrompt}

<appointment>{"doctor": "${selectedDoctor}", "department": "${selectedDept}", "date": "Tomorrow, May 5th", "time": "10:30 AM", "location": "City Care Hospital, Main Street"}</appointment>`;
      } else if (lowerMsg.includes('schedule') || lowerMsg.includes('today') || lowerMsg.includes('load')) {
        replyText = replies.schedule;
      } else if (lowerMsg.includes('patient') || lowerMsg.includes('history') || lowerMsg.includes('rahul')) {
        replyText = replies.patient;
      } else if (lowerMsg.includes('help') || lowerMsg.includes('can you')) {
        replyText = replies.help;
      } else {
        replyText = replies.generic[Math.floor(Math.random() * replies.generic.length)];
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
      setLoading(false);
    }, 1200);
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: t('chatCleared') || 'Chat cleared. How can I help you today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
  };

  return (
    <div className="assistant-page fade-in">
      {showBooking && (
        <BookingFlow
          onClose={() => setShowBooking(false)}
            onConfirm={(booking) => {
              setShowBooking(false);
              const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              
              if (booking) {
                // Trigger Multi-Channel Notification
                notify({
                  title: 'AI Appointment Confirmed',
                  msg: t('bookingConfirmedMsg')
                    .replace('{doctor}', booking.doctor?.name || 'the doctor')
                    .replace('{date}', booking.date?.full || 'the selected date')
                    .replace('{time}', booking.time),
                  type: 'success',
                  channels: ['web', 'email', 'sms', 'whatsapp']
                });

                setMessages(prev => [...prev, {
                  role: 'assistant',
                  content: t('bookingConfirmedMsg')
                    .replace('{doctor}', booking.doctor?.name || 'the doctor')
                    .replace('{date}', booking.date?.full || 'the selected date')
                    .replace('{time}', booking.time),
                  time,
                }]);
              } else {
                setMessages(prev => [...prev, {
                  role: 'assistant',
                  content: t('bookingCancelledMsg') || 'Booking cancelled. Let me know if you need help with anything else.',
                  time,
                }]);
              }
            }}
        />
      )}
      <div className="page-header">
        <h1>{t('aiAssistantTitle')}</h1>
      </div>

      <div className="assistant-layout">
        {/* Chat Area */}
        <div className="chat-container card">
          <div className="chat-header">
            <div className="chat-bot-info">
              <div className="bot-avatar-lg"><Bot size={24} /></div>
              <div>
                <p className="bot-name">{t('assistant')}</p>
                <p className="bot-status"><span className="status-dot"></span>{t('online')}</p>
              </div>
            </div>
            <button className="btn btn-ghost" onClick={clearChat} style={{ fontSize: 12, gap: 6 }}>
              <Trash2 size={14} /> {t('clearChat')}
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => <Message key={i} msg={msg} />)}
            {loading && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          <div className="quick-actions">
            {SAMPLE_ACTION_KEYS.map(k => (
              <button key={k} className="quick-action-btn" onClick={() => sendMessage(t(k))}>
                {t(k)} <ChevronRight size={12} />
              </button>
            ))}
          </div>

          <div className="chat-input-row">
            <button className="icon-btn"><Paperclip size={17} /></button>
            <input
              className="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder={t('typeMessage')}
            />
            <button 
              className={`icon-btn ${isListening ? 'listening' : ''}`} 
              onClick={toggleListening}
              title={t('voiceSearch') || 'Voice Search'}
            >
              <Mic size={17} style={{ color: isListening ? 'var(--danger)' : 'inherit' }} />
            </button>
            <button
              className="send-btn"
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
            >
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* Info Panel */}
        <div className="assistant-sidebar">
          <div className="card">
            <h3 style={{ fontSize: 14, marginBottom: 14 }}>{t('quickStats')}</h3>
            <div className="quick-stats">
              {[
                { label: t('totalAppointments'), value: '24', color: 'var(--primary)' },
                { label: t('confirmed'), value: '18', color: 'var(--success)' },
                { label: t('pending'), value: '4', color: 'var(--warning)' },
                { label: t('cancelled'), value: '2', color: 'var(--danger)' },
              ].map(s => (
                <div key={s.label} className="quick-stat">
                  <p className="qs-value" style={{ color: s.color }}>{s.value}</p>
                  <p className="qs-label">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: 14, marginBottom: 14 }}>{t('capabilities')}</h3>
            <div className="capabilities">
              {[
                { emoji: '📅', label: t('bookAppointment') },
                { emoji: '🔍', label: t('patients') },
                { emoji: '👨‍⚕️', label: t('doctors') },
                { emoji: '📋', label: t('schedules') },
                { emoji: '🔔', label: t('notifications') },
                { emoji: '📊', label: t('analytics') },
                { emoji: '🚨', label: t('noShowPred') },
                { emoji: '💊', label: t('assistantGoal4') },
              ].map(c => (
                <div key={c.label} className="capability-item">
                  <span>{c.emoji}</span>
                  <span>{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card ai-tip-card">
            <p className="tip-label">💡 {t('aiTip')}</p>
            <p className="tip-text">Try saying: "Book appointment with Dr. Sharma for tomorrow at 3 PM" and I'll handle everything automatically!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
