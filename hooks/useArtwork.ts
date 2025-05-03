import { useState, useEffect, useCallback } from 'react';
import { Artwork, ArtworkList, ArtworkFilterType } from '@/types/artwork';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Use localStorage for web and SecureStore for native
const storeData = async (key: string, value: string) => {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

const getData = async (key: string) => {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
};

export const useArtwork = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [lists, setLists] = useState<ArtworkList[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from storage
  useEffect(() => {
    const loadData = async () => {
      try {
        const artworksData = await getData('artworks');
        const listsData = await getData('lists');

        if (artworksData) {
          setArtworks(JSON.parse(artworksData));
        }

        if (listsData) {
          setLists(JSON.parse(listsData));
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading artwork data:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save data to storage whenever it changes
  useEffect(() => {
    const saveData = async () => {
      try {
        if (artworks.length > 0) {
          await storeData('artworks', JSON.stringify(artworks));
        }
        
        if (lists.length > 0) {
          await storeData('lists', JSON.stringify(lists));
        }
      } catch (error) {
        console.error('Error saving artwork data:', error);
      }
    };

    if (!isLoading) {
      saveData();
    }
  }, [artworks, lists, isLoading]);

  // Add a new artwork
  const addArtwork = useCallback(async (artwork: Omit<Artwork, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newArtwork: Artwork = {
      ...artwork,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
    };

    setArtworks((prev) => [...prev, newArtwork]);
    return newArtwork;
  }, []);

  // Update an existing artwork
  const updateArtwork = useCallback((id: string, updates: Partial<Artwork>) => {
    setArtworks((prev) =>
      prev.map((artwork) =>
        artwork.id === id
          ? {
              ...artwork,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : artwork
      )
    );
  }, []);

  // Delete an artwork
  const deleteArtwork = useCallback((id: string) => {
    setArtworks((prev) => prev.filter((artwork) => artwork.id !== id));
    
    // Also remove the artwork from any lists it belongs to
    setLists((prev) =>
      prev.map((list) => ({
        ...list,
        artworkIds: list.artworkIds.filter((artworkId) => artworkId !== id),
        updatedAt: new Date().toISOString(),
      }))
    );
  }, []);

  // Toggle favorite status
  const toggleFavorite = useCallback((id: string) => {
    setArtworks((prev) =>
      prev.map((artwork) =>
        artwork.id === id
          ? {
              ...artwork,
              isFavorite: !artwork.isFavorite,
              updatedAt: new Date().toISOString(),
            }
          : artwork
      )
    );
  }, []);

  // Create a new list
  const createList = useCallback((name: string, description: string = '') => {
    const now = new Date().toISOString();
    const newList: ArtworkList = {
      id: Date.now().toString(),
      name,
      description,
      artworkIds: [],
      createdAt: now,
      updatedAt: now,
    };

    setLists((prev) => [...prev, newList]);
    return newList;
  }, []);

  // Update a list
  const updateList = useCallback((id: string, updates: Partial<ArtworkList>) => {
    setLists((prev) =>
      prev.map((list) =>
        list.id === id
          ? {
              ...list,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : list
      )
    );
  }, []);

  // Delete a list
  const deleteList = useCallback((id: string) => {
    setLists((prev) => prev.filter((list) => list.id !== id));
    
    // Remove the list ID from any artworks that belong to it
    setArtworks((prev) =>
      prev.map((artwork) => ({
        ...artwork,
        listIds: artwork.listIds.filter((listId) => listId !== id),
        updatedAt: new Date().toISOString(),
      }))
    );
  }, []);

  // Add an artwork to a list
  const addArtworkToList = useCallback((artworkId: string, listId: string) => {
    // Add the list to the artwork's listIds
    setArtworks((prev) =>
      prev.map((artwork) =>
        artwork.id === artworkId && !artwork.listIds.includes(listId)
          ? {
              ...artwork,
              listIds: [...artwork.listIds, listId],
              updatedAt: new Date().toISOString(),
            }
          : artwork
      )
    );

    // Add the artwork to the list's artworkIds
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId && !list.artworkIds.includes(artworkId)
          ? {
              ...list,
              artworkIds: [...list.artworkIds, artworkId],
              updatedAt: new Date().toISOString(),
            }
          : list
      )
    );
  }, []);

  // Remove an artwork from a list
  const removeArtworkFromList = useCallback((artworkId: string, listId: string) => {
    // Remove the list from the artwork's listIds
    setArtworks((prev) =>
      prev.map((artwork) =>
        artwork.id === artworkId
          ? {
              ...artwork,
              listIds: artwork.listIds.filter((id) => id !== listId),
              updatedAt: new Date().toISOString(),
            }
          : artwork
      )
    );

    // Remove the artwork from the list's artworkIds
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? {
              ...list,
              artworkIds: list.artworkIds.filter((id) => id !== artworkId),
              updatedAt: new Date().toISOString(),
            }
          : list
      )
    );
  }, []);

  // Get artworks by filter
  const getArtworksByFilter = useCallback(
    (filter: ArtworkFilterType) => {
      if (filter === 'all') {
        return artworks;
      } else if (filter === 'favorites') {
        return artworks.filter((artwork) => artwork.isFavorite);
      } else if (filter === 'recent') {
        return [...artworks].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 10);
      } else {
        // Assume the filter is a list ID
        return artworks.filter((artwork) => artwork.listIds.includes(filter));
      }
    },
    [artworks]
  );

  // Search artworks
  const searchArtworks = useCallback(
    (query: string) => {
      if (!query) return artworks;
      
      const lowerQuery = query.toLowerCase();
      return artworks.filter(
        (artwork) =>
          artwork.title.toLowerCase().includes(lowerQuery) ||
          artwork.artist.toLowerCase().includes(lowerQuery) ||
          artwork.gallery.toLowerCase().includes(lowerQuery) ||
          artwork.medium.toLowerCase().includes(lowerQuery) ||
          artwork.notes.toLowerCase().includes(lowerQuery)
      );
    },
    [artworks]
  );

  return {
    artworks,
    lists,
    isLoading,
    addArtwork,
    updateArtwork,
    deleteArtwork,
    toggleFavorite,
    createList,
    updateList,
    deleteList,
    addArtworkToList,
    removeArtworkFromList,
    getArtworksByFilter,
    searchArtworks,
  };
};