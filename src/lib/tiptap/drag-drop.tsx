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
            drop(view: any, event: any) {
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
            dragover(_view: any, event: any) {
              event.preventDefault()
              return false
            },
          },
        },
      }),
    ]
  },
})
