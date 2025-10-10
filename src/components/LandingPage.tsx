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
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,200,255,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(80,160,255,0.15),transparent_50%)]" />

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full opacity-60 animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-lime-300 rounded-full opacity-60 animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
          <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-cyan-300 rounded-full opacity-60 animate-ping" style={{ animationDuration: '5s', animationDelay: '2s' }} />
          <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-white rounded-full opacity-60 animate-ping" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }} />
        </div>

        <div className="absolute top-20 right-20 w-64 h-64 bg-lime-400 rounded-full filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-cyan-400 rounded-full filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="absolute top-40 left-1/3 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl opacity-10 animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }} />

        <div className="relative h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center pt-24">
            <div className="mb-3 flex items-center justify-center gap-1.5 pt-8">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="ml-2 text-white text-sm font-medium">Rated 4.97/5</span>
              <span className="text-blue-200 text-sm ml-1">from over 50 reviews.</span>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white mb-2 leading-none tracking-tight">
              WE GENERATE
            </h1>
            <div className="mb-4">
              <div className="whitespace-nowrap">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-lime-400 transform -rotate-1 rounded-xl" />
                  <h2 className="relative text-5xl sm:text-7xl lg:text-8xl font-black text-blue-900 px-8 py-4 leading-tight tracking-tight inline">
                    CONTENT
                  </h2>
                </div>
                <div className="relative inline-block ml-2">
                  <div className="absolute inset-0 bg-white transform rotate-1 rounded-xl" />
                  <h2 className="relative text-5xl sm:text-7xl lg:text-8xl font-black text-lime-400 px-8 py-4 leading-tight tracking-tight inline">
                    YOUR
                  </h2>
                </div>
                <div className="relative inline-block ml-2">
                  <div className="absolute inset-0 bg-blue-900 transform -rotate-1 rounded-xl" />
                  <h2 className="relative text-5xl sm:text-7xl lg:text-8xl font-black text-lime-400 px-8 py-4 leading-tight tracking-tight inline">
                    AUDIENCE
                  </h2>
                </div>
              </div>
              <div>
                <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-tight tracking-tight">
                  LOVE
                </h2>
              </div>
            </div>

            <p className="text-base sm:text-lg text-blue-100 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
              Create LinkedIn posts in seconds. Say goodbye to blank screens and start growing your personal brand with <span className="font-semibold text-white">fresh, trusted content ideas</span> instantly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {!user && (
                <>
                  <button
                    onClick={onGetStarted}
                    className="inline-flex items-center gap-2 px-7 py-3 bg-white hover:bg-gray-50 text-blue-900 text-sm font-semibold rounded-full transition-all transform hover:scale-105 shadow-2xl hover:shadow-3xl"
                  >
                    Get Started Free
                  </button>
                  <button
                    className="inline-flex items-center gap-2 px-7 py-3 bg-transparent hover:bg-white/10 text-white text-sm font-semibold rounded-full transition-all border-2 border-white"
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

      <div className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-blue-900 text-center mb-16">Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 shadow-md">
              <div className="absolute top-0 right-0 w-20 h-20 bg-lime-400 rounded-full filter blur-2xl opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="relative">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-blue-900 mb-4">Instant Ideas</h3>
                <p className="text-blue-700 leading-relaxed">
                  Capture your thoughts and turn them into structured post drafts instantly. No more writer's block.
                </p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 shadow-md">
              <div className="absolute top-0 right-0 w-20 h-20 bg-lime-400 rounded-full filter blur-2xl opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="relative">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-blue-900 mb-4">Lightning Fast</h3>
                <p className="text-blue-700 leading-relaxed">
                  From idea to polished draft in seconds. Spend less time writing, more time engaging.
                </p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 shadow-md">
              <div className="absolute top-0 right-0 w-20 h-20 bg-lime-400 rounded-full filter blur-2xl opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="relative">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-blue-900 mb-4">Stay Consistent</h3>
                <p className="text-blue-700 leading-relaxed">
                  Build your personal brand with regular, high-quality content. Your audience will thank you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
