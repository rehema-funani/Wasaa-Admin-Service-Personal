// src/utils/permissions.ts

/**
 * Utility functions for handling permissions throughout the application
 */

import Cookies from 'js-cookie';

/**
 * Get the current user's permissions array
 */
export const getUserPermissions = (): string[] => {
  try {
    const userData = Cookies.get('userData');
    if (!userData) return [];
    
    const user = JSON.parse(userData);
    return user.permissions || [];
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    return [];
  }
};

/**
 * Check if the current user has a specific permission
 */
export const hasPermission = (permission: string): boolean => {
  const permissions = getUserPermissions();
  return permissions.includes(permission);
};

/**
 * Check if the current user has any of the given permissions
 */
export const hasAnyPermission = (requiredPermissions: string[]): boolean => {
  if (requiredPermissions.length === 0) return true;
  
  const permissions = getUserPermissions();
  return requiredPermissions.some(permission => permissions.includes(permission));
};

/**
 * Check if the current user has all of the given permissions
 */
export const hasAllPermissions = (requiredPermissions: string[]): boolean => {
  if (requiredPermissions.length === 0) return true;
  
  const permissions = getUserPermissions();
  return requiredPermissions.every(permission => permissions.includes(permission));
};

/**
 * Permission-based wrapper component to conditionally render content
 */
import React, { ReactNode } from 'react';

interface PermissionGuardProps {
  permissions: string[];
  requireAll?: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permissions,
  requireAll = false,
  fallback = null,
  children
}) => {
  const hasAccess = requireAll
    ? hasAllPermissions(permissions)
    : hasAnyPermission(permissions);

  return hasAccess ? (children as ReactNode) : (fallback as ReactNode);
};

/**
 * Permission mapping object with common operation patterns
 */
export const PermissionMap = {
  Users: {
    view: ['can_view_users', 'can_list_users'],
    create: ['can_create_users'],
    update: ['can_update_users'],
    delete: ['can_delete_users'],
  },
  Roles: {
    view: ['can_view_roles', 'can_list_roles'],
    create: ['can_create_roles'],
    update: ['can_update_roles'],
    delete: ['can_delete_roles'],
  },
  Languages: {
    view: ['can_view_languages', 'can_list_languages'],
    create: ['can_create_languages'],
    update: ['can_update_languages'],
    delete: ['can_delete_languages'],
  },
  Media: {
    view: ['can_view_media', 'can_list_media'],
    create: ['can_create_media'],
    update: ['can_update_media'],
    delete: ['can_delete_media'],
  },
  Settings: {
    view: ['can_view_settings'],
    update: ['can_update_settings'],
  },
  ApiKeys: {
    view: ['can_view_apiKeys', 'can_list_apiKeys'],
    create: ['can_create_apiKeys'],
    update: ['can_update_apiKeys'],
    delete: ['can_delete_apiKeys'],
  }
};