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
  Settings
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
          title: 'Countrywise Users',
          icon: Globe,
        },
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
          title: 'LS Management',
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
          type: 'dropdown',
          title: 'Wallpaper Settings',
          icon: ImageIcon,
          key: 'Wallpaper Settings',
          items: [
            {
              type: 'link',
              path: '/admin/Wallpaper/list-all-wallpaper',
              title: 'Wallpaper List',
            },
            {
              type: 'link',
              path: '/admin/Wallpaper/add-a-new-wallpaper',
              title: 'Add Wallpapper',
            },
          ],
        },
        {
          type: 'dropdown',
          title: 'Avatar Settings',
          icon: Palette,
          key: 'Avatar Setting',
          items: [
            {
              type: 'link',
              path: '/admin/Avatar/list-all-avatar',
              title: 'Avatar List',
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
          title: 'System Settings',
          icon: Settings,
          key: 'System Settings',
          items: [
            {
              type: 'link',
              path: '/admin/System-Setting/General-Setting',
              title: 'General Setting',
            },
            {
              type: 'link',
              path: '/admin/System-Setting/App-Setting',
              title: 'App Setting',
            },
            {
              type: 'link',
              path: '/admin/System-Setting/Web-Setting',
              title: 'Frontend Setting',
            },
            {
              type: 'link',
              path: '/admin/System-Setting/Advanced-Setting',
              title: 'OTP Cofigration',
            },
            {
              type: 'link',
              path: '/admin/System-Setting/email-Configration',
              title: 'Email Configration',
            },
            {
              type: 'link',
              path: '/admin/System-Setting/Pages',
              title: 'Pages',
            },
            {
              type: 'link',
              path: '/admin/System-Setting/LanguageSettings',
              title: 'Language Settings',
            },
            {
              type: 'link',
              path: '/admin/System-Setting/reportSettings',
              title: 'Report Settings',
            },
          ],
        },
        {
          type: 'dropdown',
          title: 'Gift Settings',
          icon: Gift,
          key: 'Gift Settings',
          items: [
            {
              type: 'link',
              path: '/admin/Gift/gift-list',
              title: 'Gift List',
            },
            {
              type: 'link',
              path: '/admin/Gift/add-new-gift',
              title: 'Add New Gift',
            },
            {
              type: 'link',
              path: '/admin/Gift/gift-categories',
              title: 'Gift Categories',
            },
          ],
        },
      ],
    },
  ];

export default routes;