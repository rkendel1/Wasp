import { Badge } from '../../../components/ui/badge'
import { Card, CardContent, CardHeader } from '../../../components/ui/card'
import { labels, priorities } from '../data/data'
import { Task } from '../data/schema'
import { useTasks } from '../context/tasks-context'
import { cn } from '../../../lib/cn'

interface KanbanCardProps {
  task: Task
}

export function KanbanCard({ task }: KanbanCardProps) {
  const { setCurrentRow, setOpen } = useTasks()
  
  const label = labels.find((label) => label.value === task.label)
  const priority = priorities.find((priority) => priority.value === task.priority)

  const handleCardClick = () => {
    setCurrentRow(task)
    setOpen('detail')
  }

  return (
    <Card 
      className={cn(
        "mb-3 cursor-pointer transition-all duration-200 hover:shadow-md",
        priority?.value === 'high' && "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950",
        priority?.value === 'medium' && "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950",
        priority?.value === 'low' && "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
      )}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-medium leading-tight overflow-hidden text-ellipsis" style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {task.title}
          </h4>
          {priority?.icon && (
            <priority.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          {task.id}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {task.description && (
          <p className="text-xs text-muted-foreground mb-2 overflow-hidden text-ellipsis" style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {task.description}
          </p>
        )}
        <div className="flex items-center gap-2">
          {label && (
            <Badge variant="outline" className="text-xs">
              {label.label}
            </Badge>
          )}
          {task.assignedTo && (
            <Badge variant="secondary" className="text-xs">
              {task.assignedTo}
            </Badge>
          )}
        </div>
        {task.comments && task.comments.length > 0 && (
          <div className="mt-2 text-xs text-muted-foreground">
            💬 {task.comments.length} comment{task.comments.length !== 1 ? 's' : ''}
          </div>
        )}
      </CardContent>
    </Card>
  )
}