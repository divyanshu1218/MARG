
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../constants';
import { useUser } from '../UserContext';

const Header: React.FC = () => {
  const { user, logout, isLoading } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const [highlightStyle, setHighlightStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const activeItem = navRef.current?.querySelector('a[aria-current="page"]');
    if (activeItem && activeItem.parentElement) {
      const { offsetLeft, offsetWidth } = activeItem.parentElement as HTMLLIElement;
      setHighlightStyle({ left: offsetLeft, width: offsetWidth, opacity: 1 });
    } else {
      // If no item is active (e.g., on a page not in the nav), hide the highlight
      setHighlightStyle(prev => ({ ...prev, opacity: 0 }));
    }
  }, [location, user]); // Rerun when location or user state changes

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isLoading) {
    return <div className="h-20 bg-marg-bg/80 border-b border-gray-200" />; // Placeholder
  }

  return (
    <header className="bg-marg-bg/80 backdrop-blur-sm sticky top-0 z-50 w-full border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <NavLink to="/" className="text-2xl font-extrabold text-marg-primary">
              MARG.
            </NavLink>
          </div>

          <nav className="hidden md:flex items-center justify-center">
            <ul ref={navRef} className="relative flex items-center bg-marg-bg-light p-1 rounded-full">
              <span
                className="absolute bg-marg-accent rounded-full h-[calc(100%-0.5rem)] top-1 transition-all duration-300 ease-in-out"
                style={highlightStyle}
              />
              {NAV_LINKS.map((link) => (
                <li key={link.name} className="relative z-10">
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `px-5 py-2 block text-sm font-semibold rounded-full transition-colors duration-300 ${
                        isActive
                          ? 'text-white'
                          : 'text-marg-text-secondary hover:text-marg-primary'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm font-medium text-marg-text-primary hidden sm:block">Welcome, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-marg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-marg-primary/90 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/register" className="text-sm font-medium text-marg-text-primary hover:text-marg-primary transition-colors duration-200">Login</NavLink>
                <NavLink
                  to="/register"
                  className="bg-marg-accent text-white px-4 py-2 rounded-md text-sm font-medium transform transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md"
                >
                  Signup
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;