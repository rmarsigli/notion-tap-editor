import { Extension } from '@tiptap/core'
import type { KeyboardShortcutProps } from './types'

/**
 * Extension to add keyboard shortcuts for table operations
 */
export const TableKeyboardShortcuts = Extension.create({
  name: 'tableKeyboardShortcuts',

  addKeyboardShortcuts() {
    return {
      // Delete current row with Mod-Shift-Backspace
      'Mod-Shift-Backspace': ({ editor }: KeyboardShortcutProps) => {
        if (editor.isActive('table')) {
          return editor.chain().focus().deleteRow().run()
        }
        return false
      },
      // Delete current column with Mod-Shift-Delete
      'Mod-Shift-Delete': ({ editor }: KeyboardShortcutProps) => {
        if (editor.isActive('table')) {
          return editor.chain().focus().deleteColumn().run()
        }
        return false
      },
    }
  },
})
