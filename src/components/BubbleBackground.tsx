import React from 'react';

const BubbleBackground: React.FC = () => {
  const bubbles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 30 + 10,
    left: Math.random() * 100,
    delay: Math.random() * 15,
    duration: Math.random() * 10 + 10,
    opacity: Math.random() * 0.3 + 0.1,
  }));

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 0,
      overflow: 'hidden',
    }}>
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          style={{
            position: 'absolute',
            bottom: '-50px',
            left: `${bubble.left}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            borderRadius: '50%',
            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,${bubble.opacity + 0.2}), rgba(255,255,255,${bubble.opacity}))`,
            border: `1px solid rgba(255,255,255,${bubble.opacity})`,
            animation: `bubble-rise ${bubble.duration}s ease-in ${bubble.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

export default BubbleBackground;
