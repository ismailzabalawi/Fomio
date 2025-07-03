import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import { useBlockEditor, BlockEditorProvider } from './BlockEditorComponents';

interface BlockPickerModalProps {
  visible: boolean;
  onClose: () => void;
}

const BLOCKS = [
  { type: 'paragraph', label: 'Paragraph', icon: '¶' },
  { type: 'heading', label: 'Heading', icon: '🔠' },
  { type: 'quote', label: 'Quote', icon: '❝' },
  { type: 'list', label: 'List', icon: '•' },
  { type: 'separator', label: 'Separator', icon: '―' },
  { type: 'pageBreak', label: 'Page Break', icon: '⤵' },
  { type: 'image', label: 'Image', icon: '🖼️' },
  { type: 'gallery', label: 'Gallery', icon: '🖼️🖼️' },
  { type: 'mediaText', label: 'Media + Text', icon: '🖼️ ✏️' },
  { type: 'embed', label: 'Embed Link', icon: '🌐' },
];

const BlockPickerModal: React.FC<BlockPickerModalProps> = ({ visible, onClose }) => {
  const { insertBlock } = useBlockEditor();
  const { width } = useWindowDimensions();

  const handlePress = (type: string) => {
    insertBlock(type as any);
    onClose();
  };

  return (
    <BlockEditorProvider>
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={[styles.modal, { width: width - 24 }]}>
            <TextInput
              style={styles.searchBar}
              placeholder="Search blocks"
              placeholderTextColor="#999"
              editable={false}
            />
            <FlatList
              data={BLOCKS}
              numColumns={3}
              keyExtractor={(item) => item.type}
              columnWrapperStyle={styles.row}
              contentContainerStyle={{ paddingBottom: 20 }}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.block} activeOpacity={0.7} onPress={() => handlePress(item.type)}>
                  <Text style={styles.icon}>{item.icon}</Text>
                  <Text style={styles.label}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </BlockEditorProvider>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingBottom: 12,
  },
  modal: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    alignSelf: 'center',
    padding: 12,
  },
  searchBar: {
    backgroundColor: '#2C2C2E',
    color: '#F2F2F2',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  block: {
    backgroundColor: '#2C2C2E',
    width: 100,
    height: 100,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    fontSize: 22,
    marginBottom: 8,
    color: '#fff',
  },
  label: {
    fontSize: 12,
    color: '#D1D1D6',
    textAlign: 'center',
  },
  cancel: {
    marginTop: 8,
    color: '#0A84FF',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default BlockPickerModal;
