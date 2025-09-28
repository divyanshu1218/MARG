import React from 'react';

const FeatureHighlightCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; }> = ({ icon, title, children }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 h-full">
        <div className="flex items-start space-x-4">
            <div className="text-2xl bg-marg-bg-light p-3 rounded-lg text-marg-accent">{icon}</div>
            <div>
                <h3 className="font-bold text-lg text-marg-primary mb-1">{title}</h3>
                <div className="text-sm text-marg-text-secondary">{children}</div>
            </div>
        </div>
    </div>
);

const TechStackPill: React.FC<{ name: string }> = ({ name }) => (
    <span className="inline-block bg-marg-bg-light text-marg-secondary text-sm font-medium mr-2 mb-2 px-3 py-1.5 rounded-full">
        {name}
    </span>
);

const ProcessStep: React.FC<{ number: string; title: string; description: string }> = ({ number, title, description }) => (
    <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-marg-primary text-white font-bold text-xl rounded-full">
            {number}
        </div>
        <div>
            <h4 className="font-bold text-lg text-marg-primary">{title}</h4>
            <p className="text-marg-text-secondary">{description}</p>
        </div>
    </div>
);

// --- Technology Section Components ---

const FrontendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
);

const BackendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
);

const AiIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 01-1.022.547m14.456 0a2 2 0 01-1.022-.547l-2.387-.477a6 6 0 01-3.86.517l-.318.158a6 6 0 00-3.86.517l-2.387.477a2 2 0 01-1.806.547a2 2 0 00-1.022.547m14.456 0l1.022-.547a2 2 0 001.022-1.805l-.424-2.386a2 2 0 00-1.806-1.547l-2.387.477a6 6 0 00-3.86-.517l-.318-.158a6 6 0 01-3.86-.517l-2.387-.477a2 2 0 00-1.806-1.547l-.424 2.386a2 2 0 001.022 1.805l1.022.547m0 0l-1.022.547a2 2 0 00-1.022 1.805l.424 2.386a2 2 0 001.806 1.547l2.387-.477a6 6 0 003.86.517l.318.158a6 6 0 013.86.517l2.387.477a2 2 0 001.806 1.547l.424-2.386a2 2 0 00-1.022-1.805l-1.022-.547z" />
    </svg>
);

const DevOpsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const TechCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; }> = ({ icon, title, children }) => (
    <div className="bg-marg-bg-light/50 p-6 rounded-xl border border-gray-200 h-full">
        <div className="flex items-center space-x-4 mb-4">
            <div className="text-marg-accent bg-marg-accent/10 p-3 rounded-lg">{icon}</div>
            <h3 className="font-bold text-xl text-marg-primary">{title}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
            {children}
        </div>
    </div>
);


