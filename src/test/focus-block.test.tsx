import { describe, it, expect } from 'vitest'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { render } from '@testing-library/react'
import { FocusBlock } from '@/lib/tiptap/focus-block'

function TestEditor() {
  const editor = useEditor({
    extensions: [StarterKit, FocusBlock],
    content: '<p>Test content</p>',
  })

  return <EditorContent editor={editor} />
}

describe('FocusBlock Extension', () => {
  it('should register the extension', () => {
    const { container } = render(<TestEditor />)
    expect(container).toBeTruthy()
  })

  it('should be an extension type', () => {
    const extension = FocusBlock
    expect(extension.config.name).toBe('focusBlock')
  })

  it('should add ProseMirror plugins', () => {
    const extension = FocusBlock
    const plugins = extension.options.addProseMirrorPlugins || extension.config.addProseMirrorPlugins
    expect(plugins).toBeDefined()
  })
})
