# Enhanced Kanban Board with LLM Integration

This enhanced task management system includes a Kanban board with AI-powered insights for each stage of the development lifecycle.

## Features

### 🎯 Stage-Based Workflow
- **Deep Dive**: Explore and understand requirements
- **Iterating**: Refine and improve the approach  
- **Considering**: Evaluate feasibility and priority
- **Building**: Implementation and development
- **Closed**: Complete with retrospective analysis

### 🤖 AI-Powered Insights
Each stage integrates with Large Language Models to provide:
- **Deep Dive**: Exploratory questions and ideas
- **Iterating**: Iterative feedback and suggestions
- **Considering**: Priority assessment and feasibility analysis
- **Building**: Code snippets and technical guidance
- **Closed**: Retrospective analysis and task summaries

### 🎨 Drag & Drop Interface
- Smooth drag-and-drop between stages
- Real-time updates
- Visual feedback during interactions
- Mobile-responsive design

### 📊 Dual View Modes
- **Kanban Board**: Visual workflow management
- **Table View**: Traditional list with filtering and sorting

## Technical Implementation

### Database Schema
```sql
-- Tasks with stage-based workflow
CREATE TABLE "Task" (
    "id" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "stage" TEXT DEFAULT 'deep-dive',
    "priority" TEXT DEFAULT 'medium',
    "label" TEXT DEFAULT 'feature',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- LLM responses for each stage
CREATE TABLE "LLMResponse" (
    "id" TEXT PRIMARY KEY,
    "taskId" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);
```

### API Endpoints
- `getTasks()` - Fetch all tasks with LLM responses
- `createTask(data)` - Create new task
- `updateTask(id, data)` - Update task details
- `moveTaskToStage(id, stage)` - Move task between stages
- `generateLLMResponse(taskId, stage)` - Generate AI insights

### Components
- `KanbanBoard` - Main drag-and-drop interface
- `TaskCard` - Individual task cards with AI insights
- `DroppableColumn` - Stage columns for drag-and-drop
- Enhanced data table with stage filtering

## Usage

1. **Creating Tasks**: Use the "Create Task" button to add new tasks
2. **Moving Tasks**: Drag cards between columns to update stages
3. **AI Insights**: Click the "AI" button on cards to generate stage-specific insights
4. **View Modes**: Toggle between Kanban and Table views using the toolbar buttons

## Development

The implementation uses:
- **Frontend**: React + TypeScript + Tailwind CSS
- **Drag & Drop**: @dnd-kit library
- **Backend**: Wasp framework with Prisma ORM
- **Database**: PostgreSQL
- **UI Components**: Radix UI primitives

## Future Enhancements

- Real LLM integration (currently uses mock responses)
- Advanced filtering and search
- Task templates
- Collaboration features
- Analytics and reporting