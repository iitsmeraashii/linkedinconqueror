import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Navigation } from './Navigation';

interface OnboardingScreenProps {
  onComplete: (data: { fullName: string; niche: string; targetPersona: string }) => void;
}

const NICHE_OPTIONS = [
  'Technology & Software',
  'Marketing & Sales',
  'Finance & Investment',
  'Health & Wellness',
  'Education & Training',
  'E-commerce & Retail',
  'Consulting & Coaching',
  'Real Estate',
  'Creative & Design',
  'Other (specify below)'
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const { user, signOut } = useAuth();
  const [fullName, setFullName] = useState('');
  const [selectedNiche, setSelectedNiche] = useState('');
  const [customNiche, setCustomNiche] = useState('');
  const [targetPersona, setTargetPersona] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      window.location.href = '/';
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !selectedNiche || !targetPersona.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (selectedNiche === 'Other (specify below)' && !customNiche.trim()) {
      setError('Please specify your niche');
      return;
    }

    setIsSubmitting(true);

    try {
      const finalNiche = selectedNiche === 'Other (specify below)' ? customNiche : selectedNiche;

      const { error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          id: user?.id,
          full_name: fullName.trim(),
          primary_niche: finalNiche.trim(),
          target_persona: targetPersona.trim(),
          onboarding_completed: true
        });

      if (insertError) throw insertError;

      onComplete({
        fullName: fullName.trim(),
        niche: finalNiche.trim(),
        targetPersona: targetPersona.trim()
      });
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <>
      <Navigation
        onAuthClick={handleSignOut}
        onLogoClick={() => window.location.href = '/'}
      />
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12 pt-24">
        <div className="w-full max-w-xl">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-3xl font-semibold text-slate-900 mb-3">
              Tell us a bit about you
            </h1>
            <p className="text-base text-slate-600">
              Your niche helps us discover great content for you
            </p>
          </div>

        <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in-up">
          <div className="space-y-2 group">
            <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 transition-colors group-focus-within:text-blue-600">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200 text-slate-900 placeholder-slate-400"
            />
            <p className="text-xs text-slate-500 transition-opacity duration-200">
              This helps us personalize your experience.
            </p>
          </div>

          <div className="space-y-2 group">
            <label htmlFor="niche" className="block text-sm font-medium text-slate-700 transition-colors group-focus-within:text-blue-600">
              Primary Niche
            </label>
            <select
              id="niche"
              value={selectedNiche}
              onChange={(e) => setSelectedNiche(e.target.value)}
              className="w-full pl-4 pr-10 py-3 rounded-lg border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200 text-slate-900 bg-white cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:20px] bg-[right_0.75rem_center] bg-no-repeat"
            >
              <option value="">Select your niche</option>
              {NICHE_OPTIONS.map((niche) => (
                <option key={niche} value={niche}>
                  {niche}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 transition-opacity duration-200">
              This helps us recommend better ideas for your niche.
            </p>

            {selectedNiche === 'Other (specify below)' && (
              <div className="pt-2 animate-slide-down">
                <input
                  type="text"
                  value={customNiche}
                  onChange={(e) => setCustomNiche(e.target.value)}
                  placeholder="Tell us your niche"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200 text-slate-900 placeholder-slate-400"
                />
              </div>
            )}
          </div>

          <div className="space-y-2 group">
            <label htmlFor="targetPersona" className="block text-sm font-medium text-slate-700 transition-colors group-focus-within:text-blue-600">
              Target Audience
            </label>
            <input
              id="targetPersona"
              type="text"
              value={targetPersona}
              onChange={(e) => setTargetPersona(e.target.value)}
              placeholder="e.g., coaches, founders, marketers"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200 text-slate-900 placeholder-slate-400"
            />
            <p className="text-xs text-slate-500 transition-opacity duration-200">
              This helps us craft content that resonates with your audience.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-shake">
              {error}
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 hover:scale-[1.01] active:scale-[0.99] text-white font-medium py-3.5 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? 'Saving...' : 'Continue'}
            </button>

            <p className="text-xs text-slate-500 text-center mt-6 animate-fade-in-delay">
              We never share this data — it's just to make your experience smarter.
            </p>
          </div>
        </form>
        </div>
      </div>
    </>
  );
};
