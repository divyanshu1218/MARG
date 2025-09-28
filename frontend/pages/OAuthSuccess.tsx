import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../UserContext';

const OAuthSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useUser();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      // Store JWT in localStorage
      localStorage.setItem('jwt', token);
      // Optionally fetch user profile from backend
      fetch('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user) {
            login(data.user);
            // Redirect based on role
            switch (data.user.role) {
              case 'Student':
                navigate('/student');
                break;
              case 'Parent':
                navigate('/parent');
                break;
              case 'Teacher':
                navigate('/teacher');
                break;
              default:
                navigate('/');
            }
          } else {
            navigate('/register');
          }
        });
    } else {
      navigate('/register');
    }
  }, [location, login, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Logging you in...</h2>
      <p className="text-marg-text-secondary">Please wait while we complete your login.</p>
    </div>
  );
};

export default OAuthSuccess;
