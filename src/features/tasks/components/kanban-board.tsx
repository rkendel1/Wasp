import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
} from '@dnd-kit/core'
import { updateTask } from 'wasp/client/operations'
import { Task } from '../data/schema'
import { stages } from '../data/data'
import { KanbanColumn } from './kanban-column'
import { TaskDetailModal } from './task-detail-modal'

interface KanbanBoardProps {
  tasks: Task[]
}

export function KanbanBoard({ tasks }: KanbanBoardProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  )

  // Group tasks by stage
  const tasksByStage = stages.reduce((acc, stage) => {
    acc[stage.value] = tasks.filter(task => task.stage === stage.value)
    return acc
  }, {} as Record<string, Task[]>)

  // Handle tasks without a stage (default to suggested)
  const unstagedTasks = tasks.filter(task => !task.stage)
  if (unstagedTasks.length > 0) {
    tasksByStage['suggested'] = [...(tasksByStage['suggested'] || []), ...unstagedTasks]
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = tasks.find(t => t.id === active.id)
    setActiveTask(task || null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over) {
      setActiveTask(null)
      return
    }

    const taskId = active.id as string
    const newStage = over.id as string
    
    // Find the task being moved
    const task = tasks.find(t => t.id === taskId)
    if (!task || task.stage === newStage) {
      setActiveTask(null)
      return
    }

    try {
      // Update the task stage
      await updateTask({
        taskId: task.id,
        updates: {
          ...task,
          stage: newStage as Task['stage']
        }
      })
    } catch (error) {
      console.error('Failed to update task stage:', error)
    }

    setActiveTask(null)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full overflow-x-auto overflow-y-hidden">
        <div className="flex space-x-4 md:space-x-6 p-4 md:p-6 min-w-max">
          {stages.map((stage) => (
            <KanbanColumn
              key={stage.value}
              stage={stage}
              tasks={tasksByStage[stage.value] || []}
              onTaskClick={setSelectedTask}
            />
          ))}
        </div>
        
        <DragOverlay>
          {activeTask ? (
            <div className="w-72 md:w-80 opacity-90 transform rotate-2">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {activeTask.id}
                </p>
                <h4 className="font-medium leading-tight">
                  {activeTask.title}
                </h4>
              </div>
            </div>
          ) : null}
        </DragOverlay>
        
        {selectedTask && (
          <TaskDetailModal
            task={selectedTask}
            open={!!selectedTask}
            onOpenChange={(open) => !open && setSelectedTask(null)}
          />
        )}
      </div>
    </DndContext>
  )
}