import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useArtwork } from '@/hooks/useArtwork';
import { useAuth } from '@/hooks/useAuth';
import { ScrollView } from 'react-native-gesture-handler';
import ArtworkCard from '@/components/ArtworkCard';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import { router } from 'expo-router';
import { Artwork } from '@/types/artwork';
import { Plus, Heart } from 'lucide-react-native';

export default function HomeScreen() {
  const { artworks, lists, isLoading, toggleFavorite } = useArtwork();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const recentArtworks = [...artworks].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const favoriteArtworks = artworks.filter((artwork) => artwork.isFavorite);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // In a real app, we would refetch data here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleArtworkPress = (artwork: Artwork) => {
    router.push({
      pathname: '/(artwork)/[id]',
      params: { id: artwork.id }
    });
  };

  const handleFavoritePress = (artwork: Artwork) => {
    toggleFavorite(artwork.id);
  };

  const handleAddNew = () => {
    router.push('/(tabs)/camera');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.username}>{user?.name || 'Art Lover'}</Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
            <Plus size={24} color={Colors.background} />
          </TouchableOpacity>
        </View>

        {artworks.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateTitle}>Welcome to ArtFolio!</Text>
            <Text style={styles.emptyStateText}>
              Start by adding artwork you discover at art fairs and galleries.
            </Text>
            <TouchableOpacity style={styles.emptyStateButton} onPress={handleAddNew}>
              <Text style={styles.emptyStateButtonText}>Add Your First Artwork</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {favoriteArtworks.length > 0 && (
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Favorites</Text>
                  <Heart size={20} color={Colors.error} />
                </View>
                <FlatList
                  data={favoriteArtworks.slice(0, 6)}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <ArtworkCard
                      artwork={item}
                      onPress={handleArtworkPress}
                      onFavoritePress={handleFavoritePress}
                    />
                  )}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalListContent}
                  ItemSeparatorComponent={() => <View style={{ width: Spacing.md }} />}
                />
              </View>
            )}

            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Additions</Text>
              </View>
              <View style={styles.gridContainer}>
                {recentArtworks.slice(0, 10).map((artwork) => (
                  <ArtworkCard
                    key={artwork.id}
                    artwork={artwork}
                    onPress={handleArtworkPress}
                    onFavoritePress={handleFavoritePress}
                  />
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: Colors.gray[600],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.background,
  },
  greeting: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.gray[600],
    marginBottom: 4,
  },
  username: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: Colors.text,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary[800],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionContainer: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
    marginRight: Spacing.xs,
  },
  horizontalListContent: {
    paddingRight: Spacing.lg,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyStateContainer: {
    flex: 1,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xxxl,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.gray[600],
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  emptyStateButton: {
    backgroundColor: Colors.primary[600],
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 8,
    marginTop: Spacing.md,
  },
  emptyStateButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.background,
  },
});