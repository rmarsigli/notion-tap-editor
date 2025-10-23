import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

export const DragDrop = Extension.create({
  name: 'dragDrop',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('dragDrop'),
        props: {
          handleDOMEvents: {
            drop(view, event) {
              const dragHandle = (event.target as HTMLElement).closest('[data-drag-handle]')
              if (!dragHandle) {
                const editorElement = view.dom
                const rect = editorElement.getBoundingClientRect()
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
            dragover(view, event) {
              event.preventDefault()
              return false
            },
          },
        },
      }),
    ]
  },
})
