import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Dropcursor from '@tiptap/extension-dropcursor'
import Image from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { BubbleMenu } from '../menus/bubble-menu'
import { FloatingMenu } from '../menus/floating-menu'
import { DragHandleWrapper } from '../menus/drag-handle'
import { TableMenu } from '../menus/table-menu'
import { SlashCommands, suggestionItems } from '@/lib/tiptap/slash-commands'
import { DragDropHandler } from '@/lib/tiptap/drag-drop-handler'
import { FocusBlock } from '@/lib/tiptap/focus-block'
import { Callout } from '@/lib/tiptap/callout'
import { TableKeyboardShortcuts } from '@/lib/tiptap/table-keyboard-shortcuts'
import { ImageUpload } from '@/lib/tiptap/image-upload'

export function Editor() {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        dropcursor: false, // Disable StarterKit's dropcursor, we configure our own
      }),
      Dropcursor.configure({
        color: 'hsl(var(--primary))',
        width: 2,
      }),
      ImageUpload,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Callout,
      TableKeyboardShortcuts,
      SlashCommands,
      DragDropHandler, // Prevent dragging blocks into list items
      FocusBlock, // Highlight current block with border
    ],
    content: `
      <h1>Welcome to Notion Tap Editor</h1>
      <p>This is a <strong>rich text editor</strong> built with:</p>
      <ul>
        <li>React + TypeScript</li>
        <li>TipTap 3</li>
        <li>Tailwind CSS 4</li>
        <li>shadcn/ui</li>
      </ul>
      <p>Try editing this text! Select some text to see the bubble menu, or type "/" for slash commands.</p>
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none',
      },
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-card rounded-lg border border-border p-6 pl-12 relative">
        <BubbleMenu editor={editor} />
        <TableMenu editor={editor} />
        <FloatingMenu editor={editor} commands={suggestionItems} />
        <DragHandleWrapper editor={editor} />
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
