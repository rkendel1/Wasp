import type { GetUsers } from 'wasp/server/operations'
import type { User } from 'wasp/entities'

// Get all users for assignee selection
export const getUsers: GetUsers<void, User[]> = async (args, context) => {
  if (!context.user) {
    throw new Error('User must be authenticated')
  }
  
  const users = await context.entities.User.findMany({
    where: {
      isActive: true
    },
    select: {
      id: true,
      // Add username/name fields when available
    },
    orderBy: {
      createdAt: 'asc'
    }
  })
  
  return users
}