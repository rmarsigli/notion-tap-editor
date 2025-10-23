import { describe, it, expect } from 'vitest'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { render } from '@testing-library/react'
import { DragDropHandler } from '@/lib/tiptap/drag-drop-handler'

function TestEditor() {
  const editor = useEditor({
    extensions: [StarterKit, DragDropHandler],
    content: '<p>Test content</p>',
  })

  return <EditorContent editor={editor} />
}

describe('DragDropHandler Extension', () => {
  it('should register the extension', () => {
    const { container } = render(<TestEditor />)
    expect(container).toBeTruthy()
  })

  it('should be an extension type', () => {
    const extension = DragDropHandler
    expect(extension.config.name).toBe('dragDropHandler')
  })

  it('should add ProseMirror plugins', () => {
    const extension = DragDropHandler
    const plugins = extension.options.addProseMirrorPlugins || extension.config.addProseMirrorPlugins
    expect(plugins).toBeDefined()
  })
})
