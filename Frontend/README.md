# TaskBoard Pro

TaskBoard Pro is an advanced task collaboration platform with workflow automation capabilities.

## Features

- **User Authentication**
  - Google OAuth login
  - User profiles

- **Project Management**
  - Create and manage projects
  - Invite team members
  - Track project progress

- **Task Management**
  - Kanban board view
  - Task assignment
  - Due dates and priorities
  - Commenting system

- **Workflow Automation**
  - Custom automation rules
  - Task status triggers
  - Automatic notifications

## Tech Stack

- React (with Vite)
- Tailwind CSS
- Firebase Authentication
- React Router
- Framer Motion (animations)

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/TaskBoard-Pro.git
   ```

2. Navigate to the frontend directory:
   ```
   cd TaskBoard-Pro/Frontend
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

The project follows a modular structure:

```
src/
├── components/    # Reusable UI components
├── contexts/      # React context providers
├── layouts/       # Page layout components
├── pages/         # Application pages
├── utils/         # Utility functions
├── App.jsx        # Main application component
└── main.jsx       # Application entry point
```

## Database Schema

- **Users Collection**
  - id: string
  - name: string
  - email: string
  - avatar: string
  - createdAt: timestamp

- **Projects Collection**
  - id: string
  - title: string
  - description: string
  - ownerId: string (ref: users)
  - members: array<userId> (ref: users)
  - statuses: array<string>
  - createdAt: timestamp
  - updatedAt: timestamp

- **Tasks Collection**
  - id: string
  - projectId: string (ref: projects)
  - title: string
  - description: string
  - status: string
  - assigneeId: string (ref: users)
  - dueDate: timestamp
  - priority: string
  - createdAt: timestamp
  - updatedAt: timestamp

- **Automations Collection**
  - id: string
  - projectId: string (ref: projects)
  - trigger: string
  - action: string
  - conditions: object
  - active: boolean
  - createdAt: timestamp

## License

MIT
