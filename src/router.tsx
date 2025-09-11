import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import React, { Suspense, lazy, useEffect } from "react";

import AdminLayout from "./components/layout/AdminLayout";
import Cookies from "js-cookie";
import { PATHS } from "./constants/paths";
import { PermissionMap } from "./utils/permissions";
import PermissionRouteGuard from "./components/PermissionGuard";

type RouteConfig = {
  path: string;
  element: React.LazyExoticComponent<React.ComponentType<any>>;
  permissions?: string[];
  children?: RouteConfig[];
};

const AuthModule = {
  Login: lazy(() => import("./app/auth/login/page")),
  VerifyOtp: lazy(() => import("./app/auth/verify/page")),
  ForgotPassword: lazy(() => import("./app/auth/forgot-password/page")),
  Reset: lazy(() => import("./app/auth/forgot-password/reset")),
  Set: lazy(() => import("./app/auth/password/page")),
};

const CoreModule = {
  Dashboard: lazy(() => import("./app/dashboard/page")),
  ErrorPage: lazy(() => import("./app/error/error-page")),
  UnauthorizedPage: lazy(() => import("./app/error/unauthorized-page")),
  UserProfile: lazy(() => import("./app/auth/profile/page")),
};

const UserModule = {
  UserDetails: lazy(() => import("./app/admin/users/user-details/page")),
  Userdetail: lazy(() => import("./app/admin/users/user-details/userdetail")),
  CountrywiseUsers: lazy(
    () => import("./app/admin/users/countrywise-Analysis/page")
  ),
  ReportedUsers: lazy(
    () => import("./app/admin/users/reported-user-list/page")
  ),
  CountryDetailPage: lazy(
    () => import("./app/admin/users/countrywise-Analysis/CountryDetailPage")
  ),
};

const GroupModule = {
  GroupList: lazy(() => import("./app/admin/Group/all-group-list/page")),
  GroupDetailPage: lazy(
    () => import("./app/admin/Group/all-group-list/groupdetail")
  ),
  ReportedGroups: lazy(
    () => import("./app/admin/Group/all-reported-group-list/page")
  ),
};

const RoleModule = {
  RolesPage: lazy(() => import("./app/admin/roles/roles")),
  RoleDetail: lazy(() => import("./app/admin/roles/roledetail")),
  CreateRole: lazy(() => import("./app/admin/roles/createrole")),
  EditRole: lazy(() => import("./app/admin/roles/editrole")),
  SystemUsers: lazy(() => import("./app/admin/roles/user-settings")),
  AdminUserDetails: lazy(() => import("./app/admin/roles/userdetail")),
};

const ForexModule = {
  ForexDashboard: lazy(() => import("./app/admin/finance/forex/dashboard")),
  Currencies: lazy(
    () => import("./app/admin/finance/forex/currency-management")
  ),
  CurrencyPairs: lazy(() => import("./app/admin/finance/forex/currency-pair")),
  ExchangeRates: lazy(
    () => import("./app/admin/finance/forex/exchange-rate-viewer")
  ),
  UserAlerts: lazy(() => import("./app/admin/finance/forex/user-alerts")),
  ForexSettings: lazy(() => import("./app/admin/finance/forex/settings")),
};

const FinanceModule = {
  Transactions: lazy(() => import("./app/admin/finance/transactions/page")),
  Receipt: lazy(() => import("./app/admin/finance/transactions/receipt")),
  Tarrifs: lazy(() => import("./app/admin/finance/tariffs/page")),
  EditTariff: lazy(() => import("./app/admin/finance/tariffs/edittariff")),
  AddTarrif: lazy(() => import("./app/admin/finance/tariffs/addtariff")),
  Limits: lazy(() => import("./app/admin/finance/limits/page")),
  AddLimit: lazy(() => import("./app/admin/finance/limits/addkyc")),
  EditLimit: lazy(() => import("./app/admin/finance/limits/editkyc")),
  Compliance: lazy(
    () => import("./app/admin/finance/system-wallets/amlcompliance")
  ),
  ViewRule: lazy(() => import("./app/admin/finance/system-wallets/view-rule")),
  Verification: lazy(() => import("./app/admin/finance/limits/verification")),
  Wallets: lazy(() => import("./app/admin/finance/system-wallets/page")),
  ReversalRequests: lazy(
    () => import("./app/admin/finance/system-wallets/reversalrequests")
  ),
  ReversalRequestDetails: lazy(
    () => import("./app/admin/finance/system-wallets/reversal-detail")
  ),
  Banks: lazy(() => import("./app/admin/finance/banks/page")),
  UserWallets: lazy(() => import("./app/admin/finance/user-wallets/page")),
  WalletDetail: lazy(
    () => import("./app/admin/finance/user-wallets/walletdetail")
  ),
  Withdrawals: lazy(() => import("./app/admin/finance/withdrawals/page")),
  TopUps: lazy(() => import("./app/admin/finance/top-ups/page")),
  PaymentMethods: lazy(
    () => import("./app/admin/finance/payment-methods/page")
  ),
  FinancialReports: lazy(() => import("./app/admin/finance/reports/page")),
  GiftHistory: lazy(() => import("./app/admin/finance/gift-history/page")),
  KYCLimits: lazy(() => import("./app/admin/finance/limits/page")),
  AddKYCLimit: lazy(() => import("./app/admin/finance/limits/addkyc")),
  EditKYCLimit: lazy(() => import("./app/admin/finance/limits/editkyc")),
};

