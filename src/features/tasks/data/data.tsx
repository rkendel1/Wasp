import {
  IconArrowDown,
  IconArrowRight,
  IconArrowUp,
  IconCircle,
  IconCircleCheck,
  IconCircleX,
  IconExclamationCircle,
  IconStopwatch,
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

export const statuses = [
  {
    value: 'deep-dive',
    label: 'Deep Dive',
    icon: IconExclamationCircle,
    description: 'Exploring and understanding the task requirements'
  },
  {
    value: 'iterating',
    label: 'Iterating',
    icon: IconStopwatch,
    description: 'Making iterative improvements and refinements'
  },
  {
    value: 'considering',
    label: 'Considering',
    icon: IconCircle,
    description: 'Evaluating feasibility and priority'
  },
  {
    value: 'building',
    label: 'Building',
    icon: IconCircleCheck,
    description: 'Active development and implementation'
  },
  {
    value: 'closed',
    label: 'Closed',
    icon: IconCircleX,
    description: 'Completed with final notes and summary'
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
