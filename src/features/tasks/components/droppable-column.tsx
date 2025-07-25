import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { Card, CardHeader, CardContent } from '../../../components/ui/card'
import { IconType } from '@tabler/icons-react'

interface DroppableColumnProps {
  id: string
  title: string
  description: string
  color: string
  icon: IconType
  children: React.ReactNode
}

export function DroppableColumn({ 
  id, 
  title, 
  description, 
  color, 
  icon: Icon, 
  children 
}: DroppableColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  })

  return (
    <Card className={`h-fit min-h-[500px] ${isOver ? 'ring-2 ring-blue-400 bg-blue-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-md ${color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{title}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          ref={setNodeRef}
          className={`min-h-[400px] transition-colors ${
            isOver ? 'bg-blue-25' : ''
          }`}
        >
          {children}
        </div>
      </CardContent>
    </Card>
  )
}