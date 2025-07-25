import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.

// Kanban board status columns
export const kanbanStatuses = [
  'Deep Dive',
  'Iterating', 
  'Considering',
  'Building',
  'Closed'
] as const

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum(kanbanStatuses),
  label: z.string(),
  priority: z.string(),
  description: z.string().optional(),
})

export type Task = z.infer<typeof taskSchema>
export type KanbanStatus = typeof kanbanStatuses[number]
