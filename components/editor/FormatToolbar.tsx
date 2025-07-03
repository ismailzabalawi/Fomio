import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  ScrollView,
  TextInput,
  Animated,
  Dimensions,
  Platform
} from 'react-native';
import { Keyboard, useWindowDimensions } from 'react-native';
import { useTheme } from '../../lib/theme/theme';
import * as Haptics from 'expo-haptics';
import { useBlockEditor } from './BlockEditorComponents';
import { 
  TextB, 
  TextItalic, 
  TextUnderline, 
  TextStrikethrough, 
  TextHOne, 
  TextHTwo, 
  TextHThree, 
  ListBullets, 
  ListNumbers, 
  Quotes, 
  Code, 
  Link, 
  Palette 
} from 'phosphor-react-native';

// Get colors based on theme
function getColors(theme: string) {
  switch (theme) {
    case 'light':
      return {
        background: '#F2F2F7',
        toolbarBackground: '#FFFFFF',
        text: '#1C1C1E',
        border: '#E5E5EA',
        activeBackground: '#007AFF',
        activeText: '#FFFFFF',
        inactiveBackground: 'transparent',
        inactiveText: '#1C1C1E',
        modalBackground: '#FFFFFF',
        inputBackground: '#F2F2F7',
        placeholderText: '#8E8E93',
        buttonBackground: '#007AFF',
        buttonText: '#FFFFFF',
      };
    case 'dark':
      return {
        background: '#1C1C1E',
        toolbarBackground: '#2C2C2E',
        text: '#F2F2F2',
        border: '#3C3C3E',
        activeBackground: '#0A84FF',
        activeText: '#FFFFFF',
        inactiveBackground: 'transparent',
        inactiveText: '#F2F2F2',
        modalBackground: '#2C2C2E',
        inputBackground: '#1C1C1E',
        placeholderText: '#8E8E93',
        buttonBackground: '#0A84FF',
        buttonText: '#FFFFFF',
      };
    case 'reader':
      return {
        background: '#F5ECD7',
        toolbarBackground: '#FAF4E6',
        text: '#2E2C28',
        border: '#E5DBC0',
        activeBackground: '#2E2C28',
        activeText: '#FAF4E6',
        inactiveBackground: 'transparent',
        inactiveText: '#2E2C28',
        modalBackground: '#FAF4E6',
        inputBackground: '#F5ECD7',
        placeholderText: '#6C6A67',
        buttonBackground: '#2E2C28',
        buttonText: '#FAF4E6',
      };
    default:
      return {
        background: '#1C1C1E',
        toolbarBackground: '#2C2C2E',
        text: '#F2F2F2',
        border: '#3C3C3E',
        activeBackground: '#0A84FF',
        activeText: '#FFFFFF',
        inactiveBackground: 'transparent',
        inactiveText: '#F2F2F2',
        modalBackground: '#2C2C2E',
        inputBackground: '#1C1C1E',
        placeholderText: '#8E8E93',
        buttonBackground: '#0A84FF',
        buttonText: '#FFFFFF',
      };
  }
}

// Text Formatting Options
export type FormatOption = 
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'link'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'quote'
  | 'code'
  | 'bulletList'
  | 'numberedList';

// Format Toolbar Component
interface FormatToolbarProps {
  selectedFormat?: string | null;
  onClose?: () => void;
  onFormatApply?: (format: FormatOption) => void;
  activeFormats?: FormatOption[];
  onLinkAdd?: (url: string, text: string) => void;
  onColorSelect?: (color: string) => void;
  visible?: boolean;
}

