import { useState } from 'react'
import { Header } from '../../components/layout/header'
import { Main } from '../../components/layout/main'
import { ProfileDropdown } from '../../components/profile-dropdown'
import { Search } from '../../components/search'
import { ThemeSwitch } from '../../components/theme-switch'
import { Button } from '../../components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { IconTable, IconLayoutBoard } from '@tabler/icons-react'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import { KanbanBoard } from './components/kanban-board'
import { TasksDialogs } from './components/tasks-dialogs'
import { TasksPrimaryButtons } from './components/tasks-primary-buttons'
import TasksProvider from './context/tasks-context'
import { tasks } from './data/tasks'

export default function Tasks() {
  const [view, setView] = useState<'table' | 'kanban'>('kanban')

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
              Manage your tasks with our enhanced Kanban board and table views
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center rounded-lg border p-1">
              <Button
                variant={view === 'kanban' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('kanban')}
                className="h-8"
              >
                <IconLayoutBoard className="h-4 w-4 mr-1" />
                Kanban
              </Button>
              <Button
                variant={view === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('table')}
                className="h-8"
              >
                <IconTable className="h-4 w-4 mr-1" />
                Table
              </Button>
            </div>
            <TasksPrimaryButtons />
          </div>
        </div>
        
        <div className='flex-1 overflow-hidden'>
          {view === 'kanban' ? (
            <KanbanBoard tasks={tasks} />
          ) : (
            <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
              <DataTable data={tasks} columns={columns} />
            </div>
          )}
        </div>
      </Main>

      <TasksDialogs />
    </TasksProvider>
  )
}
