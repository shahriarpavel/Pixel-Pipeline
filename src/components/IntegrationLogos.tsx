import React from 'react';

const logos = ['UNITY', 'GODOT', 'UNREAL', 'STEAM', 'DISCORD', 'X_TWITTER'];

const IntegrationLogos: React.FC = () => {
  return (
    <section id="made-for-this">
      <div className="container" style={{ textAlign: 'center' }}>
        <p className="mono" style={{ marginBottom: '3rem', opacity: 0.6 }}>Connects directly to your favorite tools</p>
        <div className="logo-grid">
          {logos.map((logo, i) => (
            <span key={i} className="logo-item">{logo}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntegrationLogos;
