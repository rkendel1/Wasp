import { Badge } from '../../../components/ui/badge'
import { Card, CardContent, CardHeader } from '../../../components/ui/card'
import { Task } from '../data/schema'
import { labels, priorities } from '../data/data'

interface KanbanColumnProps {
  stage: {
    value: string
    label: string
    description: string
    icon: any
    color: string
  }
  tasks: Task[]
  onTaskClick: (task: Task) => void
}

export function KanbanColumn({ stage, tasks, onTaskClick }: KanbanColumnProps) {
  const StageIcon = stage.icon

  return (
    <div className="w-80 flex-shrink-0">
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <StageIcon className="h-5 w-5" />
          <h3 className="font-semibold text-lg">{stage.label}</h3>
          <Badge variant="secondary" className="ml-auto">
            {tasks.length}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{stage.description}</p>
      </div>
      
      <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
        {tasks.map((task) => (
          <KanbanCard
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task)}
            stageColor={stage.color}
          />
        ))}
        
        {tasks.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No tasks in this stage
          </div>
        )}
      </div>
    </div>
  )
}

interface KanbanCardProps {
  task: Task
  onClick: () => void
  stageColor: string
}

function KanbanCard({ task, onClick, stageColor }: KanbanCardProps) {
  const label = labels.find(l => l.value === task.label)
  const priority = priorities.find(p => p.value === task.priority)
  const PriorityIcon = priority?.icon

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow duration-200" 
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between space-x-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {task.id}
            </p>
            <h4 className="font-medium leading-tight">
              {task.title}
            </h4>
          </div>
          {PriorityIcon && (
            <PriorityIcon className={`h-4 w-4 flex-shrink-0 ${
              task.priority === 'high' ? 'text-red-500' :
              task.priority === 'medium' ? 'text-yellow-500' :
              'text-green-500'
            }`} />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {task.description && (
          <p className="text-sm text-muted-foreground mb-3">
            {task.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {label && (
              <Badge variant="outline" className="text-xs">
                {label.label}
              </Badge>
            )}
            <Badge 
              variant="secondary" 
              className={`text-xs ${stageColor}`}
            >
              {task.stage?.replace('-', ' ') || 'No Stage'}
            </Badge>
          </div>
          
          {/* Show stage-specific indicators */}
          <div className="flex space-x-1">
            {task.stage === 'deep-dive' && task.deepDiveData?.exploratoryPrompts?.length && (
              <Badge variant="outline" className="text-xs">
                {task.deepDiveData.exploratoryPrompts.length} prompts
              </Badge>
            )}
            {task.stage === 'iterating' && task.iteratingData?.comments?.length && (
              <Badge variant="outline" className="text-xs">
                {task.iteratingData.comments.length} comments
              </Badge>
            )}
            {task.stage === 'building' && task.buildingData?.assignedTo && (
              <Badge variant="outline" className="text-xs">
                Assigned
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}