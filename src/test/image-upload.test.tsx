import { describe, it, expect } from 'vitest'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { render } from '@testing-library/react'
import { ImageUpload } from '@/lib/tiptap/image-upload'

function TestEditor({ content }: { content: string }) {
  const editor = useEditor({
    extensions: [StarterKit, ImageUpload],
    content,
  })

  return <EditorContent editor={editor} />
}

describe('ImageUpload Extension', () => {
  it('should register the imageUpload extension', () => {
    const { container } = render(<TestEditor content="" />)
    expect(container).toBeTruthy()
  })

  it('should render image upload placeholder when no src is provided', () => {
    const { container } = render(
      <TestEditor content='<div data-image-upload=""></div>' />
    )
    const placeholder = container.querySelector('.image-upload-placeholder')
    expect(placeholder).toBeTruthy()
  })

  it('should have default alignment as center', () => {
    const extension = ImageUpload
    const attributes = extension.options.addAttributes?.() || extension.config.addAttributes()
    expect(attributes.align.default).toBe('center')
  })

  it('should support align attribute', () => {
    const extension = ImageUpload
    const attributes = extension.options.addAttributes?.() || extension.config.addAttributes()
    expect(attributes.align).toBeDefined()
  })

  it('should support src attribute', () => {
    const extension = ImageUpload
    const attributes = extension.options.addAttributes?.() || extension.config.addAttributes()
    expect(attributes.src).toBeDefined()
  })

  it('should support caption attribute', () => {
    const extension = ImageUpload
    const attributes = extension.options.addAttributes?.() || extension.config.addAttributes()
    expect(attributes.caption).toBeDefined()
  })

  it('should be a block group node', () => {
    const extension = ImageUpload
    const group = extension.options.group || extension.config.group
    expect(group).toBe('block')
  })

  it('should be an atom node', () => {
    const extension = ImageUpload
    const atom = extension.options.atom ?? extension.config.atom
    expect(atom).toBe(true)
  })
})
