import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useBlockEditor } from './BlockEditorComponents';
import { ParagraphBlock } from './Blocks/ParagraphBlock';
import HeadingBlock from './Blocks/HeadingBlock';
import QuoteBlock from './Blocks/QuoteBlock';
import ListBlock from './Blocks/ListBlock';
import SeparatorBlock from './Blocks/SeparatorBlock';
import PageBreakBlock from './Blocks/PageBreakBlock';
import ImageBlock from './Blocks/ImageBlock';
import GalleryBlock from './Blocks/GalleryBlock';
import MediaTextBlock from './Blocks/MediaTextBlock';
import EmbeddedLinkBlock from './Blocks/EmbeddedLinkBlock';

const BlockRenderer = () => {
  const {
    blocks,
    updateBlock,
    selectBlock,
    deleteBlock,
    selectedBlockId,
  } = useBlockEditor();

  const handleBlockChange = (id: string, content: string) => {
    updateBlock(id, { content });
  };

  const handleBlockFocus = (id: string) => {
    selectBlock(id);
  };

  const handleBlockLongPress = (id: string) => {
    // Show block actions menu
  };

  return (
    <View style={styles.container}>
      {blocks.map((block) => {
        const isSelected = block.id === selectedBlockId;
        const blockProps = {
          block,
          onChange: (content: string) => handleBlockChange(block.id, content),
          onFocus: () => handleBlockFocus(block.id),
          onLongPress: () => handleBlockLongPress(block.id),
          isSelected,
        };

        switch (block.type) {
          case 'paragraph':
            return (
              <View key={block.id} style={[styles.blockWrapper, isSelected && styles.selectedBlock]}>
                <ParagraphBlock {...blockProps} />
              </View>
            );
          case 'heading':
            return (
              <View key={block.id} style={[styles.blockWrapper, isSelected && styles.selectedBlock]}>
                <HeadingBlock {...blockProps} />
              </View>
            );
          case 'quote':
            return (
              <View key={block.id} style={[styles.blockWrapper, isSelected && styles.selectedBlock]}>
                <QuoteBlock {...blockProps} />
              </View>
            );
          case 'list':
            return (
              <View key={block.id} style={[styles.blockWrapper, isSelected && styles.selectedBlock]}>
                <ListBlock {...blockProps} />
              </View>
            );
          case 'separator':
            return (
              <View key={block.id} style={[styles.blockWrapper, isSelected && styles.selectedBlock]}>
                <SeparatorBlock {...blockProps} />
              </View>
            );
          case 'pageBreak':
            return (
              <View key={block.id} style={[styles.blockWrapper, isSelected && styles.selectedBlock]}>
                <PageBreakBlock {...blockProps} />
              </View>
            );
          case 'image':
            return (
              <View key={block.id} style={[styles.blockWrapper, isSelected && styles.selectedBlock]}>
                <ImageBlock {...blockProps} />
              </View>
            );
          case 'gallery':
            return (
              <View key={block.id} style={[styles.blockWrapper, isSelected && styles.selectedBlock]}>
                <GalleryBlock {...blockProps} />
              </View>
            );
          case 'mediaText':
            return (
              <View key={block.id} style={[styles.blockWrapper, isSelected && styles.selectedBlock]}>
                <MediaTextBlock {...blockProps} />
              </View>
            );
          case 'embed':
            return (
              <View key={block.id} style={[styles.blockWrapper, isSelected && styles.selectedBlock]}>
                <EmbeddedLinkBlock {...blockProps} />
              </View>
            );
          default:
            return null;
        }
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blockWrapper: {
    marginVertical: 4,
  },
  selectedBlock: {
    backgroundColor: '#1c1c1e',
    borderRadius: 8,
  },
});

export default BlockRenderer;