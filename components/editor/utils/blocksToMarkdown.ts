import { Block } from '../BlockEditorComponents';

const blocksToMarkdown = (blocks: Block[]): string => {
  return blocks.map(block => {
    switch (block.type) {
      case 'paragraph':
        return block.content ?? '';
      case 'heading':
        return `# ${block.content ?? ''}`;
      case 'quote':
        return `> ${block.content ?? ''}`;
      // Add more cases for other block types as they are created
      default:
        return '';
    }
  }).join('\n\n') + '\n';
};

export default blocksToMarkdown;
