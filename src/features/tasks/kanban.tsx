import React, { useState } from 'react'
import { Header } from '../../components/layout/header'
import { Main } from '../../components/layout/main'
import { ProfileDropdown } from '../../components/profile-dropdown'
import { Search } from '../../components/search'
import { ThemeSwitch } from '../../components/theme-switch'
import { Button } from '../../components/ui/button'
import { Table, Plus } from 'lucide-react'
import { KanbanView } from './components/kanban-view'
import { TasksDialogs } from './components/tasks-dialogs'
import TasksProvider from './context/tasks-context'
import { tasks as initialTasks } from './data/tasks'

export default function Kanban() {
  const [tasks, setTasks] = useState(initialTasks)
  const [showAddDialog, setShowAddDialog] = useState(false)

  const handleAddNewCard = () => {
    setShowAddDialog(true)
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
            <h2 className='text-2xl font-bold tracking-tight'>Kanban Board</h2>
            <p className='text-muted-foreground'>
              Manage your tasks using the Kanban board workflow
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={handleAddNewCard}
              className="font-medium"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Card
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/tasks'}
            >
              <Table className="h-4 w-4 mr-2" />
              Switch to Table View
            </Button>
          </div>
        </div>
        
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1'>
          <KanbanView 
            tasks={tasks} 
            onTasksChange={setTasks} 
            showAddDialog={showAddDialog}
            onAddDialogChange={setShowAddDialog}
          />
        </div>
      </Main>

      <TasksDialogs />
    </TasksProvider>
  )
}