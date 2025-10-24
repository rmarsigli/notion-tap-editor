import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { NodeViewWrapper } from '@tiptap/react'
import { Upload, AlignLeft, AlignCenter, AlignRight, Maximize2, ChevronDown, RefreshCw } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import type { ImageUploadNodeViewProps } from './types'
import { validateCaption, validateFileName, VALIDATION_LIMITS } from '@/lib/validation'

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
  const [captionError, setCaptionError] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

  const handleCaptionChange = (newCaption: string) => {
    const validation = validateCaption(newCaption)

    if (!validation.isValid && validation.error) {
      setCaptionError(validation.error)
    } else {
      setCaptionError(null)
    }

    updateAttributes({ caption: validation.sanitized })
  }

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
    // Validate file name
    const fileNameValidation = validateFileName(file.name)
    if (!fileNameValidation.isValid) {
      return fileNameValidation.error || 'Invalid file name'
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.'
    }

    // Validate file size
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
          role="button"
          tabIndex={0}
          aria-label="Upload image. Click or drag and drop to upload"
          className={`image-upload-placeholder ${isDragging ? 'dragging' : ''} ${error ? 'error' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              fileInputRef.current?.click()
            }
          }}
        >
          <Upload className="w-8 h-8 mb-2 opacity-50" aria-hidden="true" />
          <p className="text-sm opacity-70 mb-1">Click to upload or drag and drop</p>
          <p className="text-xs opacity-50">PNG, JPG, GIF, WebP up to 10MB</p>
          {error && (
            <p className="text-xs text-red-600 mt-2 font-medium" role="alert">{error}</p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            aria-label="Choose image file"
            className="hidden"
          />
        </div>
      </NodeViewWrapper>
    )
  }

  const AlignIcon = alignments[align as keyof typeof alignments]?.icon || AlignCenter

  return (
    <NodeViewWrapper className={`image-upload-wrapper align-${align}`} role="figure">
      <div className="image-container">
        <img src={src} alt={caption || 'Uploaded image'} className="uploaded-image" />
        <div className="image-controls" role="toolbar" aria-label="Image controls">
          <div className="relative">
            <button
              onClick={() => setShowAlignMenu(!showAlignMenu)}
              aria-label={`Change image alignment. Current: ${alignments[align as keyof typeof alignments]?.label}`}
              aria-haspopup="menu"
              aria-expanded={showAlignMenu}
              className="image-align-button focus:outline-none focus:ring-2 focus:ring-blue-500"
              contentEditable={false}
              type="button"
            >
              <AlignIcon className="w-4 h-4" aria-hidden="true" />
              <ChevronDown className="w-3 h-3" aria-hidden="true" />
            </button>
            {showAlignMenu && (
              <div ref={menuRef} role="menu" aria-label="Image alignment menu" className="image-align-menu" contentEditable={false}>
                {Object.entries(alignments).map(([key, { icon: Icon, label }]) => (
                  <button
                    key={key}
                    role="menuitem"
                    onClick={() => {
                      updateAttributes({ align: key })
                      setShowAlignMenu(false)
                    }}
                    aria-label={`Align image ${label.toLowerCase()}`}
                    className={`image-align-option focus:outline-none focus:ring-2 focus:ring-blue-500 ${align === key ? 'active' : ''}`}
                    type="button"
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            aria-label="Replace image"
            className="image-replace-button focus:outline-none focus:ring-2 focus:ring-blue-500"
            contentEditable={false}
            type="button"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Replace
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            aria-label="Choose replacement image"
            className="hidden"
          />
        </div>
      </div>
      <div className="w-full">
        <input
          type="text"
          value={caption}
          onChange={(e) => handleCaptionChange(e.target.value)}
          placeholder="Add a caption..."
          aria-label="Image caption"
          aria-describedby={captionError ? 'caption-error' : undefined}
          aria-invalid={!!captionError}
          maxLength={VALIDATION_LIMITS.MAX_CAPTION_LENGTH}
          className="image-caption"
          contentEditable={false}
        />
        {captionError && (
          <p id="caption-error" className="text-xs text-red-600 mt-1" role="alert">
            {captionError}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          {caption.length} / {VALIDATION_LIMITS.MAX_CAPTION_LENGTH} characters
        </p>
      </div>
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
