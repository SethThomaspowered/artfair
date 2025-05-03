import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useArtwork } from '@/hooks/useArtwork';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import Input from '@/components/Input';
import ArtworkCard from '@/components/ArtworkCard';
import { Search as SearchIcon, Filter, X } from 'lucide-react-native';
import { Artwork } from '@/types/artwork';
import { useRouter } from 'expo-router';

export default function SearchScreen() {
  const { artworks, isLoading, searchArtworks, toggleFavorite } = useArtwork();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Artwork[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const router = useRouter();

  // Filter categories
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'painting', label: 'Painting' },
    { id: 'sculpture', label: 'Sculpture' },
    { id: 'photography', label: 'Photography' },
    { id: 'digital', label: 'Digital' },
    { id: 'mixed', label: 'Mixed Media' },
  ];

  useEffect(() => {
    if (searchQuery) {
      const results = searchArtworks(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, artworks, searchArtworks]);

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleFilterPress = (filterId: string) => {
    setActiveFilter(activeFilter === filterId ? null : filterId);
  };

  const filteredResults = activeFilter && activeFilter !== 'all'
    ? searchResults.filter(artwork => 
        artwork.medium.toLowerCase().includes(activeFilter.toLowerCase()))
    : searchResults;

  const handleArtworkPress = (artwork: Artwork) => {
    router.push({
      pathname: '/(artwork)/[id]',
      params: { id: artwork.id }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Input
            placeholder="Search by title, artist, gallery..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            containerStyle={styles.searchInput}
            leftIcon={<SearchIcon size={20} color={Colors.gray[500]} />}
            rightIcon={
              searchQuery ? (
                <TouchableOpacity onPress={handleClearSearch}>
                  <X size={20} color={Colors.gray[500]} />
                </TouchableOpacity>
              ) : null
            }
          />
        </View>

        <View style={styles.filtersContainer}>
          <FlatList
            data={filters}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  activeFilter === item.id && styles.activeFilterButton,
                ]}
                onPress={() => handleFilterPress(item.id)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    activeFilter === item.id && styles.activeFilterButtonText,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersList}
          />
        </View>
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>Loading...</Text>
        </View>
      ) : searchQuery && filteredResults.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyTitle}>No results found</Text>
          <Text style={styles.emptyText}>
            Try adjusting your search or filters
          </Text>
        </View>
      ) : !searchQuery ? (
        <View style={styles.centerContainer}>
          <SearchIcon size={48} color={Colors.gray[300]} />
          <Text style={styles.emptyText}>
            Search for artwork by title, artist, gallery, or medium
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredResults}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <ArtworkCard
                artwork={item}
                onPress={handleArtworkPress}
                onFavoritePress={() => toggleFavorite(item.id)}
              />
            </View>
          )}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.resultsContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: Colors.text,
  },
  searchContainer: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginBottom: Spacing.sm,
  },
  filterButton: {
    flex: 1,
  },
  filtersContainer: {
    marginTop: Spacing.xs,
  },
  filtersList: {
    paddingVertical: Spacing.xs,
  },
  filterButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: 20,
    backgroundColor: Colors.gray[200],
    marginRight: Spacing.sm,
  },
  activeFilterButton: {
    backgroundColor: Colors.primary[600],
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: Colors.gray[700],
  },
  activeFilterButtonText: {
    color: Colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.gray[600],
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  resultsContainer: {
    padding: Spacing.lg,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: '48%',
    marginBottom: Spacing.md,
  },
});