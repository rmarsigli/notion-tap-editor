import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Editor } from '@tiptap/react'
import {
  Trash2,
  Plus,
  Columns,
  Rows,
  ChevronDown,
} from 'lucide-react'

interface TableMenuProps {
  editor: Editor
}

export function TableMenu({ editor }: TableMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [showColumnMenu, setShowColumnMenu] = useState(false)
  const [showRowMenu, setShowRowMenu] = useState(false)
  const [, forceUpdate] = useState({})

  useEffect(() => {
    if (!menuRef.current) return

    const element = menuRef.current

    const updateMenu = () => {
      // Only show menu when inside a table
      if (!editor.isActive('table')) {
        element.style.display = 'none'
        setShowColumnMenu(false)
        setShowRowMenu(false)
        return
      }

      const { selection } = editor.state
      const { from } = selection

      const coords = editor.view.coordsAtPos(from)
      const editorRect = editor.view.dom.getBoundingClientRect()

      const left = coords.left
      const top = coords.top - element.offsetHeight - 8

      element.style.display = 'flex'
      element.style.position = 'fixed'
      element.style.left = `${left}px`
      element.style.top = `${top}px`

      forceUpdate({})
    }

    const handleUpdate = () => {
      updateMenu()
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (element && !element.contains(e.target as Node)) {
        setShowColumnMenu(false)
        setShowRowMenu(false)
      }
    }

    editor.on('selectionUpdate', handleUpdate)
    editor.on('transaction', handleUpdate)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      editor.off('selectionUpdate', handleUpdate)
      editor.off('transaction', handleUpdate)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [editor])

  return createPortal(
    <div
      ref={menuRef}
      className="flex items-center gap-1 rounded-lg border border-border bg-white dark:bg-gray-800 p-1 shadow-lg z-50"
      style={{ position: 'fixed', display: 'none' }}
    >
      {/* Column Menu */}
      <div className="relative">
        <button
          onClick={() => {
            setShowColumnMenu(!showColumnMenu)
            setShowRowMenu(false)
          }}
          className="flex items-center gap-1 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          type="button"
        >
          <Columns className="w-4 h-4" />
          Column
          <ChevronDown className="w-3 h-3" />
        </button>
        {showColumnMenu && (
          <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700 py-1.5 z-10 min-w-[180px]">
            <button
              onClick={() => {
                editor.chain().focus().addColumnBefore().run()
                setShowColumnMenu(false)
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
              type="button"
            >
              <Plus className="w-4 h-4" />
              <span>Insert Left</span>
            </button>
            <button
              onClick={() => {
                editor.chain().focus().addColumnAfter().run()
                setShowColumnMenu(false)
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
              type="button"
            >
              <Plus className="w-4 h-4" />
              <span>Insert Right</span>
            </button>
            <div className="h-px bg-gray-200 dark:bg-gray-700 my-1.5" />
            <button
              onClick={() => {
                editor.chain().focus().deleteColumn().run()
                setShowColumnMenu(false)
              }}
              className="w-full flex items-center justify-between gap-4 px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
              type="button"
            >
              <span className="flex items-center gap-3">
                <Trash2 className="w-4 h-4" />
                <span>Delete Column</span>
              </span>
              <span className="text-xs opacity-70 font-mono">⌘⇧Del</span>
            </button>
          </div>
        )}
      </div>

      {/* Row Menu */}
      <div className="relative">
        <button
          onClick={() => {
            setShowRowMenu(!showRowMenu)
            setShowColumnMenu(false)
          }}
          className="flex items-center gap-1 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          type="button"
        >
          <Rows className="w-4 h-4" />
          Row
          <ChevronDown className="w-3 h-3" />
        </button>
        {showRowMenu && (
          <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700 py-1.5 z-10 min-w-[180px]">
            <button
              onClick={() => {
                editor.chain().focus().addRowBefore().run()
                setShowRowMenu(false)
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
              type="button"
            >
              <Plus className="w-4 h-4" />
              <span>Insert Above</span>
            </button>
            <button
              onClick={() => {
                editor.chain().focus().addRowAfter().run()
                setShowRowMenu(false)
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
              type="button"
            >
              <Plus className="w-4 h-4" />
              <span>Insert Below</span>
            </button>
            <div className="h-px bg-gray-200 dark:bg-gray-700 my-1.5" />
            <button
              onClick={() => {
                editor.chain().focus().deleteRow().run()
                setShowRowMenu(false)
              }}
              className="w-full flex items-center justify-between gap-4 px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
              type="button"
            >
              <span className="flex items-center gap-3">
                <Trash2 className="w-4 h-4" />
                <span>Delete Row</span>
              </span>
              <span className="text-xs opacity-70 font-mono">⌘⇧⌫</span>
            </button>
          </div>
        )}
      </div>

      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

      {/* Delete Table */}
      <button
        onClick={() => editor.chain().focus().deleteTable().run()}
        className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        type="button"
      >
        <Trash2 className="w-4 h-4" />
        Delete Table
      </button>
    </div>,
    document.body
  )
}
