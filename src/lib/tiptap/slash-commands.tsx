import { Extension } from '@tiptap/core'
import { ReactRenderer } from '@tiptap/react'
import Suggestion from '@tiptap/suggestion'
import { SlashCommandsList } from '@/components/menus/slash-commands-list'

export interface SlashCommand {
  title: string
  description: string
  icon: string
  command: ({ editor, range }: any) => void
}

export const suggestionItems: SlashCommand[] = [
  {
    title: 'Text',
    description: 'Just start writing with plain text',
    icon: 'Text',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('paragraph').run()
    },
  },
  {
    title: 'Heading 1',
    description: 'Large section heading',
    icon: 'H1',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run()
    },
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading',
    icon: 'H2',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run()
    },
  },
  {
    title: 'Heading 3',
    description: 'Small section heading',
    icon: 'H3',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run()
    },
  },
  {
    title: 'Bullet List',
    description: 'Create a simple bullet list',
    icon: 'List',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run()
    },
  },
  {
    title: 'Numbered List',
    description: 'Create a list with numbering',
    icon: 'ListOrdered',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run()
    },
  },
  {
    title: 'Task List',
    description: 'Track tasks with a checklist',
    icon: 'ListTodo',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run()
    },
  },
  {
    title: 'Quote',
    description: 'Capture a quote',
    icon: 'Quote',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run()
    },
  },
  {
    title: 'Divider',
    description: 'Visually divide blocks',
    icon: 'Minus',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run()
    },
  },
  {
    title: 'Code Block',
    description: 'Capture a code snippet',
    icon: 'Code',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
    },
  },
  {
    title: 'Image',
    description: 'Upload an image',
    icon: 'ImageIcon',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setImageUpload().run()
    },
  },
  {
    title: 'Table',
    description: 'Insert a table',
    icon: 'Table',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run()
    },
  },
  {
    title: 'Callout',
    description: 'Create a callout box',
    icon: 'Info',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setCallout({ type: 'info' }).run()
    },
  },
]

export const SlashCommands = Extension.create({
  name: 'slashCommands',

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: '/',
        allow: ({ state, range }) => {
          const $from = state.doc.resolve(range.from)
          const isStartOfLine = range.from === $from.start()
          return isStartOfLine
        },
        command: ({ editor, range, props }) => {
          props.command({ editor, range })
        },
        items: ({ query }) => {
          return suggestionItems.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase())
          )
        },
        render: () => {
          let component: ReactRenderer
          let element: HTMLElement

          const updatePosition = (rect: DOMRect) => {
            const windowHeight = window.innerHeight
            const windowWidth = window.innerWidth
            const menuHeight = element.offsetHeight
            const menuWidth = element.offsetWidth
            const maxHeight = windowHeight * 0.4
            const gap = 8
            const margin = 20

            element.style.maxHeight = `${maxHeight}px`
            element.style.overflowY = 'auto'

            let top = rect.bottom + gap
            let left = rect.left

            const spaceBelow = windowHeight - rect.bottom
            const spaceAbove = rect.top
            const minSpaceNeeded = Math.min(menuHeight, maxHeight) + margin

            if (spaceBelow < minSpaceNeeded && spaceAbove > spaceBelow) {
              top = rect.top - Math.min(menuHeight, maxHeight) - gap

              if (top < margin) {
                top = margin
                const availableHeight = rect.top - gap - margin
                if (availableHeight > 150) {
                  element.style.maxHeight = `${availableHeight}px`
                } else {
                  top = rect.bottom + gap
                  const availableHeightBelow = windowHeight - rect.bottom - gap - margin
                  element.style.maxHeight = `${Math.min(maxHeight, availableHeightBelow)}px`
                }
              }
            } else {
              if (top + menuHeight > windowHeight - margin) {
                const availableHeight = windowHeight - rect.bottom - gap - margin
                if (availableHeight > 150) {
                  element.style.maxHeight = `${availableHeight}px`
                } else if (spaceAbove > 150) {
                  top = rect.top - Math.min(menuHeight, spaceAbove - margin) - gap
                  element.style.maxHeight = `${Math.min(maxHeight, spaceAbove - margin)}px`
                }
              }
            }

            const centerX = windowWidth / 2
            const idealLeft = rect.left

            if (idealLeft + menuWidth > windowWidth - margin) {
              left = Math.max(margin, windowWidth - menuWidth - margin)
            } else if (idealLeft < margin) {
              left = margin
            } else {
              left = idealLeft
            }

            element.style.position = 'fixed'
            element.style.top = `${top}px`
            element.style.left = `${left}px`
            element.style.zIndex = '50'
          }

          return {
            onStart: (props) => {
              component = new ReactRenderer(SlashCommandsList, {
                props,
                editor: props.editor,
              })

              element = component.element
              document.body.appendChild(element)

              if (!props.clientRect) {
                return
              }

              const rect = props.clientRect()
              if (rect) {
                setTimeout(() => updatePosition(rect), 0)
              }
            },

            onUpdate(props) {
              component.updateProps(props)

              if (!props.clientRect) {
                return
              }

              const rect = props.clientRect()
              if (rect) {
                updatePosition(rect)
              }
            },

            onKeyDown(props) {
              if (props.event.key === 'Escape') {
                element.style.display = 'none'
                return true
              }

              return component.ref?.onKeyDown(props)
            },

            onExit() {
              if (element && element.parentNode) {
                element.parentNode.removeChild(element)
              }
              component.destroy()
            },
          }
        },
      }),
    ]
  },
})
