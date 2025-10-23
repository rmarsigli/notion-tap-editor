# Notion-Style Editor

Notion-inspired rich text editor built with TipTap 3, React 18, TypeScript, and Tailwind CSS 4. Access the **[Live Demo](https://rmarsigli.github.io/notion-tap-editor/)** to check it out.

## Features

- Slash commands (`/`)
- Drag & drop blocks
- Image upload with alignment & captions
- Tables with keyboard shortcuts
- Callouts (info, warning, error, success)
- Task lists, code blocks, quotes
- Bubble menu on text selection
- Custom extensions with `@apply`

## Stack

- TipTap
- React
- TypeScript
- Tailwind CSS
- Vite

## Quick Start

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
pnpm preview
```

## Custom Extensions

### ImageUpload
- Drag & drop or click upload
- Alignments: left, center, right, full width
- Caption support
- Base64 encoding (no server required... yet)

### Callout
- 4 types with color coding
- Click the icon to change the type
- Uses `NodeViewContent` for editable content

### TableKeyboardShortcuts
- `Cmd+Shift+Backspace` - Delete row
- `Cmd+Shift+Delete` - Delete column

### SlashCommands
- Custom suggestion system
- Filterable command list
- Auto-positioned menu

## Configuration

### Editor Setup (editor.tsx)
```tsx
const editor = useEditor({
  extensions: [
    StarterKit.configure({ dropcursor: false }),
    Dropcursor.configure({ color: 'hsl(var(--primary))', width: 2 }),
    ImageUpload,
    Table.configure({ resizable: true }),
    TableRow, TableHeader, TableCell,
    TaskList, TaskItem.configure({ nested: true }),
    Callout,
    TableKeyboardShortcuts,
    SlashCommands,
    DragDropHandler,
    FocusBlock,
  ],
})
```

### Vite Config
- Base path configured for GitHub Pages
- `@tailwindcss/vite` plugin
- Path alias: `@` → `./src`

## Styling

All styles use Tailwind's `@apply` directive in `src/styles/app.css`.
Custom properties follow shadcn/ui conventions.

## License

MIT
