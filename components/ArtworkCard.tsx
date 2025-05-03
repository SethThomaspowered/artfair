import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Heart } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import { Artwork } from '@/types/artwork';

interface ArtworkCardProps {
  artwork: Artwork;
  onPress: (artwork: Artwork) => void;
  onFavoritePress: (artwork: Artwork) => void;
}

const { width } = Dimensions.get('window');
const cardWidth = width / 2 - Spacing.lg - Spacing.sm / 2;

export const ArtworkCard: React.FC<ArtworkCardProps> = ({
  artwork,
  onPress,
  onFavoritePress,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(artwork)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: artwork.imageUri }}
          style={styles.image}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => onFavoritePress(artwork)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Heart
            size={20}
            color={artwork.isFavorite ? Colors.error : Colors.gray[400]}
            fill={artwork.isFavorite ? Colors.error : 'transparent'}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {artwork.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {artwork.artist}
        </Text>
        <Text style={styles.gallery} numberOfLines={1}>
          {artwork.gallery}
        </Text>
        <Text style={styles.price}>{artwork.price}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: Colors.background,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    shadowColor: Colors.gray[900],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: cardWidth * 1.2,
    backgroundColor: Colors.gray[200],
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.gray[200],
  },
  favoriteButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: Spacing.xs,
    zIndex: 10,
  },
  infoContainer: {
    padding: Spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  artist: {
    fontSize: 14,
    color: Colors.gray[700],
    marginBottom: 2,
  },
  gallery: {
    fontSize: 12,
    color: Colors.gray[500],
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary[600],
  },
});

export default ArtworkCard;