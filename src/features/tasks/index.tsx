import React, { useState } from 'react'
import { Header } from '../../components/layout/header'
import { Main } from '../../components/layout/main'
import { ProfileDropdown } from '../../components/profile-dropdown'
import { Search } from '../../components/search'
import { ThemeSwitch } from '../../components/theme-switch'
import { Button } from '../../components/ui/button'
import { LayoutGrid, Table } from 'lucide-react'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import { KanbanView } from './components/kanban-view'
import { TasksDialogs } from './components/tasks-dialogs'
import { TasksPrimaryButtons } from './components/tasks-primary-buttons'
import TasksProvider from './context/tasks-context'
import { tasks as initialTasks } from './data/tasks'

export default function Tasks() {
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban')
  const [tasks, setTasks] = useState(initialTasks)

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
              {viewMode === 'kanban' 
                ? 'Manage your tasks using the Kanban board!' 
                : 'Here\'s a list of your tasks for this month!'
              }
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-md border">
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="rounded-r-none"
              >
                <Table className="h-4 w-4 mr-2" />
                Table
              </Button>
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('kanban')}
                className="rounded-l-none border-l"
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Kanban
              </Button>
            </div>
            {viewMode === 'table' ? (
              <TasksPrimaryButtons />
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/kanban'}
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Full Kanban View
              </Button>
            )}
          </div>
        </div>
        
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1'>
          {viewMode === 'table' ? (
            <DataTable data={tasks} columns={columns} />
          ) : (
            <KanbanView tasks={tasks} onTasksChange={setTasks} />
          )}
        </div>
      </Main>

      <TasksDialogs />
    </TasksProvider>
  )
}
