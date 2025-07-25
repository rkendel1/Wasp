import {
  IconArrowDown,
  IconArrowRight,
  IconArrowUp,
  IconBrain,
  IconRefresh,
  IconEye,
  IconHammer,
  IconCheck,
  IconExclamationCircle,
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
  {
    value: 'enhancement',
    label: 'Enhancement',
  },
  {
    value: 'research',
    label: 'Research',
  },
]

export const stages = [
  {
    value: 'DEEP_DIVE',
    label: 'Deep Dive',
    icon: IconBrain,
    description: 'Initial exploration and understanding',
    color: 'bg-blue-100 border-blue-300 text-blue-800',
  },
  {
    value: 'ITERATING',
    label: 'Iterating',
    icon: IconRefresh,
    description: 'Refining ideas and gathering feedback',
    color: 'bg-yellow-100 border-yellow-300 text-yellow-800',
  },
  {
    value: 'CONSIDERING',
    label: 'Considering',
    icon: IconEye,
    description: 'Evaluating options and setting priorities',
    color: 'bg-purple-100 border-purple-300 text-purple-800',
  },
  {
    value: 'BUILDING',
    label: 'Building',
    icon: IconHammer,
    description: 'Active development and implementation',
    color: 'bg-orange-100 border-orange-300 text-orange-800',
  },
  {
    value: 'CLOSED',
    label: 'Closed',
    icon: IconCheck,
    description: 'Completed tasks',
    color: 'bg-green-100 border-green-300 text-green-800',
  },
]

export const priorities = [
  {
    label: 'Low',
    value: 'LOW',
    icon: IconArrowDown,
    color: 'text-green-600',
  },
  {
    label: 'Medium',
    value: 'MEDIUM',
    icon: IconArrowRight,
    color: 'text-yellow-600',
  },
  {
    label: 'High',
    value: 'HIGH',
    icon: IconArrowUp,
    color: 'text-red-600',
  },
]

// Legacy statuses for backward compatibility
export const statuses = [
  {
    value: 'backlog',
    label: 'Backlog',
    icon: IconExclamationCircle,
  },
  {
    value: 'todo',
    label: 'Todo',
    icon: IconExclamationCircle,
  },
  {
    value: 'in progress',
    label: 'In Progress',
    icon: IconRefresh,
  },
  {
    value: 'done',
    label: 'Done',
    icon: IconCheck,
  },
  {
    value: 'canceled',
    label: 'Canceled',
    icon: IconExclamationCircle,
  },
]