const MediaModule = {
  WallpaperList: lazy(
    () => import("./app/admin/Wallpaper/list-all-wallpaper/page")
  ),
  AddWallpaper: lazy(
    () => import("./app/admin/Wallpaper/add-a-new-wallpaper/page")
  ),
  AvatarList: lazy(() => import("./app/admin/Avatar/list-all-avatar/page")),
  AddAvatar: lazy(() => import("./app/admin/Avatar/add-a-new-avatar/page")),

  GeneralSettings: lazy(() => import("./app/admin/Settings/page")),
  Emoji: lazy(() => import("./app/admin/Settings/emoji")),
  Languages: lazy(() => import("./app/admin/languages/all-languages/page")),
  Translations: lazy(
    () => import("./app/admin/languages/all-languages/details")
  ),

  AddGift: lazy(() => import("./app/admin/Gift/add-new-gift/page")),
  GiftList: lazy(() => import("./app/admin/Gift/gift-list/page")),
  GiftCategories: lazy(() => import("./app/admin/Gift/gift-categories/page")),
  NotificationsPage: lazy(
    () => import("./app/admin/notification/notifications")
  ),
  Broadcasts: lazy(() => import("./app/admin/notification/broadcast")),
  AddBroadcast: lazy(() => import("./app/admin/notification/addbroadcast")),
  EditBroadcast: lazy(() => import("./app/admin/notification/editbroadcast")),
};

const SupportAuditModule = {
  TicketDashboard: lazy(() => import("./app/admin/support/ticketdashboard")),
  Tickets: lazy(() => import("./app/admin/support/tickets")),
  QueuedTickets: lazy(() => import("./app/admin/support/queuedtickets")),
  NewTicket: lazy(() => import("./app/admin/support/newticket")),
  TicketDetail: lazy(() => import("./app/admin/support/ticketdetail")),
  SLAList: lazy(() => import("./app/admin/support/sla")),
  SLADetail: lazy(() => import("./app/admin/support/sladetail")),
  SLAEdit: lazy(() => import("./app/admin/support/slaedit")),
  SLACreate: lazy(() => import("./app/admin/support/slacreate")),
  Categories: lazy(() => import("./app/admin/support/categories")),
  CategoryCreate: lazy(() => import("./app/admin/support/categorycreate")),
  CannedResponses: lazy(() => import("./app/admin/support/cannedresponse")),
  CreateCannedResponse: lazy(
    () => import("./app/admin/support/cannedresponseaddedit")
  ),
  ResponseDetail: lazy(
    () => import("./app/admin/support/cannedresponsedetail")
  ),
  Agents: lazy(() => import("./app/admin/support/agents")),
  CreateAgent: lazy(() => import("./app/admin/support/createagent")),
  FAQs: lazy(() => import("./app/admin/support/faq")),
  FAQCreate: lazy(() => import("./app/admin/support/faqcreate")),
  FAQDetail: lazy(() => import("./app/admin/support/faqdetail")),
  SupportReports: lazy(() => import("./app/admin/support/reports")),

  QueueConfig: lazy(() => import("./app/admin/support/queueconfig")),
  AvailableQueue: lazy(() => import("./app/admin/support/availabletickets")),
  MyAssignedTickets: lazy(() => import("./app/admin/support/mytickets")),

  Logs: lazy(() => import("./app/admin/audits/page")),
  AuditDetails: lazy(() => import("./app/admin/audits/auditdetails")),
};

