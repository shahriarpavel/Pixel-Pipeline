import React, { useEffect, useState, useRef } from 'react';

const TechTerminal: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [isTyped, setIsTyped] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsTyped(true);
        observer.disconnect();
      }
    }, { threshold: 0.5 });

    if (terminalRef.current) {
      observer.observe(terminalRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works">
      <div className="container" ref={terminalRef}>
        <div className="glass-card mock-terminal">
          <div className="terminal-header">
            <span className="mono" style={{ fontSize: '0.8rem' }}>BASH — PIXEL_PIPELINE_V1.0</span>
          </div>
          <div className="terminal-body mono">
            <p className={`term-line ${isTyped ? 'typed' : ''}`} style={{ transitionDelay: '0s' }}>
              &gt; git push origin main
            </p>
            <p className={`term-line ${isTyped ? 'typed' : ''}`} style={{ color: 'var(--cyan)', transitionDelay: '0.8s' }}>
              &gt; PixelPipeline: Detected "Added Dash Mechanic"
            </p>
            <p className={`term-line ${isTyped ? 'typed' : ''}`} style={{ color: 'var(--purple)', transitionDelay: '1.6s' }}>
              &gt; Generating 15s WebM...
            </p>
            <p className={`term-line ${isTyped ? 'typed' : ''}`} style={{ color: 'var(--green)', transitionDelay: '2.4s' }}>
              &gt; Posting to Discord #dev-log... Done.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechTerminal;
