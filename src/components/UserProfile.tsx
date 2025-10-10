import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Navigation } from './Navigation';
import { User, Loader2, ExternalLink, X } from 'lucide-react';

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

interface UserProfileData {
  full_name: string;
  primary_niche: string;
  target_persona: string;
}

interface ContentSource {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
  is_selected?: boolean;
}

interface UserProfileProps {
  onNavigateToDiscover?: () => void;
  onNavigateToIdeaBank?: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onNavigateToDiscover, onNavigateToIdeaBank }) => {
  const { user, signOut } = useAuth();
  const [fullName, setFullName] = useState('');
  const [selectedNiche, setSelectedNiche] = useState('');
  const [customNiche, setCustomNiche] = useState('');
  const [targetPersona, setTargetPersona] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [savedSources, setSavedSources] = useState<ContentSource[]>([]);

  useEffect(() => {
    if (!user) {
      window.location.href = '/';
      return;
    }
    loadProfile();
    loadSavedSources();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('user_profiles')
        .select('full_name, primary_niche, target_persona')
        .eq('id', user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (data) {
        setFullName(data.full_name || '');
        setTargetPersona(data.target_persona || '');

        const isCustomNiche = !NICHE_OPTIONS.slice(0, -1).includes(data.primary_niche || '');
        if (isCustomNiche && data.primary_niche) {
          setSelectedNiche('Other (specify below)');
          setCustomNiche(data.primary_niche);
        } else {
          setSelectedNiche(data.primary_niche || '');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

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

      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          full_name: fullName.trim(),
          primary_niche: finalNiche.trim(),
          target_persona: targetPersona.trim(),
        })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadSavedSources = async () => {
    if (!user) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('content_sources')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setSavedSources(data || []);
    } catch (err: any) {
      console.error('Failed to load sources:', err);
    }
  };

  const deleteSource = async (sourceId: string) => {
    try {
      const { error } = await supabase
        .from('content_sources')
        .delete()
        .eq('id', sourceId);

      if (error) throw error;

      setSavedSources(prev => prev.filter(s => s.id !== sourceId));
    } catch (err) {
      console.error('Failed to delete source:', err);
    }
  };

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return null;
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <>
        <Navigation
          onAuthClick={handleSignOut}
          onLogoClick={() => window.location.href = '/'}
        />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4 py-12 pt-24">
          <div className="flex items-center gap-3 text-slate-600">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading profile...</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation
        onAuthClick={handleSignOut}
        onLogoClick={() => window.location.href = '/'}
        onDiscoverClick={onNavigateToDiscover}
        onIdeaBankClick={onNavigateToIdeaBank}
        onProfileClick={() => {}}
        currentView="profile"
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4 py-12 pt-24">
        <div className="w-full max-w-xl">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-semibold text-slate-900 mb-3">
              Your Profile
            </h1>
            <p className="text-base text-slate-600">
              Update your information to get better content recommendations
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in-up bg-white rounded-xl shadow-sm p-8 border border-slate-100">
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

            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm animate-fade-in">
                {successMessage}
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 hover:scale-[1.01] active:scale-[0.99] text-white font-medium py-3.5 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? 'Saving...' : 'Update Profile'}
              </button>
            </div>
          </form>

          {savedSources.length > 0 && (
            <div className="mt-12">
              <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-100">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">Your Content Sources</h2>
                <div className="space-y-3">
                  {savedSources.map((source) => {
                    const isSelected = source.is_selected;
                    const faviconUrl = getFaviconUrl(source.url);

                    return (
                      <div
                        key={source.id}
                        className="bg-white border border-slate-200 rounded-lg p-4 hover:border-slate-300 hover:shadow-sm transition-all duration-200"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                            {faviconUrl ? (
                              <img
                                src={faviconUrl}
                                alt=""
                                className="w-6 h-6"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.parentElement!.innerHTML = '<div class="text-slate-400 text-xs font-medium">?</div>';
                                }}
                              />
                            ) : (
                              <div className="text-slate-400 text-xs font-medium">?</div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-1">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <h3 className="font-medium text-slate-900 truncate">
                                  {source.name}
                                </h3>
                              </div>
                              <span className="flex-shrink-0 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                {source.category}
                              </span>
                            </div>

                            <p className="text-sm text-slate-600 mb-2 line-clamp-1">
                              {source.description}
                            </p>

                            <div className="flex items-center gap-2">
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline"
                              >
                                <ExternalLink className="w-3 h-3" />
                                Visit
                              </a>

                              <div className="ml-auto flex items-center gap-2">
                                {isSelected && (
                                  <span className="text-xs font-medium text-blue-700 bg-blue-100 px-3 py-1.5 rounded-lg">
                                    Selected
                                  </span>
                                )}
                                <button
                                  onClick={() => deleteSource(source.id)}
                                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-all duration-200 hover:scale-105"
                                  title="Delete source"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
