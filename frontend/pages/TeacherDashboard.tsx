

import React, { useState, useMemo } from 'react';
import DashboardLayout from './DashboardLayout';
import { AIRecommendation, College } from '../types';
import { Link } from 'react-router-dom';
import { useUser } from '../UserContext';


// --- Mock Data ---
const mockStudentRecommendations: { [key: string]: AIRecommendation } = {
    'Ananya Reddy': {
        conclusion: "Ananya's analytical and problem-solving skills suggest a strong aptitude for a career in technology, particularly in fields like Software Engineering or Data Science.",
        colleges: {
            nearby: [{ id: 101, name: 'Indian Institute of Technology, Bombay', city: 'Mumbai', state: 'Maharashtra', type: 'Government', annualFees: 220000 }],
            inState: [{ id: 801, name: 'Pune Institute of Computer Technology', city: 'Pune', state: 'Maharashtra', type: 'AICTE Approved', annualFees: 120000 }],
            national: [{ id: 106, name: 'International Institute of Information Technology, Hyderabad', city: 'Hyderabad', state: 'Telangana', type: 'Private', annualFees: 400000 }]
        },
        resources: [{ title: "What is Data Science?", url: "https://www.youtube.com/watch?v=ua-CiJoiE5Q", type: 'video' }]
    },
    'Vikram Singh': {
        conclusion: "Vikram's creative and empathetic responses indicate a strong potential for a career in design, specifically in user-centric fields like UI/UX Design.",
        colleges: {
             nearby: [{ id: 201, name: 'National Institute of Design, Ahmedabad', city: 'Ahmedabad', state: 'Gujarat', type: 'Government', annualFees: 350000 }],
             inState: [],
             national: [{ id: 203, name: 'Srishti Manipal Institute of Art, Design and Technology', city: 'Bengaluru', state: 'Karnataka', type: 'Private', annualFees: 600000 }]
        },
        resources: [{ title: "A Day in the Life of a UX Designer", url: "https://www.youtube.com/watch?v=c1_Y-_WzeA8", type: 'video' }]
    },
     'Rohan Shah': {
        conclusion: "Rohan's interest in structured systems and societal impact points towards a promising future in Law or Public Service.",
        colleges: {
            nearby: [],
            inState: [{ id: 502, name: 'Symbiosis Law School, Pune', city: 'Pune', state: 'Maharashtra', type: 'Private', annualFees: 400000 }],
            national: [{ id: 501, name: 'National Law School of India University, Bangalore', city: 'Bengaluru', state: 'Karnataka', type: 'Government', annualFees: 280000 }]
        },
        resources: [{ title: "How to Become a Lawyer in India", url: "https://www.example.com/law-guide", type: 'article' }]
    }
};

const mockStudents = Object.keys(mockStudentRecommendations);

