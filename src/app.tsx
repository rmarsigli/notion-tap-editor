import { Editor } from './components/editor/editor'

function App() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Notion Tap Editor</h1>
          <p className="text-muted-foreground">
            React + TypeScript + TipTap 3 + Tailwind CSS 4 + shadcn/ui
          </p>
        </div>

        <Editor />
      </div>
    </div>
  )
}

export default App
