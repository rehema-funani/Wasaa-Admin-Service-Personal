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
  Languages
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
      title: 'Users',
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
      ],
    },
    {
      type: 'section',
      title: 'User Management',
      items: [
        {
          type: 'link',
          path: '/admin/system/users',
          title: 'User Accounts',
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
          title: 'Livestream Management',
          icon: Video,
          key: 'Livestream Management',
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
          type: 'dropdown',
          title: 'Wallet Management',
          icon: Wallet,
          key: 'Wallet Management',
          items: [
            {
              type: 'link',
              path: '/admin/finance/user-wallets',
              title: 'User Wallets',
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
      title:'Gifts',
      items: [
        {
          type: 'link',
          path: '/admin/gifts/add-gift',
          title: 'Add Gift',
          icon: ImageIcon,
        },
         {
          type: 'link',
          path: '/admin/gifts/gift-list',
          title: 'Gift List',
          icon: Gift,
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
      title: 'Reports',
      items: [
        {
          type: 'link',
          path: '/admin/users/reported-user-list',
          title: 'Reported Users',
          icon: AlertTriangle,
        },
        {
          type: 'link',
          path: '/admin/Group/all-reported-group-list',
          title: 'Reported Group List',
          icon: AlertTriangle,
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
      title: 'Settings',
      items: [
        {
          type: 'link',
          path: '/admin/settings',
          title: 'General',
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
          path: '/admin/logs',
          title: 'Audit Logs',
          icon: Key,
        },
        {
          type: 'link',
          path: '/admin/support',
          title: 'Support',
          icon: Globe,
        },
        {
          type: 'link',
          path:'/admin/Wallpaper/list-all-wallpaper',
          title: 'Wallpaper',
          icon: ImageIcon,
        },
        {
          type: 'link',
          path:'/admin/Avatar/list-all-avatar',
          title: 'Avatar',
          icon: ImageIcon,
        },
      ],
    },
  ];

export default routes;