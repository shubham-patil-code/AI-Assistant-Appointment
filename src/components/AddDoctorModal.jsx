import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';
import './AddDoctorModal.css';

// List of departments matching the ones used elsewhere
const DEPARTMENTS = [
  'Cardiology',
  'Neurology',
  'Dermatology',
  'Gynecology',
  'Gen. Medicine',
  'Pediatrics',
  'Orthopedics',
];

export default function AddDoctorModal({ onClose, onAdd }) {
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [dept, setDept] = useState('Cardiology');
  const [experience, setExperience] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const firstInputRef = useRef(null);

  // Focus first input when modal mounts & add Escape key handler
  useEffect(() => {
    // Focus
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !specialty.trim()) {
      setError('Name and specialty are required');
      return;
    }
    const newDoctor = {
      id: `DR${Date.now()}`,
      name: name.trim(),
      specialty: specialty.trim(),
      dept,
      experience: experience.trim() || '0 Years',
      patients: 0,
      rating: 5.0,
      status: 'active',
      today: 0,
      phone: phone.trim(),
      email: email.trim(),
      slots: [],
    };
    onAdd(newDoctor);
    // Reset form
    setName('');
    setSpecialty('');
    setDept('Cardiology');
    setExperience('');
    setPhone('');
    setEmail('');
    setError('');
    onClose(); // close after successful add
  };

  // Render modal via portal
  return ReactDOM.createPortal(
    <div className="add-doctor-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="add-doctor-modal" role="dialog" aria-modal="true" aria-labelledby="add-doctor-title">
        <div className="add-doctor-header">
          <h2 id="add-doctor-title">Add New Doctor</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>
        <form className="add-doctor-form" onSubmit={handleSubmit}>
          {error && <p className="error-msg" role="alert">{error}</p>}
          <label>
            <span>Name</span>
            <input
              type="text"
              ref={firstInputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            <span>Specialty</span>
            <input
              type="text"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              required
            />
          </label>
          <label>
            <span>Department</span>
            <select value={dept} onChange={(e) => setDept(e.target.value)}>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Experience</span>
            <input
              type="text"
              placeholder="e.g., 5 Years"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </label>
          <label>
            <span>Phone</span>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </label>
          <label>
            <span>Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={!!error}>
              Add Doctor
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
}