const FormatToolbar: React.FC<FormatToolbarProps> = ({
  selectedFormat,
  onClose,
  onFormatApply,
  activeFormats = [],
  onLinkAdd,
  onColorSelect,
  visible = true
}) => {
  const { theme } = useTheme();
  const { updateBlock, selectedBlockId, blocks } = useBlockEditor();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const translateY = useRef(new Animated.Value(100)).current;
  const { height: screenHeight } = useWindowDimensions();

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
      Animated.timing(translateY, {
        toValue: 100,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const colors = getColors(theme);
  const [isVisible, setIsVisible] = useState(visible);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [selectedColor, setSelectedColor] = useState('#000000');

  // Handle format application
  const handleFormatApply = (format: FormatOption) => {
    if (onFormatApply) {
      onFormatApply(format);
    } else if (selectedBlockId) {
      // Apply format to selected block if no custom handler
      const currentBlock = blocks.find(block => block.id === selectedBlockId);
      if (currentBlock) {
        updateBlock(selectedBlockId, {
          attributes: {
            ...(currentBlock.attributes || {}),
            format: format
          }
        });
      }
    }
    
    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Set initial format if provided
  useEffect(() => {
    if (selectedFormat && isVisible) {
      handleFormatApply(selectedFormat as FormatOption);
    }
  }, [selectedFormat, isVisible]);

  // Format button component
  const FormatButton = ({ format, icon, label }: { format: FormatOption, icon: React.ReactNode, label?: string }) => {
    const isActive = activeFormats.includes(format) || selectedFormat === format;
    
    return (
      <TouchableOpacity
        accessibilityLabel={label || format}
        accessibilityRole="button"
        style={[
          styles.formatButton,
          { 
            backgroundColor: isActive ? colors.activeBackground : colors.inactiveBackground,
            borderColor: colors.border,
          }
        ]}
        onPress={() => handleFormatApply(format)}
      >
        {icon}
        {label && (
          <Text style={[
            styles.formatButtonLabel,
            { color: isActive ? colors.activeText : colors.inactiveText }
          ]}>
            {label}
          </Text>
        )}
      </TouchableOpacity>
    );
  };
  
  // Handle link submission
  const handleLinkSubmit = () => {
    if (onLinkAdd && linkUrl) {
      onLinkAdd(linkUrl, linkText || linkUrl);
      setLinkUrl('');
      setLinkText('');
      setShowLinkModal(false);
    } else if (selectedBlockId) {
      // Apply link to selected block if no custom handler
      const currentBlock = blocks.find(block => block.id === selectedBlockId);
      if (currentBlock) {
        updateBlock(selectedBlockId, {
          attributes: {
            ...(currentBlock.attributes || {}),
            link: {
              url: linkUrl,
              text: linkText || linkUrl
            }
          }
        });
        setLinkUrl('');
        setLinkText('');
        setShowLinkModal(false);
      }
    }
  };
  
  // Color picker component
  const ColorPicker = () => {
    const colors = [
      '#000000', '#FF3B30', '#FF9500', '#FFCC00', 
      '#4CD964', '#5AC8FA', '#007AFF', '#5856D6', 
      '#FF2D55', '#8E8E93', '#FFFFFF'
    ];
    
    return (
      <View style={styles.colorPickerContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.colorGrid}>
            {colors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorSwatch,
                  { backgroundColor: color },
                  color === '#FFFFFF' && { borderWidth: 1, borderColor: '#E5E5EA' }
                ]}
                onPress={() => {
                  if (onColorSelect) {
                    onColorSelect(color);
                    setShowColorPicker(false);
                  } else if (selectedBlockId) {
                    // Apply color to selected block if no custom handler
                    const currentBlock = blocks.find(block => block.id === selectedBlockId);
                    if (currentBlock) {
                      updateBlock(selectedBlockId, {
                        attributes: {
                          ...(currentBlock.attributes || {}),
                          textColor: color
                        }
                      });
                      setShowColorPicker(false);
                    }
                  }
                }}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };
  
  useEffect(() => {
    if (visible) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [visible]);
  
  if (!isVisible) return null;
  
  const currentBlock = blocks.find(b => b.id === selectedBlockId);
  const isTextBlock = ['paragraph', 'heading', 'quote', 'list'].includes(currentBlock?.type || '');
  
  if (!isTextBlock || !isVisible) return null;
  
  // Determine which toolbar to show based on selected format
  const renderToolbarContent = () => {
    // If a specific format is selected, show relevant options
    if (selectedFormat) {
      switch (selectedFormat) {
        case 'link':
          return (
            <View style={styles.toolbarContent}>
              <TouchableOpacity
                style={[styles.formatButton, { backgroundColor: colors.inactiveBackground }]}
                onPress={() => setShowLinkModal(true)}
              >
                <Text style={[styles.formatButtonIcon, { color: colors.inactiveText }]}>🔗</Text>
                <Text style={[styles.formatButtonLabel, { color: colors.inactiveText }]}>Add Link</Text>
              </TouchableOpacity>
            </View>
          );
        case 'bold':
        case 'italic':
        case 'underline':
        case 'strikethrough':
          return (
            <View style={styles.toolbarContent}>
              <FormatButton format={selectedFormat as FormatOption} icon={selectedFormat.charAt(0).toUpperCase()} label={selectedFormat} />
            </View>
          );
        default:
          // Default to showing all options
          return renderDefaultToolbar();
      }
    }
    
    // Default toolbar with all options
    return renderDefaultToolbar();
  };
  
  // Default toolbar with all formatting options
  const renderDefaultToolbar = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.toolbarContent}
    >
      <View style={styles.groupContainer}>
        <FormatButton format="bold" icon={<TextB size={20} color={colors.text} weight="regular" />} />
        <FormatButton format="italic" icon={<TextItalic size={20} color={colors.text} weight="regular" />} />
        <FormatButton format="underline" icon={<TextUnderline size={20} color={colors.text} weight="regular" />} />
        <FormatButton format="strikethrough" icon={<TextStrikethrough size={20} color={colors.text} weight="regular" />} />
      </View>

      <View style={styles.groupContainer}>
        <FormatButton format="heading1" icon={<TextHOne size={20} color={colors.text} weight="regular" />} />
        <FormatButton format="heading2" icon={<TextHTwo size={20} color={colors.text} weight="regular" />} />
        <FormatButton format="heading3" icon={<TextHThree size={20} color={colors.text} weight="regular" />} />
      </View>

      <View style={styles.groupContainer}>
        <FormatButton format="bulletList" icon={<ListBullets size={20} color={colors.text} weight="regular" />} />
        <FormatButton format="numberedList" icon={<ListNumbers size={20} color={colors.text} weight="regular" />} />
      </View>

      <View style={styles.groupContainer}>
        <FormatButton format="quote" icon={<Quotes size={20} color={colors.text} weight="regular" />} />
        <FormatButton format="code" icon={<Code size={20} color={colors.text} weight="regular" />} />

        <TouchableOpacity
          accessibilityLabel="Insert Link"
          accessibilityRole="button"
          style={[
            styles.formatButton,
            { backgroundColor: colors.inactiveBackground, borderColor: colors.border },
          ]}
          onPress={() => {
            Haptics.selectionAsync();
            setShowLinkModal(true);
          }}
        >
          <Link size={20} color={colors.text} weight="regular" />
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityLabel="Open color picker"
          accessibilityRole="button"
          style={[
            styles.formatButton,
            { backgroundColor: colors.inactiveBackground, borderColor: colors.border },
          ]}
          onPress={() => {
            Haptics.selectionAsync();
            setShowColorPicker(!showColorPicker);
          }}
        >
          <Palette size={20} color={colors.text} weight="regular" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
  
  return (
    <Animated.View
      style={[
        styles.floatingToolbarWrapper,
        {
          transform: [{ translateY }],
          bottom: keyboardHeight > 0 ? keyboardHeight - 56 : 0,
          height: 56,
          backgroundColor: colors.toolbarBackground,
        }
      ]}
    >
      <View style={[styles.toolbarContainer, { backgroundColor: colors.toolbarBackground }]}>
        <View style={styles.toolbarHeader}>
          <Text style={[styles.toolbarTitle, { color: colors.text }]}>
            Format
          </Text>
          {onClose && (
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={[styles.closeButtonText, { color: colors.text }]}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {renderToolbarContent()}
        
        {showColorPicker && <ColorPicker />}
        
        <Modal
          visible={showLinkModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowLinkModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[
              styles.modalContent,
              { 
                backgroundColor: colors.modalBackground,
                borderColor: colors.border,
              }
            ]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Add Link
              </Text>
              
              <TextInput
                value={linkUrl}
                onChangeText={setLinkUrl}
                placeholder="https://example.com"
                placeholderTextColor={colors.placeholderText}
                style={[
                  styles.modalInput,
                  { 
                    backgroundColor: colors.inputBackground,
                    color: colors.text,
                    borderColor: colors.border,
                  }
                ]}
                autoCapitalize="none"
                keyboardType="url"
              />
              
              <TextInput
                value={linkText}
                onChangeText={setLinkText}
                placeholder="Link text (optional)"
                placeholderTextColor={colors.placeholderText}
                style={[
                  styles.modalInput,
                  { 
                    backgroundColor: colors.inputBackground,
                    color: colors.text,
                    borderColor: colors.border,
                  }
                ]}
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: colors.buttonBackground }]}
                  onPress={handleLinkSubmit}
                >
                  <Text style={[styles.modalButtonText, { color: colors.buttonText }]}>
                    Add Link
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.modalButton, 
                    { 
                      backgroundColor: 'transparent',
                      borderWidth: 1,
                      borderColor: colors.border,
                    }
                  ]}
                  onPress={() => setShowLinkModal(false)}
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
    </Animated.View>
  );
};

// Styles
const styles = StyleSheet.create({
  floatingToolbarWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'transparent',
  },
  toolbarContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  toolbarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  toolbarTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  toolbarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  groupContainer: {
    flexDirection: 'row',
    marginRight: 16,
  },
  formatButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 2,
    borderWidth: 1,
  },
  formatButtonIcon: {
    fontSize: 16,
    fontWeight: '600',
  },
  formatButtonLabel: {
    fontSize: 14,
    marginLeft: 4,
  },
  colorPickerContainer: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  colorSwatch: {
    width: 30,
    height: 30,
    borderRadius: 15,
    margin: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  toolbarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  toolbarButtonIcon: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FormatToolbar;
