import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useArtwork } from '@/hooks/useArtwork';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { X, ChevronLeft } from 'lucide-react-native';

export default function NewArtworkScreen() {
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const { addArtwork, lists } = useArtwork();
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [gallery, setGallery] = useState('');
  const [price, setPrice] = useState('');
  const [medium, setMedium] = useState('');
  const [year, setYear] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedListIds, setSelectedListIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSave = async () => {
    if (!title || !artist) {
      Alert.alert('Required Fields', 'Please enter at least the title and artist name.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const newArtwork = await addArtwork({
        title,
        artist,
        gallery,
        price,
        medium,
        year,
        dimensions,
        notes,
        imageUri: imageUri || '',
        listIds: selectedListIds,
        isFavorite: false,
      });
      
      Alert.alert(
        'Artwork Saved',
        'The artwork has been added to your collection.',
        [
          {
            text: 'OK',
            onPress: () => router.push('/(tabs)'),
          },
        ]
      );
    } catch (error) {
      console.error('Error saving artwork:', error);
      Alert.alert('Error', 'Failed to save artwork');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleList = (listId: string) => {
    setSelectedListIds((prev) =>
      prev.includes(listId)
        ? prev.filter((id) => id !== listId)
        : [...prev, listId]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Add New Artwork',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ChevronLeft size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>No Image Selected</Text>
            </View>
          )}
        </View>
        
        <View style={styles.form}>
          <Input
            label="Title *"
            value={title}
            onChangeText={setTitle}
            placeholder="Enter artwork title"
          />
          
          <Input
            label="Artist *"
            value={artist}
            onChangeText={setArtist}
            placeholder="Enter artist name"
          />
          
          <Input
            label="Gallery / Booth"
            value={gallery}
            onChangeText={setGallery}
            placeholder="Enter gallery or booth"
          />
          
          <Input
            label="Price"
            value={price}
            onChangeText={setPrice}
            placeholder="Enter price (e.g. $1,000)"
            keyboardType="default"
          />
          
          <View style={styles.row}>
            <Input
              label="Medium"
              value={medium}
              onChangeText={setMedium}
              placeholder="e.g. Oil, Acrylic"
              containerStyle={styles.halfInput}
            />
            
            <Input
              label="Year"
              value={year}
              onChangeText={setYear}
              placeholder="e.g. 2023"
              keyboardType="numeric"
              containerStyle={styles.halfInput}
            />
          </View>
          
          <Input
            label="Dimensions"
            value={dimensions}
            onChangeText={setDimensions}
            placeholder="e.g. 24 x 36 in"
          />
          
          <Input
            label="Notes"
            value={notes}
            onChangeText={setNotes}
            placeholder="Enter any additional notes about the artwork"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={{ height: 100 }}
          />
          
          {lists.length > 0 && (
            <View style={styles.listsContainer}>
              <Text style={styles.listsLabel}>Add to Lists:</Text>
              {lists.map((list) => (
                <TouchableOpacity
                  key={list.id}
                  style={[
                    styles.listItem,
                    selectedListIds.includes(list.id) && styles.listItemSelected,
                  ]}
                  onPress={() => toggleList(list.id)}
                >
                  <Text
                    style={[
                      styles.listItemText,
                      selectedListIds.includes(list.id) && styles.listItemTextSelected,
                    ]}
                  >
                    {list.name}
                  </Text>
                  {selectedListIds.includes(list.id) && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          <Button
            title="Save Artwork"
            onPress={handleSave}
            loading={isSubmitting}
            style={styles.saveButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  imageContainer: {
    height: 240,
    backgroundColor: Colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: Colors.gray[500],
  },
  form: {
    padding: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  listsContainer: {
    marginBottom: Spacing.md,
  },
  listsLabel: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: Colors.gray[700],
    marginBottom: Spacing.sm,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 8,
    marginBottom: Spacing.sm,
  },
  listItemSelected: {
    borderColor: Colors.primary[600],
    backgroundColor: Colors.primary[50],
  },
  listItemText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.text,
  },
  listItemTextSelected: {
    fontFamily: 'Inter_500Medium',
    color: Colors.primary[700],
  },
  checkmark: {
    fontSize: 16,
    color: Colors.primary[600],
    fontWeight: 'bold',
  },
  saveButton: {
    marginTop: Spacing.lg,
  },
});