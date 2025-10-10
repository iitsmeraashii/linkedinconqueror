import { Sparkles, Zap, Target, Star, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <div className="relative min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,200,255,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(80,160,255,0.15),transparent_50%)]" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-lime-400 rounded-full filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-cyan-400 rounded-full filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-6 flex items-center justify-center gap-1.5">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="ml-3 text-white font-semibold">Rated 4.97/5</span>
              <span className="text-blue-200 ml-1">from over 50 reviews.</span>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white mb-4 leading-tight tracking-tight">
              WE GENERATE
            </h1>
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-lime-400 transform -rotate-1 rounded-xl" />
              <h2 className="relative text-5xl sm:text-7xl lg:text-8xl font-black text-blue-900 px-8 py-4 leading-tight tracking-tight">
                IDEAS YOUR AUDIENCE LOVE
              </h2>
            </div>

            <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto mb-12 leading-relaxed">
              Create LinkedIn posts in seconds. Say goodbye to blank screens and start growing your personal brand with <span className="font-semibold text-white">fresh, trusted content ideas</span> instantly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {!user && (
                <>
                  <button
                    onClick={onGetStarted}
                    className="inline-flex items-center gap-2 px-10 py-5 bg-white hover:bg-gray-50 text-blue-900 text-lg font-bold rounded-full transition-all transform hover:scale-105 shadow-2xl hover:shadow-3xl"
                  >
                    Get Started Free
                  </button>
                  <button
                    className="inline-flex items-center gap-2 px-10 py-5 bg-transparent hover:bg-white/10 text-white text-lg font-bold rounded-full transition-all border-2 border-white"
                  >
                    Learn About Us
                  </button>
                </>
              )}
              {user && (
                <div className="inline-flex items-center gap-2 px-10 py-5 bg-lime-400 text-blue-900 text-lg font-bold rounded-full shadow-2xl">
                  <TrendingUp className="w-5 h-5" />
                  Welcome back! Let's create.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
