import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  InputAccessoryView,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../lib/theme/theme';
import * as Haptics from 'expo-haptics';
import { Block } from './BlockEditorComponents';
import {
  Camera,
  Image,
  Check,
  ListBullets,
  ListNumbers,
  ArrowRight,
  ArrowLeft,
  Code,
  Paragraph,
  Plus,
  TextAa,
  ArrowClockwise,
  Smiley,
  ChatCircle,
  At,
  Keyboard as KeyboardIcon,
  Gear,
  TextB,
  TextItalic,
  Link,
  TextStrikethrough
} from 'phosphor-react-native';

// Keyboard Shortcuts Bar Component
interface KeyboardShortcutsBarProps {
  onAddBlock?: () => void;
  onFormatChange?: (format: string) => void;
  onInsertMedia?: () => void;
  onDismissKeyboard?: () => void;
  variant?: 'default' | 'note' | 'wiki';
  updateBlock: (blockId: string, updates: Partial<Block>) => void;
  selectedBlockId: string | null;
  blocks: Block[];
}

export const KeyboardShortcutsBar: React.FC<KeyboardShortcutsBarProps> = ({
  onAddBlock,
  onFormatChange,
  onInsertMedia,
  onDismissKeyboard,
  variant = 'default',
  updateBlock,
  selectedBlockId,
  blocks,
}) => {
  const { theme } = useTheme();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  // Get colors based on theme
  const getColors = () => {
    switch (theme) {
      case 'light':
        return {
          background: '#F2F2F7',
          barBackground: '#FFFFFF',
          text: '#1C1C1E',
          border: '#E5E5EA',
          icon: '#1C1C1E',
          activeIcon: '#007AFF',
        };
      case 'dark':
        return {
          background: '#1C1C1E',
          barBackground: '#2C2C2E',
          text: '#F2F2F2',
          border: '#3C3C3E',
          icon: '#F2F2F2',
          activeIcon: '#0A84FF',
        };
      case 'reader':
        return {
          background: '#F5ECD7',
          barBackground: '#FAF4E6',
          text: '#2E2C28',
          border: '#E5DBC0',
          icon: '#2E2C28',
          activeIcon: '#2E2C28',
        };
      default:
        return {
          background: '#1C1C1E',
          barBackground: '#2C2C2E',
          text: '#F2F2F2',
          border: '#3C3C3E',
          icon: '#F2F2F2',
          activeIcon: '#0A84FF',
        };
    }
  };

  const colors = getColors();

  // Monitor keyboard visibility
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleFormatPress = (format: string) => {
    if (!selectedBlockId) return;

    const block = blocks.find(b => b.id === selectedBlockId);
    if (!block) return;

    // Apply format based on type
    switch (format) {
      case 'bold':
      case 'italic':
      case 'underline':
      case 'strikethrough':
      case 'link':
        const currentFormats = block.attributes?.formats || [];
        const hasFormat = currentFormats.includes(format);
        
        updateBlock(selectedBlockId, {
          attributes: {
            ...block.attributes,
            formats: hasFormat 
              ? currentFormats.filter((f: string) => f !== format)
              : [...currentFormats, format]
          }
        });
        break;

      case 'bulletList':
      case 'numberedList':
        updateBlock(selectedBlockId, {
          type: 'list',
          attributes: {
            listType: format === 'bulletList' ? 'bullet' : 'numbered',
            items: block.content ? [block.content] : ['']
          }
        });
        break;

      default:
        // Pass other formats to the parent handler
        onFormatChange?.(format);
        break;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Shortcut button component
  const ShortcutButton = ({ icon, onPress, testID }: { icon: React.ReactNode, onPress: () => void, testID?: string }) => (
    <TouchableOpacity
      style={styles.shortcutButton}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      testID={testID}
    >
      {icon}
    </TouchableOpacity>
  );

  // Render different shortcut sets based on variant
  const renderShortcuts = () => {
    const iconColor = colors.icon;
    const iconSize = 20;

    switch (variant) {
      case 'note':
        // Note-taking focused shortcuts
        return (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <ShortcutButton
              icon={<Camera size={iconSize} color={iconColor} weight="regular" />}
              onPress={() => onInsertMedia?.()}
              testID="camera-button"
            />
            <ShortcutButton
              icon={<Image size={iconSize} color={iconColor} weight="regular" />}
              onPress={() => onInsertMedia?.()}
              testID="image-button"
            />
            <ShortcutButton
              icon={<Check size={iconSize} color={iconColor} weight="regular" />}
              onPress={() => handleFormatPress('checklist')}
              testID="checklist-button"
            />
            <ShortcutButton
              icon={<ListBullets size={iconSize} color={iconColor} weight="regular" />}
              onPress={() => handleFormatPress('bulletList')}
              testID="bullet-list-button"
            />
            <ShortcutButton
              icon={<ListNumbers size={iconSize} color={iconColor} weight="regular" />}
              onPress={() => handleFormatPress('numberedList')}
              testID="numbered-list-button"
            />
            <ShortcutButton
              icon={<ArrowRight size={iconSize} color={iconColor} weight="regular" />}
              onPress={() => handleFormatPress('indent')}
              testID="indent-button"
            />
            <ShortcutButton
              icon={<ArrowLeft size={iconSize} color={iconColor} weight="regular" />}
              onPress={() => handleFormatPress('outdent')}
              testID="outdent-button"
            />
            <ShortcutButton
              icon={<Code size={iconSize} color={iconColor} weight="regular" />}
              onPress={() => handleFormatPress('code')}
              testID="code-button"
            />
          </ScrollView>
        );
      
      case 'wiki':
        // Wiki/knowledge base focused shortcuts
        return (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <ShortcutButton
              icon={<Paragraph size={iconSize} color={iconColor} weight="regular" />}
              onPress={() => handleFormatPress('paragraph')}
              testID="paragraph-button"
            />
            <ShortcutButton
              icon={<Plus size={iconSize} color={iconColor} weight="regular" />}
              onPress={() => onAddBlock?.()}
              testID="add-button"
            />
            <ShortcutButton
              icon={<TextAa size={iconSize} color={iconColor} weight="regular" />}
              onPress={() => handleFormatPress('textStyle')}
              testID="text-style-button"
            />
            <ShortcutButton
              icon={<Image size={iconSize} color={iconColor} weight="regular" />}
              onPress={() => onInsertMedia?.()}
              testID="image-button"
            />
            <ShortcutButton
              icon={<ArrowClockwise size={iconSize} color={iconColor} weight="regular" />}
              onPress={() => handleFormatPress('undo')}
              testID="undo-button"
            />
            <ShortcutButton
              icon={<Smiley size={iconSize} color={iconColor} weight="regular" />}
              onPress={() => handleFormatPress('emoji')}
              testID="emoji-button"
            />
            <ShortcutButton
              icon={<ChatCircle size={iconSize} color={iconColor} weight="regular" />}
              onPress={() => handleFormatPress('comment')}
              testID="comment-button"
            />
            <ShortcutButton
              icon={<At size={iconSize} color={iconColor} weight="regular" />}
              onPress={() => handleFormatPress('mention')}
              testID="mention-button"
            />
            <ShortcutButton
              icon={<KeyboardIcon size={iconSize} color={iconColor} weight="regular" />}
              onPress={() => onDismissKeyboard?.()}
              testID="keyboard-button"
            />
          </ScrollView>
        );
      
      default:
        // Default editor shortcuts
        return (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <ShortcutButton
              icon={<Plus size={iconSize} color={iconColor} weight="regular" />}
              onPress={() => onAddBlock?.()}
              testID="add-button"
            />
            <ShortcutButton
              icon={<Image size={iconSize} color={iconColor} weight="regular" />}
              onPress={() => onInsertMedia?.()}
              testID="image-button"
            />
            <ShortcutButton
              icon={<ListBullets size={iconSize} color={iconColor} weight="regular" />}
              onPress={() => handleFormatPress('bulletList')}
              testID="bullet-list-button"
            />
            <ShortcutButton
              icon={<ListNumbers size={iconSize} color={iconColor} weight="regular" />}
              onPress={() => handleFormatPress('numberedList')}
              testID="numbered-list-button"
            />
            <ShortcutButton
              icon={<TextB size={iconSize} color={iconColor} weight="regular" />}
              onPress={() => handleFormatPress('bold')}
              testID="bold-button"
            />
            <ShortcutButton
              icon={<TextItalic size={iconSize} color={iconColor} weight="regular" />}
              onPress={() => handleFormatPress('italic')}
              testID="italic-button"
            />
            <ShortcutButton
              icon={<Link size={iconSize} color={iconColor} weight="regular" />}
              onPress={() => handleFormatPress('link')}
              testID="link-button"
            />
            <ShortcutButton
              icon={<TextStrikethrough size={iconSize} color={iconColor} weight="regular" />}
              onPress={() => handleFormatPress('strikethrough')}
              testID="strikethrough-button"
            />
            <ShortcutButton
              icon={<KeyboardIcon size={iconSize} color={iconColor} weight="regular" />}
              onPress={() => onDismissKeyboard?.()}
              testID="keyboard-button"
            />
          </ScrollView>
        );
    }
  };

  // Use InputAccessoryView on iOS for better keyboard integration
  if (Platform.OS === 'ios') {
    const inputAccessoryViewID = 'keyboardShortcutsBar';
    
    return (
      <InputAccessoryView nativeID={inputAccessoryViewID}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: colors.barBackground,
              borderTopColor: colors.border,
            },
          ]}
        >
          {renderShortcuts()}
        </View>
      </InputAccessoryView>
    );
  }

  // Use KeyboardAvoidingView on Android
  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', default: 'height' })}
      keyboardVerticalOffset={Platform.select({ ios: 88, default: 0 })}
      style={styles.keyboardAvoidingContainer}
    >
      {isKeyboardVisible && (
        <View
          style={[
            styles.container,
            {
              backgroundColor: colors.barBackground,
              borderTopColor: colors.border,
            },
          ]}
        >
          {renderShortcuts()}
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

// Keyboard Accessory View (wrapper for cross-platform compatibility)
interface KeyboardAccessoryViewProps extends KeyboardShortcutsBarProps {}

export const KeyboardAccessoryView: React.FC<KeyboardAccessoryViewProps> = (props) => {
  return <KeyboardShortcutsBar {...props} />;
};

// Styles
const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: 6,
    paddingHorizontal: 2,
  },
  shortcutButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 1,
  },
});

export default KeyboardAccessoryView;
