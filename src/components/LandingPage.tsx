import { Sparkles, Zap, Target, Star, TrendingUp, Award, Search, Clock, Lightbulb, CheckCircle, FolderOpen, Workflow, Users, AlertCircle, TrendingUpIcon, BarChart } from 'lucide-react';
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

      <div className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full shadow-sm border border-blue-100">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900 uppercase tracking-wide">Customer Pain Points</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-slate-100">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-1">Difficulty Finding Relevant Content</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">Struggling to discover content that resonates with your audience</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-slate-100">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-1">Time-Consuming Research</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">Hours spent researching topics and gathering information</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-slate-100">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-1">Content Idea Fatigue</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">Blank screen syndrome when trying to come up with new ideas</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-slate-100">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-1">Low Confidence in Quality</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">Unsure if your content meets professional standards</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-slate-100">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-1">Scattered Sources</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">Information spread across multiple platforms and tools</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-slate-100">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <Workflow className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-1">Inefficient Workflow</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">Manual processes slow down content creation</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-slate-100">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-1">Lack of Personal Branding Inspiration</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">Difficulty establishing a unique voice and presence</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-slate-100">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-1">Information Overload</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">Too much data makes it hard to focus on what matters</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-slate-100">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <TrendingUpIcon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-1">Limited Access to Trending Ideas</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">Missing out on what's currently resonating with audiences</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-slate-100">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <BarChart className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-1">Difficulty Scaling Content Creation</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">Can't maintain consistency as your audience grows</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
