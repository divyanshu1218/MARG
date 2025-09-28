import React, { useState, useMemo, useEffect } from 'react';
import { STAGED_QUIZ_DATA } from '../constants';
import { AIRecommendation, College, QuizQuestion } from '../types';
import { getQuizRecommendations } from '../services/geminiService';

const cities = ["Mumbai", "New Delhi", "Bengaluru", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad", "Noida", "Vellore", "Pilani", "Tiruchirappalli"];

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
const ErrorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


const QuizPage: React.FC = () => {
    const [step, setStep] = useState<'start' | 'quiz' | 'loading' | 'results' | 'error'>('start');
    const [userStage, setUserStage] = useState('');
    const [userCity, setUserCity] = useState('');
    
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    
    const [recommendations, setRecommendations] = useState<AIRecommendation | null>(null);
    const [error, setError] = useState<string | null>(null);

    const questions: QuizQuestion[] = STAGED_QUIZ_DATA[userStage] || [];
    const totalQuestions = questions.length;
    const progress = totalQuestions > 0 ? Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100) : 0;

    const handleStartQuiz = () => {
        if (userStage && userCity) {
            setStep('quiz');
        }
    };
    
    const handleAnswerSelect = (questionId: number, answer: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
        setTimeout(() => {
             if (currentQuestionIndex < totalQuestions - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            }
        }, 300);
    };
    
    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    }

    const handleSubmit = async () => {
        setStep('loading');
        setError(null);
        try {
            const result = await getQuizRecommendations(userStage, userCity, answers);
            setRecommendations(result);
            setStep('results');
            localStorage.setItem('margQuizCompleted', 'true');
        } catch (err) {
            setError("We couldn't generate your recommendations. Please try again later.");
            setStep('error');
            console.error(err);
        }
    };
    
    const isLastStep = currentQuestionIndex === totalQuestions - 1;
    const allQuestionsAnswered = Object.keys(answers).length === totalQuestions;

    const renderContent = () => {
        switch(step) {
            case 'start':
                return (
                    <div className="max-w-2xl mx-auto bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full text-center animate-fade-in">
                        <h1 className="text-3xl font-extrabold text-marg-primary mb-4">Let's Personalize Your Guidance</h1>
                        <p className="text-marg-text-secondary mb-8">First, tell us a bit about yourself to tailor the quiz questions and recommendations.</p>
                        <div className="space-y-6">
                             <div>
                                <label className="block text-sm font-bold text-marg-text-secondary mb-2 text-left">What is your current educational stage?</label>
                                <select value={userStage} onChange={e => setUserStage(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marg-accent focus:outline-none">
                                    <option value="">Select Stage...</option>
                                    {Object.keys(STAGED_QUIZ_DATA).map(stage => <option key={stage} value={stage}>{stage}</option>)}
                                </select>
                             </div>
                              <div>
                                <label className="block text-sm font-bold text-marg-text-secondary mb-2 text-left">Which city do you live in?</label>
                                <select value={userCity} onChange={e => setUserCity(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marg-accent focus:outline-none">
                                    <option value="">Select City...</option>
                                    {cities.map(city => <option key={city} value={city}>{city}</option>)}
                                </select>
                             </div>
                        </div>
                        <button onClick={handleStartQuiz} disabled={!userStage || !userCity} className="mt-10 bg-marg-accent text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:opacity-90 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100">
                            Start Quiz
                        </button>
                    </div>
                );
            case 'quiz':
                const currentQuestion = questions[currentQuestionIndex];
                 return (
                    <div key={currentQuestionIndex} className="max-w-3xl mx-auto bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full">
                        <div className="mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}><p className="text-sm font-semibold text-marg-accent">Question {currentQuestionIndex + 1} of {totalQuestions}</p><div className="w-full bg-gray-200 rounded-full h-2.5 mt-2"><div className="bg-gradient-to-r from-marg-secondary to-marg-accent h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div></div></div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-marg-primary mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>{currentQuestion.question}</h2>
                        <div className="space-y-4">{currentQuestion.options.map((option, index) => { const isSelected = answers[currentQuestion.id] === option; return (<button key={index} onClick={() => handleAnswerSelect(currentQuestion.id, option)} className={`w-full text-left p-4 border-2 rounded-lg transition-all duration-200 transform hover:scale-[1.03] hover:shadow-md opacity-0 animate-fade-in-up-medium ${ isSelected ? 'bg-marg-secondary/10 border-marg-secondary shadow-lg' : 'bg-white border-gray-200 hover:border-marg-secondary/50' }`} style={{ animationDelay: `${300 + index * 100}ms`}}><span className={`font-medium ${isSelected ? 'text-marg-primary' : 'text-marg-text-secondary'}`}>{option}</span></button>); })}</div>
                        <div className="flex justify-between items-center mt-10 animate-fade-in" style={{ animationDelay: '800ms' }}>
                             <button onClick={handleBack} disabled={currentQuestionIndex === 0} className="text-sm font-medium text-marg-text-secondary hover:text-marg-primary disabled:opacity-50 transition-opacity">Back</button>
                            {isLastStep && (<button onClick={handleSubmit} disabled={!allQuestionsAnswered} className="bg-marg-accent text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:opacity-90 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100">Get My Recommendations</button>)}
                        </div>
                    </div>
                );
            case 'loading':
                return (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
                        <div className="w-12 h-12 border-4 border-marg-accent border-t-transparent rounded-full animate-spin"></div>
                        <h2 className="mt-6 text-2xl font-bold text-marg-primary">Analyzing your results...</h2>
                        <p className="mt-2 text-marg-text-secondary">Our AI is crafting your personalized career roadmap!</p>
                    </div>
                );
            case 'error':
                 return (
                     <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
                        <div className="mb-4"><ErrorIcon /></div>
                        <h2 className="mt-6 text-2xl font-bold text-red-600">Something Went Wrong</h2>
                        <p className="mt-2 text-marg-text-secondary">{error}</p>
                         <button onClick={handleSubmit} className="mt-6 bg-marg-accent text-white px-6 py-2 rounded-lg font-semibold">Try Again</button>
                    </div>
                );
            case 'results':
                if (recommendations) {
                     return <RecommendationResults recommendations={recommendations} />;
                }
                return null;
        }
    }

    return (
        <div className="bg-marg-bg-light min-h-[80vh] py-12 px-4 flex items-center">
            {renderContent()}
        </div>
    );
};

const CollegeCard: React.FC<{ college: College }> = ({ college }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-xl hover:border-marg-accent/50 hover:-translate-y-1 transition-all duration-300">
        <h4 className="font-bold text-marg-primary">{college.name}</h4>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-marg-text-secondary mt-1">
            <span>📍 {college.city}, {college.state}</span>
            <span>🎓 {college.type}</span>
            <span>💰 ₹{college.annualFees.toLocaleString('en-IN')}/year</span>
        </div>
    </div>
);

const RecommendationResults: React.FC<{ recommendations: AIRecommendation }> = ({ recommendations }) => {
    const collegeSections = [
        { title: "Colleges Near You", colleges: recommendations.colleges.nearby },
        { title: "Top Colleges in Your State", colleges: recommendations.colleges.inState },
        { title: "Top National Colleges", colleges: recommendations.colleges.national },
    ];

    return (
        <div className="bg-marg-bg py-16 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12 opacity-0 animate-fade-in-up-long"><h1 className="text-4xl font-extrabold text-marg-primary mb-2">Your Personalized Roadmap</h1><p className="text-lg text-marg-text-secondary">Here are the recommendations our AI has curated based on your quiz answers.</p></div>
                <div className="bg-white p-8 rounded-xl border border-gray-200 mb-10 shadow-sm relative overflow-hidden opacity-0 animate-fade-in-up-long" style={{ animationDelay: '200ms' }}>
                    <h2 className="text-2xl font-bold text-marg-primary mb-4 flex items-center"><SectionIcon type="summary" /><span className="ml-3">Your Path Summary</span></h2>
                    <p className="text-marg-text-secondary text-lg leading-relaxed">{recommendations.conclusion}</p>
                </div>
                
                <div className="bg-white p-8 rounded-xl border border-gray-200 mb-10 shadow-sm opacity-0 animate-fade-in-up-long" style={{ animationDelay: '400ms' }}>
                    <h2 className="text-2xl font-bold text-marg-primary mb-6 flex items-center"><SectionIcon type="college" /><span className="ml-3">Recommended Colleges</span></h2>
                    {collegeSections.map((section, index) => (
                        (section.colleges && section.colleges.length > 0) && (
                            <div key={index} className="mb-8">
                                <h3 className="text-xl font-semibold text-marg-text-primary mb-4 pb-2 border-b border-gray-200">{section.title}</h3>
                                <div className="space-y-4">
                                    {section.colleges.map(college => <CollegeCard key={college.id} college={college} />)}
                                </div>
                            </div>
                        )
                    ))}
                </div>

                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm opacity-0 animate-fade-in-up-long" style={{ animationDelay: '600ms' }}>
                    <h2 className="text-2xl font-bold text-marg-primary mb-6 flex items-center"><SectionIcon type="resource" /><span className="ml-3">Helpful Resources</span></h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recommendations.resources.map((resource, index) => (
                             <a href={resource.url} key={index} target="_blank" rel="noopener noreferrer" className="block p-4 bg-marg-bg-light rounded-lg hover:shadow-lg hover:bg-marg-bg-light/80 transition-all duration-300 transform hover:scale-[1.03]">
                                <div className="flex items-start">
                                    <div className="mr-3 flex-shrink-0 pt-1"><ResourceIcon type={resource.type} /></div>
                                    <div>
                                        <p className="font-semibold text-marg-primary">{resource.title}</p>
                                        <p className="text-xs text-marg-accent hover:underline break-all">{resource.url}</p>
                                    </div>
                                </div>
                             </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QuizPage;
