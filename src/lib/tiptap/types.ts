import { NodeViewProps } from '@tiptap/react'
import { Editor } from '@tiptap/core'
import { EditorView } from '@tiptap/pm/view'
import { Slice } from '@tiptap/pm/model'

// Node view component props
export interface CalloutNodeViewProps extends NodeViewProps {
  node: NodeViewProps['node'] & {
    attrs: {
      type: 'info' | 'warning' | 'error' | 'success'
    }
  }
}

export interface ImageUploadNodeViewProps extends NodeViewProps {
  node: NodeViewProps['node'] & {
    attrs: {
      src: string | null
      align: 'left' | 'center' | 'right' | 'full'
      caption: string
    }
  }
}

// Slash command types
export interface SlashCommandProps {
  editor: Editor
  range: {
    from: number
    to: number
  }
}

// Keyboard shortcut types
export interface KeyboardShortcutProps {
  editor: Editor
}

// Drag & drop types
export interface DragDropViewProps {
  view: EditorView
  event: DragEvent
}

export interface HandleDropProps extends DragDropViewProps {
  slice: Slice
  moved: boolean
}

// Suggestion types
export interface SuggestionKeyDownProps {
  event: KeyboardEvent
}
