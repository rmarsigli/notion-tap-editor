import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Editor } from '@tiptap/react'
import { Plus } from 'lucide-react'
import { SlashCommand } from '@/lib/tiptap/slash-commands'
import { SlashCommandsList } from './slash-commands-list'

interface FloatingMenuProps {
  editor: Editor
  commands: SlashCommand[]
}

export function FloatingMenu({ editor, commands }: FloatingMenuProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [showButton, setShowButton] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    if (!buttonRef.current) return

    const updateButton = () => {
      const { selection, doc } = editor.state
      const { $from } = selection
      const node = $from.parent

      // Check if we're inside a listItem by walking up the tree
      let isInsideList = false
      for (let depth = $from.depth; depth > 0; depth--) {
        const parentNode = $from.node(depth)
        if (parentNode.type.name === 'listItem') {
          isInsideList = true
          break
        }
      }

      // Only show the [+] button on empty paragraphs that are NOT inside lists
      if (node.content.size === 0 && node.type.name === 'paragraph' && !isInsideList) {
        const pos = $from.before()
        const coords = editor.view.coordsAtPos(pos)
        const editorRect = editor.view.dom.getBoundingClientRect()

        buttonRef.current!.style.display = 'flex'
        buttonRef.current!.style.position = 'absolute'
        buttonRef.current!.style.top = `${coords.top}px`
        buttonRef.current!.style.left = `${editorRect.left - 32}px`

        setShowButton(true)
      } else {
        buttonRef.current!.style.display = 'none'
        setShowButton(false)
        setShowMenu(false)
      }
    }

    const handleUpdate = () => {
      updateButton()
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setShowMenu(false)
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

  useEffect(() => {
    if (!showMenu || !menuRef.current || !buttonRef.current) return

    const buttonRect = buttonRef.current.getBoundingClientRect()
    const menuHeight = menuRef.current.offsetHeight
    const menuWidth = menuRef.current.offsetWidth
    const windowHeight = window.innerHeight
    const windowWidth = window.innerWidth
    const maxHeight = windowHeight * 0.4
    const gap = 8

    menuRef.current.style.maxHeight = `${maxHeight}px`

    let top = buttonRect.top
    let left = buttonRect.right + gap

    if (top + menuHeight > windowHeight - 20) {
      top = windowHeight - menuHeight - 20
    }

    if (top < 20) {
      top = 20
    }

    if (left + menuWidth > windowWidth - 20) {
      left = buttonRect.left - menuWidth - gap
    }

    menuRef.current.style.position = 'fixed'
    menuRef.current.style.top = `${top}px`
    menuRef.current.style.left = `${left}px`
    menuRef.current.style.zIndex = '50'
  }, [showMenu])

  const handleCommand = (command: SlashCommand) => {
    const { state } = editor
    const { $from } = state.selection
    const range = {
      from: $from.start(),
      to: $from.end(),
    }
    command.command({ editor, range })
    setShowMenu(false)
  }

  return (
    <>
      {createPortal(
        <button
          ref={buttonRef}
          onClick={() => setShowMenu(!showMenu)}
          className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          style={{ position: 'fixed', display: 'none' }}
          type="button"
        >
          <Plus className="w-4 h-4" />
        </button>,
        document.body
      )}
      {showMenu &&
        createPortal(
          <div ref={menuRef} style={{ position: 'fixed' }}>
            <SlashCommandsList
              items={commands}
              command={handleCommand}
              ref={() => ({
                onKeyDown: () => false,
              })}
            />
          </div>,
          document.body
        )}
    </>
  )
}
