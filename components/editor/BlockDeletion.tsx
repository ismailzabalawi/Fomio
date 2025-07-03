import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Vibration,
  Platform,
  UIManager,
  LayoutAnimation
} from 'react-native';
import { useTheme } from '../../lib/theme/theme';
import { Block, useBlockEditor } from './BlockEditorComponents';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Block Deletion Handler Component
interface BlockDeletionHandlerProps {
  id: string;
  isSelected: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}

export const BlockDeletionHandler: React.FC<BlockDeletionHandlerProps> = ({
  id,
  isSelected,
  onSelect,
  children
}) => {
  const { theme } = useTheme();
  const { deleteBlock } = useBlockEditor();
  const [isLongPressed, setIsLongPressed] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;
  
  // Get colors based on theme
  const getColors = () => {
    switch (theme) {
      case 'light':
        return {
          selectedBorder: '#007AFF',
          deleteBorder: '#FF3B30',
          deleteButton: '#FF3B30',
          deleteButtonText: '#FFFFFF',
          background: '#FFFFFF',
        };
      case 'dark':
        return {
          selectedBorder: '#0A84FF',
          deleteBorder: '#FF453A',
          deleteButton: '#FF453A',
          deleteButtonText: '#FFFFFF',
          background: '#000000',
        };
      case 'reader':
        return {
          selectedBorder: '#2E2C28',
          deleteBorder: '#A13B38',
          deleteButton: '#A13B38',
          deleteButtonText: '#FAF4E6',
          background: '#FAF4E6',
        };
      default:
        return {
          selectedBorder: '#0A84FF',
          deleteBorder: '#FF453A',
          deleteButton: '#FF453A',
          deleteButtonText: '#FFFFFF',
          background: '#000000',
        };
    }
  };
  
  const colors = getColors();
  
  // Handle long press to initiate deletion
  const handleLongPress = () => {
    // Provide haptic feedback
    if (Platform.OS === 'ios') {
      // iOS supports different vibration patterns
      Vibration.vibrate([0, 50, 30, 100]);
    } else {
      // Android just needs a duration
      Vibration.vibrate(100);
    }
    
    setIsLongPressed(true);
    
    // Animate the border flash
    Animated.sequence([
      Animated.timing(borderAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(borderAnim, {
        toValue: 0.5,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(borderAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start(() => {
      // Show delete confirmation after animation
      setShowDeleteConfirm(true);
    });
    
    // Scale animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
  };
  
  // Handle block deletion with animation
  const handleDelete = () => {
    // Configure layout animation for smooth removal
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    // Fade out animation
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      // Delete the block after animation completes
      deleteBlock(id);
      
      // Reset states
      setIsLongPressed(false);
      setShowDeleteConfirm(false);
      fadeAnim.setValue(1);
      scaleAnim.setValue(1);
      borderAnim.setValue(0);
    });
  };
  
  // Handle cancellation of deletion
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setIsLongPressed(false);
    
    // Reset animations
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };
  
  // Interpolate border color based on animation value
  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.selectedBorder, colors.deleteBorder],
  });
  
  return (
    <Animated.View
      style={[
        styles.blockWrapper,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          if (showDeleteConfirm) {
            handleCancelDelete();
          } else {
            onSelect();
          }
        }}
        onLongPress={handleLongPress}
        delayLongPress={500}
        style={[
          styles.blockContainer,
          (isSelected || isLongPressed) && { 
            borderWidth: 1.5,
            borderColor: isLongPressed ? colors.deleteBorder : colors.selectedBorder 
          },
          isLongPressed && { 
            borderColor: borderColor as any,
          },
          { backgroundColor: colors.background }
        ]}
      >
        {children}
        
        {showDeleteConfirm && (
          <View style={styles.deleteConfirmContainer}>
            <TouchableOpacity
              style={[styles.deleteButton, { backgroundColor: colors.deleteButton }]}
              onPress={handleDelete}
            >
              <Text style={[styles.deleteButtonText, { color: colors.deleteButtonText }]}>
                Delete Block
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelDelete}
            >
              <Text style={{ color: colors.selectedBorder }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// Delete Indicator Component
interface DeleteIndicatorProps {
  visible: boolean;
}

export const DeleteIndicator: React.FC<DeleteIndicatorProps> = ({
  visible
}) => {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Get colors based on theme
  const getColors = () => {
    switch (theme) {
      case 'light':
        return {
          background: 'rgba(255, 59, 48, 0.1)',
          border: '#FF3B30',
          text: '#FF3B30',
        };
      case 'dark':
        return {
          background: 'rgba(255, 69, 58, 0.2)',
          border: '#FF453A',
          text: '#FF453A',
        };
      case 'reader':
        return {
          background: 'rgba(161, 59, 56, 0.1)',
          border: '#A13B38',
          text: '#A13B38',
        };
      default:
        return {
          background: 'rgba(255, 69, 58, 0.2)',
          border: '#FF453A',
          text: '#FF453A',
        };
    }
  };
  
  const colors = getColors();
  
  // Animate indicator visibility
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [visible, fadeAnim]);
  
  if (!visible) return null;
  
  return (
    <Animated.View 
      style={[
        styles.deleteIndicator,
        { 
          opacity: fadeAnim,
          backgroundColor: colors.background,
          borderColor: colors.border,
        }
      ]}
    >
      <Text style={[styles.deleteIndicatorText, { color: colors.text }]}>
        Long press to delete
      </Text>
    </Animated.View>
  );
};

// Delete Confirmation Dialog Component
interface DeleteConfirmationDialogProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  visible,
  onConfirm,
  onCancel
}) => {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  
  // Get colors based on theme
  const getColors = () => {
    switch (theme) {
      case 'light':
        return {
          background: '#FFFFFF',
          text: '#1C1C1E',
          border: '#E5E5EA',
          confirmButton: '#FF3B30',
          confirmText: '#FFFFFF',
          cancelButton: '#F2F2F7',
          cancelText: '#007AFF',
        };
      case 'dark':
        return {
          background: '#2C2C2E',
          text: '#F2F2F2',
          border: '#3C3C3E',
          confirmButton: '#FF453A',
          confirmText: '#FFFFFF',
          cancelButton: '#1C1C1E',
          cancelText: '#0A84FF',
        };
      case 'reader':
        return {
          background: '#FAF4E6',
          text: '#2E2C28',
          border: '#E5DBC0',
          confirmButton: '#A13B38',
          confirmText: '#FAF4E6',
          cancelButton: '#F5ECD7',
          cancelText: '#2E2C28',
        };
      default:
        return {
          background: '#2C2C2E',
          text: '#F2F2F2',
          border: '#3C3C3E',
          confirmButton: '#FF453A',
          confirmText: '#FFFFFF',
          cancelButton: '#1C1C1E',
          cancelText: '#0A84FF',
        };
    }
  };
  
  const colors = getColors();
  
  // Animate dialog visibility
  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: visible ? 1 : 0,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [visible, scaleAnim]);
  
  if (!visible) return null;
  
  return (
    <Animated.View 
      style={[
        styles.dialogOverlay,
        {
          opacity: scaleAnim,
          transform: [{ scale: scaleAnim }],
        }
      ]}
    >
      <View style={[
        styles.dialogContainer,
        { 
          backgroundColor: colors.background,
          borderColor: colors.border,
        }
      ]}>
        <Text style={[styles.dialogTitle, { color: colors.text }]}>
          Delete Block
        </Text>
        
        <Text style={[styles.dialogMessage, { color: colors.text }]}>
          Are you sure you want to delete this block? This action cannot be undone.
        </Text>
        
        <View style={styles.dialogButtons}>
          <TouchableOpacity
            style={[styles.dialogButton, { backgroundColor: colors.cancelButton }]}
            onPress={onCancel}
          >
            <Text style={[styles.dialogButtonText, { color: colors.cancelText }]}>
              Cancel
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.dialogButton, { backgroundColor: colors.confirmButton }]}
            onPress={onConfirm}
          >
            <Text style={[styles.dialogButtonText, { color: colors.confirmText }]}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  // Block wrapper styles
  blockWrapper: {
    marginVertical: 12,
  },
  blockContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    backgroundColor: '#1C1C1E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  
  // Delete confirmation styles
  deleteConfirmContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  deleteButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 8,
    width: '100%',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  
  // Delete indicator styles
  deleteIndicator: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  deleteIndicatorText: {
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Delete confirmation dialog styles
  dialogOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  dialogContainer: {
    width: '80%',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  dialogMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  dialogButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  dialogButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  dialogButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
