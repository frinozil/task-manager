import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// 1. Resolve absolute path to server/data/tasks.json
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_FILE_PATH = path.join(__dirname, '../../data/tasks.json')

// 2. Helper: Read tasks from disk
async function readTasksFromFile() {
    try {
        const data = await fs.readFile(DATA_FILE_PATH, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        // If the file doesn't exist yet, return an empty array
        if (error.code === 'ENOENT') {
            return []
        }
        throw error
    }
}

// 3. Helper: Write tasks to disk
async function writeTasksToFile(tasks) {
    // null, 2 formats the JSON with 2-space indentation so it's readable
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(tasks, null, 2), 'utf-8')
}

// 4. Model CRUD operations
export const TaskModel = {
    // Get all tasks
    async findAll() {
        return await readTasksFromFile()
    },

    // Find a single task by ID
    async findById(id) {
        const tasks = await readTasksFromFile()
        return tasks.find((t) => t.id === Number(id))
    },

    // Create a new task
    async create({ title, description = '', priority = 'MEDIUM' }) {
        const tasks = await readTasksFromFile()
        const newTask = {
            id: Date.now(), // Generate unique ID
            title,
            description,
            status: 'TODO',
            priority,
            createdAt: new Date().toLocaleDateString(),
        }
        tasks.unshift(newTask) // Add to top of list
        await writeTasksToFile(tasks)
        return newTask
    },

    // Update existing task details or status
    async update(id, updates) {
        const tasks = await readTasksFromFile()
        const index = tasks.findIndex((t) => t.id === Number(id))

        if (index === -1) return null

        tasks[index] = {
            ...tasks[index],
            ...updates,
            id: tasks[index].id, // Prevent overriding ID
        }

        await writeTasksToFile(tasks)
        return tasks[index]
    },

    // Delete a task
    async delete(id) {
        const tasks = await readTasksFromFile()
        const index = tasks.findIndex((t) => t.id === Number(id))

        if (index === -1) return false

        tasks.splice(index, 1)
        await writeTasksToFile(tasks)
        return true
    },
}
