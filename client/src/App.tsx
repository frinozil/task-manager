import { useState, useEffect, useMemo } from 'react'
import {
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  Search,
  Trash2,
  Flag,
  Calendar,
  Check,
  ArrowUpDown,
  X,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { TaskModal } from './components/TaskModal'
import { api } from './services/api'

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Task {
  id: number
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  createdAt: string
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusTab, setStatusTab] = useState<'ALL' | TaskStatus>('ALL')
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | TaskPriority>('ALL')
  const [sortBy, setSortBy] = useState<'NEWEST' | 'PRIORITY'>('NEWEST')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 1. Fetch real tasks from Node.js backend on component mount
  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getTasks()
      setTasks(data)
    } catch (err) {
      console.error(err)
      setError('Could not connect to backend server. Make sure Node.js is running on port 5000.')
    } finally {
      setLoading(false)
    }
  }

  // 2. Create task on backend
  const handleCreateTask = async (newTaskData: {
    title: string
    description: string
    priority: TaskPriority
  }) => {
    try {
      const created = await api.createTask(newTaskData)
      setTasks([created, ...tasks])
    } catch (err) {
      console.error(err)
      alert('Failed to save task to server')
    }
  }

  // 3. Delete task on backend
  const handleDeleteTask = async (id: number) => {
    try {
      await api.deleteTask(id)
      setTasks(tasks.filter((t) => t.id !== id))
    } catch (err) {
      console.error(err)
      alert('Failed to delete task from server')
    }
  }

  // 4. Update status on backend
  const handleToggleStatus = async (id: number) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return

    const nextStatus: Record<TaskStatus, TaskStatus> = {
      TODO: 'IN_PROGRESS',
      IN_PROGRESS: 'COMPLETED',
      COMPLETED: 'TODO',
    }

    const updatedStatus = nextStatus[task.status]

    try {
      const updated = await api.updateStatus(id, updatedStatus)
      setTasks(tasks.map((t) => (t.id === id ? updated : t)))
    } catch (err) {
      console.error(err)
      alert('Failed to update task status')
    }
  }

  // Derived counts
  const totalCount = tasks.length
  const completedCount = tasks.filter((t) => t.status === 'COMPLETED').length
  const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length
  const todoCount = tasks.filter((t) => t.status === 'TODO').length
  const completionPercentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)

  // Filtered & Sorted Tasks
  const filteredTasks = useMemo(() => {
    const priorityWeight: Record<TaskPriority, number> = {
      HIGH: 3,
      MEDIUM: 2,
      LOW: 1,
    }

    return tasks
      .filter((task) => {
        const matchesSearch =
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusTab === 'ALL' || task.status === statusTab
        const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter

        return matchesSearch && matchesStatus && matchesPriority
      })
      .sort((a, b) => {
        if (sortBy === 'PRIORITY') {
          return priorityWeight[b.priority] - priorityWeight[a.priority]
        }
        return b.id - a.id
      })
  }, [tasks, searchQuery, statusTab, priorityFilter, sortBy])

  return (
    <div className="min-h-screen text-zinc-100 px-4 py-8 max-w-4xl mx-auto">
      {/* Top Header */}
      <header className="flex items-center justify-between pb-6 border-b border-zinc-800/80 mb-6">
        <div className="flex items-center gap-2.5">
          <h1 className="text-base font-semibold tracking-tight text-zinc-100">Task Manager</h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-950 bg-white hover:bg-zinc-200 transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Task</span>
        </button>
      </header>

      {/* Connection Error Banner */}
      {error && (
        <div className="mb-6 flex items-center justify-between gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={loadTasks}
            className="px-2.5 py-1 rounded-md bg-rose-500/20 hover:bg-rose-500/30 font-medium transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Overview & Progress Bar */}
      <section className="mb-6 p-4 rounded-xl bg-[#121214] border border-zinc-800/80">
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-2.5">
          <div className="flex items-center gap-4">
            <span className="text-zinc-200 font-medium">Progress</span>
            <span className="text-zinc-500 font-mono">
              {completedCount} of {totalCount} completed
            </span>
          </div>
          <span className="font-mono font-semibold text-zinc-200">
            {completionPercentage}%
          </span>
        </div>

        <div className="w-full h-1.5 rounded-full bg-zinc-900 overflow-hidden">
          <div
            className="h-full bg-zinc-200 transition-all duration-300 rounded-full"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </section>

      {/* Tabs & Controls */}
      <div className="space-y-3 mb-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          {/* Segmented Status Tabs */}
          <div className="flex items-center p-0.5 rounded-lg bg-[#121214] border border-zinc-800 text-xs">
            <button
              onClick={() => setStatusTab('ALL')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${statusTab === 'ALL'
                ? 'bg-zinc-800 text-zinc-100 font-medium shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
                }`}
            >
              All <span className="text-zinc-500 ml-0.5 font-mono">({totalCount})</span>
            </button>
            <button
              onClick={() => setStatusTab('TODO')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${statusTab === 'TODO'
                ? 'bg-zinc-800 text-zinc-100 font-medium shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
                }`}
            >
              To Do <span className="text-zinc-500 ml-0.5 font-mono">({todoCount})</span>
            </button>
            <button
              onClick={() => setStatusTab('IN_PROGRESS')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${statusTab === 'IN_PROGRESS'
                ? 'bg-zinc-800 text-zinc-100 font-medium shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
                }`}
            >
              In Progress <span className="text-zinc-500 ml-0.5 font-mono">({inProgressCount})</span>
            </button>
            <button
              onClick={() => setStatusTab('COMPLETED')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${statusTab === 'COMPLETED'
                ? 'bg-zinc-800 text-zinc-100 font-medium shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
                }`}
            >
              Done <span className="text-zinc-500 ml-0.5 font-mono">({completedCount})</span>
            </button>
          </div>

          {/* Sort Switcher */}
          <button
            onClick={() => setSortBy(sortBy === 'NEWEST' ? 'PRIORITY' : 'NEWEST')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-[#121214] border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <ArrowUpDown className="w-3 h-3 text-zinc-500" />
            <span>Sort: {sortBy === 'NEWEST' ? 'Recent' : 'Priority'}</span>
          </button>
        </div>

        {/* Search & Priority Filter */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121214] border border-zinc-800 pl-9 pr-8 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 rounded-lg focus:outline-none focus:border-zinc-600 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex gap-1.5">
            {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setPriorityFilter(lvl)}
                className={`px-2.5 py-1 text-xs rounded-lg border transition-colors cursor-pointer ${priorityFilter === lvl
                  ? 'border-zinc-600 bg-zinc-800 text-zinc-100 font-medium'
                  : 'border-zinc-800 bg-[#121214] text-zinc-400 hover:text-zinc-200'
                  }`}
              >
                {lvl === 'ALL' ? 'All' : lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task Cards List */}
      <div className="space-y-2">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-zinc-500 gap-2 text-xs">
            <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
            <span>Loading tasks from Express server...</span>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12 px-4 bg-[#121214] rounded-xl border border-dashed border-zinc-800">
            <p className="text-xs text-zinc-400">No tasks match your criteria.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-3 px-3 py-1 rounded-lg text-xs font-medium text-zinc-300 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              + Create a task
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isDone = task.status === 'COMPLETED'
            const isInProgress = task.status === 'IN_PROGRESS'

            return (
              <div
                key={task.id}
                className={`group flex items-start justify-between gap-3 p-3.5 rounded-xl border transition-colors ${isDone
                  ? 'bg-[#0f0f11] border-zinc-800/50 opacity-60'
                  : 'bg-[#121214] border-zinc-800/80 hover:border-zinc-700'
                  }`}
              >
                {/* Left check status toggle */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => handleToggleStatus(task.id)}
                    className="mt-0.5 shrink-0 transition-transform active:scale-95 cursor-pointer text-zinc-500 hover:text-zinc-300"
                    title="Advance status"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isInProgress ? (
                      <Clock className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Circle className="w-4 h-4 hover:text-zinc-300" />
                    )}
                  </button>

                  {/* Task details */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-xs font-medium transition-colors truncate ${isDone ? 'line-through text-zinc-500' : 'text-zinc-200'
                        }`}
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-2 leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded border ${task.priority === 'HIGH'
                          ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                          : task.priority === 'MEDIUM'
                            ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                            : 'text-zinc-400 bg-zinc-900 border-zinc-800'
                          }`}
                      >
                        <Flag className="w-2.5 h-2.5" />
                        {task.priority}
                      </span>

                      <span className="text-[10px] text-zinc-400 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${isDone
                            ? 'bg-emerald-400'
                            : isInProgress
                              ? 'bg-amber-400'
                              : 'bg-zinc-500'
                            }`}
                        />
                        {task.status.replace('_', ' ')}
                      </span>

                      <span className="text-[10px] text-zinc-500 inline-flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5" />
                        {task.createdAt}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right actions */}
                <div className="flex items-center gap-1 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleToggleStatus(task.id)}
                    className="p-1 text-zinc-500 hover:text-zinc-200 rounded hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Advance status"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1 text-zinc-500 hover:text-rose-400 rounded hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Delete task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Task Creation Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateTask}
      />
    </div>
  )
}
