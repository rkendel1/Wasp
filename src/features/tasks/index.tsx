import React, { useState } from 'react'
import { Header } from '../../components/layout/header'
import { Main } from '../../components/layout/main'
import { ProfileDropdown } from '../../components/profile-dropdown'
import { Search } from '../../components/search'
import { ThemeSwitch } from '../../components/theme-switch'
import { Button } from '../../components/ui/button'
import { IconTable, IconColumns3 } from '@tabler/icons-react'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import { KanbanBoard } from './components/kanban-board'
import { TasksDialogs } from './components/tasks-dialogs'
import { TasksPrimaryButtons } from './components/tasks-primary-buttons'
import TasksProvider from './context/tasks-context'
import { getTasks } from 'wasp/client/operations'
import { useQuery } from '@tanstack/react-query'
import { sampleTasks } from './data/sample-tasks'

type ViewMode = 'table' | 'kanban'

export default function Tasks() {
  const [viewMode, setViewMode] = useState<ViewMode>('kanban')
  
  // Use the real API query with fallback to sample data
  const { data: tasks = sampleTasks, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
    // Use sample data if API fails
    onError: () => {
      console.log('Using sample data as fallback')
    }
  })

  if (isLoading) {
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
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading tasks...</p>
            </div>
          </div>
        </Main>
      </TasksProvider>
    )
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
        <div className='mb-4 flex flex-wrap items-center justify-between gap-x-4 space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Tasks</h2>
            <p className='text-muted-foreground'>
              {viewMode === 'kanban' 
                ? 'Manage your tasks with AI-powered insights through the development lifecycle'
                : 'Here\'s a list of your tasks for this month!'
              }
            </p>
            {error && (
              <p className="text-sm text-orange-600 mt-1">
                Using sample data (API not available)
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* View mode toggle */}
            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('kanban')}
                className="rounded-r-none"
              >
                <IconColumns3 className="w-4 h-4 mr-2" />
                Kanban
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="rounded-l-none"
              >
                <IconTable className="w-4 h-4 mr-2" />
                Table
              </Button>
            </div>
            
            <TasksPrimaryButtons />
          </div>
        </div>
        
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1'>
          {viewMode === 'kanban' ? (
            <KanbanBoard tasks={tasks} />
          ) : (
            <DataTable data={tasks} columns={columns} />
          )}
        </div>
      </Main>

      <TasksDialogs />
    </TasksProvider>
  )
}