const EscrowModule = {
  EscrowDashboard: lazy(() => import("./app/admin/escrow/dashboard")),
  AccountsDashboard: lazy(() => import("./app/admin/escrow/accountsdashboard")),
  EscrowList: lazy(() => import("./app/admin/escrow/escrowlist")),
  EscrowDetail: lazy(() => import("./app/admin/escrow/escrowdetail")),
  LedgerAccounts: lazy(() => import("./app/admin/escrow/ledgeraccounts")),
  LedgerAccountDetail: lazy(
    () => import("./app/admin/escrow/ledgeraccountdetail")
  ),
  Subwallets: lazy(() => import("./app/admin/escrow/subwallets")),
  SubwalletDetail: lazy(() => import("./app/admin/escrow/subwalletdetail")),
  FundraiserSubwalletDetail: lazy(
    () => import("./app/admin/escrow/fundraiserescrowdetail")
  ),
  CreateSubwallet: lazy(() => import("./app/admin/escrow/createsubwallet")),
  SystemEscrows: lazy(() => import("./app/admin/escrow/systemescrows")),
  MasterEscrows: lazy(() => import("./app/admin/escrow/masterescrows")),
  SystemEscrowDetail: lazy(
    () => import("./app/admin/escrow/systemescrowdetail")
  ),
  EscrowTransactions: lazy(() => import("./app/admin/escrow/transactions")),
  EscrowPendingTransactions: lazy(
    () => import("./app/admin/escrow/pendingapprovals")
  ),
  EscrowRefunds: lazy(() => import("./app/admin/escrow/refundsandreversals")),
  EscrowCreate: lazy(() => import("./app/admin/escrow/createescrow")),
  EscrowDisputes: lazy(() => import("./app/admin/escrow/activedisputes")),
  EscrowDisputeDetail: lazy(() => import("./app/admin/escrow/disputedetail")),
  EscrowEscalatedDisputes: lazy(
    () => import("./app/admin/escrow/escalateddisputes")
  ),
  EscrowResolvedDisputes: lazy(
    () => import("./app/admin/escrow/resolutionhistory")
  ),
  EscrowAML: lazy(() => import("./app/admin/escrow/amlfraud")),
  TransactionReports: lazy(
    () => import("./app/admin/escrow/reports/transactionreports")
  ),
  DisputeReports: lazy(
    () => import("./app/admin/escrow/reports/disputeanalytics")
  ),
  RevenueReports: lazy(
    () => import("./app/admin/escrow/reports/revenueandcommisions")
  ),
  ComplianceReports: lazy(
    () => import("./app/admin/escrow/reports/compliancereport")
  ),
  EscrowSettings: lazy(() => import("./app/admin/escrow/settings")),
  EscrowMilestones: lazy(() => import("./app/admin/escrow/milestones")),
};

const fundraisingModule = {
  FundraisingDashboard: lazy(() => import("./app/admin/fundraiser/dashboard")),
  FundraisingCampaigns: lazy(() => import("./app/admin/fundraiser/campaigns")),
  QueuedCampaigns: lazy(() => import("./app/admin/fundraiser/Queued")),
  FundraisingWithdrawals: lazy(
    () => import("./app/admin/fundraiser/withdrawals")
  ),
  FundraisingWithdrawalDetail: lazy(
    () => import("./app/admin/fundraiser/withdrawaldetail")
  ),
  FundraisingContributions: lazy(
    () => import("./app/admin/fundraiser/transactions")
  ),
  FundraisingRefunds: lazy(() => import("./app/admin/fundraiser/refunds")),
  FundraisingSettings: lazy(() => import("./app/admin/fundraiser/settings")),
  FundraisingReports: lazy(() => import("./app/admin/fundraiser/reports")),
  FundraisingMetrics: lazy(() => import("./app/admin/fundraiser/metrics")),
  CampaignDetail: lazy(() => import("./app/admin/fundraiser/campaigndetail")),
  DonorInsights: lazy(() => import("./app/admin/fundraiser/donorinsights")),
};

const LoadingFallback = () => {
  const [isLongLoad, setIsLongLoad] = React.useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLongLoad(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
      {isLongLoad && (
        <p className="text-gray-500">This is taking longer than expected...</p>
      )}
    </div>
  );
};

class RouteErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Route loading error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  const authToken = localStorage.getItem("authToken");
  const isAuthenticated = !!authToken;

  useEffect(() => {
    if (isAuthenticated) {
      try {
      } catch (error) {
        console.error("Auth token validation failed:", error);
        Cookies.remove("authToken");
      }
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <Navigate to={PATHS.AUTH.LOGIN} state={{ from: location }} replace />
    );
  }

  return <>{children}</>;
};

const renderRoutes = (routes: RouteConfig[]) => {
  return routes.map((route) => (
    <Route
      key={route.path}
      path={route.path}
      element={
        route.permissions ? (
          <PermissionRouteGuard permissions={route.permissions}>
            {<route.element />}
          </PermissionRouteGuard>
        ) : (
          <route.element />
        )
      }
    >
      {route.children && renderRoutes(route.children)}
    </Route>
  ));
};

