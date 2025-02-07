import {
  AlertTriangle,
  Loader2,
  RefreshCcw,
  Settings,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Logo } from './components/Logo';
import { RepositoryCard } from './components/RepositoryCard';
import { SettingsPopup } from './components/SettingsPopup';
import { useGitHub } from './hooks/use-github';
import { useInfiniteScroll } from './hooks/use-infinite-scroll';
import { InvalidTokenError } from './lib/errors';

export function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>();
  const [selectedToken, setSelectedToken] = useState<string>();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred_language');
    const savedToken = localStorage.getItem('github_token');

    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    }

    if (savedToken) {
      setSelectedToken(savedToken);
    }

    setIsInitialized(true);
  }, []);

  const {
    repositories,
    isLoading,
    isFetchingMore,
    fetchMore,
    error,
    refresh,
    isRefetching,
  } = useGitHub({
    language: selectedLanguage,
    token: selectedToken,
    enabled: isInitialized,
  });

  const scrollContainerRef = useInfiniteScroll({
    onLoadMore: fetchMore,
    isLoading: isLoading || isFetchingMore,
  });

  const handleRefresh = () => {
    refresh();
  };

  const handleSaveSettings = (language: string, token: string) => {
    setSelectedLanguage(language);
    setSelectedToken(token);

    localStorage.setItem('preferred_language', language);
    localStorage.setItem('github_token', token);
  };

  const getErrorMessage = (error: unknown) => {
    if (!error) return undefined;
    return error instanceof Error ? error.message : String(error);
  };

  return (
    <div className='h-screen relative flex flex-col bg-gradient-to-b from-zinc-900 to-black text-white overflow-hidden'>
      {(isFetchingMore || isLoading || isRefetching) && (
        <div className='absolute top-0 left-0 right-0 h-[2px] bg-white'>
          <div className='absolute top-0 left-0 right-0 h-full bg-gradient-to-r from-zinc-500 via-white to-zinc-500 animate-shimmer' />
        </div>
      )}

      {showSettings && (
        <SettingsPopup
          onClose={() => setShowSettings(false)}
          onSave={handleSaveSettings}
          initialLanguage={selectedLanguage}
          initialToken={selectedToken}
          error={getErrorMessage(error)}
        />
      )}

      {/* Navigation */}
      <nav className='px-4 sm:px-6 py-4 flex justify-between flex-row bg-white/5 backdrop-blur-xl border-b border-white/10 z-50'>
        <div className='flex-1 flex justify-between max-w-2xl mx-auto items-center gap-2'>
          <a
            href='https://github.com'
            className='flex items-center gap-2 text-white/70 hover:text-white transition-colors'
          >
            <Logo className='size-8' />
            <span className='text-base font-medium'>gititok</span>
          </a>

          <div className='flex items-center gap-2'>
            <button
              onClick={() => setShowSettings(true)}
              className='p-2 text-white/70 hover:text-white transition-colors'
            >
              <Settings className='w-5 h-5' />
            </button>
            <button
              onClick={handleRefresh}
              className='p-2 text-white/70 hover:text-white transition-colors'
            >
              <RefreshCcw className='w-5 h-5' />
            </button>
          </div>
        </div>
      </nav>
      {isLoading ? (
        <div className='flex-1 flex justify-center items-center gap-2'>
          <div className='flex items-center gap-2 border border-white/10 p-4 rounded-lg bg-white/5 backdrop-blur-xl'>
            <Loader2 className='size-5 animate-spin' strokeWidth={3} />
            <p className='text-white/70'>preparing feed...</p>
          </div>
        </div>
      ) : error ? (
        <div className='flex-1 flex justify-center items-center gap-2'>
          <div className='flex flex-col justify-center text-center items-center gap-5 border border-white/10 py-8 px-4 rounded-lg bg-white/5 backdrop-blur-xl max-w-md mx-4'>
            <AlertTriangle
              className='size-8 text-red-400 shrink-0'
              strokeWidth={2}
            />
            <p className='text-red-400 text-balance text-sm'>{error}</p>
          </div>
        </div>
      ) : (
        <div
          ref={scrollContainerRef}
          className='flex-1 overflow-y-auto snap-y snap-mandatory scrollbar-hide'
        >
          {repositories.map((repository) => (
            <div
              key={repository.id}
              className='snap-start min-h-[calc(100vh-60px)] h-[calc(100vh-60px)] flex items-center py-6'
            >
              <div className='w-full max-w-3xl mx-auto px-4 sm:px-6 h-full'>
                <RepositoryCard repository={repository} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
