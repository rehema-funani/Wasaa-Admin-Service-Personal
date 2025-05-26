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
          title: 'Digital Assets',
          icon: Gift,
        },
        {
          type: 'link',
          path: '/admin/gifts/add-gift',
          title: 'Create Asset',
          icon: CircleDollarSign,
        },
        {
          type: 'link',
          path: '/admin/gifts/gift-categories',
          title: 'Asset Categories',
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
    // Keeping these sections but moving them lower in priority
    {
      type: 'section',
      title: 'Media Library',
      items: [
        {
          type: 'link',
          path: '/admin/Wallpaper/list-all-wallpaper',
          title: 'Brand Assets',
          icon: ImageIcon,
        },
        {
          type: 'link',
          path: '/admin/Avatar/list-all-avatar',
          title: 'User Icons',
          icon: UserCircle,
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
      ],
    },
  ];

export default routes;