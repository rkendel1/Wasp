import { Badge } from '../../../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { ScrollArea } from '../../../components/ui/scroll-area'
import { Task } from '../data/schema'
import { KanbanCard } from './kanban-card'

interface KanbanColumnProps {
  title: string
  description?: string
  status: string
  tasks: Task[]
  icon?: React.ComponentType<{ className?: string }>
}

export function KanbanColumn({ title, description, status, tasks, icon: Icon }: KanbanColumnProps) {
  const taskCount = tasks.length

  return (
    <Card className="flex-1 min-w-[300px] max-w-[350px] bg-muted/50">
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
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="space-y-0">
            {tasks.map((task) => (
              <KanbanCard key={task.id} task={task} />
            ))}
            {tasks.length === 0 && (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No tasks in this stage
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}