import { useDroppable } from '@dnd-kit/core'
import { useDraggable } from '@dnd-kit/core'
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
  
  const { setNodeRef, isOver } = useDroppable({
    id: stage.value,
  })

  return (
    <div className="w-72 md:w-80 flex-shrink-0">
      <div className="mb-3 md:mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <StageIcon className="h-4 w-4 md:h-5 md:w-5" />
          <h3 className="font-semibold text-base md:text-lg">{stage.label}</h3>
          <Badge variant="secondary" className="ml-auto text-xs">
            {tasks.length}
          </Badge>
        </div>
        <p className="text-xs md:text-sm text-muted-foreground">{stage.description}</p>
      </div>
      
      <div 
        ref={setNodeRef}
        className={`space-y-2 md:space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto p-2 rounded-lg transition-colors ${
          isOver ? 'bg-blue-50 dark:bg-blue-950/30' : ''
        }`}
      >
        {tasks.map((task) => (
          <KanbanCard
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task)}
            stageColor={stage.color}
          />
        ))}
        
        {tasks.length === 0 && (
          <div className="text-center text-muted-foreground py-6 md:py-8 text-sm">
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

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: task.id,
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      className={`cursor-pointer hover:shadow-md transition-shadow duration-200 ${
        isDragging ? 'opacity-50' : ''
      }`} 
      onClick={onClick}
      {...listeners}
      {...attributes}
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
            {task.stage === 'suggested' && task.suggestedData?.votes && (
              <Badge variant="outline" className="text-xs">
                {task.suggestedData.votes} votes
              </Badge>
            )}
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