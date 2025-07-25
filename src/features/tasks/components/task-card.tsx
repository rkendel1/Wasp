import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardHeader, CardContent } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { IconBrain, IconGripVertical } from '@tabler/icons-react'
import { Task } from '../data/schema'
import { labels, priorities } from '../data/data'

interface TaskCardProps {
  task: Task
  onClick?: () => void
  onGenerateLLM?: () => void
  isDragging?: boolean
}

export function TaskCard({ task, onClick, onGenerateLLM, isDragging = false }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  }

  const label = labels.find(l => l.value === task.label)
  const priority = priorities.find(p => p.value === task.priority)
  const latestLLMResponse = task.llmResponses?.[0] // Get the latest LLM response

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`cursor-pointer transition-shadow hover:shadow-md ${
        isDragging ? 'shadow-lg' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {label && (
                <Badge variant="outline" className="text-xs">
                  {label.label}
                </Badge>
              )}
              {priority && (
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    priority.value === 'high' 
                      ? 'border-red-200 text-red-700' 
                      : priority.value === 'medium'
                      ? 'border-yellow-200 text-yellow-700'
                      : 'border-gray-200 text-gray-700'
                  }`}
                >
                  {priority.icon && <priority.icon className="w-3 h-3 mr-1" />}
                  {priority.label}
                </Badge>
              )}
            </div>
            <h3 className="font-medium text-sm leading-tight line-clamp-2">
              {task.title}
            </h3>
            {task.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
          <div
            {...attributes}
            {...listeners}
            className="p-1 hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing"
          >
            <IconGripVertical className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </CardHeader>
      
      {latestLLMResponse && (
        <CardContent className="pt-0">
          <div className="bg-blue-50 rounded-md p-2 mb-2">
            <div className="flex items-center gap-1 mb-1">
              <IconBrain className="w-3 h-3 text-blue-600" />
              <span className="text-xs font-medium text-blue-600">AI Insight</span>
            </div>
            <p className="text-xs text-blue-800 line-clamp-3">
              {latestLLMResponse.response}
            </p>
          </div>
        </CardContent>
      )}

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {task.id}
          </span>
          {onGenerateLLM && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={(e) => {
                e.stopPropagation()
                onGenerateLLM()
              }}
            >
              <IconBrain className="w-3 h-3 mr-1" />
              AI
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}