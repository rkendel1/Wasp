// Sample tasks data for testing with the new schema
import { Task } from '../data/schema'

export const sampleTasks: Task[] = [
  {
    id: 'TASK-001',
    title: 'Implement user authentication system',
    description: 'Create a secure login and registration system with password encryption',
    stage: 'deep-dive',
    priority: 'high',
    label: 'feature',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    userId: 'user-1',
    llmResponses: [
      {
        id: 'llm-1',
        stage: 'deep-dive',
        prompt: 'Analyze authentication requirements',
        response: 'Key considerations for authentication:\n• Security best practices\n• Session management\n• Password requirements\n• Multi-factor authentication options',
        metadata: { complexity: 'high', security_focus: true },
        createdAt: new Date('2024-01-15')
      }
    ]
  },
  {
    id: 'TASK-002',
    title: 'Design responsive dashboard layout',
    description: 'Create a mobile-friendly dashboard with data visualization components',
    stage: 'iterating',
    priority: 'medium',
    label: 'feature',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-18'),
    userId: 'user-1',
    llmResponses: [
      {
        id: 'llm-2',
        stage: 'iterating',
        prompt: 'Provide design iteration feedback',
        response: 'Design improvements:\n• Use consistent spacing\n• Implement progressive disclosure\n• Add dark mode support\n• Optimize for mobile breakpoints',
        metadata: { design_focus: true, accessibility: 'medium' },
        createdAt: new Date('2024-01-18')
      }
    ]
  },
  {
    id: 'TASK-003',
    title: 'Fix database performance issues',
    description: 'Optimize slow queries and add proper indexing',
    stage: 'considering',
    priority: 'high',
    label: 'bug',
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-19'),
    userId: 'user-1',
    llmResponses: [
      {
        id: 'llm-3',
        stage: 'considering',
        prompt: 'Assess database optimization priority',
        response: 'Priority Assessment:\n• High impact on user experience\n• Affects multiple features\n• Technical debt reduction\n• Estimated effort: 3-4 days',
        metadata: { feasibility: 'high', effort_days: 4, impact: 'high' },
        createdAt: new Date('2024-01-19')
      }
    ]
  },
  {
    id: 'TASK-004',
    title: 'Implement real-time notifications',
    description: 'Add WebSocket support for live updates and notifications',
    stage: 'building',
    priority: 'medium',
    label: 'feature',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-20'),
    userId: 'user-1',
    llmResponses: [
      {
        id: 'llm-4',
        stage: 'building',
        prompt: 'Generate WebSocket implementation guidance',
        response: 'Implementation approach:\n• Use Socket.io for WebSocket management\n• Create notification service class\n• Implement connection pooling\n• Add error handling and reconnection logic',
        metadata: { libraries: ['socket.io'], complexity: 'medium', patterns: ['service', 'pool'] },
        createdAt: new Date('2024-01-20')
      }
    ]
  },
  {
    id: 'TASK-005',
    title: 'Update API documentation',
    description: 'Complete OpenAPI specification and add examples',
    stage: 'closed',
    priority: 'low',
    label: 'documentation',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-21'),
    userId: 'user-1',
    llmResponses: [
      {
        id: 'llm-5',
        stage: 'closed',
        prompt: 'Provide retrospective analysis',
        response: 'Task Summary:\n• Successfully documented all API endpoints\n• Added comprehensive examples\n• Improved developer onboarding\n• Lessons: Clear documentation saves development time',
        metadata: { status: 'completed', satisfaction: 'high', impact: 'positive' },
        createdAt: new Date('2024-01-21')
      }
    ]
  },
  {
    id: 'TASK-006',
    title: 'Refactor legacy components',
    description: 'Update old React class components to functional components with hooks',
    stage: 'deep-dive',
    priority: 'medium',
    label: 'bug',
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22'),
    userId: 'user-1',
  },
  {
    id: 'TASK-007',
    title: 'Add data export functionality',
    description: 'Allow users to export their data in CSV and JSON formats',
    stage: 'iterating',
    priority: 'low',
    label: 'feature',
    createdAt: new Date('2024-01-23'),
    updatedAt: new Date('2024-01-23'),
    userId: 'user-1',
  }
]