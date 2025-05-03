import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Artwork, ArtworkList } from '@/types/artwork';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import { Image } from 'react-native';
import { List } from 'lucide-react-native';

interface ListCardProps {
  list: ArtworkList;
  artworks: Artwork[];
  onPress: (list: ArtworkList) => void;
}

export const ListCard: React.FC<ListCardProps> = ({
  list,
  artworks,
  onPress,
}) => {
  // Get the artworks in this list
  const listArtworks = artworks.filter((artwork) => 
    list.artworkIds.includes(artwork.id)
  );

  // Get up to 3 images to preview
  const previewImages = listArtworks
    .slice(0, 3)
    .map((artwork) => artwork.imageUri);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(list)}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          {previewImages.length > 0 ? (
            <View style={styles.previewContainer}>
              {previewImages.map((uri, index) => (
                <Image
                  key={index}
                  source={{ uri }}
                  style={[
                    styles.previewImage,
                    index === 1 && styles.previewImageMiddle,
                    index === 2 && styles.previewImageLast,
                  ]}
                  resizeMode="cover"
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyPreview}>
              <List color={Colors.primary[500]} size={24} />
            </View>
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {list.name}
          </Text>
          {list.description ? (
            <Text style={styles.description} numberOfLines={1}>
              {list.description}
            </Text>
          ) : null}
          <Text style={styles.count}>
            {list.artworkIds.length} {list.artworkIds.length === 1 ? 'artwork' : 'artworks'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: Colors.gray[900],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: Spacing.md,
  },
  previewContainer: {
    width: 60,
    height: 60,
    position: 'relative',
  },
  previewImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
    position: 'absolute',
    top: 0,
    left: 0,
    borderWidth: 1,
    borderColor: Colors.background,
  },
  previewImageMiddle: {
    top: 10,
    left: 10,
    zIndex: 1,
  },
  previewImageLast: {
    top: 20,
    left: 20,
    zIndex: 2,
  },
  emptyPreview: {
    width: 60,
    height: 60,
    backgroundColor: Colors.primary[50],
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 4,
  },
  count: {
    fontSize: 12,
    color: Colors.gray[500],
  },
});

export default ListCard;