/**
 * Authorization Middleware
 * Implements Role-Based Access Control (RBAC) for workspace operations
 * 
 * This addresses Issue #5 from the problem statement:
 * - Distinguishes between authentication (who you are) and authorization (what you can do)
 * - Enforces role-based permissions (admin, editor, viewer)
 * - Protects sensitive operations like delete and billing
 */

import { NextRequest, NextResponse } from 'next/server';
import { WorkspaceMember } from '@/types';
import { hasWorkspacePermission } from '../workspace';

export interface AuthorizationContext {
  userId: string;
  workspaceId: string;
  userRole: WorkspaceMember['role'];
}

/**
 * Check if user is authorized to perform an action
 * @param ctx Authorization context
 * @param requiredRole Minimum role required
 * @returns boolean
 */
export function isAuthorized(
  ctx: AuthorizationContext,
  requiredRole: WorkspaceMember['role']
): boolean {
  return hasWorkspacePermission(ctx.userRole, requiredRole);
}

/**
 * Middleware to enforce authorization
 * Returns 403 Forbidden if user doesn't have required role
 */
export function requireRole(requiredRole: WorkspaceMember['role']) {
  return async (
    request: NextRequest,
    ctx: AuthorizationContext
  ): Promise<NextResponse | null> => {
    if (!isAuthorized(ctx, requiredRole)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden: Insufficient permissions. Required role: ' + requiredRole
        },
        { status: 403 }
      );
    }

    return null; // Allow request to proceed
  };
}

/**
 * Get authorization context from request
 * This should be called after authentication
 */
export async function getAuthorizationContext(
  request: NextRequest,
  userId: string,
  workspaceId: string
): Promise<AuthorizationContext | null> {
  // TODO: Query database to get user's role in workspace
  // For now, return null - implement when Supabase is connected
  return null;
}

/**
 * Action permissions map
 * Defines which roles can perform which actions
 */
export const ACTION_PERMISSIONS = {
  // Questionnaire actions
  'questionnaires:create': 'editor' as const,
  'questionnaires:read': 'viewer' as const,
  'questionnaires:update': 'editor' as const,
  'questionnaires:delete': 'admin' as const,

  // Template actions
  'templates:create': 'editor' as const,
  'templates:read': 'viewer' as const,
  'templates:update': 'editor' as const,
  'templates:delete': 'admin' as const,

  // Workspace management
  'workspace:update': 'admin' as const,
  'workspace:billing': 'admin' as const,
  'workspace:members:invite': 'admin' as const,
  'workspace:members:remove': 'admin' as const,
  'workspace:members:update-role': 'admin' as const,
};

/**
 * Check if user can perform a specific action
 */
export function canPerformAction(
  ctx: AuthorizationContext,
  action: keyof typeof ACTION_PERMISSIONS
): boolean {
  const requiredRole = ACTION_PERMISSIONS[action];
  return isAuthorized(ctx, requiredRole);
}
