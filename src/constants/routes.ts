import {
  Globe,
  UserCircle,
  Receipt,
  Wallet,
  AlertTriangle,
  ImageIcon,
  Settings,
  Users,
  Languages,
  TicketIcon,
  UsersIcon,
  Bell,
  FileText,
  LifeBuoy,
  Building,
  CreditCardIcon,
  FilePieChart,
  FileCheck,
  Shield,
  Candy
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
              path: '/admin/finance/fee-rules',
              title: 'Fee Structures',
            },
          ],
        },
        {
          type: 'dropdown',
          title: 'Risk Management',
          icon: Shield,
          key: 'risk-management-finance',
          items: [
            {
              type: 'link',
              path: '/admin/finance/risk/aml',
              title: 'AML Screening',
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
          ],
        },
        {
          type: 'link',
          path: '/admin/finance/compliance',
          title: 'Compliance',
          icon: FileCheck,
          description: 'Regulatory compliance monitoring'
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
            {
              type: 'link',
              path: '/admin/users/kyc-verification',
              title: 'KYC Verification',
            },
            {
              type: 'link',
              path: '/admin/users/aml-screening',
              title: 'AML Screening',
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
            {
              type: 'link',
              path: '/admin/system/notifications/broadcasts',
              title: 'System Broadcasts',
            }
          ],
        },
        {
          type: 'link',
          path: '/admin/languages',
          title: 'Languages',
          icon: Languages,
          description: 'Manage platform languages'
        },
      ],
    },
    {
      type: 'section',
      title: 'Support',
      items: [
        {
          type: 'link',
          path: '/admin/support/dashboard',
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
          type: 'link',
          path: '/admin/support/sla',
          title: 'SLA Management',
          icon: UsersIcon,
          description: 'Service Level Agreements'
        },
        {
          type: 'link',
          path: '/admin/support/categories',
          title: 'Categories',
          icon: Building,
          description: 'Categories for support tickets'
        },
        {
          type: 'link',
          path: '/admin/support/canned-responses',
          title: 'Canned responses',
          icon: Candy,
          description: 'Canned responses for support tickets'
        },
        {
          type: 'link',
          path: '/admin/support/faqs',
          title: 'FAQs',
          icon: Candy,
          description: 'FAQs '
        },
        {
          type: 'link',
          path: '/admin/support/reports',
          title: 'Reports',
          icon: Candy,
          description: 'Reports & stats'
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