const authRoutes = [
  { path: PATHS.AUTH.LOGIN, element: AuthModule.Login },
  { path: PATHS.AUTH.VERIFY_OTP, element: AuthModule.VerifyOtp },
  { path: PATHS.AUTH.FORGOT_PASSWORD, element: AuthModule.ForgotPassword },
  { path: PATHS.AUTH.RESET_PASSWORD, element: AuthModule.Reset },
  { path: PATHS.AUTH.SET_PASSWORD, element: AuthModule.Set },
  { path: PATHS.ERROR.UNAUTHORIZED, element: CoreModule.UnauthorizedPage },
];

const userRoutes = [
  { path: PATHS.ADMIN.PROFILE, element: CoreModule.UserProfile },
  {
    path: PATHS.ADMIN.USERS.DETAILS,
    element: UserModule.UserDetails,
    permissions: PermissionMap.Users.view,
  },
  {
    path: PATHS.ADMIN.USERS.DETAIL,
    element: UserModule.Userdetail,
    permissions: PermissionMap.Users.view,
  },
  {
    path: PATHS.ADMIN.USERS.COUNTRY_ANALYSIS,
    element: UserModule.CountrywiseUsers,
    permissions: PermissionMap.Users.view,
  },
  {
    path: PATHS.ADMIN.USERS.COUNTRY_DETAIL,
    element: UserModule.CountryDetailPage,
    permissions: PermissionMap.Users.view,
  },
  {
    path: PATHS.ADMIN.USERS.REPORTED,
    element: UserModule.ReportedUsers,
    permissions: PermissionMap.ViewReported,
  },
];

const groupRoutes = [
  {
    path: PATHS.ADMIN.GROUPS.LIST,
    element: GroupModule.GroupList,
    permissions: PermissionMap.Groups.view,
  },
  {
    path: PATHS.ADMIN.GROUPS.DETAIL,
    element: GroupModule.GroupDetailPage,
    permissions: PermissionMap.Groups.view,
  },
  {
    path: PATHS.ADMIN.GROUPS.REPORTED,
    element: GroupModule.ReportedGroups,
    permissions: PermissionMap.ViewReported,
  },
];

const roleRoutes = [
  {
    path: PATHS.ADMIN.SYSTEM.ROLES.LIST,
    element: RoleModule.RolesPage,
    permissions: PermissionMap.Roles.view,
  },
  {
    path: PATHS.ADMIN.SYSTEM.ROLES.DETAIL,
    element: RoleModule.RoleDetail,
    permissions: PermissionMap.Roles.view,
  },
  {
    path: PATHS.ADMIN.SYSTEM.ROLES.CREATE,
    element: RoleModule.CreateRole,
    permissions: PermissionMap.Roles.create,
  },
  {
    path: PATHS.ADMIN.SYSTEM.ROLES.EDIT,
    element: RoleModule.EditRole,
    permissions: PermissionMap.Roles.update,
  },
  {
    path: PATHS.ADMIN.SYSTEM.USERS,
    element: RoleModule.SystemUsers,
    permissions: PermissionMap.Users.viewStaff,
  },
  {
    path: PATHS.ADMIN.USERS.STAFF_DETAIL,
    element: RoleModule.AdminUserDetails,
    permissions: PermissionMap.Users.viewStaff,
  },
];

