import { Lightbulb } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
  onAuthClick: () => void;
  onLogoClick?: () => void;
  onDiscoverClick?: () => void;
  onIdeaBankClick?: () => void;
  currentView?: 'discover' | 'ideabank';
}

export function Navigation({ onAuthClick, onLogoClick, onDiscoverClick, onIdeaBankClick, currentView }: NavigationProps) {
  const { user, signOut } = useAuth();

  const handleAuthAction = async () => {
    if (user) {
      await signOut();
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

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Lightbulb className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-semibold text-gray-900">LinkedIn Conqueror</span>
            </button>

            {user && (onDiscoverClick || onIdeaBankClick) && (
              <div className="flex items-center gap-1">
                {onDiscoverClick && (
                  <button
                    onClick={onDiscoverClick}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      currentView === 'discover'
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Discover Sources
                  </button>
                )}
                {onIdeaBankClick && (
                  <button
                    onClick={onIdeaBankClick}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      currentView === 'ideabank'
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Your Idea Bank
                  </button>
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleAuthAction}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            {user ? 'Sign Out' : 'Sign In / Sign Up'}
          </button>
        </div>
      </div>
    </nav>
  );
}
