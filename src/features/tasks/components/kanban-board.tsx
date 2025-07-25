import { ScrollArea } from '../../../components/ui/scroll-area'
import { statuses } from '../data/data'
import { Task } from '../data/schema'
import { KanbanColumn } from './kanban-column'

interface KanbanBoardProps {
  tasks: Task[]
}

export function KanbanBoard({ tasks }: KanbanBoardProps) {
  // Group tasks by status
  const tasksByStatus = statuses.reduce((acc, status) => {
    acc[status.value] = tasks.filter(task => task.status === status.value)
    return acc
  }, {} as Record<string, Task[]>)

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
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}