// Mock data for projects and project details
const mockProjects = [
  {
    id: '1',
    name: 'E-commerce Platform',
    description: 'Complete redesign of the company online store with modern UI and improved checkout flow.',
    progress: 70,
    members: [
      { id: 'user1', name: 'John Doe', avatar: 'JD', color: 'bg-primary' },
      { id: 'user2', name: 'Sarah Smith', avatar: 'SS', color: 'bg-secondary' },
    ],
    tasks: [
      {
        id: 'task1',
        title: 'Design Homepage',
        description: 'Create wireframes and high-fidelity mockups for the homepage.',
        status: 'Completed',
        priority: 'High',
        assignee: { id: 'user1', name: 'John Doe', avatar: 'JD', color: 'bg-primary' },
        dueDate: '2023-11-15',
        comments: 3
      },
      {
        id: 'task2',
        title: 'Implement Payment Integration',
        description: 'Integrate with Stripe API for payment processing.',
        status: 'In Progress',
        priority: 'High',
        assignee: { id: 'user2', name: 'Sarah Smith', avatar: 'SS', color: 'bg-secondary' },
        dueDate: '2023-11-25',
        comments: 5
      },
      {
        id: 'task3',
        title: 'User Testing',
        description: 'Conduct user testing sessions with 5-10 participants.',
        status: 'To Do',
        priority: 'Medium',
        assignee: null,
        dueDate: '2023-12-05',
        comments: 0
      }
    ]
  },
  {
    id: '2',
    name: 'Mobile App Redesign',
    description: 'Revamp the existing mobile application with new features and improved performance.',
    progress: 45,
    members: [
      { id: 'user1', name: 'John Doe', avatar: 'JD', color: 'bg-primary' },
      { id: 'user3', name: 'Mike Johnson', avatar: 'MJ', color: 'bg-accent' },
    ],
    tasks: [
      {
        id: 'task4',
        title: 'UI Component Library',
        description: 'Build a reusable component library for the app.',
        status: 'In Progress',
        priority: 'Medium',
        assignee: { id: 'user3', name: 'Mike Johnson', avatar: 'MJ', color: 'bg-accent' },
        dueDate: '2023-11-30',
        comments: 2
      },
      {
        id: 'task5',
        title: 'Performance Optimization',
        description: 'Improve app loading time and overall performance.',
        status: 'To Do',
        priority: 'High',
        assignee: null,
        dueDate: '2023-12-10',
        comments: 0
      }
    ]
  }
];

// Get all projects
export const getProjects = async () => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProjects);
    }, 500);
  });
};

// Get a specific project by ID
export const getProjectDetails = async (projectId) => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const project = mockProjects.find(p => p.id === projectId);
      
      if (project) {
        resolve(project);
      } else {
        reject(new Error("Project not found"));
      }
    }, 500);
  });
};

// Create a new project
export const createProject = async (projectData) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const newProject = {
        id: `project-${Date.now()}`,
        ...projectData,
        tasks: [],
        createdAt: new Date().toISOString()
      };
      
      // In a real app, this would add to the database
      mockProjects.push(newProject);
      resolve(newProject);
    }, 700);
  });
};

// Update a project
export const updateProject = async (projectId, updateData) => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const projectIndex = mockProjects.findIndex(p => p.id === projectId);
      
      if (projectIndex !== -1) {
        mockProjects[projectIndex] = {
          ...mockProjects[projectIndex],
          ...updateData,
          updatedAt: new Date().toISOString()
        };
        resolve(mockProjects[projectIndex]);
      } else {
        reject(new Error("Project not found"));
      }
    }, 700);
  });
};