// --- SVG Icon Components ---
const ResourceIcon: React.FC<{ type: string }> = ({ type }) => {
    const className = "h-5 w-5";
    switch(type) {
        case 'video': return <svg xmlns="http://www.w3.org/2000/svg" className={`${className} text-red-500`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>;
        case 'article': return <svg xmlns="http://www.w3.org/2000/svg" className={`${className} text-blue-500`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm2 1h1a1 1 0 000 2H6a1 1 0 000-2zm0 4h1a1 1 0 000 2H6a1 1 0 000-2zm0 4h1a1 1 0 000 2H6a1 1 0 000-2zm3-8h2a1 1 0 000-2H9a1 1 0 000 2zm0 4h2a1 1 0 000-2H9a1 1 0 000 2zm0 4h2a1 1 0 000-2H9a1 1 0 000 2z" clipRule="evenodd" /></svg>;
        case 'website': return <svg xmlns="http://www.w3.org/2000/svg" className={`${className} text-green-500`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.527-1.917c.243.243.447.517.616.816A6.012 6.012 0 0115.668 11.973c-.17.299-.373.573-.616.816a2 2 0 01-1.527-1.917 2 2 0 00-4 0 1.5 1.5 0 01-1.5 1.5c-.526 0-.988-.27-1.256-.706a6.012 6.012 0 01-1.912-2.706z" clipRule="evenodd" /></svg>;
        default: return <svg xmlns="http://www.w3.org/2000/svg" className={`${className} text-gray-500`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" /></svg>;
    }
};
const SectionIcon: React.FC<{ type: 'summary' | 'college' | 'resource' }> = ({ type }) => {
    const className = "h-8 w-8 text-marg-accent";
    switch (type) {
        case 'summary': return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
        case 'college': return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
        case 'resource': return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
    }
};

// --- Reusable Components from QuizPage (adapted for this context) ---
const CollegeResults: React.FC<{ colleges: AIRecommendation['colleges'] }> = ({ colleges }) => {
     const collegeSections = [
        { title: "Nearby Colleges", list: colleges.nearby },
        { title: "In-State Colleges", list: colleges.inState },
        { title: "National Colleges", list: colleges.national },
    ];
    return (
        <div className="space-y-6">
           {collegeSections.map(section => (
               section.list && section.list.length > 0 && (
                   <div key={section.title}>
                       <h4 className="font-semibold text-marg-primary mb-3">{section.title}</h4>
                        <div className="space-y-3">
                           {section.list.map(college => (
                                <div key={college.id} className="bg-marg-bg-light p-3 rounded-lg border border-gray-200">
                                    <h5 className="font-bold text-sm text-marg-primary">{college.name}</h5>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-marg-text-secondary mt-1">
                                        <span>📍 {college.city}, {college.state}</span>
                                        <span>🎓 {college.type}</span>
                                        <span>💰 ₹{college.annualFees.toLocaleString('en-IN')}/year</span>
                                    </div>
                                </div>
                            ))}
                       </div>
                   </div>
               )
           ))}
        </div>
    );
};

// --- Student Detail Modal ---
const StudentDetailModal: React.FC<{ studentName: string | null; onClose: () => void }> = ({ studentName, onClose }) => {
    if (!studentName) return null;
    const recommendations = mockStudentRecommendations[studentName];
    if (!recommendations) return null;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in-fast" onClick={onClose}>
            <div className="bg-marg-bg rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-scale-in" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-200 bg-white rounded-t-xl flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-marg-primary">{studentName}'s AI Recommendations</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <div className="p-8 overflow-y-auto space-y-8">
                    <div className="bg-white p-6 rounded-lg border">
                        <h3 className="text-xl font-bold text-marg-primary mb-3 flex items-center"><SectionIcon type="summary" /><span className="ml-3">Path Summary</span></h3>
                        <p className="text-marg-text-secondary leading-relaxed">{recommendations.conclusion}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg border">
                        <h3 className="text-xl font-bold text-marg-primary mb-4 flex items-center"><SectionIcon type="college" /><span className="ml-3">Recommended Colleges</span></h3>
                        <CollegeResults colleges={recommendations.colleges} />
                    </div>
                    <div className="bg-white p-6 rounded-lg border">
                        <h3 className="text-xl font-bold text-marg-primary mb-4 flex items-center"><SectionIcon type="resource" /><span className="ml-3">Helpful Resources</span></h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {recommendations.resources.map((res, i) => (
                                <a href={res.url} key={i} target="_blank" rel="noopener noreferrer" className="block p-4 bg-marg-bg-light rounded-lg hover:shadow-md transition-shadow">
                                    <div className="flex items-start">
                                        <div className="mr-3 flex-shrink-0 pt-1"><ResourceIcon type={res.type} /></div>
                                        <div>
                                            <p className="font-semibold text-marg-primary">{res.title}</p>
                                            <p className="text-xs text-marg-accent hover:underline break-all">{res.url}</p>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const UpgradeModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in-fast" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative p-8 text-center animate-scale-in" onClick={(e) => e.stopPropagation()}>
                 <h2 className="text-2xl font-bold text-marg-primary">Upgrade to MARG Pro</h2>
                 <p className="text-marg-text-secondary mt-2 mb-6">You've reached the limit of 1 classroom on the Free Plan. Upgrade to create unlimited classrooms and unlock advanced analytics.</p>
                 <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button onClick={onClose} className="text-sm font-medium text-marg-text-secondary px-6 py-2.5 rounded-lg hover:bg-gray-100 transition-colors">Maybe Later</button>
                    <Link to="/pro" className="bg-marg-accent text-white px-6 py-2.5 rounded-lg font-bold shadow-lg hover:opacity-90 transition-all transform hover:scale-105">Upgrade Now</Link>
                 </div>
            </div>
        </div>
    );
};

const CopyButton: React.FC<{ code: string }> = ({ code }) => {
    const [copied, setCopied] = useState(false);
    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button onClick={copyToClipboard} className={`px-3 py-1.5 rounded-md text-xs font-semibold text-white transition-all duration-300 ${copied ? 'bg-green-500' : 'bg-marg-accent'}`}>
            {copied ? 'Copied!' : 'Copy'}
        </button>
    );
};


const TeacherDashboard: React.FC = () => {
    const { user } = useUser();
    const [isPro, setIsPro] = useState(false); // Simulating subscription status
    const [classrooms, setClassrooms] = useState<string[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

    const handleCreateClass = () => {
        if (!isPro && classrooms.length >= 1) {
            setIsUpgradeModalOpen(true);
            return;
        }
        const newCode = `MARG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        setClassrooms(prev => [...prev, newCode]);
    };

    const hasCreatedClass = classrooms.length > 0;
    const userName = user?.name || 'Teacher';

    return (
        <DashboardLayout 
            title={`${userName}'s MARG Dashboard`} 
            subtitle="Your command center for guiding students."
        >
             <div className="bg-white p-4 rounded-lg border border-gray-200 mb-8 flex items-center justify-between">
                <div>
                    <span className="text-sm text-marg-text-secondary">Your Plan</span>
                    <h3 className={`text-lg font-bold ${isPro ? 'text-green-600' : 'text-marg-primary'}`}>{isPro ? 'MARG Pro' : 'Free Plan'}</h3>
                </div>
                {!isPro && <Link to="/pro" className="text-sm font-bold text-marg-accent hover:underline">Upgrade to Pro</Link>}
             </div>

            {!hasCreatedClass ? (
                <div className="bg-white p-10 rounded-xl border border-gray-200 text-center shadow-sm">
                    <h2 className="text-2xl font-bold text-marg-primary">Create Your First Classroom</h2>
                    <p className="text-marg-text-secondary mt-2 mb-6 max-w-xl mx-auto">Generate a unique class code to share with your students. Once they join, you'll be able to see their AI-powered career recommendations and provide targeted guidance.</p>
                    <button onClick={handleCreateClass} className="bg-marg-accent text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:opacity-90 transition-all transform hover:scale-105">
                        Create New Classroom
                    </button>
                </div>
            ) : (
                <div className="space-y-8">
                    {classrooms.map((classCode, index) => (
                        <div key={index} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-marg-primary">Classroom {index + 1}</h2>
                                    <p className="text-marg-text-secondary mt-1">Share this code with your students.</p>
                                </div>
                                <div className="flex items-center space-x-2 bg-marg-bg-light p-2 rounded-lg border-2 border-dashed border-gray-300">
                                    <span className="font-mono text-xl text-marg-primary px-2">{classCode}</span>
                                    <CopyButton code={classCode} />
                                </div>
                            </div>

                             <div className="bg-marg-bg-light p-3 rounded-lg text-center text-sm text-marg-text-secondary mb-6 border border-marg-secondary/20">
                                 Your classroom is limited to <strong>50 students</strong> on the Free Plan.
                             </div>
                            
                             <h3 className="text-xl font-bold text-marg-primary mb-4">Joined Students ({mockStudents.length})</h3>
                             <div className="space-y-4">
                                {mockStudents.map((studentName, idx) => (
                                    <div 
                                        key={studentName} 
                                        onClick={() => setSelectedStudent(studentName)} 
                                        className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer opacity-0 animate-fade-in-up-short"
                                        style={{ animationDelay: `${idx * 100}ms` }}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-marg-secondary/20 rounded-full flex items-center justify-center font-bold text-marg-primary text-lg">{studentName.charAt(0)}</div>
                                            <div>
                                                <h4 className="font-semibold text-marg-primary">{studentName}</h4>
                                                <p className="text-xs text-marg-text-secondary">Top Recommendation: {mockStudentRecommendations[studentName].conclusion.split('.')[0].replace(/.*suggests a strong aptitude for a career in (?:technology, particularly in fields like |)/i, '')}</p>
                                            </div>
                                        </div>
                                        <button className="text-sm font-medium text-marg-accent hover:underline">View Details</button>
                                    </div>
                                ))}
                             </div>
                        </div>
                    ))}
                    {!isPro && (
                         <button onClick={handleCreateClass} className="w-full bg-white border-2 border-dashed border-gray-300 text-marg-text-secondary p-6 rounded-xl hover:border-marg-accent hover:text-marg-accent transition-colors font-semibold">
                            + Create Another Classroom (Pro)
                        </button>
                    )}
                </div>
            )}
            <StudentDetailModal studentName={selectedStudent} onClose={() => setSelectedStudent(null)} />
            <UpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} />
        </DashboardLayout>
    );
};

export default TeacherDashboard;