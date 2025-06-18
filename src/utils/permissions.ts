export const getUserPermissions = (): string[] => {
  try {
    const userData = localStorage.getItem('userData');
    if (!userData) return [];

    const user = JSON.parse(userData);

    if (user?.role?.role_permissions?.length > 0) {
      return user.role.role_permissions.map(
        (item: { permissions: { title: string } }) => item.permissions.title
      );
    }

    return [];
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
    block: ['can_block_users'],
    unblock: ['can_unblock_users'],
    report: ['can_report_users']
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

  Settings: {
    view: ['can_view_settings'],
    update: ['can_update_settings']
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

  Devices: {
    view: ['can_view_devices', 'can_list_devices'],
    update: ['can_update_devices'],
    delete: ['can_delete_devices']
  },

  Wallets: {
    view: ['can_view_wallets', 'can_list_wallets'],
    update: ['can_update_wallets'],
    delete: ['can_delete_wallets']
  },

  Transactions: {
    view: ['can_view_transactions', 'can_list_transactions'],
    update: ['can_update_transactions'],
    delete: ['can_delete_transactions']
  },

  Groups: {
    create: ['can_create_groups'],
    view: ['can_view_groups', 'can_list_groups'],
    update: ['can_update_groups'],
    delete: ['can_delete_groups'],
    addMembers: ['can_add_group_members'],
    listMembers: ['can_list_group_members'],
    removeMembers: ['can_remove_members'],
    report: ['can_report_groups'],
    viewReported: ['can_view_reported_groups']
  },

  Profile: {
    view: ['can_view_profile'],
    update: ['can_update_profile'],
    verify: ['can_verify_account'],
    completeSignup: ['can_complete_signup'],
    delete: ['can_delete_account']
  },

  Preferences: {
    view: ['can_fetch_preferences'],
    update: ['can_update_preferences']
  },

  Contacts: {
    sync: ['can_sync_contacts'],
    add: ['can_add_contacts'],
    delete: ['can_delete_contacts']
  },

  Security: {
    checkNumber: ['can_check_number'],
    verifyPin: ['can_verify_pin'],
    updatePin: ['can_update_pin'],
    setPassword: ['can_set_password'],
    sendResetPassword: ['can_send_reset_password']
  },

  Sessions: {
    view: ['can_view_sessions', 'can_list_sessions'],
    revoke: ['can_revoke_sessions'],
    update: ['can_update_sessions']
  },

  Reports: {
    view: ['can_list_reports', 'can_view_reports']
  },

  Team: {
    create: ['can_create_team'],
    view: ['can_view_team', 'can_list_team'],
    update: ['can_update_team'],
    delete: ['can_delete_team']
  },

  TeamMember: {
    create: ['can_create_team_member'],
    view: ['can_view_team_member', 'can_list_team_member'],
    update: ['can_update_team_member'],
    delete: ['can_delete_team_member']
  },

  Ticket: {
    create: ['can_create_ticket'],
    view: ['can_view_ticket', 'can_list_ticket'],
    update: ['can_update_ticket'],
    delete: ['can_delete_ticket']
  },

  TicketComment: {
    create: ['can_create_ticket_comment'],
    view: ['can_view_ticket_comment', 'can_list_ticket_comment'],
    update: ['can_update_ticket_comment'],
    delete: ['can_delete_ticket_comment']
  },

  TicketAssignment: {
    create: ['can_create_ticket_assignment'],
    view: ['can_view_ticket_assignment', 'can_list_ticket_assignment'],
    update: ['can_update_ticket_assignment'],
    delete: ['can_delete_ticket_assignment']
  },

  TicketEscalation: {
    create: ['can_create_ticket_escalation'],
    view: ['can_view_ticket_escalation', 'can_list_ticket_escalation'],
    update: ['can_update_ticket_escalation'],
    delete: ['can_delete_ticket_escalation']
  },

  Dashboard: {
    view: ['can_view_dashboard', 'can_view_dashboard_stats']
  },

  ViewReported: [
    'can_view_reported_users',
    'can_view_reported_groups',
    'can_list_reports',
    'can_view_reports'
  ],

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
  ],

  Finance: [
    'can_list_transactions',
    'can_view_transactions',
    'can_update_transactions',
    'can_delete_transactions',
    'can_list_wallets',
    'can_view_wallets',
    'can_update_wallets',
    'can_delete_wallets'
  ],

  Support: [
    'can_create_team',
    'can_list_team',
    'can_view_team',
    'can_update_team',
    'can_delete_team',
    'can_create_team_member',
    'can_list_team_member',
    'can_view_team_member',
    'can_update_team_member',
    'can_delete_team_member',
    'can_create_ticket',
    'can_list_ticket',
    'can_view_ticket',
    'can_update_ticket',
    'can_delete_ticket',
    'can_create_ticket_comment',
    'can_list_ticket_comment',
    'can_view_ticket_comment',
    'can_update_ticket_comment',
    'can_delete_ticket_comment',
    'can_create_ticket_assignment',
    'can_list_ticket_assignment',
    'can_view_ticket_assignment',
    'can_update_ticket_assignment',
    'can_delete_ticket_assignment',
    'can_create_ticket_escalation',
    'can_list_ticket_escalation',
    'can_view_ticket_escalation',
    'can_update_ticket_escalation',
    'can_delete_ticket_escalation'
  ]
};

/**
 * Updated route permissions map with all routes and their required permissions
 */
export const routePermissionsMap = {
  // Dashboard and main routes
  '/': [],
  '/admin/dashboard': PermissionMap.Dashboard.view,

  // User management routes
  '/admin/users/user-details': PermissionMap.Users.view,
  '/admin/users/countrywise-Analysis': PermissionMap.Users.view,
  '/admin/users/reported-user-list': [...PermissionMap.Users.view, ...PermissionMap.ViewReported],

  // Group management routes
  '/admin/Group/all-group-list': PermissionMap.Groups.view,
  '/admin/Group/all-reported-group-list': [...PermissionMap.Groups.viewReported, ...PermissionMap.Reports.view],

  // System management routes
  '/admin/system/users': [...PermissionMap.Users.viewStaff, ...PermissionMap.Users.view],
  '/admin/system/roles': PermissionMap.Roles.view,
  '/admin/system/roles/create': PermissionMap.Roles.create,
  '/admin/system/roles/edit/:id': PermissionMap.Roles.update,

  // Livestream management routes
  '/admin/livestreams/all-livestreams': [],
  '/admin/livestreams/scheduled': [],
  '/admin/livestreams/settings': PermissionMap.Settings.view,
  '/admin/livestreams/categories': [],
  '/admin/livestreams/featured': [],
  '/admin/livestreams/analytics': [],
  '/admin/livestreams/moderation': [],
  '/admin/livestreams/reported': PermissionMap.Reports.view,

  // Finance management routes
  '/admin/finance/transactions': PermissionMap.Transactions.view,
  '/admin/finance/user-wallets': PermissionMap.Wallets.view,
  '/admin/finance/withdrawals': PermissionMap.Transactions.view,
  '/admin/finance/top-ups': PermissionMap.Transactions.view,
  '/admin/finance/payment-methods': PermissionMap.Settings.view,
  '/admin/finance/reports': [...PermissionMap.Reports.view, ...PermissionMap.Finance],
  '/admin/finance/gift-history': PermissionMap.Transactions.view,
  '/admin/finance/wallets': PermissionMap.Wallets.view,
  '/admin/finance/banks': PermissionMap.Settings.view,
  '/admin/finance/tariffs': PermissionMap.Settings.view,
  '/admin/finance/limits': PermissionMap.Settings.view,
  '/admin/finance/compliance': PermissionMap.Settings.view,

  // Gift management routes
  '/admin/gifts/add-gift': PermissionMap.Media.create,
  '/admin/gifts/gift-list': PermissionMap.Media.view,
  '/admin/gifts/gift-categories': PermissionMap.Media.view,

  // System settings routes
  '/admin/settings': PermissionMap.Settings.view,
  '/admin/languages': PermissionMap.Languages.view,
  '/admin/logs': PermissionMap.Admin,

  // Support routes
  '/admin/support': PermissionMap.Support,
  '/admin/support/teams': PermissionMap.Team.view,
  '/admin/support/teams/create': PermissionMap.Team.create,
  '/admin/support/teams/:id': PermissionMap.Team.view,
  '/admin/support/tickets': PermissionMap.Ticket.view,
  '/admin/support/tickets/create': PermissionMap.Ticket.create,
  '/admin/support/tickets/:id': PermissionMap.Ticket.view,
  '/admin/support/assignments': PermissionMap.TicketAssignment.view,

  // Media management routes
  '/admin/Wallpaper/list-all-wallpaper': PermissionMap.Media.view,
  '/admin/Wallpaper/add-a-new-wallpaper': PermissionMap.Media.create,
  '/admin/Avatar/list-all-avatar': PermissionMap.Media.view,
  '/admin/Avatar/add-a-new-avatar': PermissionMap.Media.create,

  // Details routes
  '/admin/users/user-details/:id': PermissionMap.Users.view,
  '/admin/users/countrywise-Analysis/:id': PermissionMap.Users.view,
  '/admin/Group/all-group-list/:id': PermissionMap.Groups.view,
  '/admin/system/roles/:id': PermissionMap.Roles.view,
  '/admin/finance/user-wallets/:id': PermissionMap.Wallets.view,
  '/admin/languages/:id/translations': PermissionMap.Languages.view,

  // Device management routes
  '/admin/devices': PermissionMap.Devices.view,
  '/admin/devices/:id': PermissionMap.Devices.view,

  // Session management routes
  '/admin/sessions': PermissionMap.Sessions.view,
  '/admin/sessions/:id': PermissionMap.Sessions.view,

  // API key management routes
  '/admin/api-keys': PermissionMap.ApiKeys.view,
  '/admin/api-keys/create': PermissionMap.ApiKeys.create,
  '/admin/api-keys/:id': PermissionMap.ApiKeys.view,

  // Security management routes
  '/admin/security/passwords': PermissionMap.Security.setPassword,
  '/admin/security/pins': PermissionMap.Security.updatePin,
};

/**
 * Get permissions required for a specific route
 */
export const getRequiredPermissionsForRoute = (path: string): string[] => {
  if (routePermissionsMap[path]) {
    return routePermissionsMap[path];
  }

  // Try to match dynamic routes
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

  return [];
};

/**
 * Check if user has permission to access a specific route
 */
export const hasPermissionForRoute = (path: string): boolean => {
  const requiredPermissions = getRequiredPermissionsForRoute(path);
  return hasAnyPermission(requiredPermissions);
};

/**
 * Helper functions for common permission checks
 */
export const canManageUsers = (): boolean => {
  return hasAnyPermission([
    ...PermissionMap.Users.create,
    ...PermissionMap.Users.update,
    ...PermissionMap.Users.delete
  ]);
};

export const canManageRoles = (): boolean => {
  return hasAnyPermission([
    ...PermissionMap.Roles.create,
    ...PermissionMap.Roles.update,
    ...PermissionMap.Roles.delete
  ]);
};

export const canManageFinance = (): boolean => {
  return hasAnyPermission(PermissionMap.Finance);
};

export const canManageMedia = (): boolean => {
  return hasAnyPermission([
    ...PermissionMap.Media.create,
    ...PermissionMap.Media.update,
    ...PermissionMap.Media.delete
  ]);
};

export const canViewReports = (): boolean => {
  return hasAnyPermission(PermissionMap.ViewReported);
};

export const canManageTickets = (): boolean => {
  return hasAnyPermission([
    ...PermissionMap.Ticket.create,
    ...PermissionMap.Ticket.update,
    ...PermissionMap.Ticket.delete
  ]);
};

export const canManageTeams = (): boolean => {
  return hasAnyPermission([
    ...PermissionMap.Team.create,
    ...PermissionMap.Team.update,
    ...PermissionMap.Team.delete
  ]);
};

export const isAdmin = (): boolean => {
  return hasAnyPermission(PermissionMap.Admin);
};

export const canManageGroups = (): boolean => {
  return hasAnyPermission([
    ...PermissionMap.Groups.create,
    ...PermissionMap.Groups.update,
    ...PermissionMap.Groups.delete,
    ...PermissionMap.Groups.addMembers,
    ...PermissionMap.Groups.removeMembers
  ]);
};

export const canManageSessions = (): boolean => {
  return hasAnyPermission([
    ...PermissionMap.Sessions.revoke,
    ...PermissionMap.Sessions.update
  ]);
};

export const canManageDevices = (): boolean => {
  return hasAnyPermission([
    ...PermissionMap.Devices.update,
    ...PermissionMap.Devices.delete
  ]);
};

export const canViewDashboard = (): boolean => {
  return hasAnyPermission(PermissionMap.Dashboard.view);
};
