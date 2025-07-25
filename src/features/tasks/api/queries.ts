import type { GetTasks, GetTaskById } from 'wasp/server/operations'
import type { Task } from 'wasp/entities'

type GetTasksOutput = Task[]
type GetTaskByIdInput = { id: string }
type GetTaskByIdOutput = Task | null

export const getTasks: GetTasks<void, GetTasksOutput> = async (_, context) => {
  if (!context.user) {
    throw new Error('Not authenticated')
  }

  return context.entities.Task.findMany({
    where: { userId: context.user.id },
    include: {
      llmResponses: {
        orderBy: { createdAt: 'desc' },
        take: 1, // Get the latest LLM response for each task
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export const getTaskById: GetTaskById<GetTaskByIdInput, GetTaskByIdOutput> = async ({ id }, context) => {
  if (!context.user) {
    throw new Error('Not authenticated')
  }

  return context.entities.Task.findFirst({
    where: { 
      id,
      userId: context.user.id 
    },
    include: {
      llmResponses: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })
}