const escrowRoutes = [
  {
    path: PATHS.ADMIN.ESCROW.DASHBOARD,
    element: EscrowModule.EscrowDashboard,
    // permissions: PermissionMap.Escrow.view,
  },
  {
    path: PATHS.ADMIN.ESCROW.ESCROW_ACCOUNTS_DASHBOARD,
    element: EscrowModule.AccountsDashboard,
    // permissions: PermissionMap.Escrow.view,
  },
  {
    path: PATHS.ADMIN.ESCROW.ALL,
    element: EscrowModule.EscrowList,
    // permissions: PermissionMap.Escrow.view,
  },
  {
    path: PATHS.ADMIN.ESCROW.ESCROW_DETAIL,
    element: EscrowModule.EscrowDetail,
    // permissions: PermissionMap.Escrow.view,
  },
  {
    path: PATHS.ADMIN.ESCROW.LEDGER_ACCOUNTS,
    element: EscrowModule.LedgerAccounts,
    // permissions: PermissionMap.Escrow.view,
  },
  {
    path: PATHS.ADMIN.ESCROW.LEDGER_ACCOUNT_DETAIL,
    element: EscrowModule.LedgerAccountDetail,
    // permissions: PermissionMap.Escrow.view,
  },
  {
    path: PATHS.ADMIN.ESCROW.SUB_WALLETS,
    element: EscrowModule.Subwallets,
    // permissions: PermissionMap.Escrow.view,
  },
  {
    path: PATHS.ADMIN.ESCROW.SUB_WALLET_DETAIL,
    element: EscrowModule.SubwalletDetail,
    // permissions: PermissionMap.Escrow.view,
  },
  {
    path: PATHS.ADMIN.ESCROW.FUNDRAISER_SUB_WALLET_DETAIL,
    element: EscrowModule.FundraiserSubwalletDetail,
    // permissions: PermissionMap.Escrow.view,
  },
  {
    path: PATHS.ADMIN.ESCROW.CREATE_SUB_WALLET,
    element: EscrowModule.CreateSubwallet,
    // permissions: PermissionMap.Escrow.view,
  },
  {
    path: PATHS.ADMIN.ESCROW.SYSTEM_ESCROWS,
    element: EscrowModule.SystemEscrows,
    // permissions: PermissionMap.Escrow.view,
  },
  {
    path: PATHS.ADMIN.ESCROW.MASTER_ESCROWS,
    element: EscrowModule.MasterEscrows,
    // permissions: PermissionMap.Escrow.view,
  },
  {
    path: PATHS.ADMIN.ESCROW.SYSTEM_ESCROW_DETAIL,
    element: EscrowModule.SystemEscrowDetail,
    // permissions: PermissionMap.Escrow.view,
  },
  {
    path: PATHS.ADMIN.ESCROW.TRANSACTIONS,
    element: EscrowModule.EscrowTransactions,
    // permissions: PermissionMap.Escrow.view,
  },
  {
    path: PATHS.ADMIN.ESCROW.PENDING,
    element: EscrowModule.EscrowPendingTransactions,
    // permissions: PermissionMap.Escrow.view,
  },
  {
    path: PATHS.ADMIN.ESCROW.REFUNDS,
    element: EscrowModule.EscrowRefunds,
    // permissions: PermissionMap.Escrow.view,
  },
  {
    path: PATHS.ADMIN.ESCROW.CREATE_ESCROW,
    element: EscrowModule.EscrowCreate,
    // permissions: PermissionMap.Escrow.view,
  },
  {
    path: PATHS.ADMIN.ESCROW.DISPUTES,
    element: EscrowModule.EscrowDisputes,
    // permissions: PermissionMap.Escrow.view,
  },
  {
    path: PATHS.ADMIN.ESCROW.ESCALATED_DISPUTES,
    element: EscrowModule.EscrowEscalatedDisputes,
    // permissions: PermissionMap.Escrow.view,
  },
  {
    path: PATHS.ADMIN.ESCROW.DISPUTE_DETAIL,
    element: EscrowModule.EscrowDisputeDetail,
    // permissions: PermissionMap.Escrow.view,
  },
  {
    path: PATHS.ADMIN.ESCROW.RESOLVED_DISPUTES,
    element: EscrowModule.EscrowResolvedDisputes,
    // permissions: PermissionMap.Escrow.view,
  },
  {
    path: PATHS.ADMIN.ESCROW.AML_FRAUD,
    element: EscrowModule.EscrowAML,
    // permissions: PermissionMap.Escrow.view,
  },
  {
    path: PATHS.ADMIN.ESCROW.TRANSACTION_REPORTS,
    element: EscrowModule.TransactionReports,
    // permissions: PermissionMap.Escrow.view,
  },
  {
    path: PATHS.ADMIN.ESCROW.DISPUTE_REPORTS,
    element: EscrowModule.DisputeReports,
    // permissions: PermissionMap.Escrow.view,
  },
  {
    path: PATHS.ADMIN.ESCROW.REVENUE_REPORTS,
    element: EscrowModule.RevenueReports,
    // permissions: PermissionMap.Escrow.view,
  },
  {
    path: PATHS.ADMIN.ESCROW.COMPLIANCE_REPORTS,
    element: EscrowModule.ComplianceReports,
    // permissions: PermissionMap.Escrow.view,
  },
  {
    path: PATHS.ADMIN.ESCROW.SETTINGS,
    element: EscrowModule.EscrowSettings,
    // permissions: PermissionMap.Escrow.view,
  },
  {
    path: PATHS.ADMIN.ESCROW.MILESTONES,
    element: EscrowModule.EscrowMilestones,
    // permissions: PermissionMap.Escrow.view,
  },
];

const forexRoutes = [
  {
    path: PATHS.ADMIN.FINANCE.FOREX.DASHBOARD,
    element: ForexModule.ForexDashboard,
    permissions: PermissionMap.Transactions.view,
  },
  {
    path: PATHS.ADMIN.FINANCE.FOREX.CURRENCIES,
    element: ForexModule.Currencies,
    permissions: PermissionMap.Transactions.view,
  },
  {
    path: PATHS.ADMIN.FINANCE.FOREX.CURRENCY_PAIRS,
    element: ForexModule.CurrencyPairs,
    permissions: PermissionMap.Transactions.view,
  },
  {
    path: PATHS.ADMIN.FINANCE.FOREX.EXCHANGE_RATES,
    element: ForexModule.ExchangeRates,
    permissions: PermissionMap.Transactions.view,
  },
  {
    path: PATHS.ADMIN.FINANCE.FOREX.ALERTS,
    element: ForexModule.UserAlerts,
    permissions: PermissionMap.Transactions.view,
  },
  {
    path: PATHS.ADMIN.FINANCE.FOREX.SETTINGS,
    element: ForexModule.ForexSettings,
    permissions: PermissionMap.Transactions.view,
  },
];

