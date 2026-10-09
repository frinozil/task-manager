# 📋 Taskflow — Modern Full-Stack Task Manager

A sleek, lightweight, and modern full-stack task management workspace built with **React 19**, **TypeScript**, **Tailwind CSS v4**, **Express 5**, and **Node.js**. Features persistent flat-file storage, live status progression, multi-criteria filtering, search, and a dark-themed UI.

---

## ✨ Features

- **⚡ Fast & Modern Architecture**: Powered by Vite 8, React 19, TypeScript, and Express 5.
- **🎨 Sleek Dark-Themed UI**: Clean aesthetic styled with Tailwind CSS v4 and Plus Jakarta Sans typography.
- **📊 Real-Time Progress Tracking**: Dynamic completion counter and animated progress bar calculating task metrics on the fly.
- **🔄 Task Lifecycle Progression**: Quickly cycle task status between `TODO`, `IN_PROGRESS`, and `COMPLETED`.
- **🔍 Search & Filter**: Filter tasks by status tab or priority (`HIGH`, `MEDIUM`, `LOW`), or search interactively across titles and descriptions.
- **↕️ Smart Sorting**: Reorder tasks by creation recency (`Newest`) or importance (`Priority`).
- **💾 Flat-File Persistence**: Zero-database requirement out-of-the-box; utilizes asynchronous file I/O (`node:fs/promises`) with `tasks.json`.
- **🛡️ Resilient Network Handling**: Graceful error banners and one-click retry if backend connectivity is disrupted.
- **🔌 Vite Reverse Proxy**: Seamless frontend-to-backend communication without CORS friction in development.

---

## 🛠️ Tech Stack

### Frontend (`client/`)
| Technology | Description |
| :--- | :--- |
| **React 19** | Modern UI component library |
| **TypeScript** | Type-safe development |
| **Vite 8** | Next-generation build tool & dev server |
| **Tailwind CSS v4** | Modern utility-first styling engine |
| **Lucide React** | Consistent, crisp icons |
| **Oxlint** | High-performance JavaScript/TypeScript linter |

### Backend (`server/`)
| Technology | Description |
| :--- | :--- |
| **Node.js** | ES Module runtime environment |
| **Express 5** | RESTful routing and API handlers |
| **CORS** | Cross-Origin Resource Sharing support |
| **Nodemon** | Automatic dev server restarts on file changes |
| **node:fs/promises** | Asynchronous persistent JSON storage |

---

## 📁 Project Structure

```text
task-manager/
├── client/                     # Frontend React + Vite application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable UI components (TaskModal, etc.)
│   │   ├── services/           # API service layer (fetch calls to backend)
│   │   ├── App.tsx             # Main dashboard view, state & filters
│   │   ├── index.css           # Tailwind CSS imports & global styles
│   │   └── main.tsx            # Application entry point
│   ├── index.html              # HTML shell & font definitions
│   ├── package.json            # Client dependencies & scripts
│   ├── tsconfig.json           # TypeScript configuration
│   └── vite.config.js          # Vite config & API reverse proxy
│
├── server/                     # Backend Node.js + Express API
│   ├── data/
│   │   └── tasks.json          # Flat-file database for tasks
│   ├── src/
│   │   ├── models/             # Data access layer (TaskModel file operations)
│   │   ├── routes/             # RESTful API route definitions
│   │   └── index.js            # Express server initialization & middleware
│   └── package.json            # Server dependencies & scripts
│
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or later recommended)
- `npm` (bundled with Node.js)

---

### 1. Backend Setup

Navigate to the `server` directory, install dependencies, and start the development server:

```bash
cd server
npm install
npm run dev
```

The Express API will start on:
👉 **`http://localhost:5000`**

Health check endpoint:
👉 **`http://localhost:5000/api/health`**

---

### 2. Frontend Setup

In a new terminal window, navigate to the `client` directory, install dependencies, and start Vite:

```bash
cd client
npm install
npm run dev
```

The React client will launch at:
👉 **`http://localhost:5173`** (or the port specified by Vite)

> **Note**: Vite is preconfigured with a proxy in `vite.config.js` to route all requests starting with `/api` directly to `http://localhost:5000`.

---

## 📡 REST API Reference

Base URL: `/api/tasks`

| Method | Endpoint | Description | Query / Body Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status check | None |
| `GET` | `/api/tasks` | Get all tasks | Optional query params: `?status=TODO\|IN_PROGRESS\|COMPLETED` and `?search=term` |
| `GET` | `/api/tasks/:id` | Get single task by ID | Route param: `:id` |
| `POST` | `/api/tasks` | Create a new task | JSON body: `{ "title": string, "description"?: string, "priority"?: "LOW"\|"MEDIUM"\|"HIGH" }` |
| `PATCH`| `/api/tasks/:id` | Update task details or status | JSON body with partial fields: `{ "status"?, "title"?, "description"?, "priority"? }` |
| `DELETE`| `/api/tasks/:id` | Delete a task | Route param: `:id` |

### Task Schema

```typescript
interface Task {
  id: number;           // Unix timestamp identifier
  title: string;        // Task title (required)
  description: string;  // Detailed description
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;    // Formatted date string
}
```

---

## 📜 Available Scripts

### In `/server`
- `npm run dev`: Runs server with `nodemon` for auto-reloading during development.
- `npm run start`: Runs server using standard `node src/index.js`.

### In `/client`
- `npm run dev`: Starts the Vite development server with HMR.
- `npm run build`: Compiles TypeScript and creates optimized production build in `dist/`.
- `npm run lint`: Runs `oxlint` for high-speed code linting.
- `npm run preview`: Previews the production build locally.

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
