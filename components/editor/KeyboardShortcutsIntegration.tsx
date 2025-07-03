// This file contains the improved integration between the KeyboardShortcutsBar and BlockEditor

import React, { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';
import { useBlockEditor } from './BlockEditorComponents';
import * as Haptics from 'expo-haptics';

/**
 * Hook to connect keyboard shortcuts to block editor actions
 * 
 * This hook provides the glue between the keyboard shortcuts bar
 * and the block editor functionality.
 */
export const useKeyboardShortcutsIntegration = () => {
  const {
    blocks,
    selectedBlockId,
    addBlock,
    updateBlock,
    deleteBlock,
    moveBlock,
    selectBlock
  } = useBlockEditor();
  const [formatToolbarVisible, setFormatToolbarVisible] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [blockPickerVisible, setBlockPickerVisible] = useState(false);
  const [mediaPickerVisible, setMediaPickerVisible] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  // Monitor keyboard visibility
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Handle format change from keyboard shortcuts
  const handleFormatChange = (format: string) => {
    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Handle different format types
    switch (format) {
      case 'bold':
      case 'italic':
      case 'underline':
      case 'strikethrough':
      case 'link':
        // Text formatting - show format toolbar with the selected format
        setSelectedFormat(format);
        setFormatToolbarVisible(true);
        break;

      case 'bulletList':
        // Convert current block to bullet list or add new one
        if (selectedBlockId) {
          const block = blocks.find(b => b.id === selectedBlockId);
          if (block && block.type === 'paragraph') {
            updateBlock(selectedBlockId, {
              type: 'list',
              attributes: { 
                listType: 'bullet', 
                items: block.content ? [block.content] : [''] 
              }
            });
          } else {
            addBlock('list', blocks.findIndex(b => b.id === selectedBlockId));
            // Find the newly added block (it should be the last one)
            const newBlockId = blocks[blocks.length - 1]?.id;
            if (newBlockId) {
              updateBlock(newBlockId, {
                attributes: { listType: 'bullet', items: [''] }
              });
            }
          }
        } else {
          // No block selected, add a new one
          addBlock('list');
          // Find the newly added block (it should be the last one)
          const newBlockId = blocks[blocks.length - 1]?.id;
          if (newBlockId) {
            updateBlock(newBlockId, {
              attributes: { listType: 'bullet', items: [''] }
            });
          }
        }
        break;

      case 'numberedList':
        // Convert current block to numbered list or add new one
        if (selectedBlockId) {
          const block = blocks.find(b => b.id === selectedBlockId);
          if (block && block.type === 'paragraph') {
            updateBlock(selectedBlockId, {
              type: 'list',
              attributes: { 
                listType: 'numbered', 
                items: block.content ? [block.content] : [''] 
              }
            });
          } else {
            addBlock('list', blocks.findIndex(b => b.id === selectedBlockId));
            // Find the newly added block (it should be the last one)
            const newBlockId = blocks[blocks.length - 1]?.id;
            if (newBlockId) {
              updateBlock(newBlockId, {
                attributes: { listType: 'numbered', items: [''] }
              });
            }
          }
        } else {
          // No block selected, add a new one
          addBlock('list');
          // Find the newly added block (it should be the last one)
          const newBlockId = blocks[blocks.length - 1]?.id;
          if (newBlockId) {
            updateBlock(newBlockId, {
              attributes: { listType: 'numbered', items: [''] }
            });
          }
        }
        break;

      case 'heading1':
        // Convert to heading or add new heading
        if (selectedBlockId) {
          const block = blocks.find(b => b.id === selectedBlockId);
          if (block) {
            updateBlock(selectedBlockId, {
              type: 'heading',
              attributes: { level: 1 }
            });
          }
        } else {
          addBlock('heading');
          // Find the newly added block
          const newBlockId = blocks[blocks.length - 1]?.id;
          if (newBlockId) {
            updateBlock(newBlockId, {
              attributes: { level: 1 }
            });
          }
        }
        break;

      case 'heading2':
        // Convert to heading or add new heading
        if (selectedBlockId) {
          const block = blocks.find(b => b.id === selectedBlockId);
          if (block) {
            updateBlock(selectedBlockId, {
              type: 'heading',
              attributes: { level: 2 }
            });
          }
        } else {
          addBlock('heading');
          // Find the newly added block
          const newBlockId = blocks[blocks.length - 1]?.id;
          if (newBlockId) {
            updateBlock(newBlockId, {
              attributes: { level: 2 }
            });
          }
        }
        break;

      case 'heading3':
        // Convert to heading or add new heading
        if (selectedBlockId) {
          const block = blocks.find(b => b.id === selectedBlockId);
          if (block) {
            updateBlock(selectedBlockId, {
              type: 'heading',
              attributes: { level: 3 }
            });
          }
        } else {
          addBlock('heading');
          // Find the newly added block
          const newBlockId = blocks[blocks.length - 1]?.id;
          if (newBlockId) {
            updateBlock(newBlockId, {
              attributes: { level: 3 }
            });
          }
        }
        break;

      case 'quote':
        // Convert to quote or add new quote
        if (selectedBlockId) {
          const block = blocks.find(b => b.id === selectedBlockId);
          if (block) {
            updateBlock(selectedBlockId, {
              type: 'quote'
            });
          }
        } else {
          addBlock('quote');
        }
        break;

      case 'code':
        // Convert to code or add new code block
        if (selectedBlockId) {
          const block = blocks.find(b => b.id === selectedBlockId);
          if (block) {
            updateBlock(selectedBlockId, {
              type: 'code'
            });
          }
        } else {
          addBlock('code');
        }
        break;

      case 'indent':
        // Increase indentation of current block
        if (selectedBlockId) {
          const block = blocks.find(b => b.id === selectedBlockId);
          if (block) {
            const currentIndent = block.attributes?.indent || 0;
            updateBlock(selectedBlockId, {
              attributes: {
                ...block.attributes,
                indent: Math.min(currentIndent + 1, 3) // Max indent level of 3
              }
            });
          }
        }
        break;

      case 'outdent':
        // Decrease indentation of current block
        if (selectedBlockId) {
          const block = blocks.find(b => b.id === selectedBlockId);
          if (block) {
            const currentIndent = block.attributes?.indent || 0;
            updateBlock(selectedBlockId, {
              attributes: {
                ...block.attributes,
                indent: Math.max(currentIndent - 1, 0) // Min indent level of 0
              }
            });
          }
        }
        break;

      case 'settings':
        // Show block settings
        setBlockPickerVisible(true);
        break;

      case 'textColor':
        // Show color picker
        setSelectedFormat('textColor');
        setFormatToolbarVisible(true);
        break;

      default:
        console.log(`Format not implemented: ${format}`);
    }
  };

  // Handle add block from keyboard shortcuts
  const handleAddBlock = () => {
    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Show block picker
    setBlockPickerVisible(true);
  };

  // Handle insert media from keyboard shortcuts
  const handleInsertMedia = () => {
    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Show media picker
    setMediaPickerVisible(true);
  };

  // Handle dismiss keyboard
  const handleDismissKeyboard = () => {
    Keyboard.dismiss();
    setFormatToolbarVisible(false);
    setSelectedFormat(null);
  };

  return {
    handleFormatChange,
    handleAddBlock,
    handleInsertMedia,
    handleDismissKeyboard,
    formatToolbarVisible,
    setFormatToolbarVisible,
    selectedFormat,
    setSelectedFormat,
    blockPickerVisible,
    setBlockPickerVisible,
    mediaPickerVisible,
    setMediaPickerVisible,
    isKeyboardVisible
  };
};
