import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import { AlertCircle, Info, AlertTriangle, CheckCircle, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    callout: {
      setCallout: (attributes: { type: string }) => ReturnType
    }
  }
}

const CalloutComponent = ({ node, updateAttributes }: any) => {
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
    <NodeViewWrapper className={`callout callout-${type}`}>
      <div className="callout-icon-wrapper">
        <button
          onClick={() => setShowTypeMenu(!showTypeMenu)}
          className="callout-icon-button"
          contentEditable={false}
          type="button"
        >
          <Icon className="w-5 h-5" />
          <ChevronDown className="w-3 h-3 opacity-60" />
        </button>
        {showTypeMenu && (
          <div ref={menuRef} className="callout-type-menu" contentEditable={false}>
            {Object.entries(icons).map(([key, IconComponent]) => (
              <button
                key={key}
                onClick={() => {
                  updateAttributes({ type: key })
                  setShowTypeMenu(false)
                }}
                className={`callout-type-option ${type === key ? 'active' : ''}`}
                type="button"
              >
                <IconComponent className="w-4 h-4" />
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
        renderHTML: (attributes: Record<string, any>) => {
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

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
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
