
import React from 'react';
import DashboardLayout from './DashboardLayout';

const UserInfoCard: React.FC = () => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 flex items-center justify-between mb-8">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-marg-secondary/20 rounded-full flex items-center justify-center font-bold text-marg-primary text-xl">
          G
        </div>
        <div>
          <h2 className="font-bold text-lg text-marg-primary">Guest</h2>
          <p className="text-sm text-marg-text-secondary">Student</p>
          <p className="text-sm text-marg-text-secondary mt-1">Email: Not provided</p>
        </div>
      </div>
      <div>
        <p className="text-sm text-marg-text-secondary">Status</p>
        <p className="font-semibold text-green-600">Active</p>
      </div>
      <span className="bg-marg-accent/20 text-marg-accent text-xs font-bold px-3 py-1 rounded-full">Student</span>
    </div>
);

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
    <div className="mb-8">
        <div className="flex justify-between mb-1">
            <span className="text-base font-medium text-marg-primary">Student Overall Progress</span>
            <span className="text-sm font-medium text-marg-primary">{progress}% completed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
            <div className="bg-gradient-to-r from-marg-accent to-orange-400 h-4 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
    </div>
);

const ActionCard: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden">
    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-repeat bg-center opacity-5" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234AA398' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}}></div>
    <h3 className="font-bold text-lg text-marg-primary mb-2">{title}</h3>
    <p className="text-sm text-marg-text-secondary">{description}</p>
  </div>
);

const ParentDashboard: React.FC = () => {
  return (
    <DashboardLayout title="Parent Dashboard" subtitle="Support your child's journey with insights">
        <UserInfoCard />
        <div className="bg-white p-6 rounded-lg border border-gray-200">
            <ProgressBar progress={82} />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ActionCard title="Parent Expectation Test" description="Share your expectations and priorities" />
                <ActionCard title="Combined Results" description="Balanced view: student + parent" />
                <ActionCard title="Mark Important Careers" description="Bookmark careers to discuss" />
                <ActionCard title="Monitor Progress" description="Track test and activity completion" />
                <ActionCard title="Family Resources" description="Guides, articles, and checklists" />
                <ActionCard title="Schedule Counseling" description="Plan a guidance session" />
            </div>
        </div>
    </DashboardLayout>
  );
};

export default ParentDashboard;