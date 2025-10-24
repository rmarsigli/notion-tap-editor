import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import { AlertCircle, Info, AlertTriangle, CheckCircle, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import type { CalloutNodeViewProps } from './types'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    callout: {
      setCallout: (attributes: { type: string }) => ReturnType
    }
  }
}

const CalloutComponent = ({ node, updateAttributes }: CalloutNodeViewProps) => {
  const type = node.attrs.type || 'info'
  const [showTypeMenu, setShowTypeMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const icons = {
    info: Info,
    warning: AlertTriangle,
    error: AlertCircle,
    success: CheckCircle,
  }

  const labels = {
    info: 'Info',
    warning: 'Warning',
    error: 'Error',
    success: 'Success',
  }

  const Icon = icons[type as keyof typeof icons] || Info

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as globalThis.Node)) {
        setShowTypeMenu(false)
      }
    }

    if (showTypeMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showTypeMenu])

  return (
    <NodeViewWrapper className={`callout callout-${type}`} role="note" aria-label={`${labels[type as keyof typeof labels]} callout`}>
      <div className="callout-icon-wrapper">
        <button
          onClick={() => setShowTypeMenu(!showTypeMenu)}
          aria-label={`Change callout type. Current type: ${labels[type as keyof typeof labels]}`}
          aria-haspopup="menu"
          aria-expanded={showTypeMenu}
          className="callout-icon-button focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          contentEditable={false}
          type="button"
        >
          <Icon className="w-5 h-5" aria-hidden="true" />
          <ChevronDown className="w-3 h-3 opacity-60" aria-hidden="true" />
        </button>
        {showTypeMenu && (
          <div ref={menuRef} role="menu" aria-label="Callout type menu" className="callout-type-menu" contentEditable={false}>
            {Object.entries(icons).map(([key, IconComponent]) => (
              <button
                key={key}
                role="menuitem"
                onClick={() => {
                  updateAttributes({ type: key })
                  setShowTypeMenu(false)
                }}
                aria-label={`Change to ${labels[key as keyof typeof labels]} callout`}
                className={`callout-type-option focus:outline-none focus:ring-2 focus:ring-blue-500 ${type === key ? 'active' : ''}`}
                type="button"
              >
                <IconComponent className="w-4 h-4" aria-hidden="true" />
                <span>{labels[key as keyof typeof labels]}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <NodeViewContent className="callout-content" />
    </NodeViewWrapper>
  )
}

export const Callout = Node.create({
  name: 'callout',

  group: 'block',

  content: 'inline*',

  addAttributes() {
    return {
      type: {
        default: 'info',
        parseHTML: (element: HTMLElement) => element.getAttribute('data-type'),
        renderHTML: (attributes: Record<string, string>) => {
          return {
            'data-type': attributes.type,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-callout]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, string> }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-callout': '' }), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutComponent)
  },

  addCommands() {
    return {
      setCallout:
        (attributes: { type: string }) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          })
        },
    }
  },
})
