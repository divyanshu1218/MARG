

import React from 'react';

interface DashboardLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ title, subtitle, children }) => {
  return (
    <div className="bg-marg-bg min-h-screen">
      <div className="bg-marg-bg-light pt-20 pb-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl font-extrabold text-marg-primary mb-2">{title}</h1>
          <p className="text-lg text-marg-text-secondary">{subtitle}</p>
        </div>
         {/* Decorative elements */}
         <div className="absolute top-10 right-20 w-16 h-16 bg-marg-accent/20 rounded-lg -rotate-12 opacity-50"></div>
         <div className="absolute top-24 right-48 w-8 h-8 bg-marg-secondary/20 rounded-full opacity-50"></div>
         <div className="absolute top-40 right-32 w-12 h-2 bg-marg-accent/30 rounded-full opacity-50"></div>
         <div className="absolute top-16 right-36 w-20 h-20 border-2 border-marg-secondary/20 rounded-full opacity-50"></div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 pb-16">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;