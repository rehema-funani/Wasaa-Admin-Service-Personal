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
  Banknote
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
      title: 'Dashboard',
      icon: Home,
    },
    {
      type: 'section',
      title: 'User Management',
      items: [
        {
          type: 'link',
          path: '/admin/users/user-details',
          title: 'Users',
          icon: UserCircle,
        },
        {
          type: 'link',
          path: '/admin/users/countrywise-Analysis',
          title: 'Countrywise',
          icon: Globe,
        },
        {
          type: 'link',
          path: '/admin/users/reported-user-list',
          title: 'Reported Users',
          icon: AlertTriangle,
        },
        {
          type: 'link',
          path: '/admin/system/users',
          title: 'System Users',
          icon: Users,
        },
        {
          type: 'link',
          path: '/admin/system/roles',
          title: 'Roles',
          icon: Shield,
        }
      ],
    },
    {
      type: 'section',
      title: 'Groups',
      items: [
        {
          type: 'link',
          path: '/admin/Group/all-group-list',
          title: 'Group List',
          icon: Group,
        },
        {
          type: 'link',
          path: '/admin/Group/all-reported-group-list',
          title: 'Reported Groups',
          icon: AlertTriangle,
        },
      ],
    },
    {
      type: 'section',
      title: 'Media',
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
      title: 'Livestreams',
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
          icon: BarChart3,
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
      title: 'Finance',
      items: [
        {
          type: 'link',
          path: '/admin/finance/transactions',
          title: 'Transactions',
          icon: Receipt,
        },
        {
          type: 'link',
          path: '/admin/finance/tariffs',
          title: 'Tariffs',
          icon: DollarSign,
        },
        {
          type: 'link',
          path: '/admin/finance/limits',
          title: 'Limits',
          icon: Monitor,
        },
        {
          type: 'link',
          path: '/admin/finance/compliance',
          title: 'Compliance',
          icon: Scale,
        },
        {
          type: 'dropdown',
          title: 'System Wallets',
          icon: Wallet,
          key: 'system-wallets',
          items: [
            {
              type: 'link',
              path: '/admin/finance/wallets',
              title: 'Wallets',
            },
            {
              type: 'link',
              path: '/admin/finance/wallets/reversal-requests',
              title: 'Reversal Requests',
            },
          ],
        },
        {
          type: 'link',
          path: '/admin/finance/banks',
          title: 'Banks',
          icon: Banknote,
        },
        {
          type: 'dropdown',
          title: 'User Wallets',
          icon: Wallet,
          key: 'user-wallets',
          items: [
            {
              type: 'link',
              path: '/admin/finance/user-wallets',
              title: 'All Wallets',
            },
            {
              type: 'link',
              path: '/admin/finance/withdrawals',
              title: 'Withdrawal Requests',
            },
            {
              type: 'link',
              path: '/admin/finance/top-ups',
              title: 'Top-up History',
            },
          ],
        },
        {
          type: 'link',
          path: '/admin/finance/payment-methods',
          title: 'Payment Methods',
          icon: CreditCard,
        },
        {
          type: 'link',
          path: '/admin/finance/reports',
          title: 'Financial Reports',
          icon: PieChart,
        },
        {
          type: 'link',
          path: '/admin/finance/gift-history',
          title: 'Gift History',
          icon: Gift,
        },
      ],
    },
    {
      type: 'section',
      title: 'Gifts',
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
          icon: ImageIcon,
        },
        {
          type: 'link',
          path: '/admin/gifts/gift-categories',
          title: 'Gift Categories',
          icon: Palette,
        },
      ]
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
    {
      type: 'section',
      title: 'Settings',
      items: [
        {
          type: 'link',
          path: '/admin/settings',
          title: 'General Settings',
          icon: Settings,
        },
        {
          type: 'link',
          path: '/admin/languages',
          title: 'Languages',
          icon: Languages,
        },
        {
          type: 'link',
          path: '/admin/emojis',
          title: 'Emojis',
          icon: ImageIcon,
        },
        {
          type: 'link',
          path: '/admin/logs',
          title: 'Audit Logs',
          icon: FileText,
        },
      ],
    },
  ];

export default routes;