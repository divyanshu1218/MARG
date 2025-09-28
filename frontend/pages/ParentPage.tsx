import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from './DashboardLayout';
import { useUser } from '../UserContext';
import { AIRecommendation, College } from '../types';

// --- Mock Data ---
const mockChildRecommendation: AIRecommendation = {
    conclusion: "Based on the quiz, your child shows strong analytical and creative problem-solving skills, suggesting a high aptitude for a career in technology or design, particularly in innovative fields like UI/UX Design or AI/ML Engineering.",
    colleges: {
        nearby: [{ id: 101, name: 'Indian Institute of Technology, Bombay', city: 'Mumbai', state: 'Maharashtra', type: 'Government', annualFees: 220000 }],
        inState: [{ id: 801, name: 'Pune Institute of Computer Technology', city: 'Pune', state: 'Maharashtra', type: 'AICTE Approved', annualFees: 120000 }],
        national: [
            { id: 201, name: 'National Institute of Design, Ahmedabad', city: 'Ahmedabad', state: 'Gujarat', type: 'Government', annualFees: 350000 },
            { id: 106, name: 'International Institute of Information Technology, Hyderabad', city: 'Hyderabad', state: 'Telangana', type: 'Private', annualFees: 400000 },
            { id: 203, name: 'Srishti Manipal Institute of Art, Design and Technology', city: 'Bengaluru', state: 'Karnataka', type: 'Private', annualFees: 600000 },
        ]
    },
    resources: [
        { title: "What is UX Design? A Full Overview", url: "https://www.youtube.com/watch?v=c1_Y-_WzeA8", type: 'video' },
        { title: "Roadmap to Becoming an AI Engineer", url: "https://www.example.com/ai-roadmap", type: 'article' },
        { title: "Figma for UI/UX Design", url: "https://www.figma.com", type: 'website' }
    ]
};

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

// --- Reusable Components ---
const FilterSelect: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: string[]; icon?: React.ReactNode }> = ({ label, value, onChange, options, icon }) => (
    <div>
        <label className="block text-sm font-medium text-marg-text-secondary mb-1.5 flex items-center">{icon && <span className="mr-2 text-marg-secondary">{icon}</span>}{label}</label>
        <div className="relative"><select value={value} onChange={onChange} className="w-full p-2.5 pl-3 pr-10 bg-white border border-gray-300 rounded-md text-sm appearance-none focus:ring-2 focus:ring-marg-accent focus:outline-none focus:border-marg-accent">{options.map(o => <option key={o} value={o}>{o}</option>)}</select><div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500"><svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg></div></div>
    </div>
);

