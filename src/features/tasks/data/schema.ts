import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  label: z.string(),
  priority: z.string(),
  description: z.string().optional(),
  comments: z.array(z.string()).optional(),
  llmData: z.object({
    exploratoryPrompts: z.array(z.string()).optional(),
    iterativeImprovements: z.array(z.string()).optional(),
    feasibilityAssessment: z.string().optional(),
    codeSnippets: z.array(z.string()).optional(),
    technicalDetails: z.string().optional(),
    retrospectiveNotes: z.string().optional(),
    llmSummary: z.string().optional(),
  }).optional(),
  assignedTo: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type Task = z.infer<typeof taskSchema>
