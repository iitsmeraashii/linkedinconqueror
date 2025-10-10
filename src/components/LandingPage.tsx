import { Sparkles, Zap, Target } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            LinkedIn Conqueror
            <span className="block text-blue-600 mt-2">Ideas To Drafts</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Transform your scattered ideas into compelling LinkedIn posts in seconds.
            Stop staring at blank screens and start building your personal brand.
          </p>
          {!user && (
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Sparkles className="w-5 h-5" />
              Get Started Free
            </button>
          )}
          {user && (
            <div className="inline-block px-8 py-4 bg-green-50 border-2 border-green-200 text-green-800 text-lg font-semibold rounded-xl">
              Welcome back! You're signed in.
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Ideas</h3>
            <p className="text-gray-600">
              Capture your thoughts and turn them into structured post drafts instantly.
              No more writer's block.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
            <p className="text-gray-600">
              From idea to polished draft in seconds. Spend less time writing,
              more time engaging.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Stay Consistent</h3>
            <p className="text-gray-600">
              Build your personal brand with regular, high-quality content.
              Your audience will thank you.
            </p>
          </div>
        </div>

        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to conquer LinkedIn?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join creators who are building their personal brand, one post at a time.
          </p>
          {!user && (
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white text-lg font-semibold rounded-xl transition-all transform hover:scale-105"
            >
              Start Creating Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
