import { useState } from 'react'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { ScrollArea } from '../../../components/ui/scroll-area'
import { Separator } from '../../../components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { Textarea } from '../../../components/ui/textarea'
import { toast } from '../../../hooks/use-toast'
import { labels, priorities, statuses } from '../data/data'
import { Task } from '../data/schema'
import { useTasks } from '../context/tasks-context'
import { SelectDropdown } from '../../../components/select-dropdown'

interface TaskDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: Task | null
}

export function TaskDetailModal({ open, onOpenChange, task }: TaskDetailModalProps) {
  const { setOpen } = useTasks()
  const [editedTask, setEditedTask] = useState<Task | null>(task)
  const [newComment, setNewComment] = useState('')
  const [newPrompt, setNewPrompt] = useState('')
  const [loadingLLM, setLoadingLLM] = useState(false)

  if (!task || !editedTask) return null

  const status = statuses.find(s => s.value === task.status)
  const label = labels.find(l => l.value === task.label)
  const priority = priorities.find(p => p.value === task.priority)

  const handleSave = () => {
    // In a real app, this would save to the backend
    toast({
      title: 'Task Updated',
      description: 'Changes have been saved successfully.',
    })
    onOpenChange(false)
  }

  const handleLLMRequest = async (action: string) => {
    setLoadingLLM(true)
    // Simulate LLM API call
    setTimeout(() => {
      toast({
        title: 'LLM Request Sent',
        description: `${action} request has been sent to the AI assistant.`,
      })
      setLoadingLLM(false)
    }, 2000)
  }

  const addComment = () => {
    if (!newComment.trim()) return
    const updatedComments = [...(editedTask.comments || []), newComment]
    setEditedTask({ ...editedTask, comments: updatedComments })
    setNewComment('')
  }

  const requestPrompt = () => {
    if (!newPrompt.trim()) return
    const updatedPrompts = [...(editedTask.llmData?.exploratoryPrompts || []), newPrompt]
    setEditedTask({
      ...editedTask,
      llmData: {
        ...editedTask.llmData,
        exploratoryPrompts: updatedPrompts
      }
    })
    setNewPrompt('')
    handleLLMRequest('Exploratory prompt')
  }

  const renderStageSpecificActions = () => {
    switch (task.status) {
      case 'deep-dive':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Deep Dive Actions</CardTitle>
              <CardDescription>Edit description and request exploratory prompts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editedTask.description || ''}
                  onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                  placeholder="Edit task description..."
                />
              </div>
              <div>
                <Label htmlFor="prompt">Request Exploratory Prompt</Label>
                <div className="flex gap-2">
                  <Input
                    id="prompt"
                    value={newPrompt}
                    onChange={(e) => setNewPrompt(e.target.value)}
                    placeholder="Ask AI to explore an aspect..."
                  />
                  <Button onClick={requestPrompt} disabled={loadingLLM}>
                    Send
                  </Button>
                </div>
              </div>
              {editedTask.llmData?.exploratoryPrompts && editedTask.llmData.exploratoryPrompts.length > 0 && (
                <div>
                  <Label>Exploratory Prompts</Label>
                  <div className="space-y-2 mt-2">
                    {editedTask.llmData.exploratoryPrompts.map((prompt, index) => (
                      <Card key={index} className="p-3">
                        <p className="text-sm">{prompt}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )

      case 'iterating':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Iterating Actions</CardTitle>
              <CardDescription>Add feedback and request improvements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="comment">Add Comment/Feedback</Label>
                <div className="flex gap-2">
                  <Input
                    id="comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add your feedback..."
                  />
                  <Button onClick={addComment}>Add</Button>
                </div>
              </div>
              <Button 
                onClick={() => handleLLMRequest('Iterative improvement')}
                disabled={loadingLLM}
                className="w-full"
              >
                Request Iterative Improvements
              </Button>
            </CardContent>
          </Card>
        )

      case 'considering':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Considering Actions</CardTitle>
              <CardDescription>Modify priority and assess feasibility</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="priority">Priority Level</Label>
                <SelectDropdown
                  defaultValue={editedTask.priority}
                  onValueChange={(value) => setEditedTask({ ...editedTask, priority: value })}
                  placeholder="Select priority"
                  items={priorities.map(p => ({ label: p.label, value: p.value }))}
                />
              </div>
              <Button 
                onClick={() => handleLLMRequest('Feasibility assessment')}
                disabled={loadingLLM}
                className="w-full"
              >
                Request LLM Feasibility Assessment
              </Button>
              {editedTask.llmData?.feasibilityAssessment && (
                <div>
                  <Label>Feasibility Assessment</Label>
                  <Card className="p-3 mt-2">
                    <p className="text-sm">{editedTask.llmData.feasibilityAssessment}</p>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        )

      case 'building':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Building Actions</CardTitle>
              <CardDescription>Assign tasks and request technical details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="assignee">Assign To</Label>
                <Input
                  id="assignee"
                  value={editedTask.assignedTo || ''}
                  onChange={(e) => setEditedTask({ ...editedTask, assignedTo: e.target.value })}
                  placeholder="Enter assignee name..."
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleLLMRequest('Code snippets')}
                  disabled={loadingLLM}
                  className="flex-1"
                >
                  Request Code Snippets
                </Button>
                <Button 
                  onClick={() => handleLLMRequest('Technical details')}
                  disabled={loadingLLM}
                  className="flex-1"
                >
                  Request Technical Details
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      case 'closed':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Closed Actions</CardTitle>
              <CardDescription>Add retrospective notes and view summary</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="retrospective">Retrospective Notes</Label>
                <Textarea
                  id="retrospective"
                  value={editedTask.llmData?.retrospectiveNotes || ''}
                  onChange={(e) => setEditedTask({
                    ...editedTask,
                    llmData: {
                      ...editedTask.llmData,
                      retrospectiveNotes: e.target.value
                    }
                  })}
                  placeholder="Add retrospective notes..."
                />
              </div>
              {editedTask.llmData?.llmSummary && (
                <div>
                  <Label>LLM Summary</Label>
                  <Card className="p-3 mt-2">
                    <p className="text-sm">{editedTask.llmData.llmSummary}</p>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-lg">{task.title}</DialogTitle>
              <DialogDescription className="mt-1">
                {task.id} • Created {task.createdAt || 'recently'}
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              {status && status.icon && (
                <status.icon className="h-5 w-5 text-muted-foreground" />
              )}
              <Badge variant="secondary">{status?.label}</Badge>
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="flex-1">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
              <TabsTrigger value="llm-data">LLM Data</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Label</Label>
                  <div className="mt-1">
                    {label && <Badge variant="outline">{label.label}</Badge>}
                  </div>
                </div>
                <div>
                  <Label>Priority</Label>
                  <div className="mt-1 flex items-center gap-2">
                    {priority?.icon && <priority.icon className="h-4 w-4" />}
                    <span className="text-sm">{priority?.label}</span>
                  </div>
                </div>
              </div>
              
              {task.description && (
                <div>
                  <Label>Description</Label>
                  <Card className="p-3 mt-2">
                    <p className="text-sm">{task.description}</p>
                  </Card>
                </div>
              )}
              
              {task.assignedTo && (
                <div>
                  <Label>Assigned To</Label>
                  <div className="mt-1">
                    <Badge variant="secondary">{task.assignedTo}</Badge>
                  </div>
                </div>
              )}
              
              {task.comments && task.comments.length > 0 && (
                <div>
                  <Label>Comments ({task.comments.length})</Label>
                  <div className="space-y-2 mt-2">
                    {task.comments.map((comment, index) => (
                      <Card key={index} className="p-3">
                        <p className="text-sm">{comment}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="actions" className="space-y-4">
              {renderStageSpecificActions()}
            </TabsContent>
            
            <TabsContent value="llm-data" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">LLM Generated Data</CardTitle>
                  <CardDescription>Structured data from AI interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  {task.llmData ? (
                    <div className="space-y-4">
                      {task.llmData.exploratoryPrompts && task.llmData.exploratoryPrompts.length > 0 && (
                        <div>
                          <Label>Exploratory Prompts</Label>
                          <div className="space-y-2 mt-2">
                            {task.llmData.exploratoryPrompts.map((prompt, index) => (
                              <Card key={index} className="p-3">
                                <p className="text-sm">{prompt}</p>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {task.llmData.feasibilityAssessment && (
                        <div>
                          <Label>Feasibility Assessment</Label>
                          <Card className="p-3 mt-2">
                            <p className="text-sm">{task.llmData.feasibilityAssessment}</p>
                          </Card>
                        </div>
                      )}
                      
                      {task.llmData.retrospectiveNotes && (
                        <div>
                          <Label>Retrospective Notes</Label>
                          <Card className="p-3 mt-2">
                            <p className="text-sm">{task.llmData.retrospectiveNotes}</p>
                          </Card>
                        </div>
                      )}
                      
                      {task.llmData.llmSummary && (
                        <div>
                          <Label>LLM Summary</Label>
                          <Card className="p-3 mt-2">
                            <p className="text-sm">{task.llmData.llmSummary}</p>
                          </Card>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No LLM data available for this task.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </ScrollArea>
        
        <Separator />
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}