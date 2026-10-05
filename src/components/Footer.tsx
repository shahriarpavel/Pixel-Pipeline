import React from 'react';
import frogFloppy from '../assets/frog_floppy.png';

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="container footer-content">
        <div className="footer-left">
          <p className="mono">&copy; 2026 PIXELPIPELINE</p>
          <a href="#" className="mono" style={{ color: 'var(--cyan)', fontSize: '0.8rem' }}>shahriaRpavel</a>
        </div>
        <div className="footer-right">
          <div className="easter-egg">
            <img src={frogFloppy} alt="Easter Egg Frog" style={{ width: '60px' }} />
            <span className="tooltip mono">RIBBIT (v1.0.4)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
