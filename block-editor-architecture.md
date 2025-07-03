# Block Editor Architecture for Fomio

## Overview
This document outlines the architecture for implementing a WordPress-like block editor with a mobile-first approach for the Fomio app's create.tsx page. The design is inspired by the WordPress block editor (Gutenberg) but optimized for mobile devices as shown in the reference images.

## Core Components

### 1. BlockEditor
The main container component that manages the overall state of the editor, including:
- List of blocks
- Currently selected block
- Editor mode (writing/block selection)
- Undo/redo history

### 2. BlockList
Renders the list of blocks and handles:
- Block ordering
- Block selection
- Block focus management
- Scrolling behavior

### 3. Block
Base component for all block types with:
- Common block interface
- Selection state
- Focus handling
- Block controls (move, delete, etc.)

### 4. BlockTypes
Individual block implementations:
- Paragraph (text)
- Heading
- Image
- Video
- List (bulleted/numbered)
- Quote
- Separator
- Page Break
- Media & Text
- Preformatted
- Gallery

### 5. BlockToolbar
Context-aware toolbar that shows:
- Block type selector
- Block-specific formatting options
- Block manipulation controls

### 6. BlockPicker
Modal interface for selecting and adding new blocks:
- Search functionality
- Categorized block types
- Recently used blocks
- Block preview

## State Management

### BlockEditorContext
React Context to manage:
- Block data structure
- Selected block ID
- Block manipulation methods (add, update, delete, reorder)
- History tracking for undo/redo

### Block Data Structure
```typescript
interface Block {
  id: string;
  type: BlockType;
  attributes: {
    [key: string]: any; // Type-specific attributes
  };
  content: string | null; // For text-based blocks
  children?: Block[]; // For nested blocks
}

type BlockType = 
  | 'paragraph'
  | 'heading'
  | 'image'
  | 'video'
  | 'list'
  | 'quote'
  | 'separator'
  | 'pageBreak'
  | 'mediaText'
  | 'preformatted'
  | 'gallery';
```

## User Interaction Flow

1. **Initial State**:
   - Editor opens with title field and an empty paragraph block
   - Focus is on title field

2. **Block Creation**:
   - User taps "+" button or "ADD BLOCK HERE" placeholder
   - BlockPicker modal appears
   - User selects block type
   - New block is inserted and focused

3. **Block Editing**:
   - User taps on a block to select and edit it
   - Block-specific controls appear in toolbar
   - Content is edited in-place

4. **Block Manipulation**:
   - Long press to enter block manipulation mode
   - Drag handles appear for reordering
   - Additional options appear for duplicating, removing, etc.

5. **Content Publishing**:
   - User taps "Publish" button
   - Content is validated
   - Post is created/updated

## UI Components

### 1. EditorHeader
- Back button
- Undo/Redo buttons
- More options menu
- Publish button

### 2. TitleInput
- Large, prominent input for post title
- Auto-expanding height

### 3. BlockPlaceholder
- Visual indicator for adding new blocks
- Shows "ADD BLOCK HERE" text
- Appears between blocks and at document end

### 4. BlockControls
- Block-specific formatting controls
- Block settings
- Move up/down buttons
- Remove button

### 5. BottomToolbar
- Block type selector
- Common formatting options
- Media insertion shortcuts

### 6. BlockPickerModal
- Search input
- Block type categories
- Block type buttons with icons and labels

## Theming Integration

The block editor will integrate with the app's existing theming system:
- Use the `useTheme` hook to access current theme
- Apply appropriate colors based on theme (light, dark, reader)
- Ensure consistent styling across the app
- Fix any inconsistent theming issues

## Mobile Optimizations

1. **Touch-Friendly UI**:
   - Larger touch targets
   - Clear visual feedback on interaction
   - Gesture support (swipe, long press)

2. **Performance**:
   - Virtualized list for large documents
   - Lazy loading of media
   - Optimized rendering of blocks

3. **Keyboard Handling**:
   - Smart keyboard behavior
   - Toolbar appears above keyboard
   - Keyboard shortcuts for common actions

4. **Responsive Layout**:
   - Adapts to different screen sizes
   - Optimized for portrait and landscape orientations
   - Tablet-specific enhancements

## Implementation Approach

1. Create core block editor components
2. Implement basic block types (paragraph, heading)
3. Add block selection and manipulation
4. Implement block picker modal
5. Add remaining block types
6. Integrate with app navigation and state
7. Fix theming inconsistencies
8. Test and optimize performance