const TimelineStep: React.FC<{ status: 'complete' | 'current' | 'upcoming'; title: string; isLast?: boolean }> = ({ status, title, isLast = false }) => {
    const getStatusStyles = () => {
        switch (status) {
            case 'complete': return { circle: 'bg-marg-secondary border-marg-secondary', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>, line: 'bg-marg-secondary' };
            case 'current': return { circle: 'bg-marg-accent border-marg-accent ring-4 ring-marg-accent/20', icon: null, line: 'bg-gray-200' };
            case 'upcoming': return { circle: 'bg-white border-gray-300', icon: null, line: 'bg-gray-200' };
        }
    };
    const styles = getStatusStyles();
    return (
        <div className="flex items-start">
            <div className="flex flex-col items-center mr-3"><div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${styles.circle}`}>{styles.icon}</div>{!isLast && <div className={`w-0.5 h-12 mt-1 transition-colors ${styles.line}`}></div>}</div>
            <p className={`font-semibold pt-0.5 ${status === 'current' ? 'text-marg-primary' : 'text-marg-text-secondary'}`}>{title}</p>
        </div>
    );
};

const MeetingModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-marg-primary">Mentorship Session</h2><button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"><div className="bg-gray-200 rounded-lg aspect-video flex flex-col items-center justify-center text-gray-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg><span className="font-semibold">Student</span></div><div className="bg-gray-200 rounded-lg aspect-video flex flex-col items-center justify-center text-gray-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg><span className="font-semibold">Mentor</span></div></div>
                <div className="bg-marg-bg-light p-4 rounded-lg text-center"><p className="font-semibold text-marg-primary">You are observing this meeting.</p></div>
                <div className="flex justify-end mt-6"><button onClick={onClose} className="bg-red-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-600 transition-colors">Leave</button></div>
            </div>
        </div>
    );
};

// --- Dashboard Sections ---
const CollegeResults: React.FC<{ colleges: AIRecommendation['colleges'] }> = ({ colleges }) => {
    const allColleges = [...(colleges.nearby || []), ...(colleges.inState || []), ...(colleges.national || [])];
    const [budget, setBudget] = useState('All');
    const [state, setState] = useState('All');
    const [type, setType] = useState('All');
    const budgetOptions = {'All': [0, Infinity], '< ₹2 Lakhs': [0, 200000], '₹2-5 Lakhs': [200001, 500000], '> ₹5 Lakhs': [500001, Infinity]};
    const states = useMemo(() => ['All', ...new Set(allColleges.map(c => c.state).sort())], [allColleges]);
    
    const filteredColleges = useMemo(() => {
        const [minBudget, maxBudget] = budgetOptions[budget as keyof typeof budgetOptions];
        return allColleges.filter(c => (c.annualFees >= minBudget && c.annualFees <= maxBudget) && (state === 'All' || c.state === state) && (type === 'All' || c.type === type));
    }, [allColleges, budget, state, type]);

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-marg-bg rounded-lg border border-gray-200">
                <FilterSelect label="Budget" value={budget} onChange={e => setBudget(e.target.value)} options={Object.keys(budgetOptions)} />
                <FilterSelect label="State" value={state} onChange={e => setState(e.target.value)} options={states} />
                <FilterSelect label="Type" value={type} onChange={e => setType(e.target.value)} options={['All', 'Government', 'Private', 'AICTE Approved', 'AISHE']} />
            </div>
            <div className="space-y-3">
                {filteredColleges.length > 0 ? (
                    filteredColleges.map(college => (
                        <div key={college.id} className="bg-white p-4 rounded-lg border border-gray-200"><h4 className="font-bold text-marg-primary">{college.name}</h4><div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-marg-text-secondary mt-1"><span>📍 {college.city}, {college.state}</span><span>🎓 {college.type}</span><span>💰 ₹{college.annualFees.toLocaleString('en-IN')}/yr</span></div></div>
                    ))
                ) : (<p className="text-center text-marg-text-secondary py-8">No colleges match filters.</p>)}
            </div>
        </div>
    );
};

const MentorshipTracker: React.FC = () => {
    const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
    const [showLiveNotification, setShowLiveNotification] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowLiveNotification(true), 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full opacity-0 animate-fade-in-up" style={{animationDelay: '200ms'}}>
            <h3 className="text-lg font-bold text-marg-primary mb-4">Mentorship Progress</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                <div>
                    <h4 className="font-semibold text-marg-primary text-sm mb-3">Application Status</h4>
                    <TimelineStep status="complete" title="Application Submitted" />
                    <TimelineStep status="complete" title="Aptitude Test Cleared" />
                    <TimelineStep status="current" title="Mentorship Meeting" />
                    <TimelineStep status="upcoming" title="Final Decision" isLast />
                </div>
                 <div>
                    <h4 className="font-semibold text-marg-primary text-sm mb-3">Live Updates</h4>
                     <div className="space-y-3">
                        {showLiveNotification && (
                            <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-r-lg animate-fade-in relative">
                                <span className="absolute -left-1.5 top-1/2 -mt-1.5 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></span>
                                <p className="font-semibold text-green-800 text-sm">Meeting is Live</p>
                                <button onClick={() => setIsMeetingModalOpen(true)} className="text-xs font-bold text-green-600 hover:underline mt-1">Join as Observer</button>
                            </div>
                        )}
                         <div className="bg-marg-bg-light/70 p-3 rounded-lg"><p className="font-semibold text-marg-primary text-sm">Aptitude Test Cleared</p><p className="text-xs text-marg-text-secondary">Yesterday</p></div>
                    </div>
                 </div>
            </div>
            <MeetingModal isOpen={isMeetingModalOpen} onClose={() => setIsMeetingModalOpen(false)} />
        </div>
    );
};

// --- Parent Dashboard Views ---
const ConnectedView: React.FC<{ recommendations: AIRecommendation }> = ({ recommendations }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm opacity-0 animate-fade-in-up" style={{animationDelay: '100ms'}}>
                    <h2 className="text-2xl font-bold text-marg-primary mb-4 flex items-center"><SectionIcon type="summary" /><span className="ml-3">Child's AI Summary</span></h2>
                    <p className="text-marg-text-secondary text-base leading-relaxed">{recommendations.conclusion}</p>
                </div>
                 <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm opacity-0 animate-fade-in-up" style={{animationDelay: '300ms'}}>
                    <h2 className="text-2xl font-bold text-marg-primary mb-6 flex items-center"><SectionIcon type="college" /><span className="ml-3">Recommended Colleges</span></h2>
                    <CollegeResults colleges={recommendations.colleges} />
                </div>
                 <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm opacity-0 animate-fade-in-up" style={{animationDelay: '500ms'}}>
                    <h2 className="text-2xl font-bold text-marg-primary mb-6 flex items-center"><SectionIcon type="resource" /><span className="ml-3">Suggested Resources</span></h2>
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
            <div className="lg:sticky top-24">
                <MentorshipTracker />
            </div>
        </div>
    );
};

const ConnectView: React.FC<{ onConnect: () => void }> = ({ onConnect }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const studentName = 'Ravi Kumar';
    const correctCode = `MARG-S-${studentName.split(' ')[0].toUpperCase()}`;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        setTimeout(() => {
            if (code.trim().toUpperCase() === correctCode) { onConnect(); } 
            else { setError('Invalid code. Please check and try again.'); }
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="bg-white p-10 rounded-xl border border-gray-200 text-center shadow-sm max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-marg-primary">Connect with Your Child</h2>
            <p className="text-marg-text-secondary mt-2 mb-6">Enter the "Parent Connect Code" provided by your child to view their progress.</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input type="text" value={code} onChange={e => setCode(e.target.value)} placeholder="Enter Connect Code" className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none font-mono tracking-wider text-center ${error ? 'border-red-500 ring-red-300' : 'border-gray-300 focus:ring-marg-accent'}`} />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button type="submit" className="bg-marg-accent text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:opacity-90 transition-all transform hover:scale-105 disabled:opacity-50 flex items-center justify-center" disabled={!code.trim() || isLoading}>
                    {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Connect'}
                </button>
            </form>
        </div>
    );
};

const ParentPage: React.FC = () => {
    const { user } = useUser();
    const [isConnected, setIsConnected] = useState(false);
    const childsName = "Ravi Kumar";
    const parentName = user?.name || "Parent";

    return (
        <>
            {isConnected ? (
                <DashboardLayout 
                    title={`${childsName}'s MARG Dashboard`} 
                    subtitle="A transparent view into your child's career journey."
                >
                    <ConnectedView recommendations={mockChildRecommendation} />
                </DashboardLayout>
            ) : (
                <div className="bg-marg-bg min-h-[80vh] py-16 px-4 flex items-center justify-center">
                    <div className="w-full">
                         <div className="text-center mb-10">
                            <h1 className="text-4xl font-extrabold text-marg-primary mb-2">{parentName}'s MARG Dashboard</h1>
                            <p className="text-lg text-marg-text-secondary">Connect with your child to begin.</p>
                        </div>
                        <ConnectView onConnect={() => setIsConnected(true)} />
                    </div>
                </div>
            )}
        </>
    );
};

export default ParentPage;
