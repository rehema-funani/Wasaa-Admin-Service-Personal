import Cookies from 'js-cookie';

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

export const hasPermission = (permission: string): boolean => {
  const permissions = getUserPermissions();
  return permissions.includes(permission);
};

export const hasAnyPermission = (requiredPermissions: string[]): boolean => {
  if (requiredPermissions.length === 0) return true;
  
  const permissions = getUserPermissions();
  return requiredPermissions.some(permission => permissions.includes(permission));
};

export const hasAllPermissions = (requiredPermissions: string[]): boolean => {
  if (requiredPermissions.length === 0) return true;
  
  const permissions = getUserPermissions();
  return requiredPermissions.every(permission => permissions.includes(permission));
};

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

export const PermissionMap = {
  AccountTypes: {
    create: ['can_create_account_types'],
    view: [],
    update: ['can_update_account_types'],
    delete: ['can_delete_account_types']
  },
  ApiKeys: {
    create: ['can_create_apiKeys'],
    view: ['can_view_apiKeys', 'can_list_apiKeys'],
    update: ['can_update_apiKeys'],
    delete: ['can_delete_apiKeys']
  },
  Users: {
    create: ['can_create_users'],
    view: ['can_view_users', 'can_list_users'],
    viewStaff: ['can_list_staff'],
    update: ['can_update_users'],
    delete: ['can_delete_users'],
    viewReported: ['can_view_reported_users']
  },
  Roles: {
    create: ['can_create_roles'],
    view: ['can_view_roles', 'can_list_roles'],
    update: ['can_update_roles'],
    delete: ['can_delete_roles']
  },
  Permissions: {
    create: ['can_create_permissions'],
    view: ['can_list_permissions'],
    update: ['can_update_permissions'],
    delete: ['can_delete_permissions']
  },
  Languages: {
    create: ['can_create_languages'],
    view: ['can_view_languages', 'can_list_languages'],
    update: ['can_update_languages'],
    delete: ['can_delete_languages']
  },
  Media: {
    create: ['can_create_media'],
    view: ['can_view_media', 'can_list_media'],
    update: ['can_update_media'],
    delete: ['can_delete_media']
  },
  Settings: {
    view: ['can_view_settings'],
    update: ['can_update_settings']
  },
  Groups: {
    create: ['can_create_groups'],
    view: ['can_view_groups', 'can_list_groups'],
    update: ['can_update_groups'],
    delete: ['can_delete_groups'],
    viewReported: ['can_view_reported_groups']
  },
  Reports: {
    view: ['can_list_reports', 'can_view_reports']
  },
  Notifications: {
    create: ['can_create_notifications'],
    view: ['can_view_notifications', 'can_list_notifications'],
    update: ['can_update_notifications'],
    delete: ['can_delete_notifications']
  },
  
  ViewReported: ['can_view_reported_users', 'can_view_reported_groups', 'can_list_reports', 'can_view_reports'],
  
  Admin: [
    'can_view_settings',
    'can_update_settings',
    'can_list_roles',
    'can_view_roles',
    'can_create_roles',
    'can_update_roles',
    'can_delete_roles',
    'can_list_permissions',
    'can_create_permissions',
    'can_update_permissions',
    'can_delete_permissions'
  ]
};

export const getRequiredPermissionsForRoute = (path: string): string[] => {
  const routePermissionsMap: Record<string, string[]> = {
    '/': [],
    
    '/admin/users/user-details': PermissionMap.Users.view,
    '/admin/users/countrywise-Analysis': PermissionMap.Users.view,
    '/admin/users/reported-user-list': [...PermissionMap.Users.viewReported, ...PermissionMap.Reports.view],
    
    '/admin/Group/all-group-list': PermissionMap.Groups.view,
    '/admin/Group/all-reported-group-list': [...PermissionMap.Groups.viewReported, ...PermissionMap.Reports.view],
    
    '/admin/system/users': [...PermissionMap.Users.viewStaff, ...PermissionMap.Users.view],
    '/admin/system/roles': PermissionMap.Roles.view,
    
    '/admin/livestreams/all-livestreams': [],
    '/admin/livestreams/scheduled': [],
    '/admin/livestreams/settings': [],
    '/admin/livestreams/categories': [],
    '/admin/livestreams/featured': [],
    '/admin/livestreams/analytics': [],
    '/admin/livestreams/moderation': [],
    '/admin/livestreams/reported': PermissionMap.Reports.view,
    
    '/admin/finance/transactions': [],
    '/admin/finance/user-wallets': [],
    '/admin/finance/withdrawals': [],
    '/admin/finance/top-ups': [],
    '/admin/finance/payment-methods': [],
    '/admin/finance/reports': [],
    '/admin/finance/gift-history': [],
    
    '/admin/gifts/add-gift': PermissionMap.Media.create,
    '/admin/gifts/gift-list': PermissionMap.Media.view,
    '/admin/gifts/gift-categories': PermissionMap.Media.view,
    
    '/admin/settings': PermissionMap.Settings.view,
    '/admin/languages': PermissionMap.Languages.view,
    '/admin/logs': [], 
    '/admin/support': [],
    
    '/admin/Wallpaper/list-all-wallpaper': PermissionMap.Media.view,
    '/admin/Wallpaper/add-a-new-wallpaper': PermissionMap.Media.create,
    '/admin/Avatar/list-all-avatar': PermissionMap.Media.view,
    '/admin/Avatar/add-a-new-avatar': PermissionMap.Media.create,
    
    '/admin/users/user-details/:id': PermissionMap.Users.view,
    '/admin/users/countrywise-Analysis/:id': PermissionMap.Users.view,
    '/admin/Group/all-group-list/:id': PermissionMap.Groups.view,
    '/admin/system/roles/:id': PermissionMap.Roles.view,
    '/admin/system/roles/create': PermissionMap.Roles.create,
    '/admin/finance/user-wallets/:id': [],
    '/admin/languages/:id/translations': PermissionMap.Languages.view,
    
    '/admin/support/teams': [],
    '/admin/support/teams/:id': [],
    '/admin/support/tickets': [],
    '/admin/support/tickets/:id': [],
    '/admin/support/assignments': [],
  };

  if (!routePermissionsMap[path]) {
    const pathParts = path.split('/');
    const possibleRoutes = Object.keys(routePermissionsMap);
    
    for (const route of possibleRoutes) {
      const routeParts = route.split('/');
      
      if (routeParts.length === pathParts.length) {
        let isMatch = true;
        
        for (let i = 0; i < routeParts.length; i++) {
          if (routeParts[i].startsWith(':') || routeParts[i] === pathParts[i]) {
            continue;
          } else {
            isMatch = false;
            break;
          }
        }
        
        if (isMatch) {
          return routePermissionsMap[route];
        }
      }
    }
  }
  
  return routePermissionsMap[path] || [];
};

export const hasPermissionForRoute = (path: string): boolean => {
  const requiredPermissions = getRequiredPermissionsForRoute(path);
  return hasAnyPermission(requiredPermissions);
};