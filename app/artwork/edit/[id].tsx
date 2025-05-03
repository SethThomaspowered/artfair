import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useArtwork } from '@/hooks/useArtwork';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { ChevronLeft } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

export default function EditArtworkScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { artworks, lists, updateArtwork } = useArtwork();
  const router = useRouter();
  
  const artwork = artworks.find((a) => a.id === id);
  
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [gallery, setGallery] = useState('');
  const [price, setPrice] = useState('');
  const [medium, setMedium] = useState('');
  const [year, setYear] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [selectedListIds, setSelectedListIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (artwork) {
      setTitle(artwork.title);
      setArtist(artwork.artist);
      setGallery(artwork.gallery);
      setPrice(artwork.price);
      setMedium(artwork.medium);
      setYear(artwork.year);
      setDimensions(artwork.dimensions);
      setNotes(artwork.notes);
      setImageUri(artwork.imageUri);
      setSelectedListIds(artwork.listIds);
    }
  }, [artwork]);
  
  if (!artwork) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Artwork not found</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }
  
  const handleSave = async () => {
    if (!title || !artist) {
      Alert.alert('Required Fields', 'Please enter at least the title and artist name.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      updateArtwork(artwork.id, {
        title,
        artist,
        gallery,
        price,
        medium,
        year,
        dimensions,
        notes,
        imageUri,
        listIds: selectedListIds,
      });
      
      Alert.alert(
        'Artwork Updated',
        'Your changes have been saved.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error updating artwork:', error);
      Alert.alert('Error', 'Failed to update artwork');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleChangeImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });
      
      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Failed to select image');
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
          title: 'Edit Artwork',
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
          <TouchableOpacity
            style={styles.changeImageButton}
            onPress={handleChangeImage}
          >
            <Text style={styles.changeImageText}>Change Image</Text>
          </TouchableOpacity>
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
            title="Save Changes"
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
    position: 'relative',
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
  changeImageButton: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: 16,
  },
  changeImageText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: Colors.background,
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