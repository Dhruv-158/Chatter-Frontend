import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X, Compass } from 'lucide-react';
import { useFriendSearch } from '@/hooks';
import SearchResults from './SearchResults';
import { debounce } from 'lodash';

const DiscoverPage = () => {
  const [searchInput, setSearchInput] = useState('');
  const { query, searchResults, isSearching, handleSearch, clearSearch } = useFriendSearch();

  // Debounced search function (waits 300ms after user stops typing)
  const debouncedSearch = useCallback(
    debounce((searchQuery) => {
      if (searchQuery.trim().length >= 1) {
        handleSearch(searchQuery);
      } else {
        clearSearch();
      }
    }, 300), // 300ms delay
    [handleSearch, clearSearch]
  );

  // Trigger search when input changes
  useEffect(() => {
    debouncedSearch(searchInput);
    
    // Cleanup
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchInput, debouncedSearch]);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      handleSearch(searchInput);
    }
  };

  const handleClear = () => {
    setSearchInput('');
    clearSearch();
  };

  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="container max-w-2xl mx-auto py-4 space-y-6">
        
        {/* Search Bar - Telegram Style */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md pb-2 pt-2">
            <form onSubmit={onSearchSubmit} className="relative">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        type="text"
                        placeholder="Search for users..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="pl-12 pr-10 h-12 text-base rounded-2xl bg-muted/50 border-transparent focus:bg-background focus:border-primary/20 transition-all shadow-sm"
                        autoFocus
                    />
                    {searchInput && (
                        <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        >
                        <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
                {isSearching && (
                    <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </form>
        </div>

        {/* Search Results or Empty State */}
        {searchInput ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <SearchResults 
                    results={searchResults} 
                    isLoading={isSearching}
                    query={searchInput}
                />
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-0 animate-in fade-in duration-500 fill-mode-forwards" style={{ animationDelay: '100ms' }}>
                <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <Compass className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2 tracking-tight">Discover People</h3>
                <p className="text-muted-foreground max-w-xs mx-auto leading-relaxed">
                    Search for users by their username or name to start connecting.
                </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverPage;
