import { Sparkles, Zap, Target, Star, TrendingUp, Award, Search, Clock, Lightbulb, CheckCircle, FolderOpen, Workflow, Users, AlertCircle, TrendingUpIcon, BarChart, Award as AwardIcon, Brain, Rocket, Shield, Bookmark, Mic, Globe, ArrowRight, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <div className="relative h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(14, 165, 233, 0.05) 0%, transparent 50%)
            `
          }} />
        </div>

        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, rgba(148, 163, 184, 0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(148, 163, 184, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }} />
        </div>

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-40 animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-cyan-400 rounded-full opacity-40 animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
          <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-blue-500 rounded-full opacity-40 animate-ping" style={{ animationDuration: '5s', animationDelay: '2s' }} />
          <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-cyan-500 rounded-full opacity-40 animate-ping" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }} />
        </div>

        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-300 to-cyan-300 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-cyan-300 to-blue-300 rounded-full filter blur-3xl opacity-15 animate-pulse" style={{ animationDuration: '8s', animationDelay: '1s' }} />

        <div className="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center py-20">
            <div className="mb-6 flex items-center justify-center gap-1.5">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="ml-2 text-slate-700 text-sm font-medium">Rated 4.97/5 from over 50 reviews.</span>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 opacity-10 blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />

              <h1 className="relative text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-tight tracking-tight">
                <span className="inline-block">
                  Generate Content
                </span>
                <br />
                <span className="relative inline-block mt-2">
                  <span className="relative z-10 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent" style={{
                    backgroundSize: '200% auto',
                    animation: 'gradient 3s linear infinite'
                  }}>
                    Your Audience Love
                  </span>
                  <svg className="absolute -bottom-2 left-0 w-full h-4" viewBox="0 0 400 12" preserveAspectRatio="none">
                    <path
                      d="M 0,6 Q 100,0 200,6 T 400,6"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="3"
                      style={{
                        strokeDasharray: '1000',
                        strokeDashoffset: '0',
                        animation: 'draw 2s ease-in-out infinite alternate'
                      }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="50%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </h1>
            </div>

            <style>{`
              @keyframes gradient {
                0% { background-position: 0% center; }
                50% { background-position: 100% center; }
                100% { background-position: 0% center; }
              }

              @keyframes draw {
                0% { stroke-dashoffset: 1000; }
                100% { stroke-dashoffset: 0; }
              }
            `}</style>

            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Create LinkedIn posts in seconds. Say goodbye to blank screens and start growing your personal brand with <span className="font-semibold text-slate-900">fresh, trusted content ideas</span> instantly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {!user && (
                <>
                  <button
                    onClick={onGetStarted}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <a
                    href="#learn-about"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 text-base font-semibold rounded-xl transition-all border-2 border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md"
                  >
                    Learn About Us
                  </a>
                </>
              )}
              {user && (
                <div className="inline-flex items-center gap-2 px-10 py-5 bg-blue-600 text-white text-lg font-bold rounded-xl shadow-lg">
                  <TrendingUp className="w-5 h-5" />
                  Welcome back! Let's create.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


      <div className="relative w-full py-24 sm:py-32 lg:py-40 bg-gradient-to-br from-slate-800 via-slate-900 to-blue-950 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)
            `
          }} />
        </div>

        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="void-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="1" fill="white" opacity="0.3"/>
                <circle cx="50" cy="50" r="20" fill="none" stroke="white" strokeWidth="0.5" opacity="0.2"/>
                <circle cx="50" cy="50" r="35" fill="none" stroke="white" strokeWidth="0.3" opacity="0.1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#void-pattern)" />
          </svg>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in mb-16">
            <h4 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-medium text-white leading-tight tracking-tight px-4">
              You're Posting, Interacting, Sending Connection Requests… But What Comes Back? <span className="text-blue-300">Crickets.</span> You Know LinkedIn Should Work For You — But It Feels Like Shouting In A Void.
            </h4>
          </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

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

        <style>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in {
            animation: fade-in 1s ease-out forwards;
          }

          @media (prefers-reduced-motion: reduce) {
            .animate-fade-in {
              animation: none;
            }
          }
        `}</style>
      </div>

      <div id="learn-about" className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 relative overflow-hidden scroll-mt-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="absolute top-20 right-20 w-64 h-64 bg-lime-400 rounded-full filter blur-3xl opacity-20" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-cyan-400 rounded-full filter blur-3xl opacity-15" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <AwardIcon className="w-4 h-4 text-lime-400" />
              <span className="text-sm font-semibold text-white uppercase tracking-wide">Benefits</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="group bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Instant Ideas</h3>
              <p className="text-slate-600 leading-relaxed">
                Capture your thoughts and turn them into structured post drafts instantly. No more writer's block.
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Lightning Fast</h3>
              <p className="text-slate-600 leading-relaxed">
                From idea to polished draft in seconds. Spend less time writing, more time engaging.
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Stay Consistent</h3>
              <p className="text-slate-600 leading-relaxed">
                Build your personal brand with regular, high-quality content. Your audience will thank you.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-lime-400 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-blue-900" />
                </div>
                <h4 className="text-lg font-bold text-white">Competence</h4>
              </div>
              <p className="text-blue-100 text-sm leading-relaxed mb-3">
                Help users feel capable, confident, and skilled.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-blue-200 text-sm">
                  <CheckCircle className="w-4 h-4 text-lime-400 flex-shrink-0 mt-0.5" />
                  <span>Generate relevant, personalized ideas</span>
                </li>
                <li className="flex items-start gap-2 text-blue-200 text-sm">
                  <CheckCircle className="w-4 h-4 text-lime-400 flex-shrink-0 mt-0.5" />
                  <span>Boost clarity and writing mastery</span>
                </li>
                <li className="flex items-start gap-2 text-blue-200 text-sm">
                  <CheckCircle className="w-4 h-4 text-lime-400 flex-shrink-0 mt-0.5" />
                  <span>Professional-quality output every time</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-cyan-400 rounded-lg flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-blue-900" />
                </div>
                <h4 className="text-lg font-bold text-white">Time Efficiency</h4>
              </div>
              <p className="text-blue-100 text-sm leading-relaxed mb-3">
                Highlight time-saving features for maximum productivity.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-blue-200 text-sm">
                  <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>Automated research and trend discovery</span>
                </li>
                <li className="flex items-start gap-2 text-blue-200 text-sm">
                  <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>Instant ideation and content drafts</span>
                </li>
                <li className="flex items-start gap-2 text-blue-200 text-sm">
                  <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>Streamlined workflow from start to finish</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-900" />
                </div>
                <h4 className="text-lg font-bold text-white">Trust & Credibility</h4>
              </div>
              <p className="text-blue-100 text-sm leading-relaxed mb-3">
                Emphasize credibility through curated, reliable sources.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-blue-200 text-sm">
                  <CheckCircle className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                  <span>Verified, high-quality content sources</span>
                </li>
                <li className="flex items-start gap-2 text-blue-200 text-sm">
                  <CheckCircle className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                  <span>Industry-leading accuracy and relevance</span>
                </li>
                <li className="flex items-start gap-2 text-blue-200 text-sm">
                  <CheckCircle className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                  <span>Build authority in your niche</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="py-20 bg-gradient-to-br from-white via-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Helping Creators and Professionals Shine Online
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                We are passionate about making content creation simple, smart, and effective. Our platform helps creators and business professionals discover trending, trustworthy content sources and turn them into fresh, ready-to-use ideas — all in seconds. No more staring at blank screens or spending hours researching. Just relevant inspiration, streamlined into ideas you can post confidently.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-0.5">
                    <TrendingUpIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Discover trending websites, blogs, podcasts, and more</h4>
                    <p className="text-sm text-slate-600">Stay on top of what's hot in your industry</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-lime-100 rounded-lg flex items-center justify-center mt-0.5">
                    <Bookmark className="w-4 h-4 text-lime-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Curate and save your favorite sources</h4>
                    <p className="text-sm text-slate-600">Build your personal library of trusted content</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center mt-0.5">
                    <Sparkles className="w-4 h-4 text-cyan-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Generate content ideas directly from trusted sources</h4>
                    <p className="text-sm text-slate-600">Transform inspiration into actionable posts</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mt-0.5">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Grow your personal or business brand with ease</h4>
                    <p className="text-sm text-slate-600">Consistent content builds lasting authority</p>
                  </div>
                </div>
              </div>

              <button
                onClick={onGetStarted}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get Started Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl p-8 shadow-xl border border-blue-200">
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="h-3 bg-slate-200 rounded w-3/4 mb-2" />
                        <div className="h-2 bg-slate-100 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-slate-100 rounded" />
                      <div className="h-2 bg-slate-100 rounded w-5/6" />
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-lime-100 rounded-lg flex items-center justify-center">
                        <Mic className="w-5 h-5 text-lime-600" />
                      </div>
                      <div className="flex-1">
                        <div className="h-3 bg-slate-200 rounded w-3/4 mb-2" />
                        <div className="h-2 bg-slate-100 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-slate-100 rounded" />
                      <div className="h-2 bg-slate-100 rounded w-4/5" />
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-cyan-600" />
                      </div>
                      <div className="flex-1">
                        <div className="h-3 bg-slate-200 rounded w-3/4 mb-2" />
                        <div className="h-2 bg-slate-100 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-slate-100 rounded" />
                      <div className="h-2 bg-slate-100 rounded w-3/4" />
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl opacity-20 blur-xl" />
                    <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 text-white">
                      <div className="flex items-center gap-3 mb-3">
                        <Sparkles className="w-6 h-6" />
                        <span className="font-bold text-lg">Content Ideas Generated</span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-white/30 rounded w-full" />
                        <div className="h-3 bg-white/30 rounded w-5/6" />
                        <div className="h-3 bg-white/30 rounded w-4/5" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 w-24 h-24 bg-lime-400 rounded-full opacity-30 blur-2xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-cyan-400 rounded-full opacity-30 blur-2xl" />
              </div>

              <div className="absolute top-8 -left-4 flex gap-2">
                <div className="w-12 h-12 bg-blue-500 rounded-lg shadow-lg flex items-center justify-center animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }}>
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div className="w-12 h-12 bg-lime-500 rounded-lg shadow-lg flex items-center justify-center animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '2s' }}>
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <div className="w-12 h-12 bg-cyan-500 rounded-lg shadow-lg flex items-center justify-center animate-bounce" style={{ animationDelay: '0.6s', animationDuration: '2s' }}>
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-2xl p-4 border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Ideas Generated</div>
                    <div className="text-xl font-bold text-slate-900">247+</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative py-24 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 30% 40%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 70% 60%, rgba(6, 182, 212, 0.08) 0%, transparent 50%)
            `
          }} />
        </div>

        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(45deg, rgba(148, 163, 184, 0.05) 25%, transparent 25%),
              linear-gradient(-45deg, rgba(148, 163, 184, 0.05) 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, rgba(148, 163, 184, 0.05) 75%),
              linear-gradient(-45deg, transparent 75%, rgba(148, 163, 184, 0.05) 75%)
            `,
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px'
          }} />
        </div>

        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400 rounded-full opacity-20 animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute bottom-10 right-10 w-20 h-20 bg-cyan-400 rounded-full opacity-20 animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />

        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDuration: '5s' }} />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full filter blur-3xl opacity-15 animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl shadow-lg mb-6 animate-bounce" style={{ animationDuration: '2s' }}>
            <Rocket className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 mb-4 leading-tight">
            Ready To Conquer LinkedIn?
          </h2>

          <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join creators who are building their personal brand, one post at a time.
          </p>

          {!user && (
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-lg font-bold rounded-2xl transition-all transform hover:scale-105 shadow-2xl hover:shadow-3xl"
            >
              Start Creating Now
              <ArrowRight className="w-6 h-6" />
            </button>
          )}

          <div className="mt-12 flex items-center justify-center gap-8 flex-wrap">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-slate-700">No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-slate-700">Free to start</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-slate-700">Cancel anytime</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
      </div>
    </div>
  );
}
