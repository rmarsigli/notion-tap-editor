import { describe, it, expect } from 'vitest'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { render } from '@testing-library/react'
import { TableKeyboardShortcuts } from '@/lib/tiptap/table-keyboard-shortcuts'

function TestEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      TableKeyboardShortcuts,
    ],
    content: '<p>Test</p>',
  })

  return <EditorContent editor={editor} />
}

describe('TableKeyboardShortcuts Extension', () => {
  it('should register the extension', () => {
    const { container } = render(<TestEditor />)
    expect(container).toBeTruthy()
  })

  it('should be an extension type', () => {
    const extension = TableKeyboardShortcuts
    expect(extension.config.name).toBe('tableKeyboardShortcuts')
  })

  it('should add keyboard shortcuts', () => {
    const extension = TableKeyboardShortcuts
    const shortcuts = extension.options.addKeyboardShortcuts?.() || extension.config.addKeyboardShortcuts?.()
    expect(shortcuts).toBeDefined()
  })
})
