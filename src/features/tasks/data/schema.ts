import { z } from 'zod'

// Enhanced schema to support Kanban stages and LLM interactions
export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  label: z.string(),
  priority: z.string(),
  description: z.string().optional(),
  stage: z.enum(['deep-dive', 'iterating', 'considering', 'building', 'closed']).optional(),
  // Stage-specific data
  deepDiveData: z.object({
    exploratoryPrompts: z.array(z.string()).optional(),
    llmResponses: z.array(z.string()).optional(),
  }).optional(),
  iteratingData: z.object({
    comments: z.array(z.object({
      id: z.string(),
      content: z.string(),
      timestamp: z.string(),
    })).optional(),
    feedback: z.array(z.string()).optional(),
    improvements: z.array(z.string()).optional(),
  }).optional(),
  consideringData: z.object({
    feasibilityAssessment: z.string().optional(),
    riskFactors: z.array(z.string()).optional(),
  }).optional(),
  buildingData: z.object({
    assignedTo: z.string().optional(),
    codeSnippets: z.array(z.object({
      id: z.string(),
      language: z.string(),
      code: z.string(),
      description: z.string().optional(),
    })).optional(),
    technicalDetails: z.array(z.string()).optional(),
  }).optional(),
  closedData: z.object({
    retrospectiveNotes: z.string().optional(),
    llmSummary: z.string().optional(),
    completionDate: z.string().optional(),
  }).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type Task = z.infer<typeof taskSchema>
