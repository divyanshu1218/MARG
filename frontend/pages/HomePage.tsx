
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRealtimeNews } from '../services/geminiService';
import { NewsNotification } from '../types';


// --- SVG Icon Components ---

const QuizIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);

const InsightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

const BuildIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
    </svg>
);

const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const GraduationCapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20M12 14.75L20.5 10 12 5.25 3.5 10 12 14.75z" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;

interface NotificationAppearance {
    icon: React.ReactNode;
    color: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

const getNotificationAppearance = (category: NewsNotification['category']): NotificationAppearance => {
    switch (category) {
        case 'EXAM': return { icon: <CalendarIcon />, color: 'blue' };
        case 'ADMISSION': return { icon: <GraduationCapIcon />, color: 'green' };
        case 'SCHOLARSHIP': return { icon: <SparklesIcon />, color: 'yellow' };
        case 'DEADLINE': return { icon: <CalendarIcon />, color: 'red' };
        case 'RESOURCE': return { icon: <LinkIcon />, color: 'purple' };
        default: return { icon: <SparklesIcon />, color: 'blue' };
    }
};

const NotificationCard: React.FC<{ notification: NewsNotification, delay: number }> = ({ notification, delay }) => {
    const { icon, color } = getNotificationAppearance(notification.category);
    
    const categoryStyles = {
        blue: { bg: 'bg-blue-100', text: 'text-blue-800' },
        green: { bg: 'bg-green-100', text: 'text-green-800' },
        yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
        red: { bg: 'bg-red-100', text: 'text-red-800' },
        purple: { bg: 'bg-purple-100', text: 'text-purple-800' },
    };
    const styles = categoryStyles[color];

    return (
        <a href={notification.url} target="_blank" rel="noopener noreferrer" className="block bg-white p-6 rounded-xl border border-gray-200 group hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 opacity-0 animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
            <div className="flex items-start space-x-4">
                <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full ${styles.bg} ${styles.text}`}>
                    {icon}
                </div>
                <div>
                    <span className={`text-xs font-bold uppercase ${styles.text}`}>{notification.category}</span>
                    <h3 className="text-lg font-bold text-marg-primary mt-1">{notification.title}</h3>
                    <p className="text-sm text-marg-text-secondary mt-2">{notification.description}</p>
                    <p className="text-xs text-gray-400 mt-4">{notification.timestamp}</p>
                </div>
            </div>
        </a>
    );
};

const NotificationSkeleton: React.FC = () => (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-start space-x-4 animate-pulse">
            <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="w-full">
                <div className="h-3 bg-gray-200 rounded w-1/4 mb-3"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6 mb-4"></div>
                <div className="h-2 bg-gray-200 rounded w-1/3"></div>
            </div>
        </div>
    </div>
);


const TrustPill: React.FC<{ name: string }> = ({ name }) => (
  <div className="bg-white p-6 text-center rounded-lg border border-gray-200 flex items-center justify-center h-full hover:shadow-md transition-shadow">
    <span className="font-semibold text-marg-text-primary">{name}</span>
  </div>
);

const HowItWorksStep: React.FC<{icon:React.ReactNode, title:string, description:string}> = ({icon, title, description}) => (
    <div className="flex flex-col items-center text-center">
        <div className="flex items-center justify-center w-20 h-20 bg-marg-bg-light rounded-full text-marg-primary mb-4 transition-all duration-300 transform group-hover:scale-110 group-hover:bg-marg-accent/20">
            {icon}
        </div>
        <h3 className="font-bold text-lg text-marg-primary mb-2">{title}</h3>
        <p className="text-marg-text-secondary text-sm max-w-xs">{description}</p>
    </div>
);

const HomePage: React.FC = () => {
  const [notifications, setNotifications] = useState<NewsNotification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const newsItems = await getRealtimeNews();
            setNotifications(newsItems.slice(0, 4));
        } catch (err) {
            console.error(err);
            setError("Could not load the latest news. Please check back later.");
        } finally {
            setIsLoading(false);
        }
    };
    fetchNews();
  }, []);

  return (
    <div className="bg-marg-bg text-marg-text-primary">
      {/* Hero Section */}
      <section className="bg-marg-bg-light relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left animate-fade-in-right">
              <span className="text-marg-secondary font-semibold uppercase tracking-wider">Mentorship & Academic Roadmap Guide</span>
              <h1 className="text-4xl md:text-6xl font-extrabold text-marg-primary mt-2 mb-4 leading-tight">
                Find Your Path with MARG.
              </h1>
              <p className="text-lg text-marg-text-secondary mb-8">
                Your AI-powered guide to a successful future. Take the quiz, discover your strengths, and build a personalized roadmap to your dream career.
              </p>
              <Link to="/careers" className="inline-block bg-marg-accent text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-transform hover:scale-105 shadow-lg">
                Explore Career Choices
              </Link>
            </div>
            <div className="animate-fade-in-left">
               <div className="bg-white/50 backdrop-blur-lg p-8 rounded-2xl border border-white/30 shadow-2xl text-center transition-all duration-300 hover:shadow-cyan-500/10 hover:border-white/60">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-marg-accent mb-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
                <h2 className="text-3xl font-bold text-marg-primary mb-3">Your Future Awaits</h2>
                <p className="text-marg-text-secondary mb-8">
                  Begin your personalized journey to career clarity. Let's build your roadmap to success together.
                </p>
                <Link to="/register" className="inline-block bg-marg-primary text-white px-10 py-4 rounded-lg font-bold text-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl shadow-lg">
                  Get Started Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Updates & News Section */}
      <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center text-marg-primary mb-12">Live Updates & News</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[300px]">
                  {isLoading ? (
                      Array.from({ length: 4 }).map((_, index) => <NotificationSkeleton key={index} />)
                  ) : error ? (
                      <div className="md:col-span-2 text-center py-10 bg-red-50 border border-red-200 rounded-lg flex flex-col items-center justify-center">
                          <p className="text-red-700 font-semibold">{error}</p>
                      </div>
                  ) : (
                      notifications.map((notification, index) => (
                          <NotificationCard key={index} notification={notification} delay={100 * (index + 1)} />
                      ))
                  )}
              </div>
          </div>
      </section>
      
      {/* How it Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-marg-primary mb-12">Your Journey to Clarity</h2>
          <div className="grid md:grid-cols-3 gap-12 items-start relative group">
             <div className="absolute top-10 left-1/4 w-1/2 h-0 border-t-2 border-dashed border-gray-300 hidden md:block" />
            <HowItWorksStep icon={<QuizIcon />} title="1. Take Tests" description="Start with quick, engaging quizzes to discover your aptitude, interests, and vision." />
            <HowItWorksStep icon={<InsightIcon />} title="2. Get Insights" description="Our AI analyzes your results to provide personalized career suggestions and insights." />
            <HowItWorksStep icon={<BuildIcon />} title="3. Build Your Path" description="Explore detailed career roadmaps and bookmark your favorites to build your future." />
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-marg-primary">Trusted by</h2>
            <span className="text-sm text-marg-text-secondary">Schools, NGOs, and edtechs</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <TrustPill name="FutureSkills Initiative" />
            <TrustPill name="EduBridge Foundation" />
            <TrustPill name="MentorWorks" />
            <TrustPill name="Pathfinder Academy" />
            <TrustPill name="SkillForge Institute" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;