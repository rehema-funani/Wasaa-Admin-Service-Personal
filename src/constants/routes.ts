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
  Headphones,
  MusicIcon,
  Library,
  UserCheck,
  ListMusic,
  Podcast,
  Rss,
  LineChart,
  Shield,
  Coins,
  File,
  PieChart,
  CalendarClock,
  Megaphone,
  Bookmark,
  ChartBar,
  BriefcaseBusiness,
  BadgeAlert,
  LockKeyhole,
  ArrowRightLeft,
  Calculator,
  ShoppingBag,
  Store,
  Package,
  ShoppingCart,
  Truck,
  BarChart4,
  LayoutGrid,
  Layers,
  Share2,
  BadgeDollarSign,
  ShieldCheck,
  Boxes,
  CircleDollarSign,
  Grid3x3,
  Zap,
  MessageCircle,
  BellRing
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
          title: 'Forex Exchange',
          icon: DollarSign,
          key: 'forex',
          items: [
            {
              type: 'link',
              path: '/admin/finance/forex/dashboard',
              title: 'Forex Dashboard',
            },
            {
              type: 'link',
              path: '/admin/finance/forex/currencies',
              title: 'Currency Management',
            },
            {
              type: 'link',
              path: '/admin/finance/forex/currency-pairs',
              title: 'Currency Pairs',
            },
            {
              type: 'link',
              path: '/admin/finance/forex/exchange-rates',
              title: 'Exchange Rate Viewer',
            },
            {
              type: 'link',
              path: '/admin/finance/forex/alerts',
              title: 'User Alerts',
            },
            {
              type: 'link',
              path: '/admin/finance/forex/settings',
              title: 'Forex Settings',
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
            {
              type: 'link',
              path: '/admin/finance/payment-gateways',
              title: 'Payment Gateways',
            },
            {
              type: 'link',
              path: '/admin/finance/settlement',
              title: 'Settlement Processing',
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
              path: '/admin/finance/risk/monitoring',
              title: 'Transaction Monitoring',
            },
            {
              type: 'link',
              path: '/admin/finance/risk/thresholds',
              title: 'Risk Thresholds',
            },
            {
              type: 'link',
              path: '/admin/finance/risk/fraud-detection',
              title: 'Fraud Detection',
            },
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
        {
          type: 'dropdown',
          title: 'Settlements',
          icon: ArrowRightLeft,
          key: 'settlements',
          items: [
            {
              type: 'link',
              path: '/admin/finance/settlements/creator',
              title: 'Creator Payments',
            },
            {
              type: 'link',
              path: '/admin/finance/settlements/vendor',
              title: 'Vendor Settlements',
            },
            {
              type: 'link',
              path: '/admin/finance/settlements/royalty',
              title: 'Royalty Disbursements',
            },
            {
              type: 'link',
              path: '/admin/finance/settlements/schedule',
              title: 'Payment Schedules',
            },
          ],
        },
        {
          type: 'link',
          path: '/admin/finance/calculator',
          title: 'Financial Calculator',
          icon: Calculator,
          description: 'Revenue and fee calculator'
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
        {
          type: 'dropdown',
          title: 'Creator Management',
          icon: UserCheck,
          key: 'creator-management',
          items: [
            {
              type: 'link',
              path: '/admin/creators/verification',
              title: 'Creator Verification',
            },
            {
              type: 'link',
              path: '/admin/creators/contracts',
              title: 'Creator Contracts',
            },
            {
              type: 'link',
              path: '/admin/creators/payment-setup',
              title: 'Payment Setup',
            },
            {
              type: 'link',
              path: '/admin/creators/performance',
              title: 'Performance Metrics',
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
            {
              type: 'link',
              path: '/admin/media/shorts/monetization',
              title: 'Monetization',
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
            {
              type: 'link',
              path: '/admin/livestreams/monetization',
              title: 'Monetization',
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
            {
              type: 'link',
              path: '/admin/media/content-calendar',
              title: 'Content Calendar',
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
            {
              type: 'link',
              path: '/admin/media/revenue-analytics',
              title: 'Revenue Analytics',
            },
          ],
        },
      ],
    },
    // {
    //   type: 'section',
    //   title: 'Podcasts',
    //   items: [
    //     {
    //       type: 'link',
    //       path: '/admin/podcasts/dashboard',
    //       title: 'Podcast Dashboard',
    //       icon: Headphones,
    //       description: 'Podcast performance overview'
    //     },
    //     {
    //       type: 'dropdown',
    //       title: 'Podcast Management',
    //       icon: Podcast,
    //       key: 'podcast-mgmt',
    //       items: [
    //         {
    //           type: 'link',
    //           path: '/admin/podcasts/shows',
    //           title: 'Podcast Shows',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/podcasts/episodes',
    //           title: 'Episodes',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/podcasts/creators',
    //           title: 'Podcast Creators',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/podcasts/categories',
    //           title: 'Categories',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/podcasts/featured',
    //           title: 'Featured Content',
    //         },
    //       ],
    //     },
    //     {
    //       type: 'dropdown',
    //       title: 'Content Moderation',
    //       icon: Shield,
    //       key: 'podcast-moderation',
    //       items: [
    //         {
    //           type: 'link',
    //           path: '/admin/podcasts/moderation/queue',
    //           title: 'Moderation Queue',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/podcasts/moderation/reported',
    //           title: 'Reported Content',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/podcasts/moderation/comments',
    //           title: 'Comment Moderation',
    //         },
    //       ],
    //     },
    //     {
    //       type: 'dropdown',
    //       title: 'Monetization',
    //       icon: Coins,
    //       key: 'podcast-monetization',
    //       items: [
    //         {
    //           type: 'link',
    //           path: '/admin/podcasts/monetization/subscriptions',
    //           title: 'Subscription Plans',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/podcasts/monetization/ads',
    //           title: 'Ad Management',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/podcasts/monetization/creator-payments',
    //           title: 'Creator Payments',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/podcasts/monetization/sponsorships',
    //           title: 'Sponsorships',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/podcasts/monetization/revenue-splits',
    //           title: 'Revenue Splits',
    //         },
    //       ],
    //     },
    //     {
    //       type: 'dropdown',
    //       title: 'Distribution',
    //       icon: Rss,
    //       key: 'podcast-distribution',
    //       items: [
    //         {
    //           type: 'link',
    //           path: '/admin/podcasts/distribution/platforms',
    //           title: 'Distribution Platforms',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/podcasts/distribution/rss',
    //           title: 'RSS Management',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/podcasts/distribution/partnerships',
    //           title: 'Platform Partnerships',
    //         },
    //       ],
    //     },
    //     {
    //       type: 'dropdown',
    //       title: 'Analytics',
    //       icon: LineChart,
    //       key: 'podcast-analytics',
    //       items: [
    //         {
    //           type: 'link',
    //           path: '/admin/podcasts/analytics/audience',
    //           title: 'Audience Metrics',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/podcasts/analytics/engagement',
    //           title: 'Engagement Analysis',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/podcasts/analytics/revenue',
    //           title: 'Revenue Reports',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/podcasts/analytics/creator',
    //           title: 'Creator Performance',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/podcasts/analytics/downloads',
    //           title: 'Download Statistics',
    //         },
    //       ],
    //     },
    //     {
    //       type: 'link',
    //       path: '/admin/podcasts/scheduling',
    //       title: 'Release Schedule',
    //       icon: CalendarClock,
    //       description: 'Manage episode release schedule'
    //     },
    //   ],
    // },
    // {
    //   type: 'section',
    //   title: 'Music',
    //   items: [
    //     {
    //       type: 'link',
    //       path: '/admin/music/dashboard',
    //       title: 'Music Dashboard',
    //       icon: MusicIcon,
    //       description: 'Music performance overview'
    //     },
    //     {
    //       type: 'dropdown',
    //       title: 'Music Library',
    //       icon: Library,
    //       key: 'music-library',
    //       items: [
    //         {
    //           type: 'link',
    //           path: '/admin/music/tracks',
    //           title: 'Tracks',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/music/albums',
    //           title: 'Albums',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/music/artists',
    //           title: 'Artists',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/music/genres',
    //           title: 'Genres',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/music/featured',
    //           title: 'Featured Content',
    //         },
    //       ],
    //     },
    //     {
    //       type: 'dropdown',
    //       title: 'Rights Management',
    //       icon: File,
    //       key: 'music-rights',
    //       items: [
    //         {
    //           type: 'link',
    //           path: '/admin/music/rights/licensing',
    //           title: 'Licensing',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/music/rights/copyright',
    //           title: 'Copyright Management',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/music/rights/royalty-tracking',
    //           title: 'Royalty Tracking',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/music/rights/distribution',
    //           title: 'Distribution Rights',
    //         },
    //       ],
    //     },
    //     {
    //       type: 'dropdown',
    //       title: 'Monetization',
    //       icon: Coins,
    //       key: 'music-monetization',
    //       items: [
    //         {
    //           type: 'link',
    //           path: '/admin/music/monetization/subscriptions',
    //           title: 'Subscription Plans',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/music/monetization/royalties',
    //           title: 'Royalty Payments',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/music/monetization/artist-payments',
    //           title: 'Artist Payments',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/music/monetization/revenue-models',
    //           title: 'Revenue Models',
    //         },
    //       ],
    //     },
    //     {
    //       type: 'dropdown',
    //       title: 'Curation',
    //       icon: ListMusic,
    //       key: 'music-curation',
    //       items: [
    //         {
    //           type: 'link',
    //           path: '/admin/music/curation/playlists',
    //           title: 'Playlists',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/music/curation/featured-artists',
    //           title: 'Featured Artists',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/music/curation/trending',
    //           title: 'Trending Content',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/music/curation/new-releases',
    //           title: 'New Releases',
    //         },
    //       ],
    //     },
    //     {
    //       type: 'dropdown',
    //       title: 'Moderation',
    //       icon: Shield,
    //       key: 'music-moderation',
    //       items: [
    //         {
    //           type: 'link',
    //           path: '/admin/music/moderation/content-review',
    //           title: 'Content Review',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/music/moderation/reported',
    //           title: 'Reported Content',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/music/moderation/explicit-content',
    //           title: 'Explicit Content',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/music/moderation/copyright-claims',
    //           title: 'Copyright Claims',
    //         },
    //       ],
    //     },
    //     {
    //       type: 'dropdown',
    //       title: 'Analytics',
    //       icon: ChartBar,
    //       key: 'music-analytics',
    //       items: [
    //         {
    //           type: 'link',
    //           path: '/admin/music/analytics/streams',
    //           title: 'Streaming Analytics',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/music/analytics/artist-performance',
    //           title: 'Artist Performance',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/music/analytics/revenue',
    //           title: 'Revenue Reports',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/music/analytics/listener-trends',
    //           title: 'Listener Trends',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/music/analytics/playlist-performance',
    //           title: 'Playlist Performance',
    //         },
    //       ],
    //     },
    //     {
    //       type: 'link',
    //       path: '/admin/music/promotions',
    //       title: 'Promotions',
    //       icon: Megaphone,
    //       description: 'Music promotion campaigns'
    //     },
    //   ],
    // },
    // {
    //   type: 'section',
    //   title: 'Store Front',
    //   items: [
    //     {
    //       type: 'link',
    //       path: '/admin/storefront/dashboard',
    //       title: 'Marketplace Dashboard',
    //       icon: ShoppingBag,
    //       description: 'Marketplace performance overview'
    //     },
    //     {
    //       type: 'dropdown',
    //       title: 'Store Management',
    //       icon: Store,
    //       key: 'store-management',
    //       items: [
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/stores',
    //           title: 'All Stores',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/stores/verification',
    //           title: 'Store Verification',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/stores/featured',
    //           title: 'Featured Stores',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/stores/categories',
    //           title: 'Store Categories',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/stores/reviews',
    //           title: 'Store Reviews',
    //         },
    //       ],
    //     },
    //     {
    //       type: 'dropdown',
    //       title: 'Product Management',
    //       icon: Package,
    //       key: 'product-management',
    //       items: [
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/products',
    //           title: 'All Products',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/products/categories',
    //           title: 'Product Categories',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/products/attributes',
    //           title: 'Product Attributes',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/products/reviews',
    //           title: 'Product Reviews',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/products/featured',
    //           title: 'Featured Products',
    //         },
    //       ],
    //     },
    //     {
    //       type: 'dropdown',
    //       title: 'Order Management',
    //       icon: ShoppingCart,
    //       key: 'order-management',
    //       items: [
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/orders',
    //           title: 'All Orders',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/orders/processing',
    //           title: 'Processing Orders',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/orders/fulfillment',
    //           title: 'Order Fulfillment',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/orders/returns',
    //           title: 'Returns & Refunds',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/orders/disputes',
    //           title: 'Order Disputes',
    //         },
    //       ],
    //     },
    //     {
    //       type: 'dropdown',
    //       title: 'Shipping & Logistics',
    //       icon: Truck,
    //       key: 'shipping-logistics',
    //       items: [
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/shipping/carriers',
    //           title: 'Shipping Carriers',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/shipping/methods',
    //           title: 'Shipping Methods',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/shipping/zones',
    //           title: 'Shipping Zones',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/shipping/tracking',
    //           title: 'Order Tracking',
    //         },
    //       ],
    //     },
    //     {
    //       type: 'dropdown',
    //       title: 'Inventory Management',
    //       icon: Boxes,
    //       key: 'inventory-management',
    //       items: [
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/inventory/stock-levels',
    //           title: 'Stock Levels',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/inventory/low-stock',
    //           title: 'Low Stock Alerts',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/inventory/warehouses',
    //           title: 'Warehouses',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/inventory/adjustments',
    //           title: 'Inventory Adjustments',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/inventory/suppliers',
    //           title: 'Suppliers',
    //         },
    //       ],
    //     },
    //     {
    //       type: 'dropdown',
    //       title: 'Promotions & Marketing',
    //       icon: Megaphone,
    //       key: 'store-promotions',
    //       items: [
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/promotions/discounts',
    //           title: 'Discount Codes',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/promotions/sales',
    //           title: 'Sales Campaigns',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/promotions/featured',
    //           title: 'Featured Items',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/promotions/bundles',
    //           title: 'Product Bundles',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/promotions/coupons',
    //           title: 'Coupon Management',
    //         },
    //       ],
    //     },
    //     {
    //       type: 'dropdown',
    //       title: 'Pricing & Taxes',
    //       icon: CircleDollarSign,
    //       key: 'pricing-taxes',
    //       items: [
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/pricing/strategies',
    //           title: 'Pricing Strategies',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/pricing/tax-rules',
    //           title: 'Tax Rules',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/pricing/currencies',
    //           title: 'Currency Settings',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/pricing/fees',
    //           title: 'Platform Fees',
    //         },
    //       ],
    //     },
    //     {
    //       type: 'dropdown',
    //       title: 'Analytics & Reporting',
    //       icon: BarChart4,
    //       key: 'store-analytics',
    //       items: [
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/analytics/sales',
    //           title: 'Sales Analytics',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/analytics/products',
    //           title: 'Product Performance',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/analytics/stores',
    //           title: 'Store Performance',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/analytics/customer',
    //           title: 'Customer Insights',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/analytics/inventory',
    //           title: 'Inventory Analytics',
    //         },
    //       ],
    //     },
    //     {
    //       type: 'dropdown',
    //       title: 'Content Management',
    //       icon: Layers,
    //       key: 'store-content',
    //       items: [
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/content/banners',
    //           title: 'Marketplace Banners',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/content/featured',
    //           title: 'Featured Collections',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/content/landing',
    //           title: 'Landing Pages',
    //         },
    //         {
    //           type: 'link',
    //           path: '/admin/storefront/content/announcements',
    //           title: 'Announcements',
    //         },
    //       ],
    //     },
    //     {
    //       type: 'link',
    //       path: '/admin/storefront/settings',
    //       title: 'Marketplace Settings',
    //       icon: Settings,
    //       description: 'Configure marketplace settings'
    //     },
    //     {
    //       type: 'link',
    //       path: '/admin/storefront/compliance',
    //       title: 'Compliance',
    //       icon: ShieldCheck,
    //       description: 'Marketplace regulatory compliance'
    //     },
    //   ],
    // },
    {
      type: 'section',
      title: 'Channels',
      items: [
        {
          type: 'link',
          path: '/admin/channels/dashboard',
          title: 'Channels Dashboard',
          icon: LayoutGrid,
          description: 'Channel performance overview'
        },
        {
          type: 'dropdown',
          title: 'Channel Management',
          icon: Grid3x3,
          key: 'channel-management',
          items: [
            {
              type: 'link',
              path: '/admin/channels/all',
              title: 'All Channels',
            },
            {
              type: 'link',
              path: '/admin/channels/categories',
              title: 'Channel Categories',
            },
            {
              type: 'link',
              path: '/admin/channels/featured',
              title: 'Featured Channels',
            },
            {
              type: 'link',
              path: '/admin/channels/verification',
              title: 'Channel Verification',
            },
            {
              type: 'link',
              path: '/admin/channels/recommendations',
              title: 'Channel Recommendations',
            },
          ],
        },
        {
          type: 'dropdown',
          title: 'Content Distribution',
          icon: Share2,
          key: 'content-distribution',
          items: [
            {
              type: 'link',
              path: '/admin/channels/distribution/publishing',
              title: 'Publishing Rules',
            },
            {
              type: 'link',
              path: '/admin/channels/distribution/syndication',
              title: 'Content Syndication',
            },
            {
              type: 'link',
              path: '/admin/channels/distribution/scheduling',
              title: 'Release Scheduling',
            },
            {
              type: 'link',
              path: '/admin/channels/distribution/partners',
              title: 'Distribution Partners',
            },
          ],
        },
        {
          type: 'dropdown',
          title: 'Communication Tools',
          icon: MessageCircle,
          key: 'communication-tools',
          items: [
            {
              type: 'link',
              path: '/admin/channels/communication/messaging',
              title: 'Channel Messaging',
            },
            {
              type: 'link',
              path: '/admin/channels/communication/broadcasts',
              title: 'Broadcast Messages',
            },
            {
              type: 'link',
              path: '/admin/channels/communication/announcements',
              title: 'Channel Announcements',
            },
            {
              type: 'link',
              path: '/admin/channels/communication/comments',
              title: 'Comment Management',
            },
          ],
        },
        {
          type: 'dropdown',
          title: 'Audience Management',
          icon: Users,
          key: 'audience-management',
          items: [
            {
              type: 'link',
              path: '/admin/channels/audience/subscribers',
              title: 'Subscriber Management',
            },
            {
              type: 'link',
              path: '/admin/channels/audience/engagement',
              title: 'Engagement Metrics',
            },
            {
              type: 'link',
              path: '/admin/channels/audience/segmentation',
              title: 'Audience Segmentation',
            },
            {
              type: 'link',
              path: '/admin/channels/audience/growth',
              title: 'Growth Analytics',
            },
          ],
        },
        {
          type: 'dropdown',
          title: 'Monetization',
          icon: BadgeDollarSign,
          key: 'channel-monetization',
          items: [
            {
              type: 'link',
              path: '/admin/channels/monetization/subscriptions',
              title: 'Subscription Plans',
            },
            {
              type: 'link',
              path: '/admin/channels/monetization/advertising',
              title: 'Advertising',
            },
            {
              type: 'link',
              path: '/admin/channels/monetization/memberships',
              title: 'Membership Tiers',
            },
            {
              type: 'link',
              path: '/admin/channels/monetization/revenue-share',
              title: 'Revenue Sharing',
            },
            {
              type: 'link',
              path: '/admin/channels/monetization/payouts',
              title: 'Creator Payouts',
            },
          ],
        },
        {
          type: 'dropdown',
          title: 'Analytics',
          icon: PieChart,
          key: 'channel-analytics',
          items: [
            {
              type: 'link',
              path: '/admin/channels/analytics/performance',
              title: 'Channel Performance',
            },
            {
              type: 'link',
              path: '/admin/channels/analytics/content',
              title: 'Content Analytics',
            },
            {
              type: 'link',
              path: '/admin/channels/analytics/audience',
              title: 'Audience Insights',
            },
            {
              type: 'link',
              path: '/admin/channels/analytics/revenue',
              title: 'Revenue Reports',
            },
            {
              type: 'link',
              path: '/admin/channels/analytics/comparison',
              title: 'Comparative Analysis',
            },
          ],
        },
        {
          type: 'dropdown',
          title: 'Content Moderation',
          icon: Shield,
          key: 'channel-moderation',
          items: [
            {
              type: 'link',
              path: '/admin/channels/moderation/queue',
              title: 'Moderation Queue',
            },
            {
              type: 'link',
              path: '/admin/channels/moderation/reported',
              title: 'Reported Content',
            },
            {
              type: 'link',
              path: '/admin/channels/moderation/policies',
              title: 'Moderation Policies',
            },
            {
              type: 'link',
              path: '/admin/channels/moderation/appeals',
              title: 'Appeals Process',
            },
          ],
        },
        {
          type: 'dropdown',
          title: 'Notifications',
          icon: BellRing,
          key: 'channel-notifications',
          items: [
            {
              type: 'link',
              path: '/admin/channels/notifications/settings',
              title: 'Notification Settings',
            },
            {
              type: 'link',
              path: '/admin/channels/notifications/templates',
              title: 'Notification Templates',
            },
            {
              type: 'link',
              path: '/admin/channels/notifications/scheduled',
              title: 'Scheduled Notifications',
            },
            {
              type: 'link',
              path: '/admin/channels/notifications/analytics',
              title: 'Notification Analytics',
            },
          ],
        },
        {
          type: 'link',
          path: '/admin/channels/cross-promotion',
          title: 'Cross-Promotion',
          icon: Zap,
          description: 'Manage cross-channel promotions'
        },
        {
          type: 'link',
          path: '/admin/channels/settings',
          title: 'Channel Settings',
          icon: Settings,
          description: 'Configure channel settings'
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
            {
              type: 'link',
              path: '/admin/notifications/campaigns',
              title: 'Notification Campaigns',
            },
            {
              type: 'link',
              path: '/admin/notifications/preferences',
              title: 'User Preferences',
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
        {
          type: 'link',
          path: '/admin/themes',
          title: 'Theme Management',
          icon: Bookmark,
          description: 'Manage platform themes'
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
            {
              type: 'link',
              path: '/admin/support/performance',
              title: 'Team Performance',
            },
            {
              type: 'link',
              path: '/admin/support/slas',
              title: 'Service Level Agreements',
            },
          ],
        },
        {
          type: 'dropdown',
          title: 'Knowledge Base',
          icon: FileText,
          key: 'knowledge-base',
          items: [
            {
              type: 'link',
              path: '/admin/support/knowledge/articles',
              title: 'KB Articles',
            },
            {
              type: 'link',
              path: '/admin/support/knowledge/categories',
              title: 'KB Categories',
            },
            {
              type: 'link',
              path: '/admin/support/knowledge/analytics',
              title: 'KB Analytics',
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

            // {
            //   type: 'link',
            //   path: '/admin/system/permissions',
            //   title: 'Permission Groups',
            // },
            // {
            //   type: 'link',
            //   path: '/admin/system/activity',
            //   title: 'User Activity',
            // },
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
        {
          type: 'dropdown',
          title: 'Security',
          icon: LockKeyhole,
          key: 'security',
          items: [
            {
              type: 'link',
              path: '/admin/security/access-logs',
              title: 'Access Logs',
            },
            {
              type: 'link',
              path: '/admin/security/auth-settings',
              title: 'Authentication Settings',
            },
            {
              type: 'link',
              path: '/admin/security/data-protection',
              title: 'Data Protection',
            },
            {
              type: 'link',
              path: '/admin/security/vulnerability',
              title: 'Vulnerability Management',
            },
          ],
        },
        {
          type: 'link',
          path: '/admin/compliance/dashboard',
          title: 'Compliance Dashboard',
          icon: BadgeAlert,
          description: 'Regulatory compliance monitoring'
        },
      ],
    },
];

export default routes;
