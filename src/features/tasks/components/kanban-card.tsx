import React from 'react'
import { Card, CardContent, CardHeader } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { MoreHorizontal, Edit, Trash2, User, Calendar, MessageSquare } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu'
import { Task, getAvailableFields, getPriorityDisplayName } from '../data/schema'
import { labels, priorities } from '../data/data'

interface KanbanCardProps {
  task: Task
  onEdit: () => void
  onDelete: () => void
}

export function KanbanCard({ task, onEdit, onDelete }: KanbanCardProps) {
  const availableFields = getAvailableFields(task.stage as any)
  const labelInfo = labels.find(l => l.value === task.label)
  const priorityInfo = priorities.find(p => p.value === task.priority)

  const formatDate = (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <Card className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm leading-tight mb-1 line-clamp-2">
              {task.title}
            </h4>
            {labelInfo && (
              <Badge variant="outline" className="text-xs">
                {labelInfo.label}
              </Badge>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {/* Description - Available in all stages */}
        {availableFields.includes('description') && task.description && (
          <div>
            <p className="text-xs text-muted-foreground line-clamp-3">
              {task.description}
            </p>
          </div>
        )}

        {/* Comments - Available from Iterating stage */}
        {availableFields.includes('comments') && task.comments && (
          <div className="flex items-start gap-2">
            <MessageSquare className="h-3 w-3 mt-0.5 text-muted-foreground flex-shrink-0" />
            <p className="text-xs text-muted-foreground line-clamp-2">
              {task.comments}
            </p>
          </div>
        )}

        {/* Priority - Available from Considering stage */}
        {availableFields.includes('priority') && task.priority && priorityInfo && (
          <div className="flex items-center gap-2">
            <priorityInfo.icon className={`h-3 w-3 ${priorityInfo.color}`} />
            <span className={`text-xs font-medium ${priorityInfo.color}`}>
              {priorityInfo.label} Priority
            </span>
          </div>
        )}

        {/* Assignee - Available from Building stage */}
        {availableFields.includes('assignee') && task.assignee && (
          <div className="flex items-center gap-2">
            <User className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Assigned to: {task.assignee.id}
            </span>
          </div>
        )}

        {/* Completion Date - Available in Closed stage */}
        {availableFields.includes('completedAt') && task.completedAt && (
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Completed: {formatDate(task.completedAt)}
            </span>
          </div>
        )}

        {/* Creation date for context */}
        <div className="pt-2 border-t">
          <span className="text-xs text-muted-foreground">
            Created {formatDate(task.createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}