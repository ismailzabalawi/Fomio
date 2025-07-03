import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, Dimensions, ActivityIndicator, TextInput, Pressable } from 'react-native';
import { Video, AVPlaybackStatus, ResizeMode } from 'expo-av';
import { useTheme } from '../../lib/theme/theme';
import { Block, BlockType, useBlockEditor } from './BlockEditorComponents';
import { MediaPicker } from './MediaPicker';

// Video Block Component
interface VideoBlockProps {
  id: string;
  src: string | null;
  thumbnail: string | null;
  caption: string;
  onChangeSrc: (src: string) => void;
  onChangeThumbnail: (thumbnail: string) => void;
  onChangeCaption: (caption: string) => void;
  isSelected: boolean;
  onSelect: () => void;
}

export const VideoBlock: React.FC<VideoBlockProps> = ({
  id,
  src,
  thumbnail,
  caption,
  onChangeSrc,
  onChangeThumbnail,
  onChangeCaption,
  isSelected,
  onSelect
}) => {
  const { theme } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const screenWidth = Dimensions.get('window').width;
  const videoRef = React.useRef<Video>(null);
  
  // Get colors based on theme
  const getColors = () => {
    switch (theme) {
      case 'light':
        return {
          text: '#1C1C1E',
          placeholder: '#8E8E93',
          background: '#FFFFFF',
          border: '#E5E5EA',
          shadow: 'rgba(0, 0, 0, 0.1)',
          videoPlaceholder: '#E5E5EA',
          videoPlaceholderIcon: '#8E8E93',
          playButton: 'rgba(255, 255, 255, 0.8)',
          playButtonIcon: '#007AFF',
          captionBackground: 'rgba(255, 255, 255, 0.8)',
          captionText: '#1C1C1E',
          errorText: '#FF3B30',
        };
      case 'dark':
        return {
          text: '#F2F2F2',
          placeholder: '#8E8E93',
          background: '#000000',
          border: '#2C2C2E',
          shadow: 'rgba(0, 0, 0, 0.3)',
          videoPlaceholder: '#2C2C2E',
          videoPlaceholderIcon: '#8E8E93',
          playButton: 'rgba(0, 0, 0, 0.6)',
          playButtonIcon: '#0A84FF',
          captionBackground: 'rgba(0, 0, 0, 0.7)',
          captionText: '#F2F2F2',
          errorText: '#FF453A',
        };
      case 'reader':
        return {
          text: '#2E2C28',
          placeholder: '#6C6A67',
          background: '#FAF4E6',
          border: '#E5DBC0',
          shadow: 'rgba(46, 44, 40, 0.1)',
          videoPlaceholder: '#E5DBC0',
          videoPlaceholderIcon: '#6C6A67',
          playButton: 'rgba(250, 244, 230, 0.8)',
          playButtonIcon: '#2E2C28',
          captionBackground: 'rgba(250, 244, 230, 0.8)',
          captionText: '#2E2C28',
          errorText: '#A13B38',
        };
      default:
        return {
          text: '#F2F2F2',
          placeholder: '#8E8E93',
          background: '#000000',
          border: '#2C2C2E',
          shadow: 'rgba(0, 0, 0, 0.3)',
          videoPlaceholder: '#2C2C2E',
          videoPlaceholderIcon: '#8E8E93',
          playButton: 'rgba(0, 0, 0, 0.6)',
          playButtonIcon: '#0A84FF',
          captionBackground: 'rgba(0, 0, 0, 0.7)',
          captionText: '#F2F2F2',
          errorText: '#FF453A',
        };
    }
  };
  
  const colors = getColors();
  
  // Handle media selection
  const handleMediaSelected = (uri: string, type: 'image' | 'video', thumbnailUri?: string) => {
    if (type === 'video') {
      onChangeSrc(uri);
      if (thumbnailUri) {
        onChangeThumbnail(thumbnailUri);
      }
      setShowMediaPicker(false);
      setIsLoading(false);
    } else {
      setError('Please select a video file');
      setIsLoading(false);
    }
  };
  
  // Handle media picker error
  const handleMediaError = (errorMessage: string) => {
    setError(errorMessage);
    setIsLoading(false);
  };
  
  // Toggle video playback
  const togglePlayback = async () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Handle video playback status update
  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      if (status.didJustFinish) {
        videoRef.current?.setPositionAsync(0);
      }
    }
  };
  
  return (
    <View style={[
      styles.videoBlockContainer,
      { 
        backgroundColor: colors.background,
        borderColor: colors.border,
        shadowColor: colors.shadow,
      }
    ]}>
      {src ? (
        <View style={styles.videoWrapper}>
          <Video
            ref={videoRef}
            source={{ uri: src }}
            style={styles.video}
            resizeMode={ResizeMode.COVER}
            isLooping
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          />
          
          {!isPlaying && (
            <TouchableOpacity 
              style={[styles.playButton, { backgroundColor: colors.playButton }]}
              onPress={togglePlayback}
            >
              <Text style={[styles.playButtonIcon, { color: colors.playButtonIcon }]}>▶</Text>
            </TouchableOpacity>
          )}
          
          {caption && (
            <View style={[styles.captionOverlay, { backgroundColor: colors.captionBackground }]}>
              <Text style={[styles.captionText, { color: colors.captionText }]} numberOfLines={2}>
                {caption}
              </Text>
            </View>
          )}
        </View>
      ) : thumbnail ? (
        <TouchableOpacity onPress={() => setShowMediaPicker(true)} style={styles.thumbnailWrapper}>
          <Image
            source={{ uri: thumbnail }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
          <View style={[styles.playButton, { backgroundColor: colors.playButton }]}>
            <Text style={[styles.playButtonIcon, { color: colors.playButtonIcon }]}>▶</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          onPress={() => setShowMediaPicker(true)}
          style={[
            styles.videoPlaceholder,
            { backgroundColor: colors.videoPlaceholder }
          ]}
        >
          <Text style={[
            styles.videoPlaceholderIcon,
            { color: colors.videoPlaceholderIcon }
          ]}>
            🎬
          </Text>
          <Text style={[
            styles.videoPlaceholderText,
            { color: colors.videoPlaceholderIcon }
          ]}>
            Tap to add video
          </Text>
        </TouchableOpacity>
      )}
      
      {error && (
        <Text style={[styles.errorText, { color: colors.errorText }]}>
          {error}
        </Text>
      )}
      
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.playButtonIcon} />
        </View>
      )}
      
      <Modal
        visible={showMediaPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMediaPicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[
            styles.modalContent,
            { backgroundColor: colors.background }
          ]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Select Video
              </Text>
              <TouchableOpacity onPress={() => setShowMediaPicker(false)}>
                <Text style={[styles.closeButton, { color: colors.text }]}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <MediaPicker
              onMediaSelected={handleMediaSelected}
              onError={handleMediaError}
              isLoading={isLoading}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Enhanced Image Block Component with Live Media Support
interface EnhancedImageBlockProps {
  id: string;
  src: string | null;
  alt: string;
  onChangeSrc: (src: string) => void;
  onChangeAlt: (alt: string) => void;
  isSelected: boolean;
  onSelect: () => void;
}

export const EnhancedImageBlock: React.FC<EnhancedImageBlockProps> = ({
  id,
  src,
  alt,
  onChangeSrc,
  onChangeAlt,
  isSelected,
  onSelect
}) => {
  const { theme } = useTheme();
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const screenWidth = Dimensions.get('window').width;
  const [showAltModal, setShowAltModal] = useState(false);
  const [tempAlt, setTempAlt] = useState(alt);
  
  // Get colors based on theme
  const getColors = () => {
    switch (theme) {
      case 'light':
        return {
          text: '#1C1C1E',
          placeholder: '#8E8E93',
          imagePlaceholder: '#E5E5EA',
          imagePlaceholderIcon: '#8E8E93',
          background: '#FFFFFF',
          border: '#E5E5EA',
          shadow: 'rgba(0, 0, 0, 0.1)',
          errorText: '#FF3B30',
          modalBackground: '#FFFFFF',
          modalOverlay: 'rgba(0, 0, 0, 0.5)',
          buttonBackground: '#007AFF',
          buttonText: '#FFFFFF',
          inputBackground: '#F2F2F7',
          placeholderText: '#8E8E93',
        };
      case 'dark':
        return {
          text: '#F2F2F2',
          placeholder: '#8E8E93',
          imagePlaceholder: '#2C2C2E',
          imagePlaceholderIcon: '#8E8E93',
          background: '#000000',
          border: '#2C2C2E',
          shadow: 'rgba(0, 0, 0, 0.3)',
          errorText: '#FF453A',
          modalBackground: '#1C1C1E',
          modalOverlay: 'rgba(0, 0, 0, 0.7)',
          buttonBackground: '#0A84FF',
          buttonText: '#FFFFFF',
          inputBackground: '#2C2C2E',
          placeholderText: '#8E8E93',
        };
      case 'reader':
        return {
          text: '#2E2C28',
          placeholder: '#6C6A67',
          imagePlaceholder: '#E5DBC0',
          imagePlaceholderIcon: '#6C6A67',
          background: '#FAF4E6',
          border: '#E5DBC0',
          shadow: 'rgba(46, 44, 40, 0.1)',
          errorText: '#A13B38',
          modalBackground: '#FAF4E6',
          modalOverlay: 'rgba(0, 0, 0, 0.5)',
          buttonBackground: '#007AFF',
          buttonText: '#FFFFFF',
          inputBackground: '#F2F2F7',
          placeholderText: '#8E8E93',
        };
      default:
        return {
          text: '#F2F2F2',
          placeholder: '#8E8E93',
          imagePlaceholder: '#2C2C2E',
          imagePlaceholderIcon: '#8E8E93',
          background: '#000000',
          border: '#2C2C2E',
          shadow: 'rgba(0, 0, 0, 0.3)',
          errorText: '#FF453A',
          modalBackground: '#1C1C1E',
          modalOverlay: 'rgba(0, 0, 0, 0.7)',
          buttonBackground: '#0A84FF',
          buttonText: '#FFFFFF',
          inputBackground: '#2C2C2E',
          placeholderText: '#8E8E93',
        };
    }
  };
  
  const colors = getColors();
  
  // Handle media selection
  const handleMediaSelected = (uri: string, type: 'image' | 'video') => {
    if (type === 'image') {
      onChangeSrc(uri);
      setShowMediaPicker(false);
      setIsLoading(false);
    } else {
      setError('Please select an image file');
      setIsLoading(false);
    }
  };
  
  // Handle media picker error
  const handleMediaError = (errorMessage: string) => {
    setError(errorMessage);
    setIsLoading(false);
  };
  
  const handleEditAlt = () => {
    setTempAlt(alt);
    setShowAltModal(true);
  };

  const handleSaveAlt = () => {
    onChangeAlt(tempAlt);
    setShowAltModal(false);
  };
  
  return (
    <View style={[
      styles.imageBlockContainer,
      { 
        backgroundColor: colors.background,
        borderColor: colors.border,
        shadowColor: colors.shadow,
      }
    ]}>
      {src ? (
        <TouchableOpacity 
          onPress={handleEditAlt} 
          style={styles.imageWrapper}
          accessibilityLabel="Edit alt text"
          accessibilityRole="button"
        >
          <Image
            source={{ uri: src }}
            style={styles.blockImage}
            resizeMode="cover"
            accessibilityLabel={alt}
          />
          {alt && (
            <Text style={[styles.imageAltBadgeText, { color: colors.text }]}>
              Alt: {alt}
            </Text>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          onPress={() => setShowMediaPicker(true)}
          style={[
            styles.imagePlaceholder,
            { backgroundColor: colors.imagePlaceholder }
          ]}
          accessibilityLabel="Add image"
          accessibilityRole="button"
        >
          <Text style={[
            styles.imagePlaceholderIcon,
            { color: colors.imagePlaceholderIcon }
          ]}>
            🖼️
          </Text>
          <Text style={[
            styles.imagePlaceholderText,
            { color: colors.imagePlaceholderIcon }
          ]}>
            Tap to add image
          </Text>
        </TouchableOpacity>
      )}
      
      {error && (
        <Text style={[styles.errorText, { color: colors.errorText }]}>
          {error}
        </Text>
      )}
      
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.text} />
        </View>
      )}
      
      <Modal
        visible={showMediaPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMediaPicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[
            styles.modalContent,
            { backgroundColor: colors.background }
          ]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Select Image
              </Text>
              <TouchableOpacity 
                onPress={() => setShowMediaPicker(false)}
                accessibilityLabel="Close image picker"
                accessibilityRole="button"
              >
                <Text style={[styles.closeButton, { color: colors.text }]}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <MediaPicker
              onMediaSelected={handleMediaSelected}
              onError={handleMediaError}
              isLoading={isLoading}
            />
          </View>
        </View>
      </Modal>
      
      <Modal
        visible={showAltModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAltModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.modalOverlay }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.modalBackground }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Edit Alt Text
            </Text>
            <TextInput
              value={tempAlt}
              onChangeText={setTempAlt}
              placeholder="Describe this image"
              placeholderTextColor={colors.placeholderText}
              style={[
                styles.modalInput,
                {
                  backgroundColor: colors.inputBackground,
                  color: colors.text,
                  borderColor: colors.border,
                }
              ]}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.buttonBackground }]}
                onPress={handleSaveAlt}
                accessibilityLabel="Save alt text"
                accessibilityRole="button"
              >
                <Text style={[styles.modalButtonText, { color: colors.buttonText }]}>
                  Save
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: 'transparent' }]}
                onPress={() => setShowAltModal(false)}
                accessibilityLabel="Cancel alt text editing"
                accessibilityRole="button"
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // Video block styles
  videoBlockContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 8,
  },
  videoWrapper: {
    position: 'relative',
    height: 200,
  },
  video: {
    width: '100%',
    height: 200,
  },
  thumbnailWrapper: {
    position: 'relative',
    height: 200,
  },
  thumbnail: {
    width: '100%',
    height: 200,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -30 }, { translateY: -30 }],
  },
  playButtonIcon: {
    fontSize: 24,
    marginLeft: 4,
  },
  captionOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
  },
  captionText: {
    fontSize: 14,
  },
  videoPlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholderIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  videoPlaceholderText: {
    fontSize: 16,
  },
  
  // Enhanced image block styles
  imageBlockContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 8,
  },
  imageWrapper: {
    position: 'relative',
  },
  blockImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  imageAltBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    opacity: 0.8,
  },
  imageAltBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  imagePlaceholderText: {
    fontSize: 16,
  },
  imageAltContainer: {
    padding: 12,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  imageAltLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  altTextButton: {
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  altTextButtonText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  
  // Common styles
  errorText: {
    fontSize: 14,
    padding: 8,
    textAlign: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    fontSize: 20,
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    minHeight: 100,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
