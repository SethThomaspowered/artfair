import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useArtwork } from '@/hooks/useArtwork';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import ArtworkCard from '@/components/ArtworkCard';
import Button from '@/components/Button';
import { ChevronLeft, MoreVertical, Edit, Trash, X } from 'lucide-react-native';
import { Artwork } from '@/types/artwork';

export default function ListDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { lists, artworks, updateList, deleteList, toggleFavorite } = useArtwork();
  const router = useRouter();
  
  const list = lists.find((l) => l.id === id);
  const listArtworks = artworks.filter((artwork) => artwork.listIds.includes(id));
  
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isOptionsModalVisible, setIsOptionsModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  
  if (!list) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>List not found</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }
  
  const handleArtworkPress = (artwork: Artwork) => {
    router.push({
      pathname: '/(artwork)/[id]',
      params: { id: artwork.id }
    });
  };
  
  const handleEditList = () => {
    setEditName(list.name);
    setEditDescription(list.description);
    setIsOptionsModalVisible(false);
    setIsEditModalVisible(true);
  };
  
  const handleDeleteList = () => {
    Alert.alert(
      'Delete List',
      'Are you sure you want to delete this list? Your artworks will not be deleted.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            deleteList(list.id);
            router.back();
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  const handleSaveEdit = () => {
    if (!editName.trim()) {
      Alert.alert('Error', 'Please enter a list name');
      return;
    }
    
    updateList(list.id, {
      name: editName.trim(),
      description: editDescription.trim(),
    });
    
    setIsEditModalVisible(false);
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: '',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ChevronLeft size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => setIsOptionsModalVisible(true)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MoreVertical size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <View style={styles.header}>
        <Text style={styles.title}>{list.name}</Text>
        {list.description ? (
          <Text style={styles.description}>{list.description}</Text>
        ) : null}
        <Text style={styles.count}>{listArtworks.length} {listArtworks.length === 1 ? 'artwork' : 'artworks'}</Text>
      </View>
      
      {listArtworks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No artworks in this list yet</Text>
          <Text style={styles.emptyText}>
            Add artworks to this list by viewing an artwork and selecting this list.
          </Text>
          <Button
            title="Browse Your Collection"
            onPress={() => router.push('/(tabs)')}
            style={styles.browseButton}
          />
        </View>
      ) : (
        <FlatList
          data={listArtworks}
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
          contentContainerStyle={styles.listContent}
        />
      )}
      
      {/* Options Modal */}
      <Modal
        visible={isOptionsModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOptionsModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOptionsModalVisible(false)}
        >
          <View style={styles.optionsModalContent}>
            <TouchableOpacity
              style={styles.optionItem}
              onPress={handleEditList}
            >
              <Edit size={20} color={Colors.text} style={styles.optionIcon} />
              <Text style={styles.optionText}>Edit List</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.optionItem}
              onPress={handleDeleteList}
            >
              <Trash size={20} color={Colors.error} style={styles.optionIcon} />
              <Text style={[styles.optionText, styles.deleteText]}>Delete List</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      
      {/* Edit Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.editModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit List</Text>
              <TouchableOpacity
                onPress={() => setIsEditModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={24} color={Colors.gray[600]} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>List Name</Text>
              <TextInput
                style={styles.input}
                value={editName}
                onChangeText={setEditName}
                placeholder="Enter list name"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editDescription}
                onChangeText={setEditDescription}
                placeholder="Add a description for your list"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
            
            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                type="outline"
                onPress={() => setIsEditModalVisible(false)}
                style={styles.modalButton}
              />
              <Button
                title="Save Changes"
                onPress={handleSaveEdit}
                style={styles.modalButton}
              />
            </View>
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
  header: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.gray[600],
    marginBottom: Spacing.sm,
  },
  count: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: Colors.gray[500],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.gray[600],
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  browseButton: {
    marginTop: Spacing.md,
  },
  listContent: {
    padding: Spacing.lg,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: '48%',
    marginBottom: Spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsModalContent: {
    position: 'absolute',
    top: 100,
    right: 20,
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: Spacing.md,
    shadowColor: Colors.gray[900],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 200,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  optionIcon: {
    marginRight: Spacing.md,
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: Colors.text,
  },
  deleteText: {
    color: Colors.error,
  },
  editModalContent: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    width: '90%',
    padding: Spacing.lg,
    shadowColor: Colors.gray[900],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
  },
  formGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: Colors.gray[700],
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 16,
    color: Colors.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.lg,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: Spacing.xs,
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