const AboutPage: React.FC = () => {
  return (
    <div className="bg-marg-bg min-h-screen">
       {/* Hero Section */}
      <div className="bg-marg-bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 items-center py-16">
                <div className="relative z-10 animate-fade-in-right">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-marg-primary mb-4">MARG: Your Path to a Fulfilling Career.</h1>
                    <p className="text-lg text-marg-text-secondary">MARG (meaning "path" in Hindi) stands for <span className="font-semibold text-marg-primary">Mentorship & Academic Roadmap Guide</span>. We are a government-first AI platform ensuring trustworthy, bias-free recommendations for all Indian students.</p>
                </div>
                <div className="h-80 md:h-96 w-full animate-fade-in-left flex items-center justify-center p-8">
                    <div className="relative w-full h-full max-w-sm max-h-sm">
                        <div className="absolute inset-0 border-[3px] border-marg-secondary/20 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
                        <div className="absolute inset-8 border-[3px] border-marg-accent/30 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
                        <div className="absolute inset-16 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-inner">
                            <div className="text-center">
                                <div className="text-5xl font-extrabold text-marg-primary">MARG</div>
                                <div className="text-sm font-tech text-marg-secondary tracking-widest">AI GUIDE</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Core Features Section */}
        <section className="opacity-0 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-center text-marg-primary mb-10">Core Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FeatureHighlightCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} title="Smart Career Guidance">
                    Our AI-driven quizzes analyze interests and aptitudes to map out optimal career streams and create a personalized dashboard just for you.
                </FeatureHighlightCard>
                <FeatureHighlightCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} title="Government College Directory">
                    Access a verified, real-time directory of Indian colleges. Our data, sourced from AICTE, UGC, and AISHE, ensures you have the latest on admissions and scholarships.
                </FeatureHighlightCard>
                <FeatureHighlightCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 009-9M3 12a9 9 0 009 9" /></svg>} title="Universal & Inclusive Access">
                    Designed for every student in India. Our fully responsive platform offers multi-language support including Hindi and Marathi to ensure no one is left behind.
                </FeatureHighlightCard>
                <FeatureHighlightCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h1m6 4h.01M9 7h.01" /></svg>} title="Community Platform">
                    Connect with a network of vetted peer mentors from top universities. Get timely scholarship alerts and access a curated library of resources to stay ahead.
                </FeatureHighlightCard>
                <FeatureHighlightCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" /></svg>} title="Parental Dashboard">
                    Empower parents with a dedicated dashboard. Gain real-time visibility into your child's progress and AI-powered recommendations to support their journey.
                </FeatureHighlightCard>
                 <FeatureHighlightCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>} title="Trust & Transparency">
                    Built on a foundation of trust. We use bias-free AI, verified government data, and a transparent mentorship program to build confidence in your future.
                </FeatureHighlightCard>
            </div>
        </section>

        {/* How MARG AI Works Section */}
        <section className="opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <h2 className="text-3xl font-bold text-center text-marg-primary mb-12">How MARG AI Works</h2>
            <div className="max-w-4xl mx-auto grid md:grid-cols-1 gap-10">
                <ProcessStep number="1" title="Take the AI Quiz" description="A multi-dimensional quiz captures your aptitude, interests, academic strengths, and personality." />
                <ProcessStep number="2" title="Get AI Analysis" description="Our engine clusters your responses, ranks recommended career streams, and predicts success probabilities." />
                <ProcessStep number="3" title="Receive Your Roadmap" description="Get personalized career, college, and path recommendations with mapped steps to exams and higher studies." />
            </div>
        </section>
        
        {/* Parental & Mentorship Section */}
        <section className="opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <h2 className="text-3xl font-bold text-center text-marg-primary mb-10">Fostering a Collaborative Ecosystem</h2>
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
                <FeatureHighlightCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" /></svg>} title="Real-Time Parent Portal">
                    The dashboard gives parents a window into their child's quiz results, AI recommendations, and mentorship application status.
                </FeatureHighlightCard>
                <FeatureHighlightCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20M12 14.75L20.5 10 12 5.25 3.5 10 12 14.75z" /></svg>} title="Vetted Peer Mentorship">
                   2nd-year+ college students undergo aptitude and interview vetting to provide high-quality, verifiable peer guidance.
                </FeatureHighlightCard>
            </div>
        </section>

        {/* Tech Stack Section */}
        <section className="opacity-0 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
            <h2 className="text-3xl font-bold text-center text-marg-primary mb-4">Our Technology Stack</h2>
            <p className="text-center text-marg-text-secondary max-w-2xl mx-auto mb-12">
                We use modern, scalable technologies to deliver a reliable and seamless experience for students, parents, and educators.
            </p>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <TechCard icon={<FrontendIcon />} title="Frontend">
                    <TechStackPill name="React (TypeScript)" />
                    <TechStackPill name="Tailwind CSS" />
                    <TechStackPill name="React Router" />
                </TechCard>
                <TechCard icon={<BackendIcon />} title="Backend">
                    <TechStackPill name="Node.ts" />
                    <TechStackPill name="Express.ts" />
                    <TechStackPill name="JWT Authentication" />
                </TechCard>
                <TechCard icon={<AiIcon />} title="AI & Data">
                    <TechStackPill name="Google Gemini API" />
                    <TechStackPill name="PostgreSQL" />
                    <TechStackPill name="MongoDB" />
                </TechCard>
                <TechCard icon={<DevOpsIcon />} title="Deployment & DevOps">
                    <TechStackPill name="Vercel" />
                    <TechStackPill name="Git & GitHub" />
                </TechCard>
            </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;