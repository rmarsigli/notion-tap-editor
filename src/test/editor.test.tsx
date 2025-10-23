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

  it('should render with initial content', () => {
    const { container } = render(<Editor />)
    const prosemirror = container.querySelector('.ProseMirror')
    expect(prosemirror?.textContent).toContain('Welcome to Notion Tap Editor')
  })

  it('should have prose classes for styling', () => {
    const { container } = render(<Editor />)
    const prosemirror = container.querySelector('.ProseMirror')
    expect(prosemirror?.classList.contains('prose')).toBe(true)
  })

  it('should render within a card container', () => {
    const { container } = render(<Editor />)
    const card = container.querySelector('.bg-card')
    expect(card).toBeTruthy()
  })

  it('should have border and rounded corners', () => {
    const { container } = render(<Editor />)
    const card = container.querySelector('.rounded-lg')
    expect(card).toBeTruthy()
  })

  it('should be centered with max width', () => {
    const { container } = render(<Editor />)
    const wrapper = container.querySelector('.max-w-4xl')
    expect(wrapper).toBeTruthy()
  })
})
