
import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CareersPage from './pages/CareersPage';
import StudentDashboard from './pages/StudentDashboard';
import ParentPage from './pages/ParentPage';
import TeacherDashboard from './pages/TeacherDashboard';
import ProPage from './pages/ProPage';
import CareerPathsPage from './pages/CareerPathsPage';
import RegisterPage from './pages/RegisterPage';
import OAuthSuccess from './pages/OAuthSuccess';
import QuizPage from './pages/QuizPage';
import BecomeMentorPage from './pages/BecomeMentorPage';

const ScrollToTop: React.FC = () => {
    const { pathname } = useLocation();
  
    React.useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
  
    return null;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen font-sans">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/paths" element={<CareerPathsPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/parent" element={<ParentPage />} />
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/pro" element={<ProPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/become-a-mentor" element={<BecomeMentorPage />} />
            <Route path="/oauth-success" element={<OAuthSuccess />} />
          </Routes>
        </main>
        <Footer />
        <Chatbot />
      </div>
    </HashRouter>
  );
};

export default App;