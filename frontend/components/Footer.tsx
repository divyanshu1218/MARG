

import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-marg-bg w-full">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="font-bold text-marg-primary">MARG.</h3>
        <p className="text-sm text-marg-text-secondary">Mentorship & Academic Roadmap Guide</p>
        <div className="mt-4 text-xs text-marg-text-secondary/80">
          &copy; {new Date().getFullYear()} MARG. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;