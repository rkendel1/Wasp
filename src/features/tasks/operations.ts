import type { 
  GetTasks, 
  CreateTask, 
  UpdateTask, 
  MoveTaskToStage, 
  DeleteTask 
} from 'wasp/server/operations'
import type { Task, TaskStage, TaskPriority } from 'wasp/entities'
import { HttpError } from 'wasp/server'

// Types for operation arguments
type CreateTaskArgs = {
  title: string
  description?: string
  label?: string
}

type UpdateTaskArgs = {
  id: string
  title?: string
  description?: string
  comments?: string
  priority?: TaskPriority
  assigneeId?: string
  label?: string
}

type MoveTaskToStageArgs = {
  id: string
  stage: TaskStage
  position?: number
}

type DeleteTaskArgs = {
  id: string
}

// Get all tasks ordered by stage and position
export const getTasks: GetTasks<void, Task[]> = async (args, context) => {
  const tasks = await context.entities.Task.findMany({
    orderBy: [
      { stage: 'asc' },
      { position: 'asc' },
      { createdAt: 'asc' }
    ],
    include: {
      assignee: {
        select: {
          id: true,
          // Note: We'll need to add username/name field to User model later
        }
      }
    }
  })
  
  return tasks
}

// Create a new task in Deep Dive stage
export const createTask: CreateTask<CreateTaskArgs, Task> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'User must be authenticated')
  }
  
  if (!args.title?.trim()) {
    throw new HttpError(400, 'Title is required')
  }
  
  // Get the highest position in Deep Dive stage for ordering
  const lastTask = await context.entities.Task.findFirst({
    where: { stage: 'DEEP_DIVE' },
    orderBy: { position: 'desc' }
  })
  
  const newPosition = (lastTask?.position || 0) + 1
  
  const task = await context.entities.Task.create({
    data: {
      title: args.title.trim(),
      description: args.description?.trim(),
      label: args.label,
      stage: 'DEEP_DIVE',
      position: newPosition
    },
    include: {
      assignee: {
        select: {
          id: true,
        }
      }
    }
  })
  
  return task
}

// Update task fields
export const updateTask: UpdateTask<UpdateTaskArgs, Task> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'User must be authenticated')
  }
  
  const existingTask = await context.entities.Task.findUnique({
    where: { id: args.id }
  })
  
  if (!existingTask) {
    throw new HttpError(404, 'Task not found')
  }
  
  const updateData: any = {}
  
  if (args.title !== undefined) {
    if (!args.title.trim()) {
      throw new HttpError(400, 'Title cannot be empty')
    }
    updateData.title = args.title.trim()
  }
  
  if (args.description !== undefined) {
    updateData.description = args.description?.trim() || null
  }
  
  if (args.comments !== undefined) {
    updateData.comments = args.comments?.trim() || null
  }
  
  if (args.priority !== undefined) {
    updateData.priority = args.priority
  }
  
  if (args.assigneeId !== undefined) {
    // Validate assignee exists
    if (args.assigneeId) {
      const assignee = await context.entities.User.findUnique({
        where: { id: args.assigneeId }
      })
      if (!assignee) {
        throw new HttpError(400, 'Invalid assignee')
      }
    }
    updateData.assigneeId = args.assigneeId || null
  }
  
  if (args.label !== undefined) {
    updateData.label = args.label
  }
  
  const task = await context.entities.Task.update({
    where: { id: args.id },
    data: updateData,
    include: {
      assignee: {
        select: {
          id: true,
        }
      }
    }
  })
  
  return task
}

// Move task to a new stage with automatic field updates
export const moveTaskToStage: MoveTaskToStage<MoveTaskToStageArgs, Task> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'User must be authenticated')
  }
  
  const existingTask = await context.entities.Task.findUnique({
    where: { id: args.id }
  })
  
  if (!existingTask) {
    throw new HttpError(404, 'Task not found')
  }
  
  // Get position for new stage
  let newPosition = args.position
  if (newPosition === undefined) {
    const lastTaskInStage = await context.entities.Task.findFirst({
      where: { stage: args.stage },
      orderBy: { position: 'desc' }
    })
    newPosition = (lastTaskInStage?.position || 0) + 1
  }
  
  const updateData: any = {
    stage: args.stage,
    position: newPosition
  }
  
  // Automatically set completion date when moving to CLOSED stage
  if (args.stage === 'CLOSED' && existingTask.stage !== 'CLOSED') {
    updateData.completedAt = new Date()
  }
  
  // Clear completion date if moving away from CLOSED stage
  if (args.stage !== 'CLOSED' && existingTask.stage === 'CLOSED') {
    updateData.completedAt = null
  }
  
  const task = await context.entities.Task.update({
    where: { id: args.id },
    data: updateData,
    include: {
      assignee: {
        select: {
          id: true,
        }
      }
    }
  })
  
  return task
}

// Delete a task
export const deleteTask: DeleteTask<DeleteTaskArgs, Task> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'User must be authenticated')
  }
  
  const existingTask = await context.entities.Task.findUnique({
    where: { id: args.id }
  })
  
  if (!existingTask) {
    throw new HttpError(404, 'Task not found')
  }
  
  const task = await context.entities.Task.delete({
    where: { id: args.id },
    include: {
      assignee: {
        select: {
          id: true,
        }
      }
    }
  })
  
  return task
}