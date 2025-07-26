import { useState } from 'react'
import { updateTask, llmInteraction } from 'wasp/client/operations'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { ScrollArea } from '../../../components/ui/scroll-area'
import { Separator } from '../../../components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { Task } from '../data/schema'
import { stages, priorities } from '../data/data'
import { 
  IconBrain, 
  IconPlus, 
  IconSend, 
  IconEdit, 
  IconUser,
  IconCode,
  IconNotes,
  IconClock,
  IconMessageCircle,
  IconTarget,
  IconScale,
} from '@tabler/icons-react'

interface TaskDetailModalProps {
  task: Task
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskDetailModal({ task, open, onOpenChange }: TaskDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState<Task>(task)
  const [newPrompt, setNewPrompt] = useState('')
  const [newComment, setNewComment] = useState('')
  const [isProcessingLLM, setIsProcessingLLM] = useState(false)

  const stage = stages.find(s => s.value === task.stage)
  const priority = priorities.find(p => p.value === task.priority)
  const StageIcon = stage?.icon
  const PriorityIcon = priority?.icon

  const handleSave = async () => {
    try {
      await updateTask({
        taskId: editedTask.id,
        updates: editedTask
      })
      console.log('Task saved successfully')
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to save task:', error)
    }
  }

  const handleLLMRequest = async (promptType: string, content: string) => {
    setIsProcessingLLM(true)
    try {
      const result = await llmInteraction({
        taskId: task.id,
        stage: task.stage || 'deep-dive',
        prompt: content,
        type: promptType as any
      })
      
      // Update task data based on stage
      const updatedTask = { ...editedTask }
      
      switch (task.stage) {
        case 'deep-dive':
          updatedTask.deepDiveData = {
            ...updatedTask.deepDiveData,
            exploratoryPrompts: [
              ...(updatedTask.deepDiveData?.exploratoryPrompts || []),
              content
            ],
            llmResponses: [
              ...(updatedTask.deepDiveData?.llmResponses || []),
              result.response
            ]
          }
          break
        case 'iterating':
          updatedTask.iteratingData = {
            ...updatedTask.iteratingData,
            improvements: [
              ...(updatedTask.iteratingData?.improvements || []),
              result.response
            ]
          }
          break
        case 'considering':
          updatedTask.consideringData = {
            ...updatedTask.consideringData,
            feasibilityAssessment: result.response
          }
          break
        case 'building':
          updatedTask.buildingData = {
            ...updatedTask.buildingData,
            technicalDetails: [
              ...(updatedTask.buildingData?.technicalDetails || []),
              result.response
            ]
          }
          break
        case 'closed':
          updatedTask.closedData = {
            ...updatedTask.closedData,
            llmSummary: result.response
          }
          break
      }
      
      setEditedTask(updatedTask)
      setNewPrompt('')
      setNewComment('')
      
      // Save the updated task
      await updateTask({
        taskId: updatedTask.id,
        updates: updatedTask
      })
    } catch (error) {
      console.error('LLM request failed:', error)
    } finally {
      setIsProcessingLLM(false)
    }
  }

  const addComment = async () => {
    if (!newComment.trim()) return
    
    const updatedTask = { ...editedTask }
    updatedTask.iteratingData = {
      ...updatedTask.iteratingData,
      comments: [
        ...(updatedTask.iteratingData?.comments || []),
        {
          id: `comment-${Date.now()}`,
          content: newComment,
          timestamp: new Date().toISOString(),
        }
      ]
    }
    setEditedTask(updatedTask)
    setNewComment('')
    
    // Save the updated task
    try {
      await updateTask({
        taskId: updatedTask.id,
        updates: updatedTask
      })
    } catch (error) {
      console.error('Failed to save comment:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs sm:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                {StageIcon && <StageIcon className="h-4 w-4 md:h-5 md:w-5" />}
                <DialogTitle className="text-lg md:text-xl">
                  {isEditing ? (
                    <Input
                      value={editedTask.title}
                      onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
                      className="text-lg md:text-xl font-semibold"
                    />
                  ) : (
                    <span className="break-words">{task.title}</span>
                  )}
                </DialogTitle>
              </div>
              <DialogDescription className="flex flex-wrap items-center gap-2">
                <span className="text-sm">{task.id}</span>
                {stage && (
                  <Badge className={stage.color}>
                    {stage.label}
                  </Badge>
                )}
                {PriorityIcon && (
                  <div className="flex items-center space-x-1">
                    <PriorityIcon className={`h-3 w-3 md:h-4 md:w-4 ${
                      task.priority === 'high' ? 'text-red-500' :
                      task.priority === 'medium' ? 'text-yellow-500' :
                      'text-green-500'
                    }`} />
                    <span className="text-sm">{priority?.label}</span>
                  </div>
                )}
              </DialogDescription>
            </div>
            <div className="flex space-x-2 ml-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} size="sm">
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)} size="sm">
                    Cancel
                  </Button>
                </>
              ) : (
                <Button variant="outline" onClick={() => setIsEditing(true)} size="sm">
                  <IconEdit className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-2 md:pr-6">
          <div className="space-y-4 md:space-y-6">
            {/* Basic Information */}
            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              {isEditing ? (
                <Textarea
                  id="description"
                  value={editedTask.description || ''}
                  onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
                  placeholder="Enter task description..."
                  className="mt-1"
                  rows={3}
                />
              ) : (
                <p className="mt-1 text-sm text-muted-foreground break-words">
                  {task.description || 'No description provided'}
                </p>
              )}
            </div>

            <Separator />

            {/* Stage-specific content */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
                <TabsTrigger value="details" className="text-xs md:text-sm">Details</TabsTrigger>
                <TabsTrigger value="actions" className="text-xs md:text-sm">Actions</TabsTrigger>
                {task.stage === 'iterating' && (
                  <TabsTrigger value="comments" className="text-xs md:text-sm">Comments</TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                {renderStageDetails(task, editedTask, setEditedTask, isEditing)}
              </TabsContent>

              <TabsContent value="actions" className="space-y-4">
                {renderStageActions(task, newPrompt, setNewPrompt, handleLLMRequest, isProcessingLLM)}
              </TabsContent>

              {task.stage === 'iterating' && (
                <TabsContent value="comments" className="space-y-4">
                  <div className="space-y-3">
                    {task.iteratingData?.comments?.map((comment) => (
                      <div key={comment.id} className="border rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <IconMessageCircle className="h-4 w-4" />
                          <span className="text-sm text-muted-foreground">
                            {new Date(comment.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    ))}
                    
                    <div className="flex space-x-2">
                      <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1"
                      />
                      <Button onClick={addComment} disabled={!newComment.trim()}>
                        <IconPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

function renderStageDetails(task: Task, editedTask: Task, setEditedTask: (task: Task) => void, isEditing: boolean) {
  switch (task.stage) {
    case 'suggested':
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="submittedBy" className="font-medium flex items-center space-x-2 mb-2">
              <IconUser className="h-4 w-4" />
              <span>Submitted By</span>
            </Label>
            {isEditing ? (
              <Input
                id="submittedBy"
                value={editedTask.suggestedData?.submittedBy || ''}
                onChange={(e) => setEditedTask({
                  ...editedTask,
                  suggestedData: { ...editedTask.suggestedData, submittedBy: e.target.value }
                })}
                placeholder="Enter submitter name..."
              />
            ) : (
              <p className="text-sm">{task.suggestedData?.submittedBy || 'Anonymous'}</p>
            )}
          </div>
          <div>
            <Label htmlFor="initialNotes" className="font-medium flex items-center space-x-2 mb-2">
              <IconNotes className="h-4 w-4" />
              <span>Initial Notes</span>
            </Label>
            {isEditing ? (
              <Textarea
                id="initialNotes"
                value={editedTask.suggestedData?.initialNotes || ''}
                onChange={(e) => setEditedTask({
                  ...editedTask,
                  suggestedData: { ...editedTask.suggestedData, initialNotes: e.target.value }
                })}
                placeholder="Add initial notes about this suggestion..."
                rows={3}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                {task.suggestedData?.initialNotes || 'No initial notes provided'}
              </p>
            )}
          </div>
          <div>
            <h4 className="font-medium flex items-center space-x-2 mb-2">
              <IconTarget className="h-4 w-4" />
              <span>Community Votes</span>
            </h4>
            <p className="text-sm">
              {task.suggestedData?.votes || 0} votes
            </p>
          </div>
        </div>
      )

    case 'deep-dive':
      return (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium flex items-center space-x-2 mb-2">
              <IconBrain className="h-4 w-4" />
              <span>Exploratory Prompts</span>
            </h4>
            {task.deepDiveData?.exploratoryPrompts?.map((prompt, index) => (
              <div key={index} className="bg-muted p-3 rounded-lg mb-2">
                <p className="text-sm">{prompt}</p>
              </div>
            ))}
          </div>
          <div>
            <h4 className="font-medium mb-2">LLM Responses</h4>
            {task.deepDiveData?.llmResponses?.map((response, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 mb-2">
                <p className="text-sm text-muted-foreground">{response}</p>
              </div>
            ))}
          </div>
        </div>
      )
    
    case 'considering':
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="priority" className="font-medium flex items-center space-x-2 mb-2">
              <IconTarget className="h-4 w-4" />
              <span>Priority Level</span>
            </Label>
            {isEditing ? (
              <select
                id="priority"
                value={editedTask.priority}
                onChange={(e) => setEditedTask({...editedTask, priority: e.target.value})}
                className="w-full p-2 border rounded-md"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            ) : (
              <p className="text-sm">{task.priority}</p>
            )}
          </div>
          <div>
            <h4 className="font-medium flex items-center space-x-2 mb-2">
              <IconScale className="h-4 w-4" />
              <span>Feasibility Assessment</span>
            </h4>
            <p className="text-sm text-muted-foreground">
              {task.consideringData?.feasibilityAssessment || 'No assessment available'}
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Risk Factors</h4>
            {task.consideringData?.riskFactors?.map((risk, index) => (
              <Badge key={index} variant="destructive" className="mr-2 mb-2">
                {risk}
              </Badge>
            ))}
          </div>
        </div>
      )
    
    case 'building':
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="assignedTo" className="font-medium flex items-center space-x-2 mb-2">
              <IconUser className="h-4 w-4" />
              <span>Assigned To</span>
            </Label>
            {isEditing ? (
              <Input
                id="assignedTo"
                value={editedTask.buildingData?.assignedTo || ''}
                onChange={(e) => setEditedTask({
                  ...editedTask,
                  buildingData: { ...editedTask.buildingData, assignedTo: e.target.value }
                })}
                placeholder="Enter assignee name..."
              />
            ) : (
              <p className="text-sm">{task.buildingData?.assignedTo || 'Unassigned'}</p>
            )}
          </div>
          <div>
            <h4 className="font-medium flex items-center space-x-2 mb-2">
              <IconCode className="h-4 w-4" />
              <span>Code Snippets</span>
            </h4>
            {task.buildingData?.codeSnippets?.map((snippet, index) => (
              <div key={index} className="bg-gray-900 text-gray-100 p-3 rounded-lg mb-2">
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="outline">{snippet.language}</Badge>
                  {snippet.description && (
                    <span className="text-xs text-gray-400">{snippet.description}</span>
                  )}
                </div>
                <pre className="text-sm overflow-x-auto">
                  <code>{snippet.code}</code>
                </pre>
              </div>
            ))}
          </div>
          <div>
            <h4 className="font-medium mb-2">Technical Details</h4>
            {task.buildingData?.technicalDetails?.map((detail, index) => (
              <div key={index} className="bg-muted p-3 rounded-lg mb-2">
                <p className="text-sm">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      )
    
    case 'closed':
      return (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium flex items-center space-x-2 mb-2">
              <IconNotes className="h-4 w-4" />
              <span>Retrospective Notes</span>
            </h4>
            <p className="text-sm text-muted-foreground">
              {task.closedData?.retrospectiveNotes || 'No retrospective notes'}
            </p>
          </div>
          <div>
            <h4 className="font-medium flex items-center space-x-2 mb-2">
              <IconBrain className="h-4 w-4" />
              <span>LLM Summary</span>
            </h4>
            <div className="border-l-4 border-green-500 pl-4">
              <p className="text-sm text-muted-foreground">
                {task.closedData?.llmSummary || 'No summary available'}
              </p>
            </div>
          </div>
          <div>
            <h4 className="font-medium flex items-center space-x-2 mb-2">
              <IconClock className="h-4 w-4" />
              <span>Completion Date</span>
            </h4>
            <p className="text-sm">
              {task.closedData?.completionDate 
                ? new Date(task.closedData.completionDate).toLocaleDateString()
                : 'Not specified'
              }
            </p>
          </div>
        </div>
      )
    
    default:
      return (
        <div className="text-center text-muted-foreground py-8">
          <p>No stage-specific details available</p>
        </div>
      )
  }
}

function renderStageActions(
  task: Task, 
  newPrompt: string, 
  setNewPrompt: (prompt: string) => void, 
  handleLLMRequest: (type: string, content: string) => Promise<void>,
  isProcessing: boolean
) {
  switch (task.stage) {
    case 'suggested':
      return (
        <div className="space-y-4">
          <Button 
            onClick={() => handleLLMRequest('initial-analysis', 'Analyze suggestion and provide initial insights')}
            disabled={isProcessing}
            className="w-full"
          >
            <IconBrain className="h-4 w-4 mr-2" />
            {isProcessing ? 'Processing...' : 'Get Initial Analysis'}
          </Button>
          <div>
            <Label htmlFor="newPrompt" className="font-medium mb-2 block">
              Add Community Feedback
            </Label>
            <div className="flex space-x-2">
              <Textarea
                id="newPrompt"
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                placeholder="Share your thoughts on this suggestion..."
                className="flex-1"
              />
              <Button 
                onClick={() => handleLLMRequest('feedback', newPrompt)}
                disabled={!newPrompt.trim() || isProcessing}
              >
                <IconMessageCircle className="h-4 w-4 mr-1" />
                {isProcessing ? 'Adding...' : 'Add'}
              </Button>
            </div>
          </div>
        </div>
      )

    case 'deep-dive':
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="newPrompt" className="font-medium mb-2 block">
              Request New Exploratory Prompt
            </Label>
            <div className="flex space-x-2">
              <Textarea
                id="newPrompt"
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                placeholder="Describe what you'd like to explore..."
                className="flex-1"
              />
              <Button 
                onClick={() => handleLLMRequest('exploratory', newPrompt)}
                disabled={!newPrompt.trim() || isProcessing}
              >
                <IconSend className="h-4 w-4 mr-1" />
                {isProcessing ? 'Processing...' : 'Send'}
              </Button>
            </div>
          </div>
        </div>
      )
    
    case 'iterating':
      return (
        <div className="space-y-4">
          <Button 
            onClick={() => handleLLMRequest('improvement', 'Request iterative improvements')}
            disabled={isProcessing}
            className="w-full"
          >
            <IconBrain className="h-4 w-4 mr-2" />
            {isProcessing ? 'Processing...' : 'Request Iterative Improvements'}
          </Button>
        </div>
      )
    
    case 'considering':
      return (
        <div className="space-y-4">
          <Button 
            onClick={() => handleLLMRequest('feasibility', 'Assess feasibility and risks')}
            disabled={isProcessing}
            className="w-full"
          >
            <IconScale className="h-4 w-4 mr-2" />
            {isProcessing ? 'Processing...' : 'Request Feasibility Assessment'}
          </Button>
        </div>
      )
    
    case 'building':
      return (
        <div className="space-y-4">
          <Button 
            onClick={() => handleLLMRequest('code', 'Generate code snippets and technical details')}
            disabled={isProcessing}
            className="w-full"
          >
            <IconCode className="h-4 w-4 mr-2" />
            {isProcessing ? 'Processing...' : 'Request Code Snippets'}
          </Button>
        </div>
      )
    
    case 'closed':
      return (
        <div className="space-y-4">
          <Button 
            onClick={() => handleLLMRequest('summary', 'Generate project summary')}
            disabled={isProcessing}
            className="w-full"
          >
            <IconBrain className="h-4 w-4 mr-2" />
            {isProcessing ? 'Processing...' : 'Generate LLM Summary'}
          </Button>
        </div>
      )
    
    default:
      return (
        <div className="text-center text-muted-foreground py-8">
          <p>No actions available for this stage</p>
        </div>
      )
  }
}