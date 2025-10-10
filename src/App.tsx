import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { OnboardingScreen } from './components/OnboardingScreen';
import { DiscoverSources } from './components/DiscoverSources';

function AppContent() {
  const { user, loading, needsOnboarding, checkOnboardingStatus } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showTransitionMessage, setShowTransitionMessage] = useState(false);
  const [onboardingData, setOnboardingData] = useState<{
    fullName: string;
    niche: string;
    targetPersona: string;
  } | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-slate-600">Loading...</div>
      </div>
    );
  }

  if (user && needsOnboarding) {
    return (
      <OnboardingScreen
        onComplete={async (data) => {
          setOnboardingData(data);
          await checkOnboardingStatus();
          setShowTransitionMessage(true);
        }}
      />
    );
  }

  if (user && !needsOnboarding && !showTransitionMessage) {
    return <DiscoverSources />;
  }

  if (showTransitionMessage && onboardingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-md">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Perfect!</h2>
          <p className="text-lg text-slate-600 mb-8">
            Now let's find sources from where you can generate ideas you'll love.
          </p>
          <button
            onClick={() => {
              setShowTransitionMessage(false);
            }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-[1.02] active:scale-[0.98] text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  const handleLogoClick = () => {
    setShowTransitionMessage(false);
    setShowAuthModal(false);
  };

  return (
    <div className="min-h-screen">
      <Navigation
        onAuthClick={() => setShowAuthModal(true)}
        onLogoClick={handleLogoClick}
      />
      <LandingPage onGetStarted={() => setShowAuthModal(true)} />
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
