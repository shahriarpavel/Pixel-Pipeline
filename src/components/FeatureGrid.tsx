import React from 'react';

const features = [
  {
    title: 'The "What Do I Tweet?" Void.',
    description: "Solve writer's block with AI-generated captions triggered directly from your commit messages.",
    accent: 'var(--cyan)'
  },
  {
    title: 'Discord Ping Anxiety.',
    description: 'Auto-schedule your updates for optimal EU/US timezones across all your developer channels.',
    accent: 'var(--purple)'
  },
  {
    title: 'The 2AM Bug Fix.',
    description: 'Celebrate the fix instantly with an auto-GIF generated from your latest screen capture, posted to Reddit.',
    accent: 'var(--green)'
  }
];

const FeatureGrid: React.FC = () => {
  return (
    <section id="painkillers">
      <div className="container">
        <h2 className="reveal" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          The Workflow <span className="gradient-text">Power-Up</span>
        </h2>
        <div className="card-grid">
          {features.map((f, i) => (
            <div key={i} className="glass-card reveal">
              <h3 style={{ color: f.accent, marginBottom: '1rem' }}>{f.title}</h3>
              <p>{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
