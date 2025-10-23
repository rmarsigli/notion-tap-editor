import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Editor } from '@tiptap/react'
import { Bold, Italic, Strikethrough, Code } from 'lucide-react'

interface BubbleMenuProps {
  editor: Editor
}

export function BubbleMenu({ editor }: BubbleMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [, forceUpdate] = useState({})

  useEffect(() => {
    if (!menuRef.current) return

    const element = menuRef.current

    const updateMenu = () => {
      const { selection } = editor.state
      const { empty } = selection

      if (empty) {
        element.style.display = 'none'
        return
      }

      // Don't show bubble menu on image or divider
      if (
        editor.isActive('imageUpload') ||
        editor.isActive('horizontalRule')
      ) {
        element.style.display = 'none'
        return
      }

      const { from, to } = selection
      const start = editor.view.coordsAtPos(from)
      const end = editor.view.coordsAtPos(to)

      const editorRect = editor.view.dom.getBoundingClientRect()
      const left = Math.max((start.left + end.left) / 2, editorRect.left)
      const top = start.top - element.offsetHeight - 8

      element.style.display = 'flex'
      element.style.position = 'absolute'
      element.style.left = `${left}px`
      element.style.top = `${top}px`
      element.style.transform = 'translateX(-50%)'

      forceUpdate({})
    }

    const handleUpdate = () => {
      updateMenu()
    }

    editor.on('selectionUpdate', handleUpdate)
    editor.on('transaction', handleUpdate)

    return () => {
      editor.off('selectionUpdate', handleUpdate)
      editor.off('transaction', handleUpdate)
    }
  }, [editor])

  return createPortal(
    <div
      ref={menuRef}
      className="flex items-center gap-1 rounded-lg border border-border bg-white p-1 shadow-lg z-50"
      style={{ position: 'fixed', display: 'none' }}
    >
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded transition-colors cursor-pointer ${
          editor.isActive('bold')
            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        type="button"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded transition-colors cursor-pointer ${
          editor.isActive('italic')
            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        type="button"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 rounded transition-colors cursor-pointer ${
          editor.isActive('strike')
            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        type="button"
      >
        <Strikethrough className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-2 rounded transition-colors cursor-pointer ${
          editor.isActive('code')
            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        type="button"
      >
        <Code className="w-4 h-4" />
      </button>
    </div>,
    document.body
  )
}
