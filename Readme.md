# TaskBoard Pro

A modern project management and collaboration platform designed to help teams organize, track, and manage their tasks efficiently with real-time updates and workflow automation.

![Screenshot from 2025-05-17 22-25-10](https://github.com/user-attachments/assets/48911fe3-e9d7-43a3-97ba-5fe7fcab779b)

---

## Table of Contents

- [Introduction](#introduction)
- [Key Screenshots](#key-screenshots)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

---

## Introduction

TaskBoard Pro is a full-stack task management application built with **React**, **Node.js**, **Express**, and **MongoDB**. It enables teams to collaborate on projects, manage tasks using a Kanban-style board, communicate via comments, and automate repetitive workflows.

The application offers:

- A responsive UI optimized for all devices
- Real-time updates via WebSockets
- Customizable workflows and automation rules
- Detailed analytics to track project progress
- Dark mode UI for reduced eye strain

---

## Key Screenshots

### Home Page
![Screenshot from 2025-05-17 22-25-10](https://github.com/user-attachments/assets/48911fe3-e9d7-43a3-97ba-5fe7fcab779b)
*The landing page showcases TaskBoard Pro's modern interface and key features.*


### Login Page
![Screenshot from 2025-05-17 22-25-29](https://github.com/user-attachments/assets/b2a18b0b-c14e-4689-a21d-f94f32e8217f)
*The login page allows users to securely access their accounts with email and password authentication.*

### Dashboard
![Screenshot from 2025-05-17 22-26-01](https://github.com/user-attachments/assets/960c8ed2-afd5-499b-bf3c-a62d14e535e0)
![Screenshot from 2025-05-17 22-25-54](https://github.com/user-attachments/assets/6312a1e7-a6ec-4715-857c-0234eb8eaddc)
*The dashboard provides an overview of all projects with progress indicators.*

### Project Kanban Board
![Screenshot from 2025-05-17 22-26-20](https://github.com/user-attachments/assets/4041038b-b9e0-4b94-b734-1dcd13e5c622)
*The intuitive drag-and-drop interface for managing tasks across different statuses.*

### Task Details View
![Screenshot from 2025-05-17 22-33-04](https://github.com/user-attachments/assets/6fd1253d-20b4-4b02-9055-e405d4c90735)
*Comprehensive task information with comments, labels, and assignment options.*


### Invite Member
![Screenshot from 2025-05-17 22-27-01](https://github.com/user-attachments/assets/ed39fddd-e6ae-49db-af37-5f4721351936)
*Easy-to-use interface for inviting team members to collaborate on projects with role assignment options.*


### Automation Rules Page
![Screenshot from 2025-05-17 22-26-48](https://github.com/user-attachments/assets/eb0261da-658c-4707-ab00-3fcd410aa2b1)
*Set up custom workflows to automate repetitive tasks and notifications.*

---

## Features

### Project Management

- **Project Creation & Organization:** Create new projects, add descriptions, and organize work.
- **Customizable Statuses:** Define your own workflow stages (To Do, In Progress, Review, Done, etc.).
- **Team Collaboration:** Invite team members and assign roles (owner, member).
- **Progress Tracking:** Visual indicators of project completion and task distribution.

### Task Management

- **Kanban Board View:** Drag-and-drop interface for managing tasks.
- **Task Details:** Title, description, assignee, due date, priority, urgency.
- **Comments & Discussions:** Threaded comments on tasks.
- **Task Assignments:** Assign tasks with email notifications.
- **Labels & Filtering:** Categorize tasks and filter by multiple criteria.

### User Experience

- **Real-time Updates:** Instant changes via WebSocket integration.
- **Responsive Design:** Works on desktop, tablet, and mobile.
- **Notifications:** In-app for assignments, mentions, and status changes.
- **Dark Mode Support:** Reduces eye strain during extended use.
- **Intuitive Navigation:** Streamlined UI for maximum productivity.

### Workflow Automation

- **Custom Automation Rules:** "If this, then that" style automations.
- **Triggers:** Status change, assignment change, due date passed.
- **Actions:** Move tasks, assign badges, send notifications.
- **Achievement Badges:** Gamification elements to boost engagement.
- **Scheduled Automations:** Set time-based rules for recurring tasks.

### Security & Access Control

- **Authentication:** Secure user authentication with Firebase.
- **Role-Based Access:** Different permissions for owners/members.
- **Data Protection:** Encrypted storage and secure API endpoints.
- **Activity Logs:** Track all changes for accountability.

---

## Technology Stack

- **Frontend:**
  - React with Vite for fast development
  - Framer Motion for smooth animations
  - Tailwind CSS for styling
  - Lucide React for icons
  - Firebase Authentication

- **Backend:**
  - Node.js and Express
  - MongoDB with Mongoose
  - Socket.IO for real-time updates
  - JWT for API authentication

---

## API Documentation

**All endpoints (except registration/login) require authentication via a Bearer token:**
```
Authorization: Bearer <your-jwt-token>
```

### Projects API

| Endpoint                                 | Method | Description                        | Request Body             | Response                  |
|-------------------------------------------|--------|------------------------------------|--------------------------|---------------------------|
| `/api/projects`                          | GET    | Get all projects for current user  | -                        | Array of project objects  |
| `/api/projects`                          | POST   | Create a new project               | `{title, description}`   | Created project object    |
| `/api/projects/:projectId`               | GET    | Get a specific project             | -                        | Project object            |
| `/api/projects/:projectId`               | PUT    | Update a project                   | `{title, description}`   | Updated project object    |
| `/api/projects/:projectId`               | DELETE | Delete a project                   | -                        | Success message           |
| `/api/projects/:projectId/invite`        | POST   | Invite user to project             | `{email}`                | Success message           |
| `/api/projects/:projectId/members/:userId`| DELETE| Remove user from project           | -                        | Success message           |

### Tasks API

| Endpoint                                 | Method | Description                        | Request Body                               | Response                |
|-------------------------------------------|--------|------------------------------------|--------------------------------------------|-------------------------|
| `/api/tasks`                             | POST   | Create a new task                  | `{title, description, projectId, status, assignee, dueDate, priority, isUrgent}` | Created task object     |
| `/api/tasks/project/:projectId`          | GET    | Get all tasks for a project        | -                                          | Array of task objects   |
| `/api/tasks/user/assigned`               | GET    | Get tasks assigned to current user | -                                          | Array of task objects   |
| `/api/tasks/:taskId`                     | GET    | Get a specific task                | -                                          | Task object             |
| `/api/tasks/:taskId`                     | PUT    | Update a task                      | Task fields to update                      | Updated task object     |
| `/api/tasks/:taskId/status`              | PATCH  | Update task status                 | `{status}`                                 | Updated task object     |
| `/api/tasks/:taskId`                     | DELETE | Delete a task                      | -                                          | Success message         |
| `/api/tasks/project/:projectId/statuses` | PUT    | Update project statuses            | `{statuses: []}`                           | Updated project object  |

### Comments API

| Endpoint                                 | Method | Description                        | Request Body         | Response                  |
|-------------------------------------------|--------|------------------------------------|----------------------|---------------------------|
| `/api/comments`                          | POST   | Create a comment                   | `{taskId, content}`  | Created comment object    |
| `/api/comments/task/:taskId`             | GET    | Get comments for a task            | -                    | Array of comment objects  |
| `/api/comments/:commentId`               | DELETE | Delete a comment                   | -                    | Success message           |

### Automations API

| Endpoint                                 | Method | Description                        | Request Body         | Response                  |
|-------------------------------------------|--------|------------------------------------|----------------------|---------------------------|
| `/api/automations`                       | POST   | Create automation rule             | Automation object    | Created automation object |
| `/api/automations/project/:projectId`    | GET    | Get automations for project        | -                    | Array of automation objects|
| `/api/automations/:automationId`         | PUT    | Update automation                  | Automation fields    | Updated automation object |
| `/api/automations/:automationId`         | DELETE | Delete automation                  | -                    | Success message           |
| `/api/automations/badges`                | GET    | Get user badges                    | -                    | Array of badge objects    |
| `/api/automations/notifications`         | GET    | Get user notifications             | -                    | Array of notification objects|

---

## Database Schema

<details>
<summary>Click to expand collections</summary>

### Project

```js
{
  _id: ObjectId,
  title: String,
  description: String,
  createdBy: String, // Firebase UID
  members: [
    {
      userId: String, // Firebase UID
      email: String,
      role: String, // 'owner' or 'member'
      name: String,
      joinedAt: Date
    }
  ],
  statuses: [String], // e.g., ['To Do', 'In Progress', 'Done']
  createdAt: Date,
  updatedAt: Date
}
```

### Task

```js
{
  _id: ObjectId,
  title: String,
  description: String,
  projectId: ObjectId, // ref: Project
  status: String,
  assignee: {
    userId: String,
    email: String,
    name: String
  },
  dueDate: Date,
  isUrgent: Boolean,
  priority: String, // '', 'low', 'medium', 'high'
  createdBy: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Comment

```js
{
  _id: ObjectId,
  taskId: ObjectId, // ref: Task
  projectId: ObjectId, // ref: Project
  content: String,
  author: {
    userId: String,
    name: String,
    email: String,
    photoURL: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Automation

```js
{
  _id: ObjectId,
  projectId: ObjectId, // ref: Project
  name: String,
  isActive: Boolean,
  trigger: {
    type: String, // 'STATUS_CHANGE', 'ASSIGNMENT_CHANGE', 'DUE_DATE_PASSED'
    fromStatus: String,
    toStatus: String,
    assigneeEmail: String
  },
  action: {
    type: String, // 'MOVE_TASK', 'ASSIGN_BADGE', 'SEND_NOTIFICATION'
    targetStatus: String,
    badgeName: String,
    notificationText: String,
    notifyAssignee: Boolean,
    notifyCreator: Boolean,
    notifyProjectOwners: Boolean
  },
  createdBy: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Badge

```js
{
  _id: ObjectId,
  userId: String,
  name: String,
  description: String,
  projectId: ObjectId, // ref: Project
  taskId: ObjectId, // ref: Task
  automationId: ObjectId, // ref: Automation
  awardedAt: Date
}
```

### Notification

```js
{
  _id: ObjectId,
  userId: String,
  type: String, // 'TASK_ASSIGNED', 'TASK_UPDATED', 'COMMENT_ADDED', 'AUTOMATION_TRIGGERED'
  title: String,
  content: String,
  relatedProjectId: ObjectId, // ref: Project
  relatedTaskId: ObjectId, // ref: Task
  isRead: Boolean,
  createdAt: Date
}
```
</details>

---

## System Architecture

```
┌──────────────┐           ┌──────────────┐           ┌──────────────┐
│ React Frontend│◄───────►│ Express API  │◄───────►  │  MongoDB     │
│   (Vite)     │  HTTP    │  (Node.js)   │           │              │
└──────────────┘           └──────────────┘           └──────────────┘
        │                        │
        ▼                        ▼
    WebSocket                Socket.io
      (Client)                (Server)

┌──────────────┐
│  Firebase    │
│Authentication│
└──────────────┘
```

---

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- Firebase account for authentication

### Installation

1. **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/taskboard-pro.git
    cd taskboard-pro
    ```

2. **Install dependencies for backend and frontend**
    ```bash
    # Backend
    cd Backend
    npm install

    # Frontend
    cd ../Frontend
    npm install
    ```

3. **Create environment files**
    ```bash
    # Backend
    touch .env

    # Frontend
    touch .env
    ```

4. **Set environment variables**

    **Backend (.env):**
    ```
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    FIREBASE_CONFIG=your_firebase_config
    FRONTEND_URL=http://localhost:5173
    ```

    **Frontend (.env):**
    ```
    VITE_API_URL=http://localhost:5000/api
    VITE_FIREBASE_API_KEY=your_firebase_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
    ```

5. **Start the development servers**
    ```bash
    # Backend
    cd Backend
    npm run dev

    # Frontend (in another terminal)
    cd Frontend
    npm run dev
    ```

6. **Access the application**
    - Frontend: http://localhost:5173  
    - Backend API: http://localhost:5000

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.