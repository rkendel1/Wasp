import { useState } from 'react'
import { Badge } from '../../../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { ScrollArea } from '../../../components/ui/scroll-area'
import { Task } from '../data/schema'
import { KanbanCard } from './kanban-card'
import { cn } from '../../../lib/cn'
import { toast } from '../../../hooks/use-toast'

interface KanbanColumnProps {
  title: string
  description?: string
  status: string
  tasks: Task[]
  icon?: React.ComponentType<{ className?: string }>
  onTaskMove?: (taskId: string, newStatus: string) => void
}

export function KanbanColumn({ title, description, status, tasks, icon: Icon, onTaskMove }: KanbanColumnProps) {
  const taskCount = tasks.length
  const [isDragOver, setIsDragOver] = useState(false)
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    // Only set false if we're leaving the column entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData('text/plain')
    setIsDragOver(false)
    setDraggedTask(null)
    
    if (taskId && onTaskMove) {
      // Check if the task is already in this column
      const isTaskAlreadyInColumn = tasks.some(task => task.id === taskId)
      if (!isTaskAlreadyInColumn) {
        onTaskMove(taskId, status)
        toast({
          title: 'Task moved',
          description: `Task moved to ${title}`,
        })
      }
    }
  }

  const handleTaskDragStart = (task: Task) => {
    setDraggedTask(task)
  }

  const handleTaskDragEnd = () => {
    setDraggedTask(null)
  }

  return (
    <Card 
      className={cn(
        "flex-1 min-w-[300px] max-w-[350px] bg-muted/50 transition-all duration-200",
        isDragOver && "bg-muted border-primary shadow-lg"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-5 w-5" />}
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            {taskCount}
          </Badge>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {isDragOver && (
          <div className="text-xs text-primary font-medium">
            Drop task here
          </div>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="space-y-0">
            {tasks.map((task) => (
              <KanbanCard 
                key={task.id} 
                task={task} 
                onDragStart={handleTaskDragStart}
                onDragEnd={handleTaskDragEnd}
              />
            ))}
            {tasks.length === 0 && (
              <div className="text-center py-8 text-sm text-muted-foreground">
                {isDragOver ? 'Drop task here' : 'No tasks in this stage'}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}