const financeRoutes = [
  {
    path: PATHS.ADMIN.FINANCE.TRANSACTIONS.LIST,
    element: FinanceModule.Transactions,
    permissions: PermissionMap.Transactions.view,
  },
  {
    path: PATHS.ADMIN.FINANCE.TRANSACTIONS.RECEIPT,
    element: FinanceModule.Receipt,
    permissions: PermissionMap.Transactions.view,
  },
  {
    path: PATHS.ADMIN.FINANCE.FEE_RULES.LIST,
    element: FinanceModule.Tarrifs,
    permissions: PermissionMap.Settings.view,
  },
  {
    path: PATHS.ADMIN.FINANCE.FEE_RULES.EDIT,
    element: FinanceModule.EditTariff,
    permissions: PermissionMap.Settings.view,
  },
  {
    path: PATHS.ADMIN.FINANCE.FEE_RULES.ADD,
    element: FinanceModule.AddTarrif,
    permissions: PermissionMap.Settings.view,
  },
  {
    path: PATHS.ADMIN.FINANCE.LIMITS.LIST,
    element: FinanceModule.Limits,
    permissions: PermissionMap.Settings.view,
  },
  {
    path: PATHS.ADMIN.FINANCE.LIMITS.ADD,
    element: FinanceModule.AddLimit,
    permissions: PermissionMap.Settings.view,
  },
  {
    path: PATHS.ADMIN.FINANCE.LIMITS.EDIT,
    element: FinanceModule.EditLimit,
    permissions: PermissionMap.Settings.view,
  },
  {
    path: PATHS.ADMIN.FINANCE.COMPLIANCE.LIST,
    element: FinanceModule.Compliance,
    permissions: PermissionMap.Settings.view,
  },
  {
    path: PATHS.ADMIN.FINANCE.COMPLIANCE.RULE,
    element: FinanceModule.ViewRule,
    permissions: PermissionMap.Settings.view,
  },
  {
    path: PATHS.ADMIN.FINANCE.LIMITS.VERIFICATION,
    element: FinanceModule.Verification,
    permissions: PermissionMap.Settings.view,
  },
  {
    path: PATHS.ADMIN.FINANCE.WALLETS.SYSTEM,
    element: FinanceModule.Wallets,
    permissions: PermissionMap.Wallets.view,
  },
  {
    path: PATHS.ADMIN.FINANCE.WALLETS.REVERSAL_REQUESTS,
    element: FinanceModule.ReversalRequests,
    permissions: PermissionMap.Wallets.view,
  },
  {
    path: PATHS.ADMIN.FINANCE.WALLETS.REVERSAL_DETAIL,
    element: FinanceModule.ReversalRequestDetails,
    permissions: PermissionMap.Wallets.view,
  },
  {
    path: PATHS.ADMIN.FINANCE.BANKS,
    element: FinanceModule.Banks,
    permissions: PermissionMap.Settings.view,
  },
  {
    path: PATHS.ADMIN.FINANCE.WALLETS.USER,
    element: FinanceModule.UserWallets,
    permissions: PermissionMap.Wallets.view,
  },
  {
    path: PATHS.ADMIN.FINANCE.WALLETS.USER_DETAIL,
    element: FinanceModule.WalletDetail,
    permissions: PermissionMap.Wallets.view,
  },
  {
    path: PATHS.ADMIN.FINANCE.WITHDRAWALS,
    element: FinanceModule.Withdrawals,
    permissions: PermissionMap.Transactions.view,
  },
  {
    path: PATHS.ADMIN.FINANCE.TOP_UPS,
    element: FinanceModule.TopUps,
    permissions: PermissionMap.Transactions.view,
  },
  {
    path: PATHS.ADMIN.FINANCE.PAYMENT_METHODS,
    element: FinanceModule.PaymentMethods,
    permissions: PermissionMap.Settings.view,
  },
  {
    path: PATHS.ADMIN.FINANCE.REPORTS,
    element: FinanceModule.FinancialReports,
    permissions: PermissionMap.Finance,
  },
  {
    path: PATHS.ADMIN.FINANCE.GIFT_HISTORY,
    element: FinanceModule.GiftHistory,
    permissions: PermissionMap.Transactions.view,
  },
  {
    path: PATHS.ADMIN.FINANCE.LIMITS.KYC_LIMITS,
    element: FinanceModule.KYCLimits,
    permissions: PermissionMap.Transactions.view,
  },
];

