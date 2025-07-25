-- CreateEnum
CREATE TYPE "TaskStage" AS ENUM ('DEEP_DIVE', 'ITERATING', 'CONSIDERING', 'BUILDING', 'CLOSED');

-- CreateEnum  
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "stage" "TaskStage" NOT NULL DEFAULT 'DEEP_DIVE',
    "comments" TEXT,
    "priority" "TaskPriority",
    "assigneeId" TEXT,
    "completedAt" TIMESTAMP(3),
    "label" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;