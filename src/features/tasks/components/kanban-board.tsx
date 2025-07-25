import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { Plus } from 'lucide-react'
import { stages, labels, priorities } from '../data/data'
import { Task, TaskStage, getAvailableFields, getStageDisplayName, getPriorityDisplayName } from '../data/schema'
import { KanbanCard } from './kanban-card'
import { CreateTaskDialog } from './create-task-dialog'
import { EditTaskDialog } from './edit-task-dialog'

interface KanbanBoardProps {
  tasks: Task[]
  onCreateTask: (data: { title: string; description?: string; label?: string }) => Promise<void>
  onUpdateTask: (data: { 
    id: string; 
    title?: string; 
    description?: string; 
    comments?: string; 
    priority?: string; 
    assigneeId?: string; 
    label?: string; 
  }) => Promise<void>
  onMoveTask: (data: { id: string; stage: string; position?: number }) => Promise<void>
  onDeleteTask: (id: string) => Promise<void>
  loading?: boolean
}

export function KanbanBoard({ 
  tasks, 
  onCreateTask, 
  onUpdateTask, 
  onMoveTask, 
  onDeleteTask, 
  loading = false 
}: KanbanBoardProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  // Group tasks by stage
  const tasksByStage = stages.reduce((acc, stage) => {
    acc[stage.value] = tasks
      .filter(task => task.stage === stage.value)
      .sort((a, b) => a.position - b.position)
    return acc
  }, {} as Record<string, Task[]>)

  const handleDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    const sourceStage = source.droppableId
    const destinationStage = destination.droppableId
    const sourceIndex = source.index
    const destinationIndex = destination.index

    // If dropped in the same position, do nothing
    if (sourceStage === destinationStage && sourceIndex === destinationIndex) {
      return
    }

    try {
      await onMoveTask({
        id: draggableId,
        stage: destinationStage,
        position: destinationIndex
      })
    } catch (error) {
      console.error('Failed to move task:', error)
    }
  }

  const handleCreateTask = async (data: { title: string; description?: string; label?: string }) => {
    try {
      await onCreateTask(data)
      setCreateDialogOpen(false)
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  const handleUpdateTask = async (data: any) => {
    try {
      await onUpdateTask(data)
      setEditingTask(null)
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-muted-foreground">Loading tasks...</div>
      </div>
    )
  }

  return (
    <div className="h-full">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Kanban Board</h2>
          <p className="text-muted-foreground">
            Manage tasks through their lifecycle stages
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {stages.map((stage) => (
            <div key={stage.value} className="flex-shrink-0 w-80">
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <stage.icon className="h-5 w-5" />
                  <h3 className="font-semibold">{stage.label}</h3>
                  <Badge variant="secondary" className="ml-auto">
                    {tasksByStage[stage.value]?.length || 0}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{stage.description}</p>
              </div>

              <Droppable droppableId={stage.value}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`
                      min-h-[200px] p-2 rounded-lg border-2 border-dashed transition-colors
                      ${snapshot.isDraggingOver 
                        ? 'border-primary bg-primary/5' 
                        : 'border-muted-foreground/25'
                      }
                    `}
                  >
                    {tasksByStage[stage.value]?.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`
                              mb-3 transition-transform
                              ${snapshot.isDragging ? 'rotate-3 scale-105' : ''}
                            `}
                          >
                            <KanbanCard
                              task={task}
                              onEdit={() => setEditingTask(task)}
                              onDelete={() => onDeleteTask(task.id)}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <CreateTaskDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateTask}
      />

      {editingTask && (
        <EditTaskDialog
          task={editingTask}
          open={!!editingTask}
          onOpenChange={() => setEditingTask(null)}
          onSubmit={handleUpdateTask}
        />
      )}
    </div>
  )
}