import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Editor } from '@/components/editor/editor'

describe('Editor Component', () => {
  it('should render without crashing', () => {
    const { container } = render(<Editor />)
    expect(container).toBeTruthy()
  })

  it('should render ProseMirror editor', () => {
    const { container } = render(<Editor />)
    const prosemirror = container.querySelector('.ProseMirror')
    expect(prosemirror).toBeTruthy()
  })

  it('should have minimum height', () => {
    const { container } = render(<Editor />)
    const prosemirror = container.querySelector('.ProseMirror')
    expect(prosemirror).toBeTruthy()
  })

  it('should be editable by default', () => {
    const { container } = render(<Editor />)
    const prosemirror = container.querySelector('.ProseMirror')
    expect(prosemirror?.getAttribute('contenteditable')).toBe('true')
  })
})
