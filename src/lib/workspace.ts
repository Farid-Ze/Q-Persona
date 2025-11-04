/**
 * Workspace Helper Functions
 * Utilities for managing workspaces and workspace members
 */

import { Workspace, WorkspaceMember } from '@/types';

/**
 * Check if a user has permission to perform an action in a workspace
 * @param userRole The user's role in the workspace
 * @param requiredRole The minimum role required for the action
 * @returns boolean indicating if the user has permission
 */
export function hasWorkspacePermission(
  userRole: WorkspaceMember['role'],
  requiredRole: WorkspaceMember['role']
): boolean {
  const roleHierarchy: Record<WorkspaceMember['role'], number> = {
    viewer: 1,
    editor: 2,
    admin: 3,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

/**
 * Get the user's role in a workspace
 * @param userId The user's ID
 * @param workspaceId The workspace ID
 * @returns Promise<WorkspaceMember['role'] | null>
 */
export async function getUserWorkspaceRole(
  userId: string,
  workspaceId: string
): Promise<WorkspaceMember['role'] | null> {
  // TODO: Implement database query via Supabase
  // This is a placeholder that should be replaced with actual DB query
  return null;
}

/**
 * Check if user can perform action on resource
 * @param userId User ID
 * @param workspaceId Workspace ID
 * @param action Action to perform (read, write, delete)
 * @returns Promise<boolean>
 */
export async function canUserPerformAction(
  userId: string,
  workspaceId: string,
  action: 'read' | 'write' | 'delete'
): Promise<boolean> {
  const role = await getUserWorkspaceRole(userId, workspaceId);
  
  if (!role) return false;

  switch (action) {
    case 'read':
      return hasWorkspacePermission(role, 'viewer');
    case 'write':
      return hasWorkspacePermission(role, 'editor');
    case 'delete':
      return hasWorkspacePermission(role, 'admin');
    default:
      return false;
  }
}

/**
 * Generate a unique slug for a workspace
 * @param name Workspace name
 * @returns string slug
 */
export function generateWorkspaceSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    + '-' + Math.random().toString(36).substring(2, 8);
}
