import { 
  Home, 
  Globe,
  UserCircle,
  Group,
  MonitorPlay,
  Clock,
  Video,
  BarChart3,
  ShieldCheck,
  Receipt,
  Wallet,
  CreditCard,
  PieChart,
  Gift,
  AlertTriangle,
  ImageIcon,
  Palette,
  Settings,
  Users,
  Key,
  Shield,
  Languages,
  DollarSign,
  Monitor,
  TicketIcon,
  UsersIcon,
  Film,
  Hash,
  MessageSquare,
  TrendingUp,
  Award,
  Bell,
  Cog,
  User,
  Scale,
  RefreshCw,
  FileText,
  HelpCircle,
  LifeBuoy,
  Banknote,
  LineChart,
  BarChart,
  AreaChart,
  CircleDollarSign,
  Building,
  BadgeDollarSign,
  FileSpreadsheet,
  Landmark,
  CreditCardIcon,
  BanknoteIcon,
  FilePieChart,
  FolderArchive,
  FileCheck,
  FolderClosed,
  Calculator
} from 'lucide-react';

export type LinkRoute = {
  type: 'link';
  path: string;
  title: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
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
      type: 'link',
      path: '/',
      title: 'Financial Dashboard',
      icon: BarChart3,
    },
    {
      type: 'section',
      title: 'Finance Management',
      items: [
        {
          type: 'link',
          path: '/admin/finance/transactions',
          title: 'Transactions',
          icon: Receipt,
        },
        {
          type: 'dropdown',
          title: 'System Wallets',
          icon: Banknote,
          key: 'system-wallets',
          items: [
            {
              type: 'link',
              path: '/admin/finance/wallets',
              title: 'Corporate Wallets',
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
          title: 'Client Accounts',
          icon: Wallet,
          key: 'user-wallets',
          items: [
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
          ],
        },
        {
          type: 'link',
          path: '/admin/finance/tariffs',
          title: 'Fee Structures',
          icon: BadgeDollarSign,
        },
        {
          type: 'link',
          path: '/admin/finance/payment-methods',
          title: 'Payment Methods',
          icon: CreditCardIcon,
        },
        {
          type: 'link',
          path: '/admin/finance/limits',
          title: 'Transaction Limits',
          icon: Calculator,
        },
        {
          type: 'link',
          path: '/admin/finance/banks',
          title: 'Banking Partners',
          icon: Landmark,
        },
        {
          type: 'link',
          path: '/admin/finance/gift-history',
          title: 'Reward History',
          icon: Gift,
        },
        {
          type: 'link',
          path: '/admin/finance/compliance',
          title: 'Compliance',
          icon: FileCheck,
        },
      ],
    },
    {
      type: 'section',
      title: 'Reports & Analytics',
      items: [
        {
          type: 'link',
          path: '/admin/finance/reports',
          title: 'Financial Reports',
          icon: FilePieChart,
        },
        {
          type: 'link',
          path: '/admin/finance/analytics/performance',
          title: 'Performance Metrics',
          icon: LineChart,
        },
        {
          type: 'link',
          path: '/admin/finance/analytics/revenue',
          title: 'Revenue Analysis',
          icon: TrendingUp,
        },
        {
          type: 'link',
          path: '/admin/finance/analytics/forecasting',
          title: 'Financial Forecasting',
          icon: AreaChart,
        },
        {
          type: 'link',
          path: '/admin/finance/analytics/audit',
          title: 'Audit Reports',
          icon: FileSpreadsheet,
        },
      ],
    },
    {
      type: 'section',
      title: 'Client Management',
      items: [
        {
          type: 'link',
          path: '/admin/users/user-details',
          title: 'Client Accounts',
          icon: UserCircle,
        },
        {
          type: 'link',
          path: '/admin/users/countrywise-Analysis',
          title: 'Geographic Analysis',
          icon: Globe,
        },
        {
          type: 'link',
          path: '/admin/users/reported-user-list',
          title: 'Flagged Accounts',
          icon: AlertTriangle,
        },
        {
          type: 'link',
          path: '/admin/Group/all-group-list',
          title: 'Corporate Accounts',
          icon: Building,
        },
        {
          type: 'link',
          path: '/admin/Group/all-reported-group-list',
          title: 'Flagged Corporate',
          icon: AlertTriangle,
        },
      ],
    },
    {
      type: 'section',
      title: 'Digital Assets',
      items: [
        {
          type: 'link',
          path: '/admin/gifts/gift-list',
          title: 'Gift List',
          icon: Gift,
        },
        {
          type: 'link',
          path: '/admin/gifts/add-gift',
          title: 'Add Gift',
          icon: CircleDollarSign,
        },
        {
          type: 'link',
          path: '/admin/gifts/gift-categories',
          title: 'Gift Categories',
          icon: FolderClosed,
        },
      ]
    },
    {
      type: 'section',
      title: 'System Administration',
      items: [
        {
          type: 'link',
          path: '/admin/system/users',
          title: 'Staff Accounts',
          icon: Users,
        },
        {
          type: 'link',
          path: '/admin/system/roles',
          title: 'Access Control',
          icon: Key,
        },
        {
          type: 'link',
          path: '/admin/settings',
          title: 'System Settings',
          icon: Settings,
        },
        {
          type: 'link',
          path: '/admin/logs',
          title: 'Audit Logs',
          icon: FileText,
        },
        {
          type: 'link',
          path: '/admin/support',
          title: 'Support Center',
          icon: LifeBuoy,
        },
        {
          type: 'link',
          path: '/admin/languages',
          title: 'Languages',
          icon: Languages,
        },
      ],
    },
    {
      type: 'section',
      title: 'Media Management',
      items: [
        {
          type: 'link',
          path: '/admin/media/shorts',
          title: 'Shorts Dashboard',
          icon: Film,
        },
        {
          type: 'link',
          path: '/admin/media/shorts/moderation',
          title: 'Video Moderation',
          icon: ShieldCheck,
        },
        {
          type: 'link',
          path: '/admin/media/shorts/reports',
          title: 'Reports',
          icon: AlertTriangle,
        },
        {
          type: 'link',
          path: '/admin/media/shorts/comments',
          title: 'Comments',
          icon: MessageSquare,
        },
        {
          type: 'dropdown',
          title: 'Hashtags',
          icon: Hash,
          key: 'hashtags',
          items: [
            {
              type: 'link',
              path: '/admin/media/shorts/hashtags',
              title: 'All Hashtags',
            },
            {
              type: 'link',
              path: '/admin/media/shorts/hashtags/blocked',
              title: 'Blocked Hashtags',
            },
            {
              type: 'link',
              path: '/admin/media/shorts/hashtags/trending',
              title: 'Trending Hashtags',
            },
          ],
        },
        {
          type: 'link',
          path: '/admin/media/shorts/creators',
          title: 'Creators',
          icon: User,
        },
        {
          type: 'dropdown',
          title: 'Promotion',
          icon: Award,
          key: 'promotion',
          items: [
            {
              type: 'link',
              path: '/admin/media/shorts/promotion',
              title: 'All Promotions',
            },
            {
              type: 'link',
              path: '/admin/media/shorts/promotion/trending',
              title: 'Trending',
            },
            {
              type: 'link',
              path: '/admin/media/shorts/promotion/featured',
              title: 'Featured',
            },
          ],
        },
        {
          type: 'dropdown',
          title: 'Analytics',
          icon: BarChart3,
          key: 'shorts-analytics',
          items: [
            {
              type: 'link',
              path: '/admin/media/shorts/analytics',
              title: 'Overview',
            },
            {
              type: 'link',
              path: '/admin/media/shorts/analytics/videos',
              title: 'Videos',
            },
            {
              type: 'link',
              path: '/admin/media/shorts/analytics/moderation',
              title: 'Moderation',
            },
          ],
        },
        {
          type: 'dropdown',
          title: 'Notifications',
          icon: Bell,
          key: 'shorts-notifications',
          items: [
            {
              type: 'link',
              path: '/admin/media/shorts/notifications',
              title: 'All Notifications',
            },
            {
              type: 'link',
              path: '/admin/media/shorts/notifications/templates',
              title: 'Templates',
            },
          ],
        },
        {
          type: 'link',
          path: '/admin/media/shorts/settings',
          title: 'Shorts Settings',
          icon: Cog,
        },
      ],
    },
    {
      type: 'section',
      title: 'Livestream Services',
      items: [
        {
          type: 'link',
          path: '/admin/livestreams/all-livestreams',
          title: 'All Livestreams',
          icon: MonitorPlay,
        },
        {
          type: 'link',
          path: '/admin/livestreams/scheduled',
          title: 'Scheduled',
          icon: Clock,
        },
        {
          type: 'dropdown',
          title: 'Management',
          icon: Video,
          key: 'livestream-management',
          items: [
            {
              type: 'link',
              path: '/admin/livestreams/settings',
              title: 'Settings',
            },
            {
              type: 'link',
              path: '/admin/livestreams/categories',
              title: 'Categories',
            },
            {
              type: 'link',
              path: '/admin/livestreams/featured',
              title: 'Featured Streams',
            },
          ],
        },
        {
          type: 'link',
          path: '/admin/livestreams/analytics',
          title: 'Analytics',
          icon: BarChart,
        },
        {
          type: 'link',
          path: '/admin/livestreams/moderation',
          title: 'Moderation',
          icon: ShieldCheck,
        },
        {
          type: 'link',
          path: '/admin/livestreams/reported',
          title: 'Reported Streams',
          icon: AlertTriangle,
        },
      ],
    },
    {
      type: 'section',
      title: 'Customization',
      items: [
        {
          type: 'link',
          path: '/admin/Wallpaper/list-all-wallpaper',
          title: 'Wallpapers',
          icon: ImageIcon,
        },
        {
          type: 'link',
          path: '/admin/Wallpaper/add-a-new-wallpaper',
          title: 'Add Wallpaper',
          icon: ImageIcon,
        },
        {
          type: 'link',
          path: '/admin/Avatar/list-all-avatar',
          title: 'Avatars',
          icon: UserCircle,
        },
        {
          type: 'link',
          path: '/admin/Avatar/add-a-new-avatar',
          title: 'Add Avatar',
          icon: UserCircle,
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
        },
        {
          type: 'link',
          path: '/admin/support/teams',
          title: 'Support Teams',
          icon: UsersIcon,
        },
        {
          type: 'link',
          path: '/admin/support/tickets',
          title: 'Tickets',
          icon: TicketIcon,
        },
        {
          type: 'link',
          path: '/admin/support/assignments',
          title: 'Ticket Assignments',
          icon: RefreshCw,
        },
      ],
    },
  ];

export default routes;