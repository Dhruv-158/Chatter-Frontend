import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { searchUsers, clearUserSearchResults } from '@/services/friendService';

/**
 * Custom hook for searching users to add as friends
 * @returns {Object} Search functionality and state
 */
export const useFriendSearch = () => {
    const [query, setQuery] = useState('');
    
    // Get search state from Redux
    const { searchResults, isSearching, searchError } = useSelector((state) => state.friends);

    /**
     * Handle user search with debouncing support
     */
    const handleSearch = useCallback(async (searchQuery) => {
        if (!searchQuery || searchQuery.trim().length === 0) {
            clearSearch();
            return { success: false, error: 'Search query is required' };
        }

        setQuery(searchQuery);
        const result = await searchUsers(searchQuery);
        return result;
    }, []);

    /**
     * Clear search results
     */
    const clearSearch = useCallback(() => {
        setQuery('');
        clearUserSearchResults();
    }, []);

    return {
        // State
        query,
        searchResults,
        isSearching,
        searchError,
        hasResults: searchResults && searchResults.length > 0,
        
        // Actions
        handleSearch,
        clearSearch,
        setQuery,
    };
};
