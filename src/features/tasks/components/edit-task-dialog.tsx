import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../components/ui/form'
import { Input } from '../../../components/ui/input'
import { Textarea } from '../../../components/ui/textarea'
import { Button } from '../../../components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select'
import { Task, getAvailableFields } from '../data/schema'
import { labels, priorities } from '../data/data'

const editTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  description: z.string().optional(),
  comments: z.string().optional(),
  priority: z.string().optional(),
  assigneeId: z.string().optional(),
  label: z.string().optional(),
})

type EditTaskFormData = z.infer<typeof editTaskSchema>

interface EditTaskDialogProps {
  task: Task
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: EditTaskFormData & { id: string }) => Promise<void>
}

export function EditTaskDialog({ task, open, onOpenChange, onSubmit }: EditTaskDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const availableFields = getAvailableFields(task.stage as any)

  const form = useForm<EditTaskFormData>({
    resolver: zodResolver(editTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description || '',
      comments: task.comments || '',
      priority: task.priority || '',
      assigneeId: task.assigneeId || '',
      label: task.label || '',
    },
  })

  // Update form values when task changes
  useEffect(() => {
    form.reset({
      title: task.title,
      description: task.description || '',
      comments: task.comments || '',
      priority: task.priority || '',
      assigneeId: task.assigneeId || '',
      label: task.label || '',
    })
  }, [task, form])

  const handleSubmit = async (data: EditTaskFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit({
        id: task.id,
        title: data.title,
        description: data.description || undefined,
        comments: data.comments || undefined,
        priority: data.priority || undefined,
        assigneeId: data.assigneeId || undefined,
        label: data.label || undefined,
      })
    } catch (error) {
      console.error('Failed to update task:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Title - Always available */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter task title..."
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description - Always available */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the task in detail..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Comments - Available from Iterating stage */}
            {availableFields.includes('comments') && (
              <FormField
                control={form.control}
                name="comments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comments / Feedback</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add comments or feedback..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Priority - Available from Considering stage */}
            {availableFields.includes('priority') && (
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">No priority</SelectItem>
                        {priorities.map((priority) => (
                          <SelectItem key={priority.value} value={priority.value}>
                            {priority.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Assignee - Available from Building stage */}
            {availableFields.includes('assignee') && (
              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignee</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter assignee ID or email..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Label - Always available */}
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a label..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">No label</SelectItem>
                      {labels.map((label) => (
                        <SelectItem key={label.value} value={label.value}>
                          {label.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Show completion date if in closed stage (read-only) */}
            {task.stage === 'CLOSED' && task.completedAt && (
              <div className="text-sm text-muted-foreground">
                <strong>Completed:</strong> {new Date(task.completedAt).toLocaleDateString()}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}