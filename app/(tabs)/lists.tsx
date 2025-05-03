import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Alert } from 'react-native';
import { useArtwork } from '@/hooks/useArtwork';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import ListCard from '@/components/ListCard';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { router } from 'expo-router';
import { FolderPlus, X } from 'lucide-react-native';

export default function ListsScreen() {
  const { lists, artworks, createList } = useArtwork();
  const [modalVisible, setModalVisible] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [isCreatingList, setIsCreatingList] = useState(false);

  const handleCreateList = () => {
    if (!newListName.trim()) {
      Alert.alert('Error', 'Please enter a list name');
      return;
    }

    setIsCreatingList(true);
    try {
      createList(newListName.trim(), newListDescription.trim());
      setModalVisible(false);
      setNewListName('');
      setNewListDescription('');
    } catch (error) {
      Alert.alert('Error', 'Failed to create list');
    } finally {
      setIsCreatingList(false);
    }
  };

  const handleListPress = (list: { id: string; name: string }) => {
    router.push({
      pathname: '/list/[id]',
      params: { id: list.id }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Lists</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <FolderPlus size={24} color={Colors.primary[600]} />
        </TouchableOpacity>
      </View>

      {lists.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Lists Yet</Text>
          <Text style={styles.emptyText}>
            Create lists to organize your artwork for different categories, exhibitions, or decisions.
          </Text>
          <Button
            title="Create Your First List"
            onPress={() => setModalVisible(true)}
            style={styles.emptyButton}
          />
        </View>
      ) : (
        <FlatList
          data={lists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ListCard
              list={item}
              artworks={artworks}
              onPress={handleListPress}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New List</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={24} color={Colors.gray[600]} />
              </TouchableOpacity>
            </View>

            <Input
              label="List Name"
              value={newListName}
              onChangeText={setNewListName}
              placeholder="E.g., Must Buy, Top Picks, Abstract Art"
            />

            <Input
              label="Description (Optional)"
              value={newListDescription}
              onChangeText={setNewListDescription}
              placeholder="Add a description for your list"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              style={{ height: 80 }}
            />

            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                type="outline"
                onPress={() => setModalVisible(false)}
                style={styles.modalButton}
              />
              <Button
                title="Create List"
                onPress={handleCreateList}
                loading={isCreatingList}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: Colors.text,
  },
  addButton: {
    padding: Spacing.sm,
    borderRadius: 8,
  },
  listContent: {
    padding: Spacing.lg,
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
  emptyButton: {
    marginTop: Spacing.md,
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
    padding: Spacing.xl,
    paddingBottom: Spacing.xxl,
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
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.lg,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
});