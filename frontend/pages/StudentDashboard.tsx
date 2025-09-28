import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import { useUser } from '../UserContext';
import { COLLEGES_DATA } from '../constants';

// --- SVG Icon Components ---

const ExploreIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const PathsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const ReviewIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>;
const MentorshipIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const BookmarksIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;


const ActionCard: React.FC<{ icon: React.ReactNode; title: string; description: string; link: string; delay: number }> = ({ icon, title, description, link, delay }) => (
    <Link to={link} className="block bg-white p-6 rounded-xl border border-gray-200 group hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 opacity-0 animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
        <div className="flex items-center justify-between">
            <div className="flex items-start space-x-4">
                <div className="p-3 rounded-lg bg-marg-bg-light text-marg-secondary group-hover:bg-marg-accent group-hover:text-white transition-colors duration-300">{icon}</div>
                <div>
                    <h3 className="font-bold text-lg text-marg-primary">{title}</h3>
                    <p className="text-sm text-marg-text-secondary">{description}</p>
                </div>
            </div>
            <span className="text-gray-300 group-hover:text-marg-accent opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-1 group-hover:translate-x-0">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </span>
        </div>
    </Link>
);

const ClickActionCard: React.FC<{ icon: React.ReactNode; title: string; description: string; onClick: () => void; delay: number }> = ({ icon, title, description, onClick, delay }) => (
    <div onClick={onClick} className="block bg-white p-6 rounded-xl border border-gray-200 group hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 opacity-0 animate-fade-in-up cursor-pointer" style={{ animationDelay: `${delay}ms` }}>
        <div className="flex items-center justify-between">
            <div className="flex items-start space-x-4">
                <div className="p-3 rounded-lg bg-marg-bg-light text-marg-secondary group-hover:bg-marg-accent group-hover:text-white transition-colors duration-300">{icon}</div>
                <div>
                    <h3 className="font-bold text-lg text-marg-primary">{title}</h3>
                    <p className="text-sm text-marg-text-secondary">{description}</p>
                </div>
            </div>
            <span className="text-gray-300 group-hover:text-marg-accent opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-1 group-hover:translate-x-0">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </span>
        </div>
    </div>
);


const LockedFeatureCard: React.FC<{ icon: React.ReactNode; title: string; delay: number }> = ({ icon, title, delay }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 text-center relative overflow-hidden opacity-0 animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
        <div className="absolute inset-0 bg-gray-100/60 backdrop-blur-sm flex items-center justify-center flex-col p-4 group">
            <div className="text-gray-400 mb-2 transition-all duration-300 group-hover:scale-110 group-hover:text-marg-accent group-hover:drop-shadow-[0_0_4px_rgba(242,153,74,0.7)]">
                <LockIcon />
            </div>
            <span className="text-xs font-semibold text-gray-500 transition-colors group-hover:text-marg-primary">Complete the quiz to unlock</span>
        </div>
        <div className="text-4xl mb-3 text-marg-primary/40">{icon}</div>
        <h3 className="font-bold text-lg text-marg-primary/40">{title}</h3>
    </div>
);

