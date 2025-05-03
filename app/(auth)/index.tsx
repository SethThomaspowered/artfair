import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '@/components/Button';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import { useAuth } from '@/hooks/useAuth';
import { StatusBar } from 'expo-status-bar';

export default function WelcomeScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.headerContainer}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg' }}
          style={styles.backgroundImage}
        />
        <View style={styles.overlay} />
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>ArtFolio</Text>
          <Text style={styles.tagline}>Collect what inspires you.</Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>
          Discover, Save, and Organize Art You Love
        </Text>
        <Text style={styles.description}>
          Create personalized collections of artwork from art fairs, galleries, and museums. Keep track of details and make decisions with ease.
        </Text>

        <View style={styles.buttonsContainer}>
          <Button
            title="Sign In"
            onPress={() => router.push('/(auth)/login')}
            style={styles.button}
          />
          <Button
            title="Create Account"
            onPress={() => router.push('/(auth)/register')}
            type="outline"
            style={styles.button}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    height: '50%',
    position: 'relative',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  logoContainer: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  logoText: {
    fontSize: 42,
    fontFamily: 'Inter_700Bold',
    color: Colors.background,
    marginBottom: Spacing.xs,
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.background,
    opacity: 0.9,
  },
  contentContainer: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: Colors.gray[600],
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  buttonsContainer: {
    marginTop: Spacing.md,
  },
  button: {
    marginBottom: Spacing.md,
  },
});