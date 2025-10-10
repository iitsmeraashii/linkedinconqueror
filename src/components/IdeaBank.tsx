import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Navigation } from './Navigation';
import { Plus, ExternalLink, Lightbulb, Loader2, Trash2 } from 'lucide-react';

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

  const handleGetIdeas = async (sourceId: string) => {
    console.log('Get ideas for source:', sourceId);
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
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-4 py-2.5 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Lightbulb className="w-4 h-4" />
                    Get Content Ideas
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
