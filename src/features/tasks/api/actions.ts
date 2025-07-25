import type { 
  CreateTask, 
  UpdateTask, 
  DeleteTask, 
  MoveTaskToStage,
  GenerateLLMResponse 
} from 'wasp/server/operations'
import type { Task, LLMResponse } from 'wasp/entities'

// Types for action inputs
type CreateTaskInput = {
  title: string
  description?: string
  priority?: string
  label?: string
}

type UpdateTaskInput = {
  id: string
  title?: string
  description?: string
  priority?: string
  label?: string
}

type DeleteTaskInput = {
  id: string
}

type MoveTaskToStageInput = {
  id: string
  stage: string
}

type GenerateLLMResponseInput = {
  taskId: string
  stage: string
}

// LLM Service (mock implementation for now)
const generateLLMResponseForStage = async (task: Task, stage: string): Promise<{ response: string; metadata: any }> => {
  // This would integrate with actual LLM service like OpenAI, Claude, etc.
  // For now, return mock responses based on stage
  const prompts = {
    'deep-dive': `Analyze this task: "${task.title}". Generate exploratory questions and ideas to better understand the requirements and scope.`,
    'iterating': `For task: "${task.title}". Provide iterative feedback and suggestions for improvement based on current progress.`,
    'considering': `Evaluate task: "${task.title}". Assess feasibility, assign priority recommendations, and identify potential risks.`,
    'building': `For implementation of: "${task.title}". Generate code snippets, technical details, and implementation guidance.`,
    'closed': `Task completed: "${task.title}". Provide a retrospective analysis and summary of what was accomplished.`
  }

  const mockResponses = {
    'deep-dive': {
      response: `Key questions to explore:\n• What are the specific user requirements?\n• What technical constraints should we consider?\n• How does this integrate with existing systems?\n• What are the success criteria?`,
      metadata: { questions: 4, complexity: 'medium' }
    },
    'iterating': {
      response: `Suggestions for improvement:\n• Consider breaking down into smaller tasks\n• Add more detailed acceptance criteria\n• Review similar implementations\n• Get stakeholder feedback`,
      metadata: { suggestions: 4, priority: 'high' }
    },
    'considering': {
      response: `Feasibility Assessment:\n• Technical: High feasibility\n• Resources: 2-3 dev days\n• Priority: Medium\n• Risks: Low complexity, well-defined scope`,
      metadata: { feasibility: 'high', effort: '2-3 days', risks: 'low' }
    },
    'building': {
      response: `Implementation approach:\n• Use React hooks for state management\n• Implement drag-and-drop with @dnd-kit\n• Create reusable card components\n• Add proper TypeScript types`,
      metadata: { approach: 'component-based', libraries: ['react', '@dnd-kit'], complexity: 'medium' }
    },
    'closed': {
      response: `Task Summary:\n• Successfully implemented Kanban functionality\n• Added drag-and-drop capabilities\n• Integrated LLM responses\n• Lessons learned: Good component architecture is key`,
      metadata: { status: 'completed', outcomes: ['kanban', 'drag-drop', 'llm'], satisfaction: 'high' }
    }
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  return mockResponses[stage as keyof typeof mockResponses] || {
    response: 'No specific guidance available for this stage.',
    metadata: {}
  }
}

export const createTask: CreateTask<CreateTaskInput, Task> = async (args, context) => {
  if (!context.user) {
    throw new Error('Not authenticated')
  }

  return context.entities.Task.create({
    data: {
      ...args,
      userId: context.user.id,
      stage: 'deep-dive', // Always start in deep-dive stage
    },
  })
}

export const updateTask: UpdateTask<UpdateTaskInput, Task> = async ({ id, ...updates }, context) => {
  if (!context.user) {
    throw new Error('Not authenticated')
  }

  const task = await context.entities.Task.findFirst({
    where: { id, userId: context.user.id }
  })

  if (!task) {
    throw new Error('Task not found')
  }

  return context.entities.Task.update({
    where: { id },
    data: updates,
  })
}

export const deleteTask: DeleteTask<DeleteTaskInput, Task> = async ({ id }, context) => {
  if (!context.user) {
    throw new Error('Not authenticated')
  }

  const task = await context.entities.Task.findFirst({
    where: { id, userId: context.user.id }
  })

  if (!task) {
    throw new Error('Task not found')
  }

  return context.entities.Task.delete({
    where: { id },
  })
}

export const moveTaskToStage: MoveTaskToStage<MoveTaskToStageInput, Task> = async ({ id, stage }, context) => {
  if (!context.user) {
    throw new Error('Not authenticated')
  }

  const task = await context.entities.Task.findFirst({
    where: { id, userId: context.user.id }
  })

  if (!task) {
    throw new Error('Task not found')
  }

  const validStages = ['deep-dive', 'iterating', 'considering', 'building', 'closed']
  if (!validStages.includes(stage)) {
    throw new Error('Invalid stage')
  }

  return context.entities.Task.update({
    where: { id },
    data: { stage },
  })
}

export const generateLLMResponse: GenerateLLMResponse<GenerateLLMResponseInput, LLMResponse> = async ({ taskId, stage }, context) => {
  if (!context.user) {
    throw new Error('Not authenticated')
  }

  const task = await context.entities.Task.findFirst({
    where: { id: taskId, userId: context.user.id }
  })

  if (!task) {
    throw new Error('Task not found')
  }

  // Generate LLM response
  const { response, metadata } = await generateLLMResponseForStage(task, stage)

  // Store the response
  return context.entities.LLMResponse.create({
    data: {
      taskId,
      stage,
      prompt: `Stage: ${stage}, Task: ${task.title}`,
      response,
      metadata,
    },
  })
}