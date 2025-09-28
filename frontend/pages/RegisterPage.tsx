
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { User } from '../types';

// --- SVG Icon Components ---

const GoogleIcon: React.FC = () => (
  <svg className="w-5 h-5 mr-3 flex-shrink-0" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.222 0-9.618-3.354-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
    <path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 36.49 44 30.686 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
  </svg>
);

const DigiLockerIcon: React.FC = () => (
  <svg className="w-5 h-5 mr-3 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM9 6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8H9V6ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17Z"/>
  </svg>
);


const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useUser();

  const handleSimulatedLogin = (user: User) => {
    login(user);
    switch(user.role) {
        case 'Student':
            navigate('/student');
            break;
        case 'Parent':
            navigate('/parent');
            break;
        case 'Teacher':
            navigate('/teacher');
            break;
    }
  };

  return (
    <div className="bg-marg-bg-light min-h-screen py-12 sm:py-16 px-4">
      <div className="max-w-lg mx-auto space-y-8">
        {/* Placeholder Form */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-marg-primary text-center mb-2">Create an Account</h2>
          <p className="text-center text-marg-text-secondary mb-8">This is a visual placeholder for demonstration.</p>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-marg-text-secondary">Full Name</label>
              <input type="text" id="fullName" disabled className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm cursor-not-allowed" placeholder="e.g., Priya Sharma" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-marg-text-secondary">Email</label>
              <input type="email" id="email" disabled className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm cursor-not-allowed" placeholder="you@example.com" />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-marg-text-secondary">I am a...</label>
              <select id="role" disabled className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm cursor-not-allowed appearance-none">
                <option>Student</option>
                <option>Parent</option>
                <option>Teacher</option>
              </select>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-marg-text-secondary">Password</label>
              <input type="password" id="password" disabled className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm cursor-not-allowed" placeholder="••••••••" />
            </div>
            <button type="submit" disabled className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-marg-accent/50 cursor-not-allowed">
              Register
            </button>
          </form>

          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm font-semibold">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="space-y-4">
            <a
              href={process.env.VITE_BACKEND_URL + '/api/auth/google'}
              className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <GoogleIcon />
              Sign in with Google
            </a>
            <a
              href={process.env.VITE_BACKEND_URL + '/api/auth/digilocker'}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#007BFF] hover:bg-[#0069D9] transition-colors"
            >
              <DigiLockerIcon />
              Sign in with DigiLocker
            </a>
          </div>

        </div>
        
        {/* Demo Login Buttons */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="font-bold text-center text-marg-primary mb-4">For Demonstration Purposes</h3>
              <p className="text-center text-marg-text-secondary text-sm mb-6">The form above is a placeholder. Click a button below to simulate logging in as different user types.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button 
                      onClick={() => handleSimulatedLogin({ name: 'Ravi Kumar', role: 'Student' })} 
                      className="bg-marg-secondary text-white px-6 py-2.5 rounded-lg font-bold shadow hover:bg-marg-secondary/90 transition-all transform hover:scale-105"
                  >
                      Login as Student
                  </button>
                  <button 
                      onClick={() => handleSimulatedLogin({ name: 'Mrs. Sharma', role: 'Parent' })} 
                      className="bg-marg-primary text-white px-6 py-2.5 rounded-lg font-bold shadow hover:bg-marg-primary/90 transition-all transform hover:scale-105"
                  >
                      Login as Parent
                  </button>
                  <button 
                      onClick={() => handleSimulatedLogin({ name: 'Mr. Singh', role: 'Teacher' })} 
                      className="bg-marg-accent text-white px-6 py-2.5 rounded-lg font-bold shadow hover:bg-marg-accent/90 transition-all transform hover:scale-105"
                  >
                      Login as Teacher
                  </button>
              </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
