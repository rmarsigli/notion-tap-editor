import { describe, it, expect } from 'vitest'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { render } from '@testing-library/react'
import { Callout } from '@/lib/tiptap/callout'

function TestEditor({ content }: { content: string }) {
  const editor = useEditor({
    extensions: [StarterKit, Callout],
    content,
  })

  return <EditorContent editor={editor} />
}

describe('Callout Extension', () => {
  it('should register the callout extension', () => {
    const { container } = render(<TestEditor content="" />)
    expect(container).toBeTruthy()
  })

  it('should have default type as info', () => {
    const extension = Callout
    const attributes = extension.options.addAttributes?.() || extension.config.addAttributes()
    expect(attributes.type.default).toBe('info')
  })

  it('should support type attribute', () => {
    const extension = Callout
    const attributes = extension.options.addAttributes?.() || extension.config.addAttributes()
    expect(attributes.type).toBeDefined()
  })

  it('should be a block group node', () => {
    const extension = Callout
    const group = extension.options.group || extension.config.group
    expect(group).toBe('block')
  })

  it('should support inline content', () => {
    const extension = Callout
    const content = extension.options.content || extension.config.content
    expect(content).toBe('inline*')
  })

  it('should parse HTML with data-callout attribute', () => {
    const extension = Callout
    const parseHTML = extension.options.parseHTML?.() || extension.config.parseHTML()
    expect(parseHTML[0].tag).toBe('div[data-callout]')
  })
})
