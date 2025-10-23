import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { EditorView } from '@tiptap/pm/view'

export const DragDrop = Extension.create({
  name: 'dragDrop',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('dragDrop'),
        props: {
          handleDOMEvents: {
            drop(view: EditorView, event: DragEvent) {
              const dragHandle = (event.target as HTMLElement).closest('[data-drag-handle]')
              if (!dragHandle) {
                const posAtCoords = view.posAtCoords({
                  left: event.clientX,
                  top: event.clientY,
                })

                if (posAtCoords) {
                  event.preventDefault()
                  return true
                }
              }
              return false
            },
            dragover(_view: EditorView, event: DragEvent) {
              event.preventDefault()
              return false
            },
          },
        },
      }),
    ]
  },
})
