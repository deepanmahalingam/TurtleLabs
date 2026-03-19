import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Navbar: React.FC = () => {
  const { mode, setMode } = useApp();
  const location = useLocation();

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 24px',
      background: 'rgba(10, 77, 104, 0.9)',
      backdropFilter: 'blur(10px)',
      borderBottom: '2px solid rgba(5, 191, 219, 0.3)',
    }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <TurtleLogo />
        <span style={{
          fontFamily: "'Fredoka One', cursive",
          fontSize: '1.4rem',
          color: '#05bfdb',
          letterSpacing: '0.5px',
        }}>
          TurtleWorksheet Lab
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {location.pathname !== '/' && (
          <Link to="/generate" style={{
            textDecoration: 'none',
            color: 'white',
            fontWeight: 700,
            fontSize: '0.95rem',
            padding: '8px 16px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.1)',
          }}>
            Create Worksheet
          </Link>
        )}

        <div style={{
          display: 'flex',
          background: 'rgba(255,255,255,0.15)',
          borderRadius: '25px',
          padding: '3px',
        }}>
          <button
            onClick={() => setMode('kids')}
            style={{
              padding: '6px 16px',
              borderRadius: '22px',
              fontSize: '0.85rem',
              fontWeight: 700,
              background: mode === 'kids' ? '#05bfdb' : 'transparent',
              color: mode === 'kids' ? '#0a4d68' : 'rgba(255,255,255,0.7)',
            }}
          >
            Kids
          </button>
          <button
            onClick={() => setMode('teacher')}
            style={{
              padding: '6px 16px',
              borderRadius: '22px',
              fontSize: '0.85rem',
              fontWeight: 700,
              background: mode === 'teacher' ? '#05bfdb' : 'transparent',
              color: mode === 'teacher' ? '#0a4d68' : 'rgba(255,255,255,0.7)',
            }}
          >
            Teacher
          </button>
        </div>
      </div>
    </nav>
  );
};

const TurtleLogo: React.FC = () => (
  <svg width="36" height="36" viewBox="0 0 100 100" fill="none">
    <ellipse cx="50" cy="55" rx="30" ry="22" fill="#2ecc71" />
    <ellipse cx="50" cy="55" rx="30" ry="22" fill="url(#shellGrad)" />
    <path d="M35 50 Q42 38 50 42 Q58 38 65 50" fill="#27ae60" />
    <path d="M50 42 L50 70" stroke="#1a8a4a" strokeWidth="2" />
    <path d="M38 48 L62 48" stroke="#1a8a4a" strokeWidth="1.5" />
    <path d="M36 56 L64 56" stroke="#1a8a4a" strokeWidth="1.5" />
    <circle cx="50" cy="30" r="12" fill="#2ecc71" />
    <circle cx="46" cy="27" r="3" fill="white" />
    <circle cx="54" cy="27" r="3" fill="white" />
    <circle cx="46" cy="27" r="1.5" fill="#1a3a4a" />
    <circle cx="54" cy="27" r="1.5" fill="#1a3a4a" />
    <path d="M46 33 Q50 37 54 33" stroke="#1a3a4a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <ellipse cx="24" cy="60" rx="8" ry="5" fill="#2ecc71" transform="rotate(-20 24 60)" />
    <ellipse cx="76" cy="60" rx="8" ry="5" fill="#2ecc71" transform="rotate(20 76 60)" />
    <ellipse cx="30" cy="74" rx="7" ry="5" fill="#2ecc71" transform="rotate(-10 30 74)" />
    <ellipse cx="70" cy="74" rx="7" ry="5" fill="#2ecc71" transform="rotate(10 70 74)" />
    <ellipse cx="50" cy="80" rx="4" ry="6" fill="#2ecc71" />
    <defs>
      <radialGradient id="shellGrad" cx="50%" cy="30%" r="70%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
      </radialGradient>
    </defs>
  </svg>
);

export default Navbar;
