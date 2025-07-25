import { useState } from 'react'
import { Header } from '../../components/layout/header'
import { Main } from '../../components/layout/main'
import { ProfileDropdown } from '../../components/profile-dropdown'
import { Search } from '../../components/search'
import { ThemeSwitch } from '../../components/theme-switch'
import { Button } from '../../components/ui/button'
import { toast } from '../../hooks/use-toast'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import { KanbanBoard } from './components/kanban-board'
import { TasksDialogs } from './components/tasks-dialogs'
import { TasksPrimaryButtons } from './components/tasks-primary-buttons'
import TasksProvider from './context/tasks-context'
import { tasks as initialTasks } from './data/tasks'
import { Task } from './data/schema'

export default function Tasks() {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban')
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    )
    
    // In a real app, this would make an API call to save the changes
    toast({
      title: 'Task updated',
      description: `Task ${updatedTask.id} has been updated successfully.`,
    })
  }

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
        <div className='mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Tasks</h2>
            <p className='text-muted-foreground'>
              Manage your tasks in {viewMode === 'kanban' ? 'Kanban board' : 'table'} view
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('kanban')}
              >
                Kanban
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                Table
              </Button>
            </div>
            <TasksPrimaryButtons />
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1'>
          {viewMode === 'kanban' ? (
            <KanbanBoard tasks={tasks} onTaskUpdate={handleTaskUpdate} />
          ) : (
            <DataTable data={tasks} columns={columns} />
          )}
        </div>
      </Main>

      <TasksDialogs />
    </TasksProvider>
  )
}
