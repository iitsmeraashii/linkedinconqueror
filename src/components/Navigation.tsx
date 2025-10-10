import { useState, useEffect, useRef } from 'react';
import { Lightbulb, Menu, X, Compass, Lightbulb as IdeaIcon, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
  onAuthClick: () => void;
  onLogoClick?: () => void;
  onDiscoverClick?: () => void;
  onIdeaBankClick?: () => void;
  onProfileClick?: () => void;
  currentView?: 'discover' | 'ideabank' | 'profile';
}

export function Navigation({ onAuthClick, onLogoClick, onDiscoverClick, onIdeaBankClick, onProfileClick, currentView }: NavigationProps) {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleAuthAction = async () => {
    if (user) {
      await signOut();
      setIsMenuOpen(false);
    } else {
      onAuthClick();
    }
  };

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    } else {
      window.location.href = '/';
    }
  };

  const handleMenuItemClick = (callback?: () => void) => {
    if (callback) {
      callback();
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Lightbulb className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-semibold text-slate-900">LinkedIn Conqueror</span>
          </button>

          {user && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
                aria-label="Menu"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>

              {isMenuOpen && (
                <>
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 animate-fade-in-down overflow-hidden">
                    {onDiscoverClick && (
                      <button
                        onClick={() => handleMenuItemClick(onDiscoverClick)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                          currentView === 'discover'
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Compass className="w-5 h-5" />
                        <span>Discover Sources</span>
                      </button>
                    )}
                    {onIdeaBankClick && (
                      <button
                        onClick={() => handleMenuItemClick(onIdeaBankClick)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                          currentView === 'ideabank'
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <IdeaIcon className="w-5 h-5" />
                        <span>Your Idea Bank</span>
                      </button>
                    )}
                    {onProfileClick && (
                      <button
                        onClick={() => handleMenuItemClick(onProfileClick)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                          currentView === 'profile'
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <User className="w-5 h-5" />
                        <span>User Profile</span>
                      </button>
                    )}
                    <div className="border-t border-slate-200 my-2"></div>
                    <button
                      onClick={handleAuthAction}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {!user && (
            <button
              onClick={handleAuthAction}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Sign In / Sign Up
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
