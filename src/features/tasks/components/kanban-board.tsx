import { useState } from 'react'
import { Task } from '../data/schema'
import { stages } from '../data/data'
import { KanbanColumn } from './kanban-column'
import { TaskDetailModal } from './task-detail-modal'

interface KanbanBoardProps {
  tasks: Task[]
}

export function KanbanBoard({ tasks }: KanbanBoardProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  // Group tasks by stage
  const tasksByStage = stages.reduce((acc, stage) => {
    acc[stage.value] = tasks.filter(task => task.stage === stage.value)
    return acc
  }, {} as Record<string, Task[]>)

  // Handle tasks without a stage (default to deep-dive)
  const unstagedTasks = tasks.filter(task => !task.stage)
  if (unstagedTasks.length > 0) {
    tasksByStage['deep-dive'] = [...(tasksByStage['deep-dive'] || []), ...unstagedTasks]
  }

  return (
    <div className="flex h-full overflow-x-auto">
      <div className="flex space-x-6 p-6 min-w-max">
        {stages.map((stage) => (
          <KanbanColumn
            key={stage.value}
            stage={stage}
            tasks={tasksByStage[stage.value] || []}
            onTaskClick={setSelectedTask}
          />
        ))}
      </div>
      
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          open={!!selectedTask}
          onOpenChange={(open) => !open && setSelectedTask(null)}
        />
      )}
    </div>
  )
}