import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Navigation } from './Navigation';
import { Plus, ExternalLink, Check, Loader2, ListPlus, X, Trophy, Award, Medal } from 'lucide-react';

interface UserProfile {
  full_name: string;
  primary_niche: string;
  target_persona: string;
}

interface AISuggestedSource {
  name: string;
  url: string;
  description: string;
  type: string;
  relevanceReason: string;
}

interface ContentSource {
  id?: string;
  name: string;
  url: string;
  description: string;
  category: string;
  is_selected?: boolean;
  isAISuggested?: boolean;
  relevanceReason?: string;
}

interface DiscoverSourcesProps {
  onNavigateToIdeaBank?: () => void;
}

export const DiscoverSources: React.FC<DiscoverSourcesProps> = ({ onNavigateToIdeaBank }) => {
  const { user, signOut } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [aiSources, setAiSources] = useState<ContentSource[]>([]);
  const [savedSources, setSavedSources] = useState<ContentSource[]>([]);
  const [customUrl, setCustomUrl] = useState('');
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedAISources, setSelectedAISources] = useState<Set<string>>(new Set());
  const [hasLoadedAI, setHasLoadedAI] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showDiscoverButton, setShowDiscoverButton] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserProfile();
      loadSavedSources();
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('full_name, primary_niche, target_persona')
        .eq('id', user?.id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setUserProfile(data);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleDiscoverClick = async () => {
    if (!userProfile?.primary_niche || !userProfile?.target_persona) {
      setErrorMessage('Missing niche or target persona information');
      return;
    }
    setShowDiscoverButton(false);
    fetchAISources(userProfile.primary_niche, userProfile.target_persona);
  };

  const fetchAISources = async (niche: string, targetPersona: string) => {
    setIsLoadingAI(true);
    setErrorMessage(null);
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/discover-sources`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          niche,
          targetPersona
        })
      });

      const result = await response.json();

      if (result.success && result.sources) {
        const formattedSources: ContentSource[] = result.sources.map((source: AISuggestedSource) => ({
          name: source.name,
          url: source.url,
          description: source.description,
          category: source.type,
          isAISuggested: true,
          relevanceReason: source.relevanceReason
        }));
        setAiSources(formattedSources);
        setHasLoadedAI(true);
      } else {
        const errorMsg = result.error || 'Failed to load AI sources';
        setErrorMessage(errorMsg);
        console.error('Error from API:', result);
      }
    } catch (err) {
      console.error('Error fetching AI sources:', err);
      setErrorMessage('Failed to connect to the discovery service. Please try again later.');
    } finally {
      setIsLoadingAI(false);
    }
  };

  const loadSavedSources = async () => {
    try {
      const { data, error } = await supabase
        .from('content_sources')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedSources(data || []);
    } catch (err) {
      console.error('Error loading sources:', err);
    }
  };

  const toggleAISource = (url: string) => {
    setSelectedAISources(prev => {
      const newSet = new Set(prev);
      if (newSet.has(url)) {
        newSet.delete(url);
      } else {
        newSet.add(url);
      }
      return newSet;
    });
  };

  const addSelectedSourcesToList = async () => {
    if (selectedAISources.size === 0) return;

    setIsSaving(true);
    try {
      const sourcesToAdd = aiSources.filter(source => selectedAISources.has(source.url));

      const { data, error } = await supabase
        .from('content_sources')
        .insert(
          sourcesToAdd.map(source => ({
            user_id: user?.id,
            name: source.name,
            url: source.url,
            description: source.description,
            category: source.category,
            is_selected: true
          }))
        )
        .select();

      if (error) throw error;

      setSavedSources(prev => [...(data || []), ...prev]);
      setAiSources(prev => prev.filter(s => !selectedAISources.has(s.url)));
      setSelectedAISources(new Set());
    } catch (err) {
      console.error('Error saving sources:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSavedSource = async (sourceId: string) => {
    const source = savedSources.find(s => s.id === sourceId);
    if (!source) return;

    const newSelectedState = !source.is_selected;

    setSavedSources(prev => prev.map(s =>
      s.id === sourceId ? { ...s, is_selected: newSelectedState } : s
    ));

    try {
      const { error } = await supabase
        .from('content_sources')
        .update({ is_selected: newSelectedState })
        .eq('id', sourceId);

      if (error) throw error;
    } catch (err) {
      console.error('Error updating source:', err);
      setSavedSources(prev => prev.map(s =>
        s.id === sourceId ? { ...s, is_selected: !newSelectedState } : s
      ));
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
      console.error('Error deleting source:', err);
    }
  };

  const addCustomSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;

    setIsSaving(true);
    try {
      let url = customUrl.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      const { data, error } = await supabase
        .from('content_sources')
        .insert({
          user_id: user?.id,
          name: new URL(url).hostname.replace('www.', ''),
          url: url,
          description: 'Custom source',
          category: 'Custom',
          is_selected: true
        })
        .select()
        .single();

      if (error) throw error;

      setSavedSources(prev => [data, ...prev]);
      setCustomUrl('');
    } catch (err) {
      console.error('Error adding source:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  const handleViewIdeaBank = () => {
    if (onNavigateToIdeaBank) {
      onNavigateToIdeaBank();
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

  if (isLoadingProfile) {
    return (
      <>
        <Navigation onAuthClick={handleSignOut} onLogoClick={() => window.location.href = '/'} />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="flex items-center gap-2 text-slate-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading...
          </div>
        </div>
      </>
    );
  }

  const allSources = [...aiSources, ...savedSources];

  return (
    <>
      <Navigation
        onAuthClick={handleSignOut}
        onLogoClick={() => window.location.href = '/'}
        onDiscoverClick={() => {}}
        onIdeaBankClick={onNavigateToIdeaBank}
        currentView="discover"
      />
      <div className="min-h-screen bg-white px-4 py-12 pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-semibold text-slate-900 mb-3">
              Discover Content Sources
            </h1>
            <p className="text-base text-slate-600 max-w-2xl mx-auto">
              Find the best places your{' '}
              <span className="font-medium text-slate-900">{userProfile?.target_persona || 'audience'}</span>
              {' '}already follows in{' '}
              <span className="font-medium text-slate-900">{userProfile?.primary_niche || 'your niche'}</span>.
            </p>
          </div>

          {showDiscoverButton && !isLoadingAI && aiSources.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <button
                onClick={handleDiscoverClick}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-lg px-12 py-5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              >
                Show Recommendations
              </button>
              <p className="text-sm text-slate-500 mt-4 max-w-md text-center">
                Click to get best recommended sources to generate ideas for your niche
              </p>
            </div>
          )}

          {isLoadingAI && (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3 text-slate-600">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="text-lg font-medium">
                  Discovering the top content sources for{' '}
                  <span className="text-slate-900">{userProfile?.primary_niche}</span> creators who reach{' '}
                  <span className="text-slate-900">{userProfile?.target_persona}</span>...
                </span>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <p className="text-red-800 font-medium mb-1">Error Loading Sources</p>
              <p className="text-red-600 text-sm">{errorMessage}</p>
              <p className="text-red-600 text-sm mt-2">Please check the browser console for more details.</p>
            </div>
          )}

          {!isLoadingAI && allSources.length > 0 && (
            <>
            <div className="max-h-[600px] overflow-y-auto mb-4 pr-2 space-y-3">
              {allSources.map((source, index) => {
                const isAI = source.isAISuggested;
                const isSelected = isAI ? selectedAISources.has(source.url) : source.is_selected;
                const faviconUrl = getFaviconUrl(source.url);
                const rank = index + 1;
                const isTopThree = rank <= 3;

                const getRankIcon = () => {
                  if (rank === 1) return <Trophy className="w-4 h-4 text-yellow-500" />;
                  if (rank === 2) return <Award className="w-4 h-4 text-slate-400" />;
                  if (rank === 3) return <Medal className="w-4 h-4 text-amber-600" />;
                  return null;
                };

                return (
                  <div
                    key={isAI ? source.url : source.id || index}
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
                            <span className="flex-shrink-0 font-semibold text-slate-400 text-sm">
                              #{rank}
                            </span>
                            {getRankIcon()}
                            <h3 className="font-medium text-slate-900 truncate">
                              {source.name}
                            </h3>
                            {isTopThree && (
                              <span className="flex-shrink-0 text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                                Most Recommended
                              </span>
                            )}
                          </div>
                          <span className="flex-shrink-0 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                            {source.category}
                          </span>
                        </div>

                        <p className="text-sm text-slate-600 mb-2 line-clamp-1">
                          {source.description}
                        </p>

                        {isAI && source.relevanceReason && (
                          <p className="text-xs text-blue-600 italic mb-3 line-clamp-1">
                            Why relevant: {source.relevanceReason}
                          </p>
                        )}

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

                          {isAI ? (
                            <button
                              onClick={() => toggleAISource(source.url)}
                              className={`ml-auto flex items-center justify-center w-5 h-5 rounded border-2 transition-all duration-200 ${
                                isSelected
                                  ? 'bg-blue-600 border-blue-600'
                                  : 'bg-white border-slate-300 hover:border-blue-400'
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                            </button>
                          ) : (
                            <div className="ml-auto flex items-center gap-2">
                              <button
                                onClick={() => toggleSavedSource(source.id!)}
                                className={`text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 ${
                                  isSelected
                                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                              >
                                {isSelected ? 'Selected' : 'Select'}
                              </button>
                              <button
                                onClick={() => deleteSource(source.id!)}
                                className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-all duration-200 hover:scale-105"
                                title="Delete source"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {aiSources.length > 0 && selectedAISources.size > 0 && (
              <div className="flex justify-center mb-8">
                <button
                  onClick={addSelectedSourcesToList}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
                >
                  <ListPlus className="w-5 h-5" />
                  Add {selectedAISources.size} {selectedAISources.size === 1 ? 'Source' : 'Sources'} to My List
                </button>
              </div>
            )}
            </>
          )}

          <div className="bg-slate-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-medium text-slate-900 mb-3">
              Add a Custom Source
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Have a specific blog, newsletter, or website you want to follow? Add it here.
            </p>

            <form onSubmit={addCustomSource} className="flex gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="e.g., blog.example.com or https://example.com"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200 text-slate-900 placeholder-slate-400"
                />
              </div>
              <button
                type="submit"
                disabled={isSaving || !customUrl.trim()}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="w-5 h-5" />
                Add
              </button>
            </form>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleViewIdeaBank}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3.5 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              View your Idea Bank
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
