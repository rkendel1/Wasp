import React, { useState } from 'react'
import { Card, CardContent, CardHeader } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu'
import { Task } from '../data/schema'
import { TaskEditDialog } from './task-edit-dialog'

interface TaskCardProps {
  task: Task
  onDragStart: (e: React.DragEvent, taskId: string) => void
  onUpdate: (task: Task) => void
  onDelete: (taskId: string) => void
  isDragging: boolean
}

export function TaskCard({ 
  task, 
  onDragStart, 
  onUpdate, 
  onDelete, 
  isDragging 
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50'
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50'
      case 'low':
        return 'border-l-green-500 bg-green-50'
      default:
        return 'border-l-gray-500 bg-gray-50'
    }
  }

  const getLabelColor = (label: string) => {
    switch (label) {
      case 'bug':
        return 'bg-red-100 text-red-800'
      case 'feature':
        return 'bg-blue-100 text-blue-800'
      case 'documentation':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <>
      <Card
        draggable
        onDragStart={(e) => onDragStart(e, task.id)}
        className={`
          cursor-move transition-all hover:shadow-md border-l-4
          ${getPriorityColor(task.priority)}
          ${isDragging ? 'opacity-50 rotate-2' : ''}
        `}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium leading-tight truncate">
                {task.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {task.id}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 ml-2 flex-shrink-0"
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(task.id)}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {task.description && (
            <p className="text-xs text-muted-foreground mb-3 line-clamp-3">
              {task.description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <Badge 
              variant="secondary" 
              className={`text-xs ${getLabelColor(task.label)}`}
            >
              {task.label}
            </Badge>
            <Badge 
              variant="outline" 
              className="text-xs capitalize"
            >
              {task.priority}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <TaskEditDialog
        task={task}
        open={isEditing}
        onOpenChange={setIsEditing}
        onSave={(updatedTask) => {
          onUpdate(updatedTask)
          setIsEditing(false)
        }}
      />
    </>
  )
}