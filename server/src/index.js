import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes.js'

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//Mount task routes at /api/tasks
app.use('/api/tasks', taskRoutes)

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Task Manager API is running smoothly',
        timestamp: new Date().toISOString(),
    })
})
// 3. Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
})