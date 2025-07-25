import {
  IconArrowDown,
  IconArrowRight,
  IconArrowUp,
  IconBrain,
  IconRefresh,
  IconScale,
  IconCode,
  IconCheck,
} from '@tabler/icons-react'

export const labels = [
  {
    value: 'bug',
    label: 'Bug',
  },
  {
    value: 'feature',
    label: 'Feature',
  },
  {
    value: 'documentation',
    label: 'Documentation',
  },
]

// New stage-based statuses for Kanban board
export const stages = [
  {
    value: 'deep-dive',
    label: 'Deep Dive',
    icon: IconBrain,
    description: 'Explore and understand requirements',
    color: 'bg-blue-100 text-blue-800',
  },
  {
    value: 'iterating',
    label: 'Iterating',
    icon: IconRefresh,
    description: 'Refining and improving the approach',
    color: 'bg-yellow-100 text-yellow-800',
  },
  {
    value: 'considering',
    label: 'Considering',
    icon: IconScale,
    description: 'Evaluating feasibility and priority',
    color: 'bg-purple-100 text-purple-800',
  },
  {
    value: 'building',
    label: 'Building',
    icon: IconCode,
    description: 'Implementation and development',
    color: 'bg-orange-100 text-orange-800',
  },
  {
    value: 'closed',
    label: 'Closed',
    icon: IconCheck,
    description: 'Completed with retrospective',
    color: 'bg-green-100 text-green-800',
  },
]

// Keep legacy statuses for backward compatibility with existing table view
export const statuses = [
  {
    value: 'backlog',
    label: 'Backlog',
    icon: IconBrain,
  },
  {
    value: 'todo',
    label: 'Todo',
    icon: IconRefresh,
  },
  {
    value: 'in progress',
    label: 'In Progress',
    icon: IconCode,
  },
  {
    value: 'done',
    label: 'Done',
    icon: IconCheck,
  },
  {
    value: 'canceled',
    label: 'Canceled',
    icon: IconCheck,
  },
]

export const priorities = [
  {
    label: 'Low',
    value: 'low',
    icon: IconArrowDown,
  },
  {
    label: 'Medium',
    value: 'medium',
    icon: IconArrowRight,
  },
  {
    label: 'High',
    value: 'high',
    icon: IconArrowUp,
  },
]
