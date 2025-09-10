import {
  Globe,
  UserCircle,
  Receipt,
  Wallet,
  AlertTriangle,
  ImageIcon,
  Settings,
  Users,
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
  Candy,
  ListEnd,
  List,
} from "lucide-react";

export type LinkRoute = {
  type: "link";
  path: string;
  title: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  description?: string;
};

export type DropdownItem = {
  type: "link";
  path: string;
  title: string;
};

export type DropdownRoute = {
  type: "dropdown";
  title: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  key: string;
  items: DropdownItem[];
};

export type SectionRoute = {
  type: "section";
  title: string;
  items: (LinkRoute | DropdownRoute)[];
};

export type Route = LinkRoute | DropdownRoute | SectionRoute;

const routes: Route[] = [
  {
    type: "section",
    title: "Escrow",
    items: [
      {
        type: "link",
        path: "/admin/escrow/dashboard",
        title: "Escrow Dashboard",
        icon: Shield,
        description: "Overview of all escrow operations",
      },
      {
        type: "link",
        path: "/admin/escrow/transactions/create",
        title: "Create Escrow",
        icon: FileText,
        description: "Initiate a new escrow transaction",
      },
      {
        type: "link",
        path: "/admin/escrow/subwallets",
        title: "Escrow Subwallets",
        icon: FileText,
        description: "Manage escrow subwallets",
      },
      {
        type: "link",
        path: "/admin/escrow/all-escrow-agreements",
        title: "Escrow Agreements",
        icon: FileText,
        description: "Manage all escrow agreements",
      },
      {
        type: "link",
        path: "/admin/escrow/system-escrows",
        title: "System Escrow",
        icon: FileText,
        description: "Manage all system escrow accounts",
      },
      {
        type: "dropdown",
        title: "Ledger Management",
        icon: Receipt,
        key: "escrow-transactions",
        items: [
          {
            type: "link",
            path: "/admin/escrow/ledger-accounts",
            title: "All Ledger Accounts",
          },
          {
            type: "link",
            path: "/admin/escrow/transactions",
            title: "All Transactions",
          },
          {
            type: "link",
            path: "/admin/escrow/transactions/pending",
            title: "Pending Approvals",
          },
          {
            type: "link",
            path: "/admin/escrow/transactions/create",
            title: "Create Escrow",
          },
          {
            type: "link",
            path: "/admin/escrow/refunds",
            title: "Refunds & Reversals",
          },
        ],
      },
      {
        type: "dropdown",
        title: "Dispute Resolution",
        icon: AlertTriangle,
        key: "escrow-disputes",
        items: [
          {
            type: "link",
            path: "/admin/escrow/disputes",
            title: "Active Disputes",
          },
          {
            type: "link",
            path: "/admin/escrow/disputes/escalated",
            title: "Escalated Cases",
          },
          {
            type: "link",
            path: "/admin/escrow/disputes/resolved",
            title: "Resolution History",
          },
        ],
      },
      {
        type: "dropdown",
        title: "Compliance & Security",
        icon: FileCheck,
        key: "escrow-compliance",
        items: [
          {
            type: "link",
            path: "/admin/escrow/aml",
            title: "AML/Fraud Detection",
          },
          {
            type: "link",
            path: "/admin/escrow/sar",
            title: "Suspicious Activity Reports",
          },
        ],
      },
      {
        type: "dropdown",
        title: "Analytics & Reports",
        icon: FilePieChart,
        key: "escrow-reports",
        items: [
          {
            type: "link",
            path: "/admin/escrow/reports/transactions",
            title: "Transaction Reports",
          },
          {
            type: "link",
            path: "/admin/escrow/reports/disputes",
            title: "Dispute Analytics",
          },
          {
            type: "link",
            path: "/admin/escrow/reports/revenue",
            title: "Revenue & Commissions",
          },
          {
            type: "link",
            path: "/admin/escrow/milestones",
            title: "Milestones Management",
          },
          {
            type: "link",
            path: "/admin/escrow/reports/compliance",
            title: "Compliance Reports",
          },
        ],
      },
      {
        type: "link",
        path: "/admin/escrow/settings",
        title: "Escrow Settings",
        icon: Settings,
        description: "Configure escrow parameters",
      },
    ],
  },
  {
    type: "section",
    title: "Wallet",
    items: [
      {
        type: "link",
        path: "/admin/finance/transactions",
        title: "Transactions",
        icon: Receipt,
        description: "View all financial transactions",
      },
      {
        type: "dropdown",
        title: "Wallets & Accounts",
        icon: Wallet,
        key: "wallets",
        items: [
          {
            type: "link",
            path: "/admin/finance/wallets",
            title: "Corporate Wallets",
          },
          {
            type: "link",
            path: "/admin/finance/user-wallets",
            title: "Client Accounts",
          },
          {
            type: "link",
            path: "/admin/finance/top-ups",
            title: "Deposits & Top-ups",
          },
          {
            type: "link",
            path: "/admin/finance/wallets/reversal-requests",
            title: "Reversal Requests",
          },
        ],
      },
      {
        type: "dropdown",
        title: "Payments & Banking",
        icon: CreditCardIcon,
        key: "payments",
        items: [
          {
            type: "link",
            path: "/admin/finance/fee-rules",
            title: "Fee Structures",
          },
        ],
      },
      {
        type: "dropdown",
        title: "Risk Management",
        icon: Shield,
        key: "risk-management-finance",
        items: [
          {
            type: "link",
            path: "/admin/finance/risk/aml",
            title: "AML Screening",
          },
        ],
      },
      {
        type: "dropdown",
        title: "Reports & Analytics",
        icon: FilePieChart,
        key: "finance-reports",
        items: [
          {
            type: "link",
            path: "/admin/finance/reports",
            title: "Financial Reports",
          },
        ],
      },
      {
        type: "link",
        path: "/admin/finance/compliance",
        title: "Compliance",
        icon: FileCheck,
        description: "Regulatory compliance monitoring",
      },
    ],
  },
  {
    type: "section",
    title: "Users",
    items: [
      {
        type: "link",
        path: "/admin/users/user-details",
        title: "Client Accounts",
        icon: UserCircle,
        description: "Manage individual clients",
      },
      {
        type: "link",
        path: "/admin/Group/all-group-list",
        title: "Group Accounts",
        icon: Building,
        description: "Manage group accounts",
      },
      {
        type: "link",
        path: "/admin/users/countrywise-Analysis",
        title: "Geographic Analysis",
        icon: Globe,
        description: "Client distribution by region",
      },
      {
        type: "dropdown",
        title: "Risk Management",
        icon: AlertTriangle,
        key: "risk-management",
        items: [
          {
            type: "link",
            path: "/admin/users/reported-user-list",
            title: "Flagged Individual Accounts",
          },
          {
            type: "link",
            path: "/admin/Group/all-reported-group-list",
            title: "Flagged Corporate Accounts",
          },
          {
            type: "link",
            path: "/admin/users/kyc-verification",
            title: "KYC Verification",
          },
          {
            type: "link",
            path: "/admin/users/aml-screening",
            title: "AML Screening",
          },
        ],
      },
    ],
  },
  {
    type: "section",
    title: "Customization",
    items: [
      {
        type: "dropdown",
        title: "Wallpapers & Avatars",
        icon: ImageIcon,
        key: "visual-assets",
        items: [
          {
            type: "link",
            path: "/admin/Wallpaper/list-all-wallpaper",
            title: "Wallpapers",
          },
          {
            type: "link",
            path: "/admin/Wallpaper/add-a-new-wallpaper",
            title: "Add Wallpaper",
          },
          {
            type: "link",
            path: "/admin/Avatar/list-all-avatar",
            title: "Avatars",
          },
        ],
      },
      {
        type: "dropdown",
        title: "Notifications",
        icon: Bell,
        key: "notifications",
        items: [
          {
            type: "link",
            path: "/admin/media/shorts/notifications",
            title: "All Notifications",
          },
          {
            type: "link",
            path: "/admin/media/shorts/notifications/templates",
            title: "Message Templates",
          },
          {
            type: "link",
            path: "/admin/system/notifications/broadcasts",
            title: "System Broadcasts",
          },
        ],
      },
    ],
  },
  {
    type: "section",
    title: "Support",
    items: [
      {
        type: "link",
        path: "/admin/support/dashboard",
        title: "Support Dashboard",
        icon: LifeBuoy,
        description: "Customer support overview",
      },
      {
        type: "link",
        path: "/admin/support/queued-tickets",
        title: "Queued Tickets",
        icon: List,
        description: "Manage queued support tickets",
      },
      {
        type: "link",
        path: "/admin/support/my-tickets",
        title: "My Assigned Tickets",
        icon: TicketIcon,
        description: "Tickets assigned to me",
      },
      {
        type: "link",
        path: "/admin/support/tickets",
        title: "Support Tickets",
        icon: TicketIcon,
        description: "Manage customer inquiries",
      },
      {
        type: "link",
        path: "/admin/support/sla",
        title: "SLA Management",
        icon: UsersIcon,
        description: "Service Level Agreements",
      },
      {
        type: "link",
        path: "/admin/support/categories",
        title: "Categories",
        icon: Building,
        description: "Categories for support tickets",
      },
      {
        type: "link",
        path: "/admin/support/canned-responses",
        title: "Canned responses",
        icon: Candy,
        description: "Canned responses for support tickets",
      },
      {
        type: "link",
        path: "/admin/support/faqs",
        title: "FAQs",
        icon: Candy,
        description: "FAQs ",
      },
      {
        type: "link",
        path: "/admin/support/reports",
        title: "Reports",
        icon: Candy,
        description: "Reports & stats",
      },
    ],
  },
  {
    type: "section",
    title: "Administration",
    items: [
      {
        type: "dropdown",
        title: "User Management",
        icon: Users,
        key: "user-mgmt",
        items: [
          {
            type: "link",
            path: "/admin/system/users",
            title: "Staff Accounts",
          },
          {
            type: "link",
            path: "/admin/system/roles",
            title: "Access Control",
          },
        ],
      },
      {
        type: "link",
        path: "/admin/settings",
        title: "System Settings",
        icon: Settings,
        description: "Configure platform settings",
      },
      {
        type: "link",
        path: "/admin/logs",
        title: "Audit Logs",
        icon: FileText,
        description: "System activity monitoring",
      },
    ],
  },
  {
    type: "section",
    title: "Fundraising",
    items: [
      {
        type: "link",
        path: "/admin/fundraising/dashboard",
        title: "Dashboard",
        icon: Building,
        description: "Overview of all fundraising campaigns",
      },
      {
        type: "link",
        path: "/admin/fundraising/campaigns",
        title: "All Campaigns",
        icon: FileText,
        description: "View all fundraising campaigns",
      },
      {
        type: "link",
        path: "/admin/fundraising/campaigns/queued",
        title: "Queued Campaigns",
        icon: ListEnd,
        description: "View all queued campaigns",
      },
      {
        type: "dropdown",
        title: "Transactions",
        icon: Receipt,
        key: "fundraising-transactions",
        items: [
          {
            type: "link",
            path: "/admin/fundraising/contributions",
            title: "Contributions",
          },
          {
            type: "link",
            path: "/admin/fundraising/withdrawals",
            title: "Withdrawal Requests",
          },
          {
            type: "link",
            path: "/admin/fundraising/approve-withdrawals",
            title: "Approve Withdrawals",
          },
        ],
      },
      {
        type: "link",
        path: "/admin/fundraising/settings",
        title: "Campaign Settings",
        icon: Settings,
        description: "Configure fundraising parameters",
      },
    ],
  },
];

export default routes;
