export const projects = [
  {
    id: '1',
    title: 'Website Redesign',
    description: 'Redesign company website with modern UI/UX',
    progress: 68,
    members: [
      { id: '1', name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/150?img=1' },
      { id: '2', name: 'Maya Patel', avatar: 'https://i.pravatar.cc/150?img=5' },
      { id: '3', name: 'David Kim', avatar: 'https://i.pravatar.cc/150?img=3' }
    ],
    createdAt: '2023-09-15',
    dueDate: '2023-12-10'
  },
  {
    id: '2',
    title: 'Mobile App Development',
    description: 'Build a cross-platform mobile app for client management',
    progress: 42,
    members: [
      { id: '2', name: 'Maya Patel', avatar: 'https://i.pravatar.cc/150?img=5' },
      { id: '4', name: 'Sarah Lee', avatar: 'https://i.pravatar.cc/150?img=4' }
    ],
    createdAt: '2023-10-01',
    dueDate: '2023-12-31'
  },
  {
    id: '3',
    title: 'Marketing Campaign',
    description: 'Q4 marketing campaign for product launch',
    progress: 24,
    members: [
      { id: '1', name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/150?img=1' },
      { id: '3', name: 'David Kim', avatar: 'https://i.pravatar.cc/150?img=3' },
      { id: '5', name: 'James Wilson', avatar: 'https://i.pravatar.cc/150?img=12' }
    ],
    createdAt: '2023-10-15',
    dueDate: '2024-01-15'
  }
];

export const tasks = {
  'todo': [
    {
      id: 't1',
      title: 'Research competitors',
      description: 'Analyze top 5 competitors in the market',
      priority: 'high',
      assignee: { id: '1', name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/150?img=1' },
      dueDate: '2023-11-05',
      labels: ['research', 'marketing']
    },
    {
      id: 't2',
      title: 'Create wireframes',
      description: 'Design initial wireframes for homepage',
      priority: 'medium',
      assignee: { id: '2', name: 'Maya Patel', avatar: 'https://i.pravatar.cc/150?img=5' },
      dueDate: '2023-11-10',
      labels: ['design', 'ui/ux']
    }
  ],
  'in-progress': [
    {
      id: 't3',
      title: 'Develop API endpoints',
      description: 'Create backend API endpoints for user authentication',
      priority: 'high',
      assignee: { id: '3', name: 'David Kim', avatar: 'https://i.pravatar.cc/150?img=3' },
      dueDate: '2023-11-15',
      labels: ['development', 'backend']
    },
    {
      id: 't4',
      title: 'User testing plan',
      description: 'Create a comprehensive user testing plan',
      priority: 'low',
      assignee: { id: '4', name: 'Sarah Lee', avatar: 'https://i.pravatar.cc/150?img=4' },
      dueDate: '2023-11-20',
      labels: ['testing', 'ux']
    }
  ],
  'done': [
    {
      id: 't5',
      title: 'Project kickoff meeting',
      description: 'Initial meeting with stakeholders to define project scope',
      priority: 'medium',
      assignee: { id: '1', name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/150?img=1' },
      dueDate: '2023-10-25',
      labels: ['meeting', 'planning']
    }
  ]
};

export const automationRules = [
  {
    id: 'r1',
    name: 'Assign high priority tasks to team lead',
    condition: {
      type: 'priority',
      value: 'high'
    },
    action: {
      type: 'assign',
      value: { id: '1', name: 'Alex Johnson' }
    }
  },
  {
    id: 'r2',
    name: 'Move completed tasks to Done column',
    condition: {
      type: 'status',
      value: 'completed'
    },
    action: {
      type: 'move',
      value: 'done'
    }
  }
];

export const user = {
  id: 'u1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatar: 'https://i.pravatar.cc/150?img=1',
  role: 'Product Manager'
};