const MentorshipModal: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsSubmitted(false);
            setMessage('');
        }
    }, [isOpen]);
    
    const handleEsc = (event: KeyboardEvent) => {
       if (event.key === 'Escape') {
        onClose();
       }
    };
    
    useEffect(() => {
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
        }
        return () => {
          window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        console.log('Mentorship request submitted:', message);
        setIsSubmitted(true);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in-fast" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg relative p-8 animate-scale-in" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                {isSubmitted ? (
                    <div className="text-center p-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-2xl font-bold text-marg-primary mt-4">Request Submitted!</h2>
                        <p className="text-marg-text-secondary mt-2">A mentor will review your request and get in touch with you shortly via email.</p>
                        <button onClick={onClose} className="mt-8 bg-marg-accent text-white px-8 py-2.5 rounded-lg font-bold">Close</button>
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-marg-primary">Request Mentorship Counseling</h2>
                        <p className="text-marg-text-secondary mt-2 mb-4">Describe what you'd like to discuss with a mentor. This will help us connect you with the right person.</p>
                        
                        <div className="bg-marg-bg-light p-3 rounded-lg text-center text-sm text-marg-text-secondary mb-6 border border-marg-secondary/20">
                           Your first mentorship session is <span className="font-bold text-marg-primary">free</span>. Unlimited counseling is available with a <Link to="/pro" className="font-bold text-marg-accent hover:underline">MARG Pro</Link> subscription.
                        </div>

                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="e.g., I'm confused between Data Science and AI/ML, I need help preparing for college interviews..."
                            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marg-accent focus:outline-none transition-shadow"
                            aria-label="Your message to the mentor"
                        ></textarea>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button onClick={onClose} className="text-sm font-medium text-marg-text-secondary px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors">Cancel</button>
                            <button onClick={handleSubmit} disabled={!message.trim()} className="bg-marg-accent text-white px-6 py-2 rounded-lg font-bold disabled:opacity-50 transition-opacity hover:opacity-90">Submit Request</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const ParentConnectCode: React.FC<{ userName: string }> = ({ userName }) => {
    const studentCode = `MARG-S-${userName.split(' ')[0].toUpperCase()}`;
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(studentCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col sm:flex-row items-center justify-center sm:justify-between text-center sm:text-left gap-4">
            <div>
                <h3 className="font-semibold text-marg-primary">Your Parent Connect Code</h3>
                <p className="text-xs text-marg-text-secondary">Share this code with your parent to link your accounts.</p>
            </div>
            <div className="flex items-center space-x-2 bg-marg-bg-light p-2 rounded-lg border-2 border-dashed border-gray-300">
                <span className="font-mono text-marg-primary px-2">{studentCode}</span>
                <button onClick={copyToClipboard} className={`px-3 py-1 rounded-md text-xs font-semibold text-white transition-all duration-300 ${copied ? 'bg-green-500' : 'bg-marg-accent'}`}>
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
        </div>
    );
};

const JoinClassroom: React.FC = () => {
    const [code, setCode] = useState('');
    const [joined, setJoined] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (code.trim()) {
            setJoined(true);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
            {joined ? (
                <div className="flex items-center justify-center text-green-600 font-semibold text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Successfully connected to your teacher's classroom!
                </div>
            ) : (
                 <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 w-full">
                    <label htmlFor="class-code" className="font-semibold text-marg-primary flex-shrink-0 text-center sm:text-left whitespace-nowrap">
                         Join a Classroom
                    </label>
                    <input 
                        id="class-code"
                        type="text" 
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="Enter Teacher's Code"
                        className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marg-accent focus:outline-none font-mono tracking-wider w-full sm:w-auto"
                    />
                    <button type="submit" className="bg-marg-primary text-white px-5 py-2 rounded-lg font-bold hover:bg-marg-primary/90 transition-colors w-full sm:w-auto flex-shrink-0">
                        Connect
                    </button>
                </form>
            )}
        </div>
    );
};

const MyInterests: React.FC = () => {
    const interests = [
        'Data Analysis',
        'Creative Design',
        'Software Development',
        'Problem Solving',
        'Leadership',
        'Machine Learning',
    ];
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-marg-primary mb-4">Your Key Interests</h3>
            <div className="flex flex-wrap gap-3">
                {interests.map(interest => (
                    <div key={interest} className="bg-marg-bg-light text-marg-secondary font-semibold px-4 py-2 rounded-full text-sm">
                        {interest}
                    </div>
                ))}
            </div>
        </div>
    );
};

const TopGovColleges: React.FC = () => {
    const govColleges = COLLEGES_DATA.filter(c => c.type === 'Government').slice(0, 6);

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-marg-primary">Spotlight on Government Colleges</h3>
                <Link to="/careers" className="text-sm font-bold text-marg-accent hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {govColleges.map(college => (
                    <div key={college.id} className="p-4 bg-marg-bg-light rounded-lg border border-gray-200 group transition-all duration-300 hover:shadow-md hover:border-marg-secondary/50">
                        <h4 className="font-bold text-marg-primary truncate">{college.name}</h4>
                        <p className="text-sm text-marg-text-secondary"> {college.city}, {college.state}</p>
                         <p className="text-xs text-marg-text-secondary mt-1">~ ₹{college.annualFees.toLocaleString('en-IN')}/year</p>
                    </div>
                ))}
            </div>
        </div>
    );
};


