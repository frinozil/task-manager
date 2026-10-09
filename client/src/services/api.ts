import { Task, TaskPriority, TaskStatus } from '../App'

const API_BASE = '/api/tasks'

export const api = {
    // Fetch all tasks from Express
    async getTasks(): Promise<Task[]> {
        const res = await fetch(API_BASE)
        if (!res.ok) throw new Error('Failed to fetch tasks')
        return res.json()
    },

    // Create a new task
    async createTask(data: {
        title: string
        description: string
        priority: TaskPriority
    }): Promise<Task> {
        const res = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error('Failed to create task')
        return res.json()
    },

    // Update task status
    async updateStatus(id: number, status: TaskStatus): Promise<Task> {
        const res = await fetch(`${API_BASE}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        })
        if (!res.ok) throw new Error('Failed to update task')
        return res.json()
    },

    // Delete a task
    async deleteTask(id: number): Promise<void> {
        const res = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE',
        })
        if (!res.ok) throw new Error('Failed to delete task')
    },
}
