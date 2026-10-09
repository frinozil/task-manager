import { Router } from 'express'
import { TaskModel } from '../models/taskModel.js'

const router = Router()

// 1. GET /api/tasks — Retrieve all tasks (with optional query filtering)
router.get('/', async (req, res) => {
    try {
        const { status, search } = req.query
        let tasks = await TaskModel.findAll()

        // Filter by status if query param provided (e.g., /api/tasks?status=TODO)
        if (status && status !== 'ALL') {
            tasks = tasks.filter((t) => t.status === status)
        }

        // Filter by search query if provided (e.g., /api/tasks?search=node)
        if (search) {
            const q = search.toLowerCase()
            tasks = tasks.filter(
                (t) =>
                    t.title.toLowerCase().includes(q) ||
                    t.description.toLowerCase().includes(q)
            )
        }

        res.json(tasks)
    } catch (error) {
        console.error('Error fetching tasks:', error)
        res.status(500).json({ error: 'Failed to retrieve tasks' })
    }
})

// 2. GET /api/tasks/:id — Retrieve single task
router.get('/:id', async (req, res) => {
    try {
        const task = await TaskModel.findById(req.params.id)
        if (!task) {
            return res.status(404).json({ error: 'Task not found' })
        }
        res.json(task)
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve task' })
    }
})

// 3. POST /api/tasks — Create a new task
router.post('/', async (req, res) => {
    try {
        const { title, description, priority } = req.body

        // Input Validation
        if (!title || typeof title !== 'string' || !title.trim()) {
            return res.status(400).json({ error: 'Task title is required' })
        }

        const newTask = await TaskModel.create({
            title: title.trim(),
            description: description ? description.trim() : '',
            priority: priority || 'MEDIUM',
        })

        // 201 Created is the standard status code for newly created resources
        res.status(201).json(newTask)
    } catch (error) {
        console.error('Error creating task:', error)
        res.status(500).json({ error: 'Failed to create task' })
    }
})

// 4. PATCH /api/tasks/:id — Update existing task or advance status
router.patch('/:id', async (req, res) => {
    try {
        const updatedTask = await TaskModel.update(req.params.id, req.body)

        if (!updatedTask) {
            return res.status(404).json({ error: 'Task not found' })
        }

        res.json(updatedTask)
    } catch (error) {
        console.error('Error updating task:', error)
        res.status(500).json({ error: 'Failed to update task' })
    }
})

// 5. DELETE /api/tasks/:id — Delete a task
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await TaskModel.delete(req.params.id)

        if (!deleted) {
            return res.status(404).json({ error: 'Task not found' })
        }

        res.json({ message: 'Task deleted successfully', id: Number(req.params.id) })
    } catch (error) {
        console.error('Error deleting task:', error)
        res.status(500).json({ error: 'Failed to delete task' })
    }
})

export default router
