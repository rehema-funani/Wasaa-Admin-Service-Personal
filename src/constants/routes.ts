import { 
  Globe,
  UserCircle,
  MonitorPlay,
  Video,
  BarChart3,
  Receipt,
  Wallet,
  Gift,
  AlertTriangle,
  ImageIcon,
  Settings,
  Users,
  Languages,
  TicketIcon,
  UsersIcon,
  Film,
  Hash,
  Bell,
  Cog,
  FileText,
  LifeBuoy,
  Building,
  CreditCardIcon,
  FilePieChart,
  FileCheck
} from 'lucide-react';

export type LinkRoute = {
  type: 'link';
  path: string;
  title: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  description?: string;
};

export type DropdownItem = {
  type: 'link';
  path: string;
  title: string;
};

export type DropdownRoute = {
  type: 'dropdown';
  title: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  key: string;
  items: DropdownItem[];
};

export type SectionRoute = {
  type: 'section';
  title: string;
  items: (LinkRoute | DropdownRoute)[];
};

export type Route = LinkRoute | DropdownRoute | SectionRoute;

const routes: Route[] = [
    {
      type: 'section',
      title: 'Finance',
      items: [
        {
          type: 'link',
          path: '/admin/finance/transactions',
          title: 'Transactions',
          icon: Receipt,
          description: 'View all financial transactions'
        },
        {
          type: 'dropdown',
          title: 'Wallets & Accounts',
          icon: Wallet,
          key: 'wallets',
          items: [
            {
              type: 'link',
              path: '/admin/finance/wallets',
              title: 'Corporate Wallets',
            },
            {
              type: 'link',
              path: '/admin/finance/user-wallets',
              title: 'Client Accounts',
            },
            {
              type: 'link',
              path: '/admin/finance/withdrawals',
              title: 'Withdrawal Requests',
            },
            {
              type: 'link',
              path: '/admin/finance/top-ups',
              title: 'Deposits & Top-ups',
            },
            {
              type: 'link',
              path: '/admin/finance/wallets/reversal-requests',
              title: 'Reversal Requests',
            },
          ],
        },
        {
          type: 'dropdown',
          title: 'Payments & Banking',
          icon: CreditCardIcon,
          key: 'payments',
          items: [
            {
              type: 'link',
              path: '/admin/finance/payment-methods',
              title: 'Payment Methods',
            },
            {
              type: 'link',
              path: '/admin/finance/banks',
              title: 'Banking Partners',
            },
            {
              type: 'link',
              path: '/admin/finance/limits',
              title: 'Transaction Limits',
            },
            {
              type: 'link',
              path: '/admin/finance/tariffs',
              title: 'Fee Structures',
            },
          ],
        },
        {
          type: 'dropdown',
          title: 'Reports & Analytics',
          icon: FilePieChart,
          key: 'finance-reports',
          items: [
            {
              type: 'link',
              path: '/admin/finance/reports',
              title: 'Financial Reports',
            },
            {
              type: 'link',
              path: '/admin/finance/analytics/performance',
              title: 'Performance Metrics',
            },
            {
              type: 'link',
              path: '/admin/finance/analytics/revenue',
              title: 'Revenue Analysis',
            },
            {
              type: 'link',
              path: '/admin/finance/analytics/forecasting',
              title: 'Financial Forecasting',
            },
            {
              type: 'link',
              path: '/admin/finance/analytics/audit',
              title: 'Audit Reports',
            },
          ],
        },
        {
          type: 'link',
          path: '/admin/finance/compliance',
          title: 'Compliance',
          icon: FileCheck,
          description: 'Regulatory compliance monitoring'
        },
        {
          type: 'link',
          path: '/admin/finance/gift-history',
          title: 'Rewards',
          icon: Gift,
          description: 'Manage reward distributions'
        },
      ],
    },
    {
      type: 'section',
      title: 'Clients',
      items: [
        {
          type: 'link',
          path: '/admin/users/user-details',
          title: 'Client Accounts',
          icon: UserCircle,
          description: 'Manage individual clients'
        },
        {
          type: 'link',
          path: '/admin/Group/all-group-list',
          title: 'Group Accounts',
          icon: Building,
          description: 'Manage group accounts'
        },
        {
          type: 'link',
          path: '/admin/users/countrywise-Analysis',
          title: 'Geographic Analysis',
          icon: Globe,
          description: 'Client distribution by region'
        },
        {
          type: 'dropdown',
          title: 'Risk Management',
          icon: AlertTriangle,
          key: 'risk-management',
          items: [
            {
              type: 'link',
              path: '/admin/users/reported-user-list',
              title: 'Flagged Individual Accounts',
            },
            {
              type: 'link',
              path: '/admin/Group/all-reported-group-list',
              title: 'Flagged Corporate Accounts',
            },
          ],
        },
        {
          type: 'dropdown',
          title: 'Digital Assets',
          icon: Gift,
          key: 'digital-assets',
          items: [
            {
              type: 'link',
              path: '/admin/gifts/gift-list',
              title: 'Gift Catalog',
            },
            {
              type: 'link',
              path: '/admin/gifts/add-gift',
              title: 'Add New Gift',
            },
            {
              type: 'link',
              path: '/admin/gifts/gift-categories',
              title: 'Gift Categories',
            },
          ],
        },
      ],
    },
    {
      type: 'section',
      title: 'Media',
      items: [
        {
          type: 'dropdown',
          title: 'Short Videos',
          icon: Film,
          key: 'shorts',
          items: [
            {
              type: 'link',
              path: '/admin/media/shorts',
              title: 'Shorts Dashboard',
            },
            {
              type: 'link',
              path: '/admin/media/shorts/moderation',
              title: 'Video Moderation',
            },
            {
              type: 'link',
              path: '/admin/media/shorts/reports',
              title: 'Reported Content',
            },
            {
              type: 'link',
              path: '/admin/media/shorts/comments',
              title: 'Comments Management',
            },
            {
              type: 'link',
              path: '/admin/media/shorts/creators',
              title: 'Content Creators',
            },
          ],
        },
        {
          type: 'dropdown',
          title: 'Livestreams',
          icon: MonitorPlay,
          key: 'livestreams',
          items: [
            {
              type: 'link',
              path: '/admin/livestreams/all-livestreams',
              title: 'All Livestreams',
            },
            {
              type: 'link',
              path: '/admin/livestreams/scheduled',
              title: 'Scheduled Streams',
            },
            {
              type: 'link',
              path: '/admin/livestreams/featured',
              title: 'Featured Streams',
            },
            {
              type: 'link',
              path: '/admin/livestreams/moderation',
              title: 'Stream Moderation',
            },
            {
              type: 'link',
              path: '/admin/livestreams/reported',
              title: 'Reported Streams',
            },
          ],
        },
        {
          type: 'dropdown',
          title: 'Content Management',
          icon: Hash,
          key: 'content-mgmt',
          items: [
            {
              type: 'link',
              path: '/admin/media/shorts/hashtags',
              title: 'Hashtags',
            },
            {
              type: 'link',
              path: '/admin/media/shorts/hashtags/trending',
              title: 'Trending Tags',
            },
            {
              type: 'link',
              path: '/admin/media/shorts/promotion',
              title: 'Promotions',
            },
            {
              type: 'link',
              path: '/admin/livestreams/categories',
              title: 'Stream Categories',
            },
          ],
        },
        {
          type: 'dropdown',
          title: 'Analytics',
          icon: BarChart3,
          key: 'media-analytics',
          items: [
            {
              type: 'link',
              path: '/admin/media/shorts/analytics',
              title: 'Shorts Analytics',
            },
            {
              type: 'link',
              path: '/admin/livestreams/analytics',
              title: 'Stream Analytics',
            },
            {
              type: 'link',
              path: '/admin/media/shorts/analytics/moderation',
              title: 'Moderation Reports',
            },
          ],
        },
      ],
    },
    {
      type: 'section',
      title: 'Customization',
      items: [
        {
          type: 'dropdown',
          title: 'Wallpapers & Avatars',
          icon: ImageIcon,
          key: 'visual-assets',
          items: [
            {
              type: 'link',
              path: '/admin/Wallpaper/list-all-wallpaper',
              title: 'Wallpapers',
            },
            {
              type: 'link',
              path: '/admin/Wallpaper/add-a-new-wallpaper',
              title: 'Add Wallpaper',
            },
            {
              type: 'link',
              path: '/admin/Avatar/list-all-avatar',
              title: 'Avatars',
            },
            {
              type: 'link',
              path: '/admin/Avatar/add-a-new-avatar',
              title: 'Add Avatar',
            },
          ],
        },
        {
          type: 'dropdown',
          title: 'Notifications',
          icon: Bell,
          key: 'notifications',
          items: [
            {
              type: 'link',
              path: '/admin/media/shorts/notifications',
              title: 'All Notifications',
            },
            {
              type: 'link',
              path: '/admin/media/shorts/notifications/templates',
              title: 'Message Templates',
            },
          ],
        },
        {
          type: 'link',
          path: '/admin/languages',
          title: 'Languages',
          icon: Languages,
          description: 'Manage platform languages'
        },
        {
          type: 'link',
          path: '/admin/media/shorts/settings',
          title: 'Media Settings',
          icon: Cog,
          description: 'Configure media preferences'
        },
        {
          type: 'link',
          path: '/admin/livestreams/settings',
          title: 'Stream Settings',
          icon: Video,
          description: 'Configure streaming options'
        },
      ],
    },
    {
      type: 'section',
      title: 'Support',
      items: [
        {
          type: 'link',
          path: '/admin/support',
          title: 'Support Dashboard',
          icon: LifeBuoy,
          description: 'Customer support overview'
        },
        {
          type: 'link',
          path: '/admin/support/tickets',
          title: 'Support Tickets',
          icon: TicketIcon,
          description: 'Manage customer inquiries'
        },
        {
          type: 'dropdown',
          title: 'Team Management',
          icon: UsersIcon,
          key: 'support-teams',
          items: [
            {
              type: 'link',
              path: '/admin/support/teams',
              title: 'Support Teams',
            },
            {
              type: 'link',
              path: '/admin/support/assignments',
              title: 'Ticket Assignments',
            },
          ],
        },
      ],
    },
    {
      type: 'section',
      title: 'Administration',
      items: [
        {
          type: 'dropdown',
          title: 'User Management',
          icon: Users,
          key: 'user-mgmt',
          items: [
            {
              type: 'link',
              path: '/admin/system/users',
              title: 'Staff Accounts',
            },
            {
              type: 'link',
              path: '/admin/system/roles',
              title: 'Access Control',
            },
          ],
        },
        {
          type: 'link',
          path: '/admin/settings',
          title: 'System Settings',
          icon: Settings,
          description: 'Configure platform settings'
        },
        {
          type: 'link',
          path: '/admin/logs',
          title: 'Audit Logs',
          icon: FileText,
          description: 'System activity monitoring'
        },
      ],
    },
];

export default routes;