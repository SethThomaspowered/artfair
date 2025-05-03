import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useArtwork } from '@/hooks/useArtwork';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import Button from '@/components/Button';
import { ChevronLeft, Heart, Share2, Edit, Trash, BookMarked } from 'lucide-react-native';

export default function ArtworkDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { artworks, lists, toggleFavorite, deleteArtwork, addArtworkToList, removeArtworkFromList } = useArtwork();
  const router = useRouter();

  const artwork = artworks.find((a) => a.id === id);
  const [listModalVisible, setListModalVisible] = useState(false);

  if (!artwork) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Artwork not found</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  const handleToggleFavorite = () => {
    toggleFavorite(artwork.id);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Artwork',
      'Are you sure you want to delete this artwork? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            deleteArtwork(artwork.id);
            router.back();
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleShare = () => {
    Alert.alert('Share', 'Sharing functionality would be implemented here');
  };

  const handleEdit = () => {
    router.push({
      pathname: '/artwork/edit/[id]',
      params: { id: artwork.id }
    });
  };

  const handleListPress = (listId: string) => {
    const isInList = artwork.listIds.includes(listId);
    
    if (isInList) {
      removeArtworkFromList(artwork.id, listId);
    } else {
      addArtworkToList(artwork.id, listId);
    }
  };

  // Format artwork details for display
  const details = [
    { label: 'Artist', value: artwork.artist },
    { label: 'Gallery', value: artwork.gallery },
    { label: 'Medium', value: artwork.medium },
    { label: 'Year', value: artwork.year },
    { label: 'Dimensions', value: artwork.dimensions },
    { label: 'Price', value: artwork.price },
  ].filter((detail) => detail.value);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
          headerTransparent: true,
          headerLeft: () => (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ChevronLeft size={24} color={Colors.background} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={handleToggleFavorite}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Heart
                  size={24}
                  color={Colors.background}
                  fill={artwork.isFavorite ? Colors.error : 'transparent'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={handleShare}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Share2 size={24} color={Colors.background} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: artwork.imageUri }} style={styles.image} resizeMode="contain" />
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.title}>{artwork.title}</Text>

          <View style={styles.detailsContainer}>
            {details.map((detail, index) => (
              <View key={index} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{detail.label}</Text>
                <Text style={styles.detailValue}>{detail.value}</Text>
              </View>
            ))}
          </View>

          {artwork.notes ? (
            <View style={styles.notesContainer}>
              <Text style={styles.notesLabel}>Notes</Text>
              <Text style={styles.notes}>{artwork.notes}</Text>
            </View>
          ) : null}

          <View style={styles.listsContainer}>
            <View style={styles.listsHeader}>
              <Text style={styles.listsLabel}>Lists</Text>
              <TouchableOpacity
                style={styles.addToListButton}
                onPress={() => setListModalVisible(true)}
              >
                <Text style={styles.addToListText}>Manage Lists</Text>
                <BookMarked size={16} color={Colors.primary[600]} />
              </TouchableOpacity>
            </View>

            {artwork.listIds.length > 0 ? (
              <View style={styles.listTags}>
                {artwork.listIds.map((listId) => {
                  const list = lists.find((l) => l.id === listId);
                  return list ? (
                    <View key={list.id} style={styles.listTag}>
                      <Text style={styles.listTagText}>{list.name}</Text>
                    </View>
                  ) : null;
                })}
              </View>
            ) : (
              <Text style={styles.noListsText}>Not added to any lists yet</Text>
            )}
          </View>

          <View style={styles.actionsContainer}>
            <Button
              title="Edit Artwork"
              onPress={handleEdit}
              icon={<Edit size={20} color={Colors.primary[600]} style={styles.buttonIcon} />}
              type="outline"
              style={styles.actionButton}
            />
            <Button
              title="Delete"
              onPress={handleDelete}
              icon={<Trash size={20} color={Colors.error} style={styles.buttonIcon} />}
              type="outline"
              style={[styles.actionButton, styles.deleteButton]}
              textStyle={styles.deleteButtonText}
            />
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={listModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setListModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add to Lists</Text>
              <TouchableOpacity
                onPress={() => setListModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.modalClose}>Done</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {lists.length > 0 ? (
                lists.map((list) => (
                  <TouchableOpacity
                    key={list.id}
                    style={[
                      styles.modalListItem,
                      artwork.listIds.includes(list.id) && styles.modalListItemSelected,
                    ]}
                    onPress={() => handleListPress(list.id)}
                  >
                    <Text
                      style={[
                        styles.modalListItemText,
                        artwork.listIds.includes(list.id) && styles.modalListItemTextSelected,
                      ]}
                    >
                      {list.name}
                    </Text>
                    {artwork.listIds.includes(list.id) && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.noListsContainer}>
                  <Text style={styles.noListsModalText}>You don't have any lists yet</Text>
                  <Button
                    title="Create a List"
                    onPress={() => {
                      setListModalVisible(false);
                      router.push('/(tabs)/lists');
                    }}
                    style={styles.createListButton}
                  />
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  headerActions: {
    flexDirection: 'row',
    marginRight: Spacing.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  imageContainer: {
    height: 300,
    backgroundColor: Colors.gray[900],
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: Spacing.lg,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  detailsContainer: {
    marginBottom: Spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  detailLabel: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: Colors.gray[600],
  },
  detailValue: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: Colors.text,
    maxWidth: '60%',
    textAlign: 'right',
  },
  notesContainer: {
    marginBottom: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.gray[50],
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  notes: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.gray[800],
    lineHeight: 24,
  },
  listsContainer: {
    marginBottom: Spacing.lg,
  },
  listsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  listsLabel: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
  },
  addToListButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addToListText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: Colors.primary[600],
    marginRight: Spacing.xs,
  },
  listTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  listTag: {
    backgroundColor: Colors.primary[50],
    borderRadius: 16,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.primary[200],
  },
  listTagText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: Colors.primary[700],
  },
  noListsText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: Colors.gray[600],
    marginTop: Spacing.xs,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.lg,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
  deleteButton: {
    borderColor: Colors.error,
  },
  deleteButtonText: {
    color: Colors.error,
  },
  buttonIcon: {
    marginRight: Spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
  },
  modalClose: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: Colors.primary[600],
  },
  modalBody: {
    padding: Spacing.lg,
    maxHeight: '80%',
  },
  modalListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  modalListItemSelected: {
    backgroundColor: Colors.primary[50],
  },
  modalListItemText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.text,
  },
  modalListItemTextSelected: {
    fontFamily: 'Inter_500Medium',
    color: Colors.primary[700],
  },
  checkmark: {
    fontSize: 18,
    color: Colors.primary[600],
    fontWeight: 'bold',
  },
  noListsContainer: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  noListsModalText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.gray[600],
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  createListButton: {
    marginTop: Spacing.md,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  notFoundText: {
    fontSize: 18,
    fontFamily: 'Inter_500Medium',
    color: Colors.gray[600],
    marginBottom: Spacing.lg,
  },
});