const StudentDashboard: React.FC = () => {
    const { user } = useUser();
    const [isQuizCompleted, setIsQuizCompleted] = useState(false);
    const [isMentorshipModalOpen, setIsMentorshipModalOpen] = useState(false);
    
    useEffect(() => {
        const completed = localStorage.getItem('margQuizCompleted') === 'true';
        setIsQuizCompleted(completed);
    }, []);
    
    const userName = user?.name || 'Student';

    return (
        <DashboardLayout 
            title={`Welcome, ${userName}!`} 
            subtitle={isQuizCompleted ? "Your MARG Dashboard for career exploration." : "Your journey to a successful career starts here."}
        >
            <div className="space-y-8">
                {isQuizCompleted ? (
                     <div className="space-y-8">
                        <div className="opacity-0 animate-fade-in-up space-y-4">
                            <MyInterests />
                        </div>
                         <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                            <TopGovColleges />
                        </div>
                    </div>
                ) : (
                    <div className="lg:col-span-2 bg-gradient-to-br from-marg-primary to-marg-secondary text-white p-10 rounded-xl shadow-2xl flex flex-col justify-center items-center text-center transform hover:scale-[1.02] transition-transform duration-500 relative overflow-hidden opacity-0 animate-fade-in-up">
                        <div className="absolute inset-0 bg-animated-pattern opacity-10 animate-bg-pan"></div>
                        <div className="relative z-10">
                            <div className="relative w-24 h-24 mb-4 mx-auto">
                                <div className="absolute inset-0 bg-yellow-300 rounded-full animate-pulse opacity-20"></div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold mb-3">Unlock Your Personalized Career Path</h2>
                            <p className="max-w-xl mx-auto mb-8 text-gray-200">
                                Take our comprehensive quiz to discover your strengths. Our AI will craft a tailored career roadmap and college recommendations just for you.
                            </p>
                            <Link
                                to="/quiz"
                                className="inline-block bg-marg-accent text-white px-10 py-4 rounded-lg font-bold text-lg transform transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl shadow-lg"
                            >
                                Take the Quiz Now
                            </Link>
                        </div>
                    </div>
                )}
                
                 <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                    <h3 className="text-xl font-bold text-marg-primary mb-4">Connectivity Hub</h3>
                    <div className="space-y-4">
                      <ParentConnectCode userName={userName}/>
                      <JoinClassroom />
                    </div>
                  </div>

                <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                    <h3 className="text-2xl font-bold text-marg-primary text-center mb-8">
                        {isQuizCompleted ? "Your Personalized Tools & Actions" : "After the quiz, you'll unlock these personalized tools:"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {isQuizCompleted ? (
                             <>
                                <ActionCard icon={<ReviewIcon />} title="Review Recommendations" description="Revisit your AI career matches and resources." link="/quiz" delay={600} />
                                <ClickActionCard icon={<MentorshipIcon />} title="Request Mentorship" description="Your first session is free! Get expert advice." onClick={() => setIsMentorshipModalOpen(true)} delay={700} />
                                <ActionCard icon={<BookmarksIcon />} title="My Bookmarks" description="View your saved careers and paths." link="/careers" delay={800} />
                            </>
                        ) : (
                             <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
                                <LockedFeatureCard icon={<ReviewIcon/>} title="AI Career Matches" delay={600} />
                                <LockedFeatureCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>} title="Top College Recommendations" delay={700} />
                                <LockedFeatureCard icon={<MentorshipIcon/>} title="Mentorship Counseling" delay={800} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
             <MentorshipModal isOpen={isMentorshipModalOpen} onClose={() => setIsMentorshipModalOpen(false)} />
        </DashboardLayout>
    );
};

export default StudentDashboard;