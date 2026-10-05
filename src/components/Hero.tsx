import React, { useEffect, useState } from 'react';
import characterGear from '../assets/character_gear.png';
import cartridge from '../assets/cartridge.png';

const diffLines = [
  { text: '--- game/player.cs', color: '#ff5f56' },
  { text: '+++ pipeline/social_post.log', color: '#27c93f' },
  { text: '- added dash mechanic', color: '#ff5f56' },
  { text: '+ Generated: Twitter Post + GIF', color: '#27c93f' },
  { text: '+ Platform: X (Twitter)', color: '#27c93f' },
  { text: '+ Status: Scheduled for 2:00 PM', color: '#00F0FF' }
];

const Hero: React.FC = () => {
  const [typedLines, setTypedLines] = useState<typeof diffLines>([]);

  useEffect(() => {
    let lineIndex = 0;
    const interval = setInterval(() => {
      if (lineIndex < diffLines.length) {
        setTypedLines(prev => [...prev, diffLines[lineIndex]]);
        lineIndex++;
      } else {
        clearInterval(interval);
      }
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="hero">
      <div className="container hero-grid">
        <div className="hero-content">
          <h1 className="reveal">Stop <span className="gradient-text">Marketing.</span><br />Start Shipping.</h1>
          <p className="reveal" style={{ fontSize: '1.2rem', maxWidth: '600px', marginBottom: '2.5rem' }}>
            PixelPipeline turns your Git commits into devlogs and trending GIFs. Connect once, and watch your Steam wishlists grow while you sleep.
          </p>
          <div className="reveal">
            <a href="#studio" className="btn btn-primary">Try the Pipeline Studio</a>
            <p className="mono" style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--purple)' }}>Runs locally in your browser.</p>
          </div>
        </div>

        <div className="hero-visual">
          <div className="glass-card terminal-pane">
            <div className="terminal-header">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
              <span className="mono" style={{ marginLeft: '10px', fontSize: '0.7rem', opacity: 0.5 }}>pipeline_diff.exe</span>
            </div>
            <div className="terminal-body mono">
              {typedLines.map((line, i) => (
                <div key={i} style={{ color: line.color, marginBottom: '5px' }}>
                  {line.text}
                </div>
              ))}
            </div>
          </div>
          <img src={characterGear} alt="Pixel Character" className="hero-asset asset-1" />
          <img src={cartridge} alt="Cartridge" className="hero-asset asset-2" />
        </div>
      </div>
    </header>
  );
};

export default Hero;
