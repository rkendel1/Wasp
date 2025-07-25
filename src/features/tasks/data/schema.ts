import { z } from 'zod'

// Enums for task stages and priorities
export const TaskStage = {
  DEEP_DIVE: 'DEEP_DIVE',
  ITERATING: 'ITERATING', 
  CONSIDERING: 'CONSIDERING',
  BUILDING: 'BUILDING',
  CLOSED: 'CLOSED'
} as const

export const TaskPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH'
} as const

// Schema for task data validation
export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  stage: z.nativeEnum(TaskStage),
  comments: z.string().nullable().optional(),
  priority: z.nativeEnum(TaskPriority).nullable().optional(),
  assigneeId: z.string().nullable().optional(),
  assignee: z.object({
    id: z.string(),
  }).nullable().optional(),
  completedAt: z.date().nullable().optional(),
  label: z.string().nullable().optional(),
  position: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Task = z.infer<typeof taskSchema>
export type TaskStageType = keyof typeof TaskStage
export type TaskPriorityType = keyof typeof TaskPriority

// Helper functions for stage management
export const getStageDisplayName = (stage: TaskStageType): string => {
  const displayNames: Record<TaskStageType, string> = {
    DEEP_DIVE: 'Deep Dive',
    ITERATING: 'Iterating',
    CONSIDERING: 'Considering',
    BUILDING: 'Building',
    CLOSED: 'Closed'
  }
  return displayNames[stage]
}

export const getPriorityDisplayName = (priority: TaskPriorityType): string => {
  const displayNames: Record<TaskPriorityType, string> = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High'
  }
  return displayNames[priority]
}

// Get fields available for each stage
export const getAvailableFields = (stage: TaskStageType): string[] => {
  const baseFields = ['title', 'description']
  
  switch (stage) {
    case 'DEEP_DIVE':
      return baseFields
    case 'ITERATING':
      return [...baseFields, 'comments']
    case 'CONSIDERING':
      return [...baseFields, 'comments', 'priority']
    case 'BUILDING':
      return [...baseFields, 'comments', 'priority', 'assignee']
    case 'CLOSED':
      return [...baseFields, 'comments', 'priority', 'assignee', 'completedAt']
    default:
      return baseFields
  }
}
