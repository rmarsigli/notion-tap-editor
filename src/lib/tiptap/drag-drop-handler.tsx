import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { EditorView } from '@tiptap/pm/view'
import { Slice } from '@tiptap/pm/model'

/**
 * Extension to prevent dragging blocks INTO list items
 * Blocks can only be dropped BETWEEN blocks at the same level
 */
export const DragDropHandler = Extension.create({
  name: 'dragDropHandler',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('dragDropHandler'),
        props: {
          handleDrop(view: EditorView, event: DragEvent, _slice: Slice, moved: boolean) {
            // If this is not a moved operation (internal drag), allow default behavior
            if (!moved) {
              return false
            }

            // Get the position where the drop is happening
            const pos = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            })

            if (!pos) {
              return false
            }

            // Resolve the position to get node information
            const $pos = view.state.doc.resolve(pos.pos)

            // Check if we're trying to drop inside a listItem
            // Walk up the tree to see if any parent is a listItem
            for (let depth = $pos.depth; depth > 0; depth--) {
              const node = $pos.node(depth)

              // If we find a listItem parent, prevent the drop
              if (node.type.name === 'listItem') {
                event.preventDefault()
                return true // true means we handled it (by blocking it)
              }
            }

            // Allow the drop if we're not inside a listItem
            return false
          },
        },
      }),
    ]
  },
})
