import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav>
      <div className="container nav-content">
        <a href="#" className="logo">PIXEL_PIPELINE</a>
        <a href="#studio" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.8rem' }}>Open Studio</a>
      </div>
    </nav>
  );
};

export default Navbar;
