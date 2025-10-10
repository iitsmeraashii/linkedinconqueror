import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Navigation } from './Navigation';
import { Plus, ExternalLink, Lightbulb, Loader2, Trash2, X } from 'lucide-react';

interface UserProfile {
  full_name: string;
  primary_niche: string;
  target_persona: string;
}

interface ContentSource {
  id: string;
  url: string;
  name: string;
  description: string;
  category: string;
  is_selected: boolean;
  created_at: string;
  updated_at: string;
}

interface ContentIdea {
  hook: string;
  why_it_works: string;
}

interface IdeaFormat {
  id: string;
  label: string;
}

const CONTENT_FORMATS: IdeaFormat[] = [
  { id: 'text', label: 'Text Post' },
  { id: 'image-text', label: 'Image + Text' },
  { id: 'carousel', label: 'Carousel (slides)' },
  { id: 'poll', label: 'Poll' },
  { id: 'short-video', label: 'Short Native Video Script (45–60s)' },
  { id: 'long-video', label: 'Long Video Script (2–3 min)' },
  { id: 'article', label: 'Article / Newsletter' },
  { id: 'thread', label: 'Thread / Multi-post sequence' },
  { id: 'quote', label: 'Quote Card' },
  { id: 'case-study', label: 'Case Study Snapshot' },
];

interface LoadingState {
  status: 'idle' | 'scraping' | 'analyzing' | 'complete' | 'error';
  message?: string;
}

interface IdeaBankProps {
  onNavigateToDiscover?: () => void;
}

