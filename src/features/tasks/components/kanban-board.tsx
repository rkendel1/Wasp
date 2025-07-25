import React, { useState } from 'react'
import { ScrollArea } from '../../../components/ui/scroll-area'
import { toast } from '../../../hooks/use-toast'
import { statuses } from '../data/data'
import { Task } from '../data/schema'
import { KanbanColumn } from './kanban-column'

interface KanbanBoardProps {
  tasks: Task[]
  onTaskUpdate?: (updatedTask: Task) => void
}

export function KanbanBoard({ tasks, onTaskUpdate }: KanbanBoardProps) {
  const [localTasks, setLocalTasks] = useState(tasks)

  // Group tasks by status
  const tasksByStatus = statuses.reduce((acc, status) => {
    acc[status.value] = localTasks.filter(task => task.status === status.value)
    return acc
  }, {} as Record<string, Task[]>)

  const handleTaskMove = (taskId: string, newStatus: string) => {
    const updatedTasks = localTasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, status: newStatus }
        onTaskUpdate?.(updatedTask)
        return updatedTask
      }
      return task
    })
    
    setLocalTasks(updatedTasks)
  }

  // Update local tasks when props change
  React.useEffect(() => {
    setLocalTasks(tasks)
  }, [tasks])

  return (
    <div className="w-full">
      <ScrollArea className="w-full">
        <div className="flex gap-6 pb-4 min-w-fit">
          {statuses.map((status) => (
            <KanbanColumn
              key={status.value}
              title={status.label}
              description={status.description}
              status={status.value}
              tasks={tasksByStatus[status.value] || []}
              icon={status.icon}
              onTaskMove={handleTaskMove}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}