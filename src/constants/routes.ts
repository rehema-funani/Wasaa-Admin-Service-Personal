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
  FileCheck,
  DollarSign,
  UserCheck,
  Shield,
  PieChart,
  Bookmark,
  BadgeAlert,
  LockKeyhole,
  ArrowRightLeft,
  Calculator,
  LayoutGrid,
  Share2,
  BadgeDollarSign,
  Grid3x3,
  Zap,
  MessageCircle,
  BellRing,
  Building2,
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
            // {
            //   type: 'link',
            //   path: '/admin/finance/withdrawals',
            //   title: 'Withdrawal Requests',
            // },
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
        // {
        //   type: 'dropdown',
        //   title: 'Forex Exchange',
        //   icon: DollarSign,
        //   key: 'forex',
        //   items: [
        //     {
        //       type: 'link',
        //       path: '/admin/finance/forex/dashboard',
        //       title: 'Forex Dashboard',
        //     },
        //     {
        //       type: 'link',
        //       path: '/admin/finance/forex/currencies',
        //       title: 'Currency Management',
        //     },
        //     {
        //       type: 'link',
        //       path: '/admin/finance/forex/currency-pairs',
        //       title: 'Currency Pairs',
        //     },
        //     {
        //       type: 'link',
        //       path: '/admin/finance/forex/exchange-rates',
        //       title: 'Exchange Rate Viewer',
        //     },
        //     {
        //       type: 'link',
        //       path: '/admin/finance/forex/alerts',
        //       title: 'User Alerts',
        //     },
        //     {
        //       type: 'link',
        //       path: '/admin/finance/forex/settings',
        //       title: 'Forex Settings',
        //     },
        //   ],
        // },
        {
          type: 'dropdown',
          title: 'Payments & Banking',
          icon: CreditCardIcon,
          key: 'payments',
          items: [
            // {
            //   type: 'link',
            //   path: '/admin/finance/banks',
            //   title: 'Banking Partners',
            // },
            {
              type: 'link',
              path: '/admin/finance/fee-rules',
              title: 'Fee Structures',
            },
            // {
            //   type: 'link',
            //   path: '/admin/finance/payment-gateways',
            //   title: 'Payment Gateways',
            // },
            // {
            //   type: 'link',
            //   path: '/admin/finance/settlement',
            //   title: 'Settlement Processing',
            // },
          ],
        },
        {
          type: 'dropdown',
          title: 'Risk Management',
          icon: Shield,
          key: 'risk-management-finance',
          items: [
            // {
            //   type: 'link',
            //   path: '/admin/finance/risk/monitoring',
            //   title: 'Transaction Monitoring',
            // },
            // {
            //   type: 'link',
            //   path: '/admin/finance/risk/thresholds',
            //   title: 'Risk Thresholds',
            // },
            // {
            //   type: 'link',
            //   path: '/admin/finance/risk/fraud-detection',
            //   title: 'Fraud Detection',
            // },
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
            // {
            //   type: 'link',
            //   path: '/admin/finance/analytics/performance',
            //   title: 'Performance Metrics',
            // },
            // {
            //   type: 'link',
            //   path: '/admin/finance/analytics/revenue',
            //   title: 'Revenue Analysis',
            // },
            // {
            //   type: 'link',
            //   path: '/admin/finance/analytics/forecasting',
            //   title: 'Financial Forecasting',
            // },
            // {
            //   type: 'link',
            //   path: '/admin/finance/analytics/audit',
            //   title: 'Audit Reports',
            // },
          ],
        },
        {
          type: 'link',
          path: '/admin/finance/compliance',
          title: 'Compliance',
          icon: FileCheck,
          description: 'Regulatory compliance monitoring'
        },
        // {
        //   type: 'link',
        //   path: '/admin/finance/gift-history',
        //   title: 'Rewards',
        //   icon: Gift,
        //   description: 'Manage reward distributions'
        // },
        // {
        //   type: 'dropdown',
        //   title: 'Settlements',
        //   icon: ArrowRightLeft,
        //   key: 'settlements',
        //   items: [
        //     {
        //       type: 'link',
        //       path: '/admin/finance/settlements/creator',
        //       title: 'Creator Payments',
        //     },
        //     {
        //       type: 'link',
        //       path: '/admin/finance/settlements/vendor',
        //       title: 'Vendor Settlements',
        //     },
        //     {
        //       type: 'link',
        //       path: '/admin/finance/settlements/royalty',
        //       title: 'Royalty Disbursements',
        //     },
        //     {
        //       type: 'link',
        //       path: '/admin/finance/settlements/schedule',
        //       title: 'Payment Schedules',
        //     },
        //   ],
        // },
        // {
        //   type: 'link',
        //   path: '/admin/finance/calculator',
        //   title: 'Financial Calculator',
        //   icon: Calculator,
        //   description: 'Revenue and fee calculator'
        // },
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
        // {
        //   type: 'dropdown',
        //   title: 'Digital Assets',
        //   icon: Gift,
        //   key: 'digital-assets',
        //   items: [
        //     {
        //       type: 'link',
        //       path: '/admin/gifts/gift-list',
        //       title: 'Gift Catalog',
        //     },
        //     {
        //       type: 'link',
        //       path: '/admin/gifts/add-gift',
        //       title: 'Add New Gift',
        //     },
        //     {
        //       type: 'link',
        //       path: '/admin/gifts/gift-categories',
        //       title: 'Gift Categories',
        //     },
        //   ],
        // },
        // {
        //   type: 'dropdown',
        //   title: 'Creator Management',
        //   icon: UserCheck,
        //   key: 'creator-management',
        //   items: [
        //     {
        //       type: 'link',
        //       path: '/admin/creators/verification',
        //       title: 'Creator Verification',
        //     },
        //     {
        //       type: 'link',
        //       path: '/admin/creators/contracts',
        //       title: 'Creator Contracts',
        //     },
        //     {
        //       type: 'link',
        //       path: '/admin/creators/payment-setup',
        //       title: 'Payment Setup',
        //     },
        //     {
        //       type: 'link',
        //       path: '/admin/creators/performance',
        //       title: 'Performance Metrics',
        //     },
        //   ],
        // },
      ],
    },
    // {
    //   type: 'section',
    //   title: 'Media',
    //   items: [
    //     {
    //       type: 'dropdown',
    //       title: 'Short Videos',
    //       icon: Film,
    //       key: 'shorts',
    //       items: [
    //         {
    //           type: 'link',
    //           path: '/admin/media/shorts',
    //           title: 'Shorts Dashboard',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/media/shorts/moderation',
    //           title: 'Video Moderation',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/media/shorts/reports',
    //           title: 'Reported Content',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/media/shorts/comments',
    //           title: 'Comments Management',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/media/shorts/creators',
    //           title: 'Content Creators',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/media/shorts/monetization',
    //           title: 'Monetization',
    //         },
    //       ],
    //     },
    //     {
    //       type: 'dropdown',
    //       title: 'Livestreams',
    //       icon: MonitorPlay,
    //       key: 'livestreams',
    //       items: [
    //         {
    //           type: 'link',
    //           path: '/admin/livestreams/all-livestreams',
    //           title: 'All Livestreams',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/livestreams/scheduled',
    //           title: 'Scheduled Streams',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/livestreams/featured',
    //           title: 'Featured Streams',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/livestreams/moderation',
    //           title: 'Stream Moderation',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/livestreams/reported',
    //           title: 'Reported Streams',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/livestreams/monetization',
    //           title: 'Monetization',
    //         },
    //       ],
    //     },
    //     {
    //       type: 'dropdown',
    //       title: 'Content Management',
    //       icon: Hash,
    //       key: 'content-mgmt',
    //       items: [
    //         {
    //           type: 'link',
    //           path: '/admin/media/shorts/hashtags',
    //           title: 'Hashtags',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/media/shorts/hashtags/trending',
    //           title: 'Trending Tags',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/media/shorts/promotion',
    //           title: 'Promotions',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/livestreams/categories',
    //           title: 'Stream Categories',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/media/content-calendar',
    //           title: 'Content Calendar',
    //         },
    //       ],
    //     },
    //     {
    //       type: 'dropdown',
    //       title: 'Analytics',
    //       icon: BarChart3,
    //       key: 'media-analytics',
    //       items: [
    //         {
    //           type: 'link',
    //           path: '/admin/media/shorts/analytics',
    //           title: 'Shorts Analytics',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/livestreams/analytics',
    //           title: 'Stream Analytics',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/media/shorts/analytics/moderation',
    //           title: 'Moderation Reports',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/media/revenue-analytics',
    //           title: 'Revenue Analytics',
    //         },
    //       ],
    //     },
    //   ],
    // },
    // {
    //   type: 'section',
    //   title: 'Channels',
    //   items: [
    //     {
    //       type: 'link',
    //       path: '/admin/channels/dashboard',
    //       title: 'Channels Dashboard',
    //       icon: LayoutGrid,
    //       description: 'Channel performance overview'
    //     },
    //     {
    //       type: 'dropdown',
    //       title: 'Channel Management',
    //       icon: Grid3x3,
    //       key: 'channel-management',
    //       items: [
    //         {
    //           type: 'link',
    //           path: '/admin/channels/all',
    //           title: 'All Channels',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/channels/categories',
    //           title: 'Channel Categories',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/channels/featured',
    //           title: 'Featured Channels',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/channels/verification',
    //           title: 'Channel Verification',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/channels/recommendations',
    //           title: 'Channel Recommendations',
    //         },
    //       ],
    //     },
    //     {
    //       type: 'dropdown',
    //       title: 'Content Distribution',
    //       icon: Share2,
    //       key: 'content-distribution',
    //       items: [
    //         {
    //           type: 'link',
    //           path: '/admin/channels/distribution/publishing',
    //           title: 'Publishing Rules',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/channels/distribution/syndication',
    //           title: 'Content Syndication',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/channels/distribution/scheduling',
    //           title: 'Release Scheduling',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/channels/distribution/partners',
    //           title: 'Distribution Partners',
    //         },
    //       ],
    //     },
    //     {
    //       type: 'dropdown',
    //       title: 'Communication Tools',
    //       icon: MessageCircle,
    //       key: 'communication-tools',
    //       items: [
    //         {
    //           type: 'link',
    //           path: '/admin/channels/communication/messaging',
    //           title: 'Channel Messaging',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/channels/communication/broadcasts',
    //           title: 'Broadcast Messages',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/channels/communication/announcements',
    //           title: 'Channel Announcements',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/channels/communication/comments',
    //           title: 'Comment Management',
    //         },
    //       ],
    //     },
    //     {
    //       type: 'dropdown',
    //       title: 'Audience Management',
    //       icon: Users,
    //       key: 'audience-management',
    //       items: [
    //         {
    //           type: 'link',
    //           path: '/admin/channels/audience/subscribers',
    //           title: 'Subscriber Management',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/channels/audience/engagement',
    //           title: 'Engagement Metrics',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/channels/audience/segmentation',
    //           title: 'Audience Segmentation',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/channels/audience/growth',
    //           title: 'Growth Analytics',
    //         },
    //       ],
    //     },
    //     {
    //       type: 'dropdown',
    //       title: 'Monetization',
    //       icon: BadgeDollarSign,
    //       key: 'channel-monetization',
    //       items: [
    //         {
    //           type: 'link',
    //           path: '/admin/channels/monetization/subscriptions',
    //           title: 'Subscription Plans',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/channels/monetization/advertising',
    //           title: 'Advertising',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/channels/monetization/memberships',
    //           title: 'Membership Tiers',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/channels/monetization/revenue-share',
    //           title: 'Revenue Sharing',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/channels/monetization/payouts',
    //           title: 'Creator Payouts',
    //         },
    //       ],
    //     },
    //     {
    //       type: 'dropdown',
    //       title: 'Analytics',
    //       icon: PieChart,
    //       key: 'channel-analytics',
    //       items: [
    //         {
    //           type: 'link',
    //           path: '/admin/channels/analytics/performance',
    //           title: 'Channel Performance',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/channels/analytics/content',
    //           title: 'Content Analytics',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/channels/analytics/audience',
    //           title: 'Audience Insights',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/channels/analytics/revenue',
    //           title: 'Revenue Reports',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/channels/analytics/comparison',
    //           title: 'Comparative Analysis',
    //         },
    //       ],
    //     },
    //     {
    //       type: 'dropdown',
    //       title: 'Content Moderation',
    //       icon: Shield,
    //       key: 'channel-moderation',
    //       items: [
    //         {
    //           type: 'link',
    //           path: '/admin/channels/moderation/queue',
    //           title: 'Moderation Queue',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/channels/moderation/reported',
    //           title: 'Reported Content',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/channels/moderation/policies',
    //           title: 'Moderation Policies',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/channels/moderation/appeals',
    //           title: 'Appeals Process',
    //         },
    //       ],
    //     },
    //     {
    //       type: 'dropdown',
    //       title: 'Notifications',
    //       icon: BellRing,
    //       key: 'channel-notifications',
    //       items: [
    //         {
    //           type: 'link',
    //           path: '/admin/channels/notifications/settings',
    //           title: 'Notification Settings',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/channels/notifications/templates',
    //           title: 'Notification Templates',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/channels/notifications/scheduled',
    //           title: 'Scheduled Notifications',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/channels/notifications/analytics',
    //           title: 'Notification Analytics',
    //         },
    //       ],
    //     },
    //     {
    //       type: 'link',
    //       path: '/admin/channels/cross-promotion',
    //       title: 'Cross-Promotion',
    //       icon: Zap,
    //       description: 'Manage cross-channel promotions'
    //     },
    //     {
    //       type: 'link',
    //       path: '/admin/channels/settings',
    //       title: 'Channel Settings',
    //       icon: Settings,
    //       description: 'Configure channel settings'
    //     },
    //   ],
    // },
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
            // {
            //   type: 'link',
            //   path: '/admin/Avatar/add-a-new-avatar',
            //   title: 'Add Avatar',
            // },
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
            // {
            //   type: 'link',
            //   path: '/admin/notifications/campaigns',
            //   title: 'Notification Campaigns',
            // },
            // {
            //   type: 'link',
            //   path: '/admin/notifications/preferences',
            //   title: 'User Preferences',
            // },
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
        // {
        //   type: 'link',
        //   path: '/admin/media/shorts/settings',
        //   title: 'Media Settings',
        //   icon: Cog,
        //   description: 'Configure media preferences'
        // },
        // {
        //   type: 'link',
        //   path: '/admin/livestreams/settings',
        //   title: 'Stream Settings',
        //   icon: Video,
        //   description: 'Configure streaming options'
        // },
        // {
        //   type: 'link',
        //   path: '/admin/themes',
        //   title: 'Theme Management',
        //   icon: Bookmark,
        //   description: 'Manage platform themes'
        // },
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
          path: '/admin/support/agents',
          title: 'Agents',
          icon: UsersIcon,
          description: 'Support agent management & team'
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
        // {
        //   type: 'dropdown',
        //   title: 'Security',
        //   icon: LockKeyhole,
        //   key: 'security',
        //   items: [
        //     {
        //       type: 'link',
        //       path: '/admin/security/access-logs',
        //       title: 'Access Logs',
        //     },
        //     {
        //       type: 'link',
        //       path: '/admin/security/auth-settings',
        //       title: 'Authentication Settings',
        //     },
        //     {
        //       type: 'link',
        //       path: '/admin/security/data-protection',
        //       title: 'Data Protection',
        //     },
        //     {
        //       type: 'link',
        //       path: '/admin/security/vulnerability',
        //       title: 'Vulnerability Management',
        //     },
        //   ],
        // },
        // {
        //   type: 'link',
        //   path: '/admin/compliance/dashboard',
        //   title: 'Compliance Dashboard',
        //   icon: BadgeAlert,
        //   description: 'Regulatory compliance monitoring'
        // },
      ],
    },
];

export default routes;
