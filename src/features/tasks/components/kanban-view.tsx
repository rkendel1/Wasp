import React, { useState, useEffect } from 'react'
import { KanbanBoard } from './kanban-board'
import { TaskEditDialog } from './task-edit-dialog'
import { Task, KanbanStatus } from '../data/schema'

interface KanbanViewProps {
  tasks: Task[]
  onTasksChange: (tasks: Task[]) => void
  showAddDialog?: boolean
  onAddDialogChange?: (show: boolean) => void
}

export function KanbanView({ 
  tasks, 
  onTasksChange, 
  showAddDialog = false, 
  onAddDialogChange 
}: KanbanViewProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [createStatus, setCreateStatus] = useState<KanbanStatus>('Suggested')

  // Handle external add dialog state
  useEffect(() => {
    if (showAddDialog) {
      setCreateStatus('Suggested') // Default to first column
      setIsCreating(true)
    }
  }, [showAddDialog])

  const handleTaskMove = (taskId: string, newStatus: KanbanStatus) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    )
    onTasksChange(updatedTasks)
  }

  const handleTaskCreate = (status: KanbanStatus) => {
    setCreateStatus(status)
    setIsCreating(true)
  }

  const handleTaskUpdate = (updatedTask: Task) => {
    const updatedTasks = tasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    )
    onTasksChange(updatedTasks)
  }

  const handleTaskDelete = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId)
    onTasksChange(updatedTasks)
  }

  const handleTaskSave = (newTask: Task) => {
    const existingTaskIndex = tasks.findIndex(task => task.id === newTask.id)
    
    if (existingTaskIndex >= 0) {
      // Update existing task
      const updatedTasks = [...tasks]
      updatedTasks[existingTaskIndex] = newTask
      onTasksChange(updatedTasks)
    } else {
      // Add new task
      onTasksChange([...tasks, newTask])
    }
    setIsCreating(false)
    // Close external dialog if it was triggered from there
    if (onAddDialogChange) {
      onAddDialogChange(false)
    }
  }

  const handleDialogClose = (open: boolean) => {
    setIsCreating(open)
    // Close external dialog if it was triggered from there
    if (!open && onAddDialogChange) {
      onAddDialogChange(false)
    }
  }

  return (
    <>
      <KanbanBoard
        tasks={tasks}
        onTaskMove={handleTaskMove}
        onTaskCreate={handleTaskCreate}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
      />

      <TaskEditDialog
        open={isCreating}
        onOpenChange={handleDialogClose}
        onSave={handleTaskSave}
        defaultStatus={createStatus}
      />
    </>
  )
}