export const IdeaBank: React.FC<IdeaBankProps> = ({ onNavigateToDiscover }) => {
  const { user, signOut } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [sources, setSources] = useState<ContentSource[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingSources, setIsLoadingSources] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, LoadingState>>({});
  const [generatedIdeas, setGeneratedIdeas] = useState<Record<string, ContentIdea[]>>({});
  const [showIdeasModal, setShowIdeasModal] = useState(false);
  const [selectedSourceIdeas, setSelectedSourceIdeas] = useState<{ ideas: ContentIdea[]; sourceName: string } | null>(null);
  const [selectedFormats, setSelectedFormats] = useState<Record<string, string>>({});
  const [generatingContent, setGeneratingContent] = useState<Record<string, boolean>>({});
  const [generatedContent, setGeneratedContent] = useState<Record<string, string>>({});
  const [showContentModal, setShowContentModal] = useState(false);
  const [activeContent, setActiveContent] = useState<{ content: string; hook: string } | null>(null);

  useEffect(() => {
    if (user) {
      loadUserProfile();
      loadSources();
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

  const loadSources = async () => {
    try {
      const { data, error } = await supabase
        .from('content_sources')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSources(data || []);
    } catch (err) {
      console.error('Error loading sources:', err);
    } finally {
      setIsLoadingSources(false);
    }
  };

  const extractDomain = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  const addWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    setIsAdding(true);
    try {
      let url = newUrl.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      const domain = extractDomain(url);
      const name = domain;

      const { data, error } = await supabase
        .from('content_sources')
        .insert({
          user_id: user?.id,
          url: url,
          name: name,
          description: '',
          category: 'Website',
          is_selected: false
        })
        .select()
        .single();

      if (error) throw error;

      setSources(prev => [data, ...prev]);
      setNewUrl('');
    } catch (err) {
      console.error('Error adding website:', err);
    } finally {
      setIsAdding(false);
    }
  };

  const deleteSource = async (sourceId: string) => {
    try {
      const { error } = await supabase
        .from('content_sources')
        .delete()
        .eq('id', sourceId);

      if (error) throw error;

      setSources(prev => prev.filter(s => s.id !== sourceId));
    } catch (err) {
      console.error('Error deleting source:', err);
    }
  };

  const handleGenerateContent = async (sourceId: string, ideaIndex: number, idea: ContentIdea) => {
    const ideaKey = `${sourceId}-${ideaIndex}`;
    const selectedFormat = selectedFormats[ideaKey] || 'text';

    if (!userProfile) return;

    setGeneratingContent(prev => ({ ...prev, [ideaKey]: true }));

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-content`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hook: idea.hook,
          why_it_works: idea.why_it_works,
          format: selectedFormat,
          niche: userProfile.primary_niche,
          targetPersona: userProfile.target_persona,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate content');
      }

      const data = await response.json();

      if (data.success && data.content) {
        setGeneratedContent(prev => ({ ...prev, [ideaKey]: data.content }));
        setActiveContent({ content: data.content, hook: idea.hook });
        setShowContentModal(true);
      }
    } catch (err: any) {
      console.error('Error generating content:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setGeneratingContent(prev => ({ ...prev, [ideaKey]: false }));
    }
  };

  const handleGetIdeas = async (sourceId: string) => {
    const source = sources.find(s => s.id === sourceId);
    if (!source || !userProfile) return;

    setLoadingStates(prev => ({
      ...prev,
      [sourceId]: { status: 'scraping', message: 'Generating Ideas…' }
    }));

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-ideas`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: source.url,
          niche: userProfile.primary_niche,
          targetPersona: userProfile.target_persona,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate ideas');
      }

      setLoadingStates(prev => ({
        ...prev,
        [sourceId]: {
          status: 'analyzing',
          message: `Analyzing ideas for ${userProfile.primary_niche} & ${userProfile.target_persona}…`
        }
      }));

      const data = await response.json();

      if (data.success && data.ideas) {
        setGeneratedIdeas(prev => ({
          ...prev,
          [sourceId]: data.ideas
        }));

        setLoadingStates(prev => ({
          ...prev,
          [sourceId]: { status: 'complete' }
        }));

        console.log('Generated ideas:', data.ideas);
      } else {
        throw new Error('No ideas generated');
      }
    } catch (err) {
      console.error('Error generating ideas:', err);
      setLoadingStates(prev => ({
        ...prev,
        [sourceId]: {
          status: 'error',
          message: err instanceof Error ? err.message : 'Failed to generate ideas'
        }
      }));

      setTimeout(() => {
        setLoadingStates(prev => {
          const newStates = { ...prev };
          delete newStates[sourceId];
          return newStates;
        });
      }, 3000);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  const getFaviconUrl = (domain: string) => {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  };


  if (isLoadingProfile || isLoadingSources) {
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

  return (
    <>
      <Navigation
        onAuthClick={handleSignOut}
        onLogoClick={() => window.location.href = '/'}
        onDiscoverClick={onNavigateToDiscover}
        onIdeaBankClick={() => {}}
        currentView="ideabank"
      />
      <div className="min-h-screen bg-white px-4 py-12 pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-semibold text-slate-900 mb-3">
              Your Idea Bank
            </h1>
            <p className="text-base text-slate-600 max-w-2xl mx-auto">
              Pick a website to turn into LinkedIn ideas for your{' '}
              <span className="font-medium text-slate-900">{userProfile?.primary_niche || 'niche'}</span>
              {' '}targeting{' '}
              <span className="font-medium text-slate-900">{userProfile?.target_persona || 'your audience'}</span>.
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-6 mb-8">
            <form onSubmit={addWebsite} className="flex gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="e.g., blog.example.com or https://example.com"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200 text-slate-900 placeholder-slate-400"
                />
              </div>
              <button
                type="submit"
                disabled={isAdding || !newUrl.trim()}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="w-5 h-5" />
                Add Website
              </button>
            </form>
          </div>

          {sources.length === 0 ? (
            <div className="text-center py-16">
              <Lightbulb className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg mb-2">
                No sources saved yet
              </p>
              <p className="text-slate-400 text-sm">
                Add sources from the Discover Sources page or add a custom website above
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sources.map((source) => (
                <div
                  key={source.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                      <img
                        src={getFaviconUrl(extractDomain(source.url))}
                        alt=""
                        className="w-8 h-8"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = '<div class="text-slate-400 text-sm font-medium">?</div>';
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 truncate mb-1">
                        {source.name}
                      </h3>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Visit
                      </a>
                    </div>

                    <button
                      onClick={() => deleteSource(source.id)}
                      className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-all duration-200"
                      title="Delete source"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {source.description && (
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                      {source.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                    <span className="bg-slate-100 px-2 py-1 rounded">{source.category}</span>
                  </div>

                  <button
                    onClick={() => handleGetIdeas(source.id)}
                    disabled={loadingStates[source.id]?.status === 'scraping' || loadingStates[source.id]?.status === 'analyzing'}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-4 py-2.5 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loadingStates[source.id]?.status === 'scraping' || loadingStates[source.id]?.status === 'analyzing' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {loadingStates[source.id]?.message}
                      </>
                    ) : loadingStates[source.id]?.status === 'error' ? (
                      <>
                        <span className="text-red-100">Error: {loadingStates[source.id]?.message}</span>
                      </>
                    ) : generatedIdeas[source.id] ? (
                      <>
                        <Lightbulb className="w-4 h-4" />
                        Regenerate Ideas
                      </>
                    ) : (
                      <>
                        <Lightbulb className="w-4 h-4" />
                        Get Content Ideas
                      </>
                    )}
                  </button>

                  {generatedIdeas[source.id] && (
                  <div className="mt-4 space-y-3">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">Generated Ideas:</h4>
                    {generatedIdeas[source.id].map((idea, idx) => {
                      const ideaKey = `${source.id}-${idx}`;
                      return (
                        <div key={idx} className="bg-white border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-all duration-200">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-md flex items-center justify-center text-xs font-semibold">
                              {idx + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-900 mb-1">{idea.hook}</p>
                              <p className="text-xs text-slate-600">{idea.why_it_works}</p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 mt-3">
                            <select
                              value={selectedFormats[ideaKey] || 'text'}
                              onChange={(e) => setSelectedFormats({ ...selectedFormats, [ideaKey]: e.target.value })}
                              className="w-full text-sm pl-3 pr-10 py-2 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200 appearance-none bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20width%3d%2210%22%20height%3d%226%22%20viewBox%3d%220%200%2010%206%22%20fill%3d%22none%22%20xmlns%3d%22http%3a//www.w3.org/2000/svg%22%3e%3cpath%20d%3d%22M1%201L5%205L9%201%22%20stroke%3d%22%23475569%22%20stroke-width%3d%221.5%22%20stroke-linecap%3d%22round%22%20stroke-linejoin%3d%22round%22/%3e%3c/svg%3e')] bg-no-repeat bg-[center_right_0.75rem]"
                            >
                              {CONTENT_FORMATS.map((format) => (
                                <option key={format.id} value={format.id}>
                                  {format.label}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleGenerateContent(source.id, idx, idea)}
                              disabled={generatingContent[ideaKey]}
                              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2.5 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                            >
                              {generatingContent[ideaKey] ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Lightbulb className="w-4 h-4" />
                                  Generate Content
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showContentModal && activeContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowContentModal(false)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Generated Content</h2>
                <p className="text-sm text-slate-600 mt-1">{activeContent.hook}</p>
              </div>
              <button
                onClick={() => setShowContentModal(false)}
                className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 140px)' }}>
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <pre className="whitespace-pre-wrap font-sans text-slate-800 leading-relaxed">{activeContent.content}</pre>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(activeContent.content);
                  alert('Content copied to clipboard!');
                }}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200"
              >
                Copy Content
              </button>
              <button
                onClick={() => setShowContentModal(false)}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
