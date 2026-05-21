import React, { useState } from 'react';
import { X, Calendar, Clock, User, Stethoscope } from 'lucide-react';
import { createPortal } from 'react-dom';
import './AddScheduleModal.css';

export default function AddScheduleModal({ onClose, onConfirm }) {
  const [doctor, setDoctor] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [type, setType] = useState('cardiology');

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({ doctor, date, startTime, endTime, type });
  };

  const modalContent = (
    <div className="schedule-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="schedule-modal">
        <div className="schedule-modal-header">
          <h2>Add New Schedule</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="schedule-modal-body">
          <div className="form-group">
            <label><User size={16} /> Doctor Name</label>
            <select value={doctor} onChange={(e) => setDoctor(e.target.value)} required>
              <option value="">Select Doctor</option>
              <option value="Dr. Sarah Johnson">Dr. Sarah Johnson</option>
              <option value="Dr. James Wilson">Dr. James Wilson</option>
              <option value="Dr. Emily Davis">Dr. Emily Davis</option>
              <option value="Dr. Ravi Sharma">Dr. Ravi Sharma</option>
              <option value="Dr. Neha Patil">Dr. Neha Patil</option>
            </select>
          </div>
          
          <div className="form-group">
            <label><Stethoscope size={16} /> Department</label>
            <select value={type} onChange={(e) => setType(e.target.value)} required>
              <option value="cardiology">Cardiology</option>
              <option value="neurology">Neurology</option>
              <option value="gynecology">Gynecology</option>
              <option value="dermatology">Dermatology</option>
              <option value="pediatrics">Pediatrics</option>
              <option value="orthopedics">Orthopedics</option>
            </select>
          </div>

          <div className="form-group">
            <label><Calendar size={16} /> Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label><Clock size={16} /> Start Time</label>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
            </div>
            <div className="form-group">
              <label><Clock size={16} /> End Time</label>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
            </div>
          </div>

          <div className="schedule-modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Schedule</button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
