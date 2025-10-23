import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

/**
 * Extension to highlight the current block with a border when focused
 */
export const FocusBlock = Extension.create({
  name: 'focusBlock',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('focusBlock'),
        props: {
          decorations: (state) => {
            const { selection } = state
            const { $from } = selection

            // Get the depth of the current block-level node
            // We want to highlight the outermost block (paragraph, heading, list, etc)
            let depth = $from.depth
            while (depth > 0) {
              const node = $from.node(depth)
              // Stop at block-level nodes
              if (node.isBlock && node.type.name !== 'doc') {
                break
              }
              depth--
            }

            if (depth === 0) {
              return DecorationSet.empty
            }

            const from = $from.before(depth)
            const to = $from.after(depth)

            const decoration = Decoration.node(from, to, {
              class: 'focused-block',
            })

            return DecorationSet.create(state.doc, [decoration])
          },
        },
      }),
    ]
  },
})
