import { useState } from 'react'
import DragHandle from '@tiptap/extension-drag-handle-react'
import { Editor } from '@tiptap/react'
import { GripVertical } from 'lucide-react'

interface DragHandleWrapperProps {
  editor: Editor | null
}

export function DragHandleWrapper({ editor }: DragHandleWrapperProps) {
  const [shouldShow, setShouldShow] = useState(true)

  if (!editor) return null

  return (
    <DragHandle
      editor={editor}
      onNodeChange={(data) => {
        // Hide drag handle on empty paragraphs (where the [+] button shows)
        if (data.node) {
          const isEmpty = data.node.type.name === 'paragraph' && data.node.content.size === 0
          setShouldShow(!isEmpty)
        } else {
          setShouldShow(true)
        }
      }}
    >
      <div
        className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-grab active:cursor-grabbing"
        style={{ opacity: shouldShow ? 1 : 0, pointerEvents: shouldShow ? 'auto' : 'none' }}
      >
        <GripVertical className="w-4 h-4" />
      </div>
    </DragHandle>
  )
}
