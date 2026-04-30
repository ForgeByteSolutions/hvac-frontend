import React from 'react';

const DEMO_QUERIES = [
  {
    id: 'suitability',
    label: 'Is this suitable for 3-ton residential?',
    query: 'Is this air handler suitable for a 3-ton residential replacement?',
  },
  {
    id: 'condensers',
    label: 'Which condensers are compatible?',
    query: 'Which condensers are compatible with this unit?',
  },
  {
    id: 'bom',
    label: 'What else do I need for this job?',
    query: 'What else do I need to complete this installation?',
  },
  {
    id: 'build',
    label: 'Build a complete system for me',
    query: 'Yes, build the complete system for this job',
  },
  {
    id: 'availability',
    label: 'Which option can I get today?',
    query: 'Which option can I get today for same-day pickup?',
  },
  {
    id: 'alternative',
    label: 'What if this unit is out of stock?',
    query: 'What if this air handler is out of stock?',
  },
  {
    id: 'recommend',
    label: 'Which option do you recommend?',
    query: 'Which option do you recommend for an urgent same-day replacement?',
  },
];

export default function QuickReplyChips({ onSelect, disabled }) {
  return (
    <div style={{ padding: '12px 16px 4px' }}>
      <p style={{
        fontSize: '10px',
        fontWeight: '700',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: '10px'
      }}>
        Quick Actions
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {DEMO_QUERIES.map((q) => (
          <button
            key={q.id}
            onClick={() => !disabled && onSelect(q.query)}
            disabled={disabled}
            style={{
              textAlign: 'left',
              padding: '9px 14px',
              borderRadius: '12px',
              border: '1px solid rgba(30, 64, 175, 0.15)',
              background: disabled ? 'rgba(248,250,252,0.5)' : 'rgba(239, 246, 255, 0.8)',
              color: disabled ? '#94a3b8' : '#1e40af',
              fontSize: '12.5px',
              fontWeight: '500',
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease',
              backdropFilter: 'blur(4px)',
              lineHeight: '1.3',
            }}
            onMouseEnter={(e) => {
              if (!disabled) {
                e.currentTarget.style.background = 'rgba(219, 234, 254, 0.95)';
                e.currentTarget.style.borderColor = 'rgba(30, 64, 175, 0.35)';
                e.currentTarget.style.transform = 'translateX(2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!disabled) {
                e.currentTarget.style.background = 'rgba(239, 246, 255, 0.8)';
                e.currentTarget.style.borderColor = 'rgba(30, 64, 175, 0.15)';
                e.currentTarget.style.transform = 'translateX(0)';
              }
            }}
          >
            {q.label}
          </button>
        ))}
      </div>
    </div>
  );
}
