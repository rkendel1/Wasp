import React, { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Button } from '../../../components/ui/button'
import { Card, CardHeader, CardContent } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { stages, priorities, labels } from '../data/data'
import { Task } from '../data/schema'
import { TaskCard } from './task-card'
import { DroppableColumn } from './droppable-column'
import { useTasks } from '../context/tasks-context'
import { moveTaskToStage, generateLLMResponse } from 'wasp/client/operations'
import { useQueryClient } from '@tanstack/react-query'

interface KanbanBoardProps {
  tasks: Task[]
}

export function KanbanBoard({ tasks }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const { setOpen, setCurrentRow } = useTasks()
  const queryClient = useQueryClient()
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  // Group tasks by stage
  const tasksByStage = stages.reduce((acc, stage) => {
    acc[stage.value] = tasks.filter(task => task.stage === stage.value)
    return acc
  }, {} as Record<string, Task[]>)

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = tasks.find(t => t.id === active.id)
    setActiveTask(task || null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const taskId = active.id as string
    const newStage = over.id as string
    const task = tasks.find(t => t.id === taskId)

    if (!task || task.stage === newStage) return

    try {
      // Move task to new stage
      await moveTaskToStage({ id: taskId, stage: newStage })
      
      // Generate LLM response for the new stage
      await generateLLMResponse({ taskId, stage: newStage })
      
      // Invalidate queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    } catch (error) {
      console.error('Error moving task:', error)
      // Could add a toast notification here for user feedback
    }
  }

  const handleTaskClick = (task: Task) => {
    setCurrentRow(task)
    setOpen('update')
  }

  const handleGenerateLLM = async (taskId: string, stage: string) => {
    try {
      await generateLLMResponse({ taskId, stage })
      // Invalidate queries to refresh the UI with new LLM response
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    } catch (error) {
      console.error('Error generating LLM response:', error)
      // Could add a toast notification here for user feedback
    }
  }

  return (
    <div className="w-full">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          {stages.map((stage) => (
            <DroppableColumn
              key={stage.value}
              id={stage.value}
              title={stage.label}
              description={stage.description}
              color={stage.color}
              icon={stage.icon}
            >
              <SortableContext
                items={tasksByStage[stage.value].map(task => task.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {tasksByStage[stage.value].map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onClick={() => handleTaskClick(task)}
                      onGenerateLLM={() => handleGenerateLLM(task.id, stage.value)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DroppableColumn>
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="rotate-2 opacity-90">
              <TaskCard task={activeTask} isDragging />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}