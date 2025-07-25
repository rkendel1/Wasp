import React, { useState } from 'react'
import { getTasks, createTask, updateTask, moveTaskToStage, deleteTask } from 'wasp/client/operations'
import { Header } from '../../components/layout/header'
import { Main } from '../../components/layout/main'
import { ProfileDropdown } from '../../components/profile-dropdown'
import { Search } from '../../components/search'
import { ThemeSwitch } from '../../components/theme-switch'
import { Button } from '../../components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import { TasksDialogs } from './components/tasks-dialogs'
import { TasksPrimaryButtons } from './components/tasks-primary-buttons'
import { KanbanBoard } from './components/kanban-board'
import TasksProvider from './context/tasks-context'
import { tasks as mockTasks } from './data/tasks'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '../../hooks/use-toast'

export default function Tasks() {
  const [activeView, setActiveView] = useState<'kanban' | 'table'>('kanban')
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Fetch tasks from server
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  })

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast({
        title: 'Task created',
        description: 'Your task has been created successfully.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create task. Please try again.',
        variant: 'destructive',
      })
    },
  })

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast({
        title: 'Task updated',
        description: 'Your task has been updated successfully.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update task. Please try again.',
        variant: 'destructive',
      })
    },
  })

  // Move task mutation
  const moveTaskMutation = useMutation({
    mutationFn: moveTaskToStage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to move task. Please try again.',
        variant: 'destructive',
      })
    },
  })

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast({
        title: 'Task deleted',
        description: 'Your task has been deleted successfully.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete task. Please try again.',
        variant: 'destructive',
      })
    },
  })

  // Transform tasks data for table view (convert new format to legacy format)
  const tableData = tasks.map(task => ({
    id: task.id,
    title: task.title,
    status: task.stage.toLowerCase().replace('_', ' '),
    label: task.label || 'feature',
    priority: task.priority?.toLowerCase() || 'medium',
  }))

  return (
    <TasksProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-4 flex flex-wrap items-center justify-between gap-x-4 space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Tasks</h2>
            <p className='text-muted-foreground'>
              Manage your tasks through their lifecycle stages
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)}>
              <TabsList>
                <TabsTrigger value="kanban">Kanban</TabsTrigger>
                <TabsTrigger value="table">Table</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className='-mx-4 flex-1 overflow-auto px-4 py-1'>
          <Tabs value={activeView} className="w-full">
            <TabsContent value="kanban" className="mt-0">
              <KanbanBoard
                tasks={tasks}
                onCreateTask={createTaskMutation.mutateAsync}
                onUpdateTask={updateTaskMutation.mutateAsync}
                onMoveTask={moveTaskMutation.mutateAsync}
                onDeleteTask={deleteTaskMutation.mutateAsync}
                loading={isLoading}
              />
            </TabsContent>
            
            <TabsContent value="table" className="mt-0">
              <div className="mb-4">
                <TasksPrimaryButtons />
              </div>
              <DataTable data={tableData} columns={columns} />
            </TabsContent>
          </Tabs>
        </div>
      </Main>

      <TasksDialogs />
    </TasksProvider>
  )
}
