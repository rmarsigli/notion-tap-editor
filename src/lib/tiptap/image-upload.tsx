import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { NodeViewWrapper } from '@tiptap/react'
import { Upload, AlignLeft, AlignCenter, AlignRight, Maximize2, ChevronDown, RefreshCw } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import type { ImageUploadNodeViewProps } from './types'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageUpload: {
      setImageUpload: () => ReturnType
    }
  }
}

const ImageUploadComponent = ({ node, updateAttributes }: ImageUploadNodeViewProps) => {
  const src = node.attrs.src
  const align = node.attrs.align || 'center'
  const caption = node.attrs.caption || ''
  const [showAlignMenu, setShowAlignMenu] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

  const alignments = {
    left: { icon: AlignLeft, label: 'Left' },
    center: { icon: AlignCenter, label: 'Center' },
    right: { icon: AlignRight, label: 'Right' },
    full: { icon: Maximize2, label: 'Full Width' },
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as globalThis.Node)) {
        setShowAlignMenu(false)
      }
    }

    if (showAlignMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showAlignMenu])

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.'
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds 10MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`
    }
    return null
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    const reader = new FileReader()
    reader.onerror = () => {
      setError('Failed to read file. Please try again.')
    }
    reader.onload = (event) => {
      const result = event.target?.result
      if (result) {
        updateAttributes({ src: result })
        setError(null)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (!file) return

    setError(null)
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    const reader = new FileReader()
    reader.onerror = () => {
      setError('Failed to read file. Please try again.')
    }
    reader.onload = (event) => {
      const result = event.target?.result
      if (result) {
        updateAttributes({ src: result })
        setError(null)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  if (!src) {
    return (
      <NodeViewWrapper className="image-upload-wrapper">
        <div
          className={`image-upload-placeholder ${isDragging ? 'dragging' : ''} ${error ? 'error' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-8 h-8 mb-2 opacity-50" />
          <p className="text-sm opacity-70 mb-1">Click to upload or drag and drop</p>
          <p className="text-xs opacity-50">PNG, JPG, GIF, WebP up to 10MB</p>
          {error && (
            <p className="text-xs text-red-600 mt-2 font-medium">{error}</p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </NodeViewWrapper>
    )
  }

  const AlignIcon = alignments[align as keyof typeof alignments]?.icon || AlignCenter

  return (
    <NodeViewWrapper className={`image-upload-wrapper align-${align}`}>
      <div className="image-container">
        <img src={src} alt={caption} className="uploaded-image" />
        <div className="image-controls">
          <div className="relative">
            <button
              onClick={() => setShowAlignMenu(!showAlignMenu)}
              className="image-align-button"
              contentEditable={false}
              type="button"
            >
              <AlignIcon className="w-4 h-4" />
              <ChevronDown className="w-3 h-3" />
            </button>
            {showAlignMenu && (
              <div ref={menuRef} className="image-align-menu" contentEditable={false}>
                {Object.entries(alignments).map(([key, { icon: Icon, label }]) => (
                  <button
                    key={key}
                    onClick={() => {
                      updateAttributes({ align: key })
                      setShowAlignMenu(false)
                    }}
                    className={`image-align-option ${align === key ? 'active' : ''}`}
                    type="button"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="image-replace-button"
            contentEditable={false}
            type="button"
          >
            <RefreshCw className="w-4 h-4" />
            Replace
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
      <input
        type="text"
        value={caption}
        onChange={(e) => updateAttributes({ caption: e.target.value })}
        placeholder="Add a caption..."
        className="image-caption"
        contentEditable={false}
      />
    </NodeViewWrapper>
  )
}

export const ImageUpload = Node.create({
  name: 'imageUpload',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      align: {
        default: 'center',
      },
      caption: {
        default: '',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-image-upload]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, string> }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-image-upload': '' })]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageUploadComponent)
  },

  addCommands() {
    return {
      setImageUpload:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { src: null, align: 'center' },
          })
        },
    }
  },
})
