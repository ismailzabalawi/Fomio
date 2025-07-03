import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';
import * as FileSystem from 'expo-file-system';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../lib/theme/theme';

// Media Picker Component for Images and Videos
interface MediaPickerProps {
  onMediaSelected: (uri: string, type: 'image' | 'video', thumbnail?: string) => void;
  onError: (error: string) => void;
  isLoading: boolean;
}

export const MediaPicker: React.FC<MediaPickerProps> = ({
  onMediaSelected,
  onError,
  isLoading
}) => {
  const { theme } = useTheme();
  
  // Get colors based on theme
  const getColors = () => {
    switch (theme) {
      case 'light':
        return {
          background: '#F2F2F7',
          text: '#1C1C1E',
          buttonBackground: '#FFFFFF',
          buttonBorder: '#E5E5EA',
          buttonText: '#007AFF',
          loadingBackground: 'rgba(255, 255, 255, 0.8)',
        };
      case 'dark':
        return {
          background: '#1C1C1E',
          text: '#F2F2F2',
          buttonBackground: '#2C2C2E',
          buttonBorder: '#3C3C3E',
          buttonText: '#0A84FF',
          loadingBackground: 'rgba(0, 0, 0, 0.8)',
        };
      case 'reader':
        return {
          background: '#F5ECD7',
          text: '#2E2C28',
          buttonBackground: '#FAF4E6',
          buttonBorder: '#E5DBC0',
          buttonText: '#2E2C28',
          loadingBackground: 'rgba(250, 244, 230, 0.8)',
        };
      default:
        return {
          background: '#1C1C1E',
          text: '#F2F2F2',
          buttonBackground: '#2C2C2E',
          buttonBorder: '#3C3C3E',
          buttonText: '#0A84FF',
          loadingBackground: 'rgba(0, 0, 0, 0.8)',
        };
    }
  };
  
  const colors = getColors();
  
  // Request permissions for media library
  const requestMediaLibraryPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      onError('Permission to access media library is required!');
      return false;
    }
    return true;
  };
  
  // Request permissions for camera
  const requestCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      onError('Permission to access camera is required!');
      return false;
    }
    return true;
  };
  
  // Pick image from library
  const pickImage = async () => {
    const hasPermission = await requestMediaLibraryPermissions();
    if (!hasPermission) return;
    
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        allowsMultipleSelection: false,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        
        // Check file size (limit to 10MB)
        const fileInfo = await FileSystem.getInfoAsync(asset.uri);
        if (fileInfo.exists && 'size' in fileInfo && fileInfo.size > 10 * 1024 * 1024) {
          onError('Image size exceeds 10MB limit. Please choose a smaller image.');
          return;
        }
        
        onMediaSelected(asset.uri, 'image');
      }
    } catch (error) {
      onError(`Error picking image: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  // Take photo with camera
  const takePhoto = async () => {
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) return;
    
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        onMediaSelected(result.assets[0].uri, 'image');
      }
    } catch (error) {
      onError(`Error taking photo: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  // Pick video from library
  const pickVideo = async () => {
    const hasPermission = await requestMediaLibraryPermissions();
    if (!hasPermission) return;
    
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
        videoMaxDuration: 60, // Limit to 60 seconds
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        
        // Check file size (limit to 50MB)
        const fileInfo = await FileSystem.getInfoAsync(asset.uri);
        if (fileInfo.exists && 'size' in fileInfo && fileInfo.size > 50 * 1024 * 1024) {
          onError('Video size exceeds 50MB limit. Please choose a smaller video.');
          return;
        }
        
        // Generate thumbnail
        try {
          const { uri } = await VideoThumbnails.getThumbnailAsync(asset.uri, {
            time: 0,
            quality: 0.7,
          });
          
          onMediaSelected(asset.uri, 'video', uri);
        } catch (thumbnailError) {
          // If thumbnail generation fails, still use the video but without thumbnail
          onMediaSelected(asset.uri, 'video');
          console.warn('Could not generate video thumbnail:', thumbnailError);
        }
      }
    } catch (error) {
      onError(`Error picking video: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  // Record video with camera
  const recordVideo = async () => {
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) return;
    
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
        videoMaxDuration: 60, // Limit to 60 seconds
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        
        // Generate thumbnail
        try {
          const { uri } = await VideoThumbnails.getThumbnailAsync(asset.uri, {
            time: 0,
            quality: 0.7,
          });
          
          onMediaSelected(asset.uri, 'video', uri);
        } catch (thumbnailError) {
          // If thumbnail generation fails, still use the video but without thumbnail
          onMediaSelected(asset.uri, 'video');
          console.warn('Could not generate video thumbnail:', thumbnailError);
        }
      }
    } catch (error) {
      onError(`Error recording video: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          accessibilityLabel="Pick an image from gallery"
          accessibilityRole="button"
          activeOpacity={0.7}
          style={[
            styles.button,
            { 
              backgroundColor: colors.buttonBackground,
              borderColor: colors.buttonBorder,
            }
          ]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            pickImage();
          }}
          disabled={isLoading}
        >
          <Text style={[styles.buttonIcon, { color: colors.buttonText }]}>🖼️</Text>
          <Text style={[styles.buttonText, { color: colors.text }]}>Gallery</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          accessibilityLabel="Take a photo with camera"
          accessibilityRole="button"
          activeOpacity={0.7}
          style={[
            styles.button,
            { 
              backgroundColor: colors.buttonBackground,
              borderColor: colors.buttonBorder,
            }
          ]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            takePhoto();
          }}
          disabled={isLoading}
        >
          <Text style={[styles.buttonIcon, { color: colors.buttonText }]}>📷</Text>
          <Text style={[styles.buttonText, { color: colors.text }]}>Camera</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity
          accessibilityLabel="Pick a video from library"
          accessibilityRole="button"
          activeOpacity={0.7}
          style={[
            styles.button,
            { 
              backgroundColor: colors.buttonBackground,
              borderColor: colors.buttonBorder,
            }
          ]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            pickVideo();
          }}
          disabled={isLoading}
        >
          <Text style={[styles.buttonIcon, { color: colors.buttonText }]}>🎬</Text>
          <Text style={[styles.buttonText, { color: colors.text }]}>Video</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          accessibilityLabel="Record a video with camera"
          accessibilityRole="button"
          activeOpacity={0.7}
          style={[
            styles.button,
            { 
              backgroundColor: colors.buttonBackground,
              borderColor: colors.buttonBorder,
            }
          ]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            recordVideo();
          }}
          disabled={isLoading}
        >
          <Text style={[styles.buttonIcon, { color: colors.buttonText }]}>🎥</Text>
          <Text style={[styles.buttonText, { color: colors.text }]}>Record</Text>
        </TouchableOpacity>
      </View>
      
      {isLoading && (
        <View style={[styles.loadingOverlay, { backgroundColor: colors.loadingBackground }]}>
          <ActivityIndicator size="large" color={colors.buttonText} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Processing media...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 8,
  },
  buttonIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
});
