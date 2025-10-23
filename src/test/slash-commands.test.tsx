import { describe, it, expect } from 'vitest'
import { suggestionItems } from '@/lib/tiptap/slash-commands'

describe('Slash Commands', () => {
  it('should have all basic commands', () => {
    const commandTitles = suggestionItems.map((item) => item.title)

    expect(commandTitles).toContain('Text')
    expect(commandTitles).toContain('Heading 1')
    expect(commandTitles).toContain('Heading 2')
    expect(commandTitles).toContain('Heading 3')
    expect(commandTitles).toContain('Bullet List')
    expect(commandTitles).toContain('Numbered List')
    expect(commandTitles).toContain('Task List')
    expect(commandTitles).toContain('Quote')
    expect(commandTitles).toContain('Divider')
    expect(commandTitles).toContain('Code Block')
  })

  it('should have image command', () => {
    const imageCommand = suggestionItems.find((item) => item.title === 'Image')
    expect(imageCommand).toBeDefined()
    expect(imageCommand?.description).toBe('Upload an image')
    expect(imageCommand?.icon).toBe('ImageIcon')
  })

  it('should have table command', () => {
    const tableCommand = suggestionItems.find((item) => item.title === 'Table')
    expect(tableCommand).toBeDefined()
    expect(tableCommand?.description).toBe('Insert a table')
    expect(tableCommand?.icon).toBe('Table')
  })

  it('should have callout command', () => {
    const calloutCommand = suggestionItems.find((item) => item.title === 'Callout')
    expect(calloutCommand).toBeDefined()
    expect(calloutCommand?.description).toBe('Create a callout box')
    expect(calloutCommand?.icon).toBe('Info')
  })

  it('should have exactly 13 commands', () => {
    expect(suggestionItems).toHaveLength(13)
  })

  it('each command should have required properties', () => {
    suggestionItems.forEach((item) => {
      expect(item).toHaveProperty('title')
      expect(item).toHaveProperty('description')
      expect(item).toHaveProperty('icon')
      expect(item).toHaveProperty('command')
      expect(typeof item.command).toBe('function')
    })
  })
})
