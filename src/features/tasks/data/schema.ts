import { z } from 'zod'

// Updated schema for the enhanced task model
export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  stage: z.string(),
  priority: z.string(),
  label: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  userId: z.string().optional(),
  llmResponses: z.array(z.object({
    id: z.string(),
    stage: z.string(),
    prompt: z.string(),
    response: z.string(),
    metadata: z.any().optional(),
    createdAt: z.date().optional(),
  })).optional(),
})

export type Task = z.infer<typeof taskSchema>

export const llmResponseSchema = z.object({
  id: z.string(),
  taskId: z.string(),
  stage: z.string(),
  prompt: z.string(),
  response: z.string(),
  metadata: z.any().optional(),
  createdAt: z.date().optional(),
})

export type LLMResponse = z.infer<typeof llmResponseSchema>
