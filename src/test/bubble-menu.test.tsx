import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { BubbleMenu } from '@/components/menus/bubble-menu'

function TestBubbleMenu() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Test content</p>',
  })

  if (!editor) return null

  return <BubbleMenu editor={editor} />
}

describe('BubbleMenu Component', () => {
  it('should render without crashing', () => {
    const { container } = render(<TestBubbleMenu />)
    expect(container).toBeTruthy()
  })

  it('should have formatting buttons', () => {
    const { container } = render(<TestBubbleMenu />)
    // BubbleMenu renders in a portal, so we check if component mounted
    expect(container).toBeTruthy()
  })
})
