import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Modal,
  SafeAreaView,
  StatusBar,
  Share,
  Alert
} from 'react-native';
import { useTheme } from '../../lib/theme/theme';
import { Block, BlockType, useBlockEditor } from './BlockEditorComponents';

// Preview Mode Component
interface PreviewModeProps {
  visible: boolean;
  onClose: () => void;
  blocks: Block[];
  title: string;
}

export const PreviewMode: React.FC<PreviewModeProps> = ({
  visible,
  onClose,
  blocks,
  title
}) => {
  const { theme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'reader'>(theme);
  
  // Get colors based on theme
  const getColors = () => {
    switch (currentTheme) {
      case 'light':
        return {
          background: '#FFFFFF',
          text: '#1C1C1E',
          secondaryText: '#8E8E93',
          headerBackground: '#FFFFFF',
          headerBorder: '#E5E5EA',
          buttonText: '#007AFF',
          blockBackground: '#F9F9F9',
          blockBorder: '#E5E5EA',
          separator: '#E5E5EA',
          quote: '#007AFF',
          codeBackground: '#F2F2F7',
          listBullet: '#8E8E93',
          statusBarStyle: 'dark-content' as 'dark-content',
        };
      case 'dark':
        return {
          background: '#000000',
          text: '#F2F2F2',
          secondaryText: '#8E8E93',
          headerBackground: '#1C1C1E',
          headerBorder: '#2C2C2E',
          buttonText: '#0A84FF',
          blockBackground: '#1C1C1E',
          blockBorder: '#2C2C2E',
          separator: '#2C2C2E',
          quote: '#0A84FF',
          codeBackground: '#2C2C2E',
          listBullet: '#8E8E93',
          statusBarStyle: 'light-content' as 'light-content',
        };
      case 'reader':
        return {
          background: '#FAF4E6',
          text: '#2E2C28',
          secondaryText: '#6C6A67',
          headerBackground: '#FAF4E6',
          headerBorder: '#E5DBC0',
          buttonText: '#2E2C28',
          blockBackground: '#F5ECD7',
          blockBorder: '#E5DBC0',
          separator: '#E5DBC0',
          quote: '#2E2C28',
          codeBackground: '#F5ECD7',
          listBullet: '#6C6A67',
          statusBarStyle: 'dark-content' as 'dark-content',
        };
      default:
        return {
          background: '#000000',
          text: '#F2F2F2',
          secondaryText: '#8E8E93',
          headerBackground: '#1C1C1E',
          headerBorder: '#2C2C2E',
          buttonText: '#0A84FF',
          blockBackground: '#1C1C1E',
          blockBorder: '#2C2C2E',
          separator: '#2C2C2E',
          quote: '#0A84FF',
          codeBackground: '#2C2C2E',
          listBullet: '#8E8E93',
          statusBarStyle: 'light-content' as 'light-content',
        };
    }
  };
  
  const colors = getColors();
  
  // Toggle between themes
  const toggleTheme = () => {
    if (currentTheme === 'light') {
      setCurrentTheme('dark');
    } else if (currentTheme === 'dark') {
      setCurrentTheme('reader');
    } else {
      setCurrentTheme('light');
    }
  };
  
  // Share content
  const shareContent = async () => {
    try {
      // Convert blocks to plain text for sharing
      let contentText = title + '\n\n';
      
      blocks.forEach(block => {
        switch (block.type) {
          case 'paragraph':
            contentText += block.content + '\n\n';
            break;
          case 'heading':
            contentText += block.content + '\n\n';
            break;
          case 'list':
            if ('attributes' in block && block.attributes && block.attributes.items) {
              block.attributes.items.forEach((item: string, index: number) => {
                const prefix = block.attributes?.listType === 'bullet' ? '• ' : `${index + 1}. `;
                contentText += `${prefix}${item}\n`;
              });
              contentText += '\n';
            }
            break;
          case 'quote':
            contentText += `"${block.content}"\n`;
            if ('attributes' in block && block.attributes?.citation) {
              contentText += `— ${block.attributes.citation}\n`;
            }
            contentText += '\n';
            break;
          case 'image':
            contentText += '[Image' + (('attributes' in block && block.attributes?.alt) ? `: ${block.attributes.alt}` : '') + ']\n\n';
            break;
          case 'video':
            contentText += '[Video' + (('attributes' in block && block.attributes?.caption) ? `: ${block.attributes.caption}` : '') + ']\n\n';
            break;
          case 'separator':
            contentText += '---\n\n';
            break;
          default:
            if (block.content) {
              contentText += block.content + '\n\n';
            }
        }
      });
      
      await Share.share({
        message: contentText,
        title: title,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share content');
    }
  };
  
  // Render block content
  const renderBlock = (block: Block, index: number) => {
    switch (block.type) {
      case 'paragraph':
        return (
          <View 
            key={block.id || index}
            style={[styles.blockContainer, { marginBottom: 16 }]}
          >
            <Text style={[styles.paragraphText, { color: colors.text }]}>
              {block.content}
            </Text>
          </View>
        );
        
      case 'heading':
        const level = ('attributes' in block && block.attributes && block.attributes.level) ? block.attributes.level : 2;
        const headingStyles = {
          1: { fontSize: 32, fontWeight: '800' as const, marginBottom: 24 },
          2: { fontSize: 26, fontWeight: '700' as const, marginBottom: 20 },
          3: { fontSize: 22, fontWeight: '600' as const, marginBottom: 16 },
        };
        
        return (
          <View 
            key={block.id || index}
            style={[styles.blockContainer, { marginBottom: headingStyles[level as 1 | 2 | 3].marginBottom }]}
          >
            <Text 
              style={[
                styles.headingText, 
                headingStyles[level as 1 | 2 | 3],
                { color: colors.text }
              ]}
            >
              {block.content}
            </Text>
          </View>
        );
        
      case 'image':
        return (
          <View 
            key={block.id || index}
            style={[
              styles.imageContainer, 
              { 
                backgroundColor: colors.blockBackground,
                borderColor: colors.blockBorder,
              }
            ]}
          >
            {('attributes' in block && block.attributes?.src) ? (
              <View style={styles.imagePlaceholder}>
                <Text style={{ color: colors.secondaryText }}>
                  [Image: {block.attributes.alt || 'No description'}]
                </Text>
              </View>
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={{ color: colors.secondaryText }}>
                  [Image placeholder]
                </Text>
              </View>
            )}
            
            {('attributes' in block && block.attributes?.alt) && (
              <Text style={[styles.imageCaption, { color: colors.secondaryText }]}>
                {block.attributes.alt}
              </Text>
            )}
          </View>
        );
        
      case 'video':
        return (
          <View 
            key={block.id || index}
            style={[
              styles.videoContainer, 
              { 
                backgroundColor: colors.blockBackground,
                borderColor: colors.blockBorder,
              }
            ]}
          >
            <View style={styles.videoPlaceholder}>
              <Text style={{ color: colors.secondaryText }}>
                [Video{('attributes' in block && block.attributes?.caption) ? `: ${block.attributes.caption}` : ''}]
              </Text>
            </View>
            
            {('attributes' in block && block.attributes?.caption) && (
              <Text style={[styles.videoCaption, { color: colors.secondaryText }]}>
                {block.attributes.caption}
              </Text>
            )}
          </View>
        );
        
      case 'list':
        return (
          <View 
            key={block.id || index}
            style={[styles.blockContainer, { marginBottom: 16 }]}
          >
            {('attributes' in block && block.attributes?.items) && block.attributes.items.map((item: string, itemIndex: number) => (
              <View key={itemIndex} style={styles.listItemContainer}>
                <Text style={[styles.listBullet, { color: colors.listBullet }]}>
                  {('attributes' in block && block.attributes?.listType && block.attributes.listType === 'bullet') ? '•' : `${itemIndex + 1}.`}
                </Text>
                <Text style={[styles.listItemText, { color: colors.text }]}>
                  {item}
                </Text>
              </View>
            ))}
          </View>
        );
        
      case 'quote':
        return (
          <View 
            key={block.id || index}
            style={[
              styles.quoteContainer, 
              { 
                borderLeftColor: colors.quote,
                backgroundColor: colors.blockBackground,
              }
            ]}
          >
            <Text style={[styles.quoteText, { color: colors.text }]}>
              {block.content}
            </Text>
            
            {('attributes' in block && block.attributes?.citation) && (
              <Text style={[styles.quoteCitation, { color: colors.secondaryText }]}>
                — {block.attributes.citation}
              </Text>
            )}
          </View>
        );
        
      case 'separator':
        return (
          <View 
            key={block.id || index}
            style={[styles.separatorContainer, { marginVertical: 24 }]}
          >
            <View 
              style={[
                styles.separator, 
                { 
                  borderBottomColor: colors.separator,
                  borderBottomWidth: 1,
                  borderStyle: ('attributes' in block && block.attributes?.style)
                    ? (block.attributes.style === 'dots'
                      ? 'dotted'
                      : block.attributes.style === 'dashes'
                        ? 'dashed'
                        : 'solid')
                    : 'solid',
                }
              ]} 
            />
          </View>
        );
        
      default:
        return (
          <View key={block.id || index} style={styles.blockContainer}>
            <Text style={{ color: colors.text }}>
              {block.content || `[${block.type} block]`}
            </Text>
          </View>
        );
    }
  };
  
  if (!visible) return null;
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={colors.statusBarStyle} />
        
        <View style={[
          styles.header, 
          { 
            backgroundColor: colors.headerBackground,
            borderBottomColor: colors.headerBorder,
          }
        ]}>
          <TouchableOpacity onPress={onClose} style={styles.headerButton}>
            <Text style={[styles.headerButtonText, { color: colors.buttonText }]}>
              Close
            </Text>
          </TouchableOpacity>
          
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Preview
          </Text>
          
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={toggleTheme} style={styles.headerButton}>
              <Text style={[styles.headerButtonText, { color: colors.buttonText }]}>
                {currentTheme === 'light' ? '🌙' : currentTheme === 'dark' ? '📖' : '☀️'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={shareContent} style={styles.headerButton}>
              <Text style={[styles.headerButtonText, { color: colors.buttonText }]}>
                Share
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          <Text style={[styles.title, { color: colors.text }]}>
            {title || 'Untitled'}
          </Text>
          
          {blocks.map(renderBlock)}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

// Preview Button Component
interface PreviewButtonProps {
  onPress: () => void;
}

export const PreviewButton: React.FC<PreviewButtonProps> = ({
  onPress
}) => {
  const { theme } = useTheme();
  
  // Get colors based on theme
  const getColors = () => {
    switch (theme) {
      case 'light':
        return {
          background: '#007AFF',
          text: '#FFFFFF',
        };
      case 'dark':
        return {
          background: '#0A84FF',
          text: '#FFFFFF',
        };
      case 'reader':
        return {
          background: '#2E2C28',
          text: '#FAF4E6',
        };
      default:
        return {
          background: '#0A84FF',
          text: '#FFFFFF',
        };
    }
  };
  
  const colors = getColors();
  
  return (
    <TouchableOpacity
      style={[styles.previewButton, { backgroundColor: colors.background }]}
      onPress={onPress}
    >
      <Text style={[styles.previewButtonText, { color: colors.text }]}>
        Preview
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  headerButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  
  // Title styles
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 24,
  },
  
  // Block container styles
  blockContainer: {
    marginBottom: 16,
  },
  
  // Text styles
  paragraphText: {
    fontSize: 18,
    lineHeight: 28,
  },
  headingText: {
    lineHeight: 1.3,
  },
  
  // Image styles
  imageContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
  },
  imagePlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageCaption: {
    padding: 12,
    fontSize: 14,
    fontStyle: 'italic',
  },
  
  // Video styles
  videoContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
  },
  videoPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoCaption: {
    padding: 12,
    fontSize: 14,
    fontStyle: 'italic',
  },
  
  // List styles
  listItemContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  listBullet: {
    width: 24,
    fontSize: 18,
  },
  listItemText: {
    flex: 1,
    fontSize: 18,
    lineHeight: 28,
  },
  
  // Quote styles
  quoteContainer: {
    borderLeftWidth: 4,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginVertical: 16,
    borderRadius: 8,
  },
  quoteText: {
    fontSize: 18,
    lineHeight: 28,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  quoteCitation: {
    fontSize: 16,
    textAlign: 'right',
  },
  
  // Separator styles
  separatorContainer: {
    paddingVertical: 8,
  },
  separator: {
    borderBottomWidth: 1,
  },
  
  // Preview button styles
  previewButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    alignSelf: 'center',
  },
  previewButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
