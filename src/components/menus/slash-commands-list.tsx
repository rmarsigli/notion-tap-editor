import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { SlashCommand } from '@/lib/tiptap/slash-commands'
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListTodo,
  Quote,
  Code,
  Minus,
  Text,
  LucideIcon
} from 'lucide-react'

interface SlashCommandsListProps {
  items: SlashCommand[]
  command: (item: SlashCommand) => void
}

const iconMap: Record<string, LucideIcon> = {
  Text: Text,
  H1: Heading1,
  H2: Heading2,
  H3: Heading3,
  List: List,
  ListOrdered: ListOrdered,
  ListTodo: ListTodo,
  Quote: Quote,
  Code: Code,
  Minus: Minus,
}

export const SlashCommandsList = forwardRef((props: SlashCommandsListProps, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = (index: number) => {
    const item = props.items[index]
    if (item) {
      props.command(item)
    }
  }

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => setSelectedIndex(0), [props.items])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        upHandler()
        return true
      }

      if (event.key === 'ArrowDown') {
        downHandler()
        return true
      }

      if (event.key === 'Enter') {
        enterHandler()
        return true
      }

      return false
    },
  }))

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden w-72 slash-commands-menu">
      <div className="p-1">
        {props.items.length === 0 ? (
          <div className="px-3 py-2 text-sm text-gray-500">No results</div>
        ) : (
          props.items.map((item, index) => {
            const Icon = iconMap[item.icon]
            return (
              <button
                key={index}
                onClick={() => selectItem(index)}
                className={`w-full text-left px-3 py-2 rounded-md flex items-start gap-3 transition-colors cursor-pointer ${
                  index === selectedIndex
                    ? 'bg-gray-100'
                    : 'hover:bg-gray-50'
                }`}
                type="button"
              >
                <div className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 ${
                  index === selectedIndex ? 'bg-white border border-gray-200' : 'bg-gray-100'
                }`}>
                  {Icon && <Icon className="w-5 h-5 text-gray-600" />}
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <div className="font-medium text-sm text-gray-900">{item.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
})

SlashCommandsList.displayName = 'SlashCommandsList'