const mediaRoutes = [
  {
    path: PATHS.ADMIN.WALLPAPER.LIST,
    element: MediaModule.WallpaperList,
    permissions: PermissionMap.Media.view,
  },
  {
    path: PATHS.ADMIN.WALLPAPER.ADD,
    element: MediaModule.AddWallpaper,
    permissions: PermissionMap.Media.create,
  },

  {
    path: PATHS.ADMIN.AVATAR.LIST,
    element: MediaModule.AvatarList,
    permissions: PermissionMap.Media.view,
  },
  {
    path: PATHS.ADMIN.AVATAR.ADD,
    element: MediaModule.AddAvatar,
    permissions: PermissionMap.Media.create,
  },

  {
    path: PATHS.ADMIN.SETTINGS.GENERAL,
    element: MediaModule.GeneralSettings,
    permissions: PermissionMap.Settings.view,
  },
  {
    path: PATHS.ADMIN.SETTINGS.EMOJI,
    element: MediaModule.Emoji,
    permissions: PermissionMap.Settings.view,
  },
  {
    path: PATHS.ADMIN.SETTINGS.LANGUAGES.LIST,
    element: MediaModule.Languages,
    permissions: PermissionMap.Languages.view,
  },
  {
    path: PATHS.ADMIN.SETTINGS.LANGUAGES.TRANSLATIONS,
    element: MediaModule.Translations,
    permissions: PermissionMap.Languages.view,
  },

  {
    path: PATHS.ADMIN.GIFTS.LIST,
    element: MediaModule.GiftList,
    permissions: PermissionMap.Media.view,
  },
  {
    path: PATHS.ADMIN.GIFTS.ADD,
    element: MediaModule.AddGift,
    permissions: PermissionMap.Media.create,
  },
  {
    path: PATHS.ADMIN.GIFTS.CATEGORIES,
    element: MediaModule.GiftCategories,
    permissions: PermissionMap.Media.view,
  },

  {
    path: PATHS.ADMIN.MEDIA.SHORTS.NOTIFICATIONS,
    element: MediaModule.NotificationsPage,
    permissions: PermissionMap.Media.view,
  },
  {
    path: PATHS.ADMIN.MEDIA.SHORTS.NOTIFICATIONS_TEMPLATES,
    element: MediaModule.NotificationsPage,
    permissions: PermissionMap.Media.view,
  },

  {
    path: PATHS.ADMIN.SYSTEM.NOTIFICATIONS.BROADCASTS,
    element: MediaModule.Broadcasts,
    permissions: PermissionMap.Settings.view,
  },
  {
    path: PATHS.ADMIN.COMMUNICATION.BROADCASTS.ADD,
    element: MediaModule.AddBroadcast,
    permissions: PermissionMap.Settings.view,
  },
  {
    path: PATHS.ADMIN.COMMUNICATION.BROADCASTS.EDIT,
    element: MediaModule.EditBroadcast,
    permissions: PermissionMap.Settings.view,
  },
];

