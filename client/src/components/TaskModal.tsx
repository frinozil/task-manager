import { useState, useEffect } from 'react'
import { X, AlertCircle } from 'lucide-react'
import { TaskPriority } from '../App'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (taskData: {
    title: string
    description: string
    priority: TaskPriority
  }) => void
}

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
]

export function TaskModal({ isOpen, onClose, onSave }: TaskModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM')
  const [error, setError] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      setError('Please provide a task title')
      return
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      priority,
    })

    setTitle('')
    setDescription('')
    setPriority('MEDIUM')
    setError('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[#121214] border border-zinc-800 rounded-xl shadow-2xl p-5 overflow-hidden animate-modal">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800/80">
          <div>
            <h2 className="text-sm font-semibold text-zinc-100">Create New Task</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Add an item to your workflow</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs px-3 py-2 rounded-lg">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Title <span className="text-zinc-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Design authentication middleware"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (error) setError('')
              }}
              className="w-full bg-[#09090b] border border-zinc-800 text-zinc-100 placeholder-zinc-600 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-zinc-500 transition-colors"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Description
            </label>
            <textarea
              placeholder="Add extra context, steps or notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-[#09090b] border border-zinc-800 text-zinc-100 placeholder-zinc-600 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-zinc-500 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Priority
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PRIORITY_OPTIONS.map((opt) => {
                const isSelected = priority === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPriority(opt.value)}
                    className={`py-1.5 px-3 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-100 text-zinc-900 border-zinc-100 font-semibold'
                        : 'border-zinc-800 bg-[#09090b] text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80">
            <span className="text-[11px] text-zinc-500">
              Esc to close
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 text-xs font-semibold text-zinc-950 bg-white hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                Create Task
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
