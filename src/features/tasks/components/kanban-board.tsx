import React, { useState } from 'react'
import { Card, CardContent, CardHeader } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { ScrollArea } from '../../../components/ui/scroll-area'
import { Button } from '../../../components/ui/button'
import { Plus } from 'lucide-react'
import { Task, KanbanStatus, kanbanStatuses } from '../data/schema'
import { TaskCard } from './task-card'

interface KanbanBoardProps {
  tasks: Task[]
  onTaskMove: (taskId: string, newStatus: KanbanStatus) => void
  onTaskCreate: (status: KanbanStatus) => void
  onTaskUpdate: (task: Task) => void
  onTaskDelete: (taskId: string) => void
}

export function KanbanBoard({ 
  tasks, 
  onTaskMove, 
  onTaskCreate, 
  onTaskUpdate, 
  onTaskDelete 
}: KanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, status: KanbanStatus) => {
    e.preventDefault()
    if (draggedTask) {
      onTaskMove(draggedTask, status)
      setDraggedTask(null)
    }
  }

  const getTasksByStatus = (status: KanbanStatus) => {
    return tasks.filter(task => task.status === status)
  }

  const getStatusColor = (status: KanbanStatus) => {
    const colors = {
      'Deep Dive': 'bg-blue-50 border-blue-200',
      'Iterating': 'bg-orange-50 border-orange-200',
      'Considering': 'bg-yellow-50 border-yellow-200',
      'Building': 'bg-green-50 border-green-200',
      'Closed': 'bg-gray-50 border-gray-200'
    }
    return colors[status]
  }

  const getStatusHeaderColor = (status: KanbanStatus) => {
    const colors = {
      'Deep Dive': 'text-blue-700 bg-blue-100',
      'Iterating': 'text-orange-700 bg-orange-100',
      'Considering': 'text-yellow-700 bg-yellow-100',
      'Building': 'text-green-700 bg-green-100',
      'Closed': 'text-gray-700 bg-gray-100'
    }
    return colors[status]
  }

  return (
    <div className="flex gap-6 h-full overflow-x-auto pb-6">
      {kanbanStatuses.map((status) => {
        const columnTasks = getTasksByStatus(status)
        
        return (
          <div 
            key={status} 
            className="flex-shrink-0 w-80"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
          >
            <Card className={`h-full ${getStatusColor(status)}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="secondary" 
                      className={`${getStatusHeaderColor(status)} font-medium`}
                    >
                      {status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {columnTasks.length}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onTaskCreate(status)}
                    className="h-6 w-6 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="space-y-3 pr-3">
                    {columnTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onDragStart={handleDragStart}
                        onUpdate={onTaskUpdate}
                        onDelete={onTaskDelete}
                        isDragging={draggedTask === task.id}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        )
      })}
    </div>
  )
}