const supportAuditRoutes = [
  {
    path: PATHS.ADMIN.SUPPORT.DASHBOARD,
    element: SupportAuditModule.TicketDashboard,
  },
  { path: PATHS.ADMIN.SUPPORT.TICKETS, element: SupportAuditModule.Tickets },
  {
    path: PATHS.ADMIN.SUPPORT.QUEUED_TICKETS,
    element: SupportAuditModule.QueuedTickets,
  },
  {
    path: PATHS.ADMIN.SUPPORT.NEW_TICKET,
    element: SupportAuditModule.NewTicket,
  },
  {
    path: PATHS.ADMIN.SUPPORT.TICKET_DETAIL,
    element: SupportAuditModule.TicketDetail,
  },
  { path: PATHS.ADMIN.SUPPORT.SLA_LIST, element: SupportAuditModule.SLAList },
  {
    path: PATHS.ADMIN.SUPPORT.SLA_DETAIL,
    element: SupportAuditModule.SLADetail,
  },
  { path: PATHS.ADMIN.SUPPORT.SLA_EDIT, element: SupportAuditModule.SLAEdit },
  {
    path: PATHS.ADMIN.SUPPORT.SLA_CREATE,
    element: SupportAuditModule.SLACreate,
  },
  {
    path: PATHS.ADMIN.SUPPORT.CATEGORIES,
    element: SupportAuditModule.Categories,
  },
  {
    path: PATHS.ADMIN.SUPPORT.CATEGORY_CREATE,
    element: SupportAuditModule.CategoryCreate,
  },
  {
    path: PATHS.ADMIN.SUPPORT.CANNED_RESPONSES,
    element: SupportAuditModule.CannedResponses,
  },
  {
    path: PATHS.ADMIN.SUPPORT.CANNED_RESPONSE_CREATE,
    element: SupportAuditModule.CreateCannedResponse,
  },
  {
    path: PATHS.ADMIN.SUPPORT.CANNED_RESPONSE_DETAIL,
    element: SupportAuditModule.ResponseDetail,
  },
  {
    path: PATHS.ADMIN.SUPPORT.AGENTS,
    element: SupportAuditModule.Agents,
  },
  {
    path: PATHS.ADMIN.SUPPORT.AGENT_CREATE,
    element: SupportAuditModule.CreateAgent,
  },
  { path: PATHS.ADMIN.SUPPORT.FAQS, element: SupportAuditModule.FAQs },
  {
    path: PATHS.ADMIN.SUPPORT.FAQ_CREATE,
    element: SupportAuditModule.FAQCreate,
  },
  {
    path: PATHS.ADMIN.SUPPORT.FAQ_DETAIL,
    element: SupportAuditModule.FAQDetail,
  },
  { path: PATHS.ADMIN.SUPPORT.FAQ_EDIT, element: SupportAuditModule.FAQCreate },
  {
    path: PATHS.ADMIN.SUPPORT.REPORTS,
    element: SupportAuditModule.SupportReports,
  },
  {
    path: PATHS.ADMIN.SUPPORT.QUEUE_CONFIG,
    element: SupportAuditModule.QueueConfig,
  },
  {
    path: PATHS.ADMIN.SUPPORT.AVAILABLE_QUEUE,
    element: SupportAuditModule.AvailableQueue,
  },
  {
    path: PATHS.ADMIN.SUPPORT.MY_ASSIGNED_TICKETS,
    element: SupportAuditModule.MyAssignedTickets,
  },
  {
    path: PATHS.ADMIN.AUDITS.LOGS,
    element: SupportAuditModule.Logs,
    permissions: PermissionMap.Admin,
  },
  {
    path: PATHS.ADMIN.AUDITS.DETAILS,
    element: SupportAuditModule.AuditDetails,
    permissions: PermissionMap.Admin,
  },
];

const fundraisingRoutes = [
  {
    path: PATHS.ADMIN.FUNDRAISING.DASHBOARD,
    element: fundraisingModule.FundraisingDashboard,
  },
  {
    path: PATHS.ADMIN.FUNDRAISING.CAMPAIGNS,
    element: fundraisingModule.FundraisingCampaigns,
  },
  {
    path: PATHS.ADMIN.FUNDRAISING.QUEUED,
    element: fundraisingModule.QueuedCampaigns,
  },
  {
    path: PATHS.ADMIN.FUNDRAISING.CAMPAIGN_DETAIL,
    element: fundraisingModule.CampaignDetail,
  },
  {
    path: PATHS.ADMIN.FUNDRAISING.WITHDRAWALS,
    element: fundraisingModule.FundraisingWithdrawals,
  },
  {
    path: PATHS.ADMIN.FUNDRAISING.WITHDRAWAL_DETAIL,
    element: fundraisingModule.FundraisingWithdrawalDetail,
  },
  {
    path: PATHS.ADMIN.FUNDRAISING.CONTRIBUTIONS,
    element: fundraisingModule.FundraisingContributions,
  },
  {
    path: PATHS.ADMIN.FUNDRAISING.REFUNDS,
    element: fundraisingModule.FundraisingRefunds,
  },
  {
    path: PATHS.ADMIN.FUNDRAISING.DONOR_INSIGHTS,
    element: fundraisingModule.DonorInsights,
  },
  {
    path: PATHS.ADMIN.FUNDRAISING.REPORTS,
    element: fundraisingModule.FundraisingReports,
  },
  {
    path: PATHS.ADMIN.FUNDRAISING.SETTINGS,
    element: fundraisingModule.FundraisingSettings,
  },
  {
    path: PATHS.ADMIN.FUNDRAISING.METRICS,
    element: fundraisingModule.FundraisingMetrics,
  },
];

const protectedRoutes = [
  { path: PATHS.ADMIN.DASHBOARD, element: CoreModule.Dashboard },
  ...userRoutes,
  ...groupRoutes,
  ...roleRoutes,
  ...forexRoutes,
  ...financeRoutes,
  ...mediaRoutes,
  ...supportAuditRoutes,
  ...fundraisingRoutes,
  ...escrowRoutes,
];

const AppRouter: React.FC = () => {
  return (
    <RouteErrorBoundary fallback={<CoreModule.ErrorPage />}>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {renderRoutes(authRoutes)}

          <Route
            path={PATHS.ROOT}
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {renderRoutes(protectedRoutes)}
          </Route>

          <Route path="*" element={<CoreModule.ErrorPage />} />
        </Routes>
      </Suspense>
    </RouteErrorBoundary>
  );
};

export default AppRouter;
