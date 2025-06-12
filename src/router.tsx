import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

import AdminLayout from './components/layout/AdminLayout';
import { PermissionMap } from './utils/permissions';
import PermissionRouteGuard from './components/PermissionGuard';

const lazyLoad = (importFunc: any) => {
  const Component = lazy(importFunc);
  return (props: any) => (
    <RouteErrorBoundary fallback={<ErrorPage />}>
      <Component {...props} />
    </RouteErrorBoundary>
  );
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

interface RouteErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

interface RouteErrorBoundaryState {
  hasError: boolean;
}

class RouteErrorBoundary extends React.Component<RouteErrorBoundaryProps, RouteErrorBoundaryState> {
  constructor(props: RouteErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Route loading error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const authToken = Cookies.get("authToken");
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
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const ErrorPage = lazyLoad(() => import('./app/error/error-page'));
const UnauthorizedPage = lazyLoad(() => import('./app/error/unauthorized-page'));
const Dashboard = lazyLoad(() => import('./app/dashboard/page'));

const Login = lazyLoad(() => import('./app/auth/login/page'));
const VerifyOtp = lazyLoad(() => import('./app/auth/verify/page'));
const ForgotPassword = lazyLoad(() => import('./app/auth/forgot-password/page'));
const Reset = lazyLoad(() => import('./app/auth/forgot-password/reset'));
const Set = lazyLoad(() => import('./app/auth/forgot-password/set'));

const ModeratorDashboard = lazyLoad(() => import('./app/admin/chat/page'));

const UserManagement = {
  UserDetails: lazyLoad(() => import('./app/admin/users/user-details/page')),
  UserDetail: lazyLoad(() => import('./app/admin/users/user-details/userdetail')),
  CountrywiseUsers: lazyLoad(() => import('./app/admin/users/countrywise-Analysis/page')),
  CountryDetailPage: lazyLoad(() => import('./app/admin/users/countrywise-Analysis/CountryDetailPage')),
  ReportedUsers: lazyLoad(() => import('./app/admin/users/reported-user-list/page')),
};

const GroupManagement = {
  GroupList: lazyLoad(() => import('./app/admin/Group/all-group-list/page')),
  GroupDetailPage: lazyLoad(() => import('./app/admin/Group/all-group-list/groupdetail')),
  ReportedGroups: lazyLoad(() => import('./app/admin/Group/all-reported-group-list/page')),
};

const RoleManagement = {
  RolesPage: lazyLoad(() => import('./app/admin/roles/roles')),
  RoleDetail: lazyLoad(() => import('./app/admin/roles/roledetail')),
  CreateRole: lazyLoad(() => import('./app/admin/roles/createrole')),
  SystemUsers: lazyLoad(() => import('./app/admin/roles/user-settings')),
  AdminUserDetails: lazyLoad(() => import('./app/admin/roles/userdetail')),
};

const LivestreamManagement = {
  AllLivestreams: lazyLoad(() => import('./app/admin/livestreams/all-livestreams/page')),
  ScheduledStreams: lazyLoad(() => import('./app/admin/livestreams/scheduled/page')),
  StreamSettings: lazyLoad(() => import('./app/admin/livestreams/settings/page')),
  StreamCategories: lazyLoad(() => import('./app/admin/livestreams/categories/page')),
  FeaturedStreams: lazyLoad(() => import('./app/admin/livestreams/featured/page')),
  StreamAnalytics: lazyLoad(() => import('./app/admin/livestreams/analytics/page')),
  StreamModeration: lazyLoad(() => import('./app/admin/livestreams/moderation/page')),
  ReportedStreams: lazyLoad(() => import('./app/admin/livestreams/reported/page')),
};

const ForexManagement = {
  ForexDashboard: lazyLoad(() => import('./app/admin/finance/forex/dashboard')),
  Currencies: lazyLoad(() => import('./app/admin/finance/forex/currency-management')),
  CurrencyPairs: lazyLoad(() => import('./app/admin/finance/forex/currency-pair')),
  ExchangeRates: lazyLoad(() => import('./app/admin/finance/forex/exchange-rate-viewer')),
  UserAlerts: lazyLoad(() => import('./app/admin/finance/forex/user-alerts')),
  ForexSettings: lazyLoad(() => import('./app/admin/finance/forex/settings')),
};

const FinanceManagement = {
  Transactions: lazyLoad(() => import('./app/admin/finance/transactions/page')),
  Receipt: lazyLoad(() => import('./app/admin/finance/transactions/receipt')),
  Tarrifs: lazyLoad(() => import('./app/admin/finance/tariffs/page')),
  EditTariff: lazyLoad(() => import('./app/admin/finance/tariffs/edittariff')),
  AddTarrif: lazyLoad(() => import('./app/admin/finance/tariffs/addtariff')),
  Limits: lazyLoad(() => import('./app/admin/finance/limits/page')),
  AddLimit: lazyLoad(() => import('./app/admin/finance/limits/addkyc')),
  EditLimit: lazyLoad(() => import('./app/admin/finance/limits/editkyc')),
  Compliance: lazyLoad(() => import('./app/admin/finance/system-wallets/amlcompliance')),
  ViewRule: lazyLoad(() => import('./app/admin/finance/system-wallets/view-rule')),
  Verification: lazyLoad(() => import('./app/admin/finance/limits/verification')),
  Wallets: lazyLoad(() => import('./app/admin/finance/system-wallets/page')),
  ReversalRequests: lazyLoad(() => import('./app/admin/finance/system-wallets/reversalrequests')),
  ReversalRequestDetails: lazyLoad(() => import('./app/admin/finance/system-wallets/reversal-detail')),
  Banks: lazyLoad(() => import('./app/admin/finance/banks/page')),
  UserWallets: lazyLoad(() => import('./app/admin/finance/user-wallets/page')),
  WalletDetail: lazyLoad(() => import('./app/admin/finance/user-wallets/walletdetail')),
  Withdrawals: lazyLoad(() => import('./app/admin/finance/withdrawals/page')),
  TopUps: lazyLoad(() => import('./app/admin/finance/top-ups/page')),
  PaymentMethods: lazyLoad(() => import('./app/admin/finance/payment-methods/page')),
  FinancialReports: lazyLoad(() => import('./app/admin/finance/reports/page')),
  GiftHistory: lazyLoad(() => import('./app/admin/finance/gift-history/page')),
};

const MediaManagement = {
  WallpaperList: lazyLoad(() => import('./app/admin/Wallpaper/list-all-wallpaper/page')),
  AddWallpaper: lazyLoad(() => import('./app/admin/Wallpaper/add-a-new-wallpaper/page')),
  AvatarList: lazyLoad(() => import('./app/admin/Avatar/list-all-avatar/page')),
  AddAvatar: lazyLoad(() => import('./app/admin/Avatar/add-a-new-avatar/page')),
  MediaDashboard: lazyLoad(() => import('./app/admin/media/index')),
  VideoModeration: lazyLoad(() => import('./app/admin/media/moderation')),
  ReportsPage: lazyLoad(() => import('./app/admin/media/reports')),
  CommentsPage: lazyLoad(() => import('./app/admin/media/comments')),
  HashtagsPage: lazyLoad(() => import('./app/admin/media/hashtags')),
  CreatorsPage: lazyLoad(() => import('./app/admin/media/creators')),
  CreatorDetail: lazyLoad(() => import('./app/admin/media/creatordetail')),
  PromotionPage: lazyLoad(() => import('./app/admin/media/promotion')),
  AnalyticsPage: lazyLoad(() => import('./app/admin/media/analytics')),
  NotificationsPage: lazyLoad(() => import('./app/admin/media/notifications')),
  ShortsSettings: lazyLoad(() => import('./app/admin/media/settings')),
};

const SettingsManagement = {
  GeneralSettings: lazyLoad(() => import('./app/admin/Settings/page')),
  Emoji: lazyLoad(() => import('./app/admin/Settings/emoji')),
  Languages: lazyLoad(() => import('./app/admin/languages/all-languages/page')),
  Translations: lazyLoad(() => import('./app/admin/languages/all-languages/details')),
};

const GiftManagement = {
  AddGift: lazyLoad(() => import('./app/admin/Gift/add-new-gift/page')),
  GiftList: lazyLoad(() => import('./app/admin/Gift/gift-list/page')),
  GiftCategories: lazyLoad(() => import('./app/admin/Gift/gift-categories/page')),
};

const SupportCenter = {
  SupportDashboard: lazyLoad(() => import('./app/admin/support/dashboard')),
  Tickets: lazyLoad(() => import('./app/admin/support/ticketlist')),
  TicketDetails: lazyLoad(() => import('./app/admin/support/ticketdetail')),
  Agents: lazyLoad(() => import('./app/admin/support/agentlist')),
  Categories: lazyLoad(() => import('./app/admin/support/categorymanagement')),
  CannedResponses: lazyLoad(() => import('./app/admin/support/CannedResponses')),
  SLA: lazyLoad(() => import('./app/admin/support/SLAManagement')),
  Analytics: lazyLoad(() => import('./app/admin/support/analytics')),
};

const Auditing = {
  Logs: lazyLoad(() => import('./app/admin/audits/page')),
  AuditDetails: lazyLoad(() => import('./app/admin/audits/auditdetails')),
};

const createProtectedRoute = (path: any, permission: any, Component: any) => ({
  path,
  element: (
    <PermissionRouteGuard permissions={permission}>
      <Component />
    </PermissionRouteGuard>
  ),
});

const publicRoutes = [
  { path: "/auth/login", element: <Login /> },
  { path: "/auth/login/verify-otp", element: <VerifyOtp /> },
  { path: "/auth/forgot-password", element: <ForgotPassword /> },
  { path: "/auth/reset-password", element: <Reset /> },
  { path: "/user/set-password", element: <Set /> },
  { path: "/unauthorized", element: <UnauthorizedPage /> },
];

const userRoutes = [
  createProtectedRoute(
    "admin/users/user-details",
    PermissionMap.Users.view,
    UserManagement.UserDetails
  ),
  createProtectedRoute(
    "admin/users/user-details/:id",
    PermissionMap.Users.view,
    UserManagement.UserDetail
  ),
  createProtectedRoute(
    "admin/users/countrywise-Analysis",
    PermissionMap.Users.view,
    UserManagement.CountrywiseUsers
  ),
  createProtectedRoute(
    "admin/users/countrywise-Analysis/:id",
    PermissionMap.Users.view,
    UserManagement.CountryDetailPage
  ),
  createProtectedRoute(
    "admin/users/reported-user-list",
    PermissionMap.ViewReported,
    UserManagement.ReportedUsers
  ),
];

const groupRoutes = [
  createProtectedRoute(
    "admin/Group/all-group-list",
    PermissionMap.Groups.view,
    GroupManagement.GroupList
  ),
  createProtectedRoute(
    "admin/Group/all-group-list/:id",
    PermissionMap.Groups.view,
    GroupManagement.GroupDetailPage
  ),
  createProtectedRoute(
    "admin/Group/all-reported-group-list",
    PermissionMap.ViewReported,
    GroupManagement.ReportedGroups
  ),
];

const roleRoutes = [
  createProtectedRoute(
    "admin/system/roles",
    PermissionMap.Roles.view,
    RoleManagement.RolesPage
  ),
  createProtectedRoute(
    "admin/system/roles/:id",
    PermissionMap.Roles.view,
    RoleManagement.RoleDetail
  ),
  createProtectedRoute(
    "admin/system/roles/create",
    PermissionMap.Roles.create,
    RoleManagement.CreateRole
  ),
  createProtectedRoute(
    "admin/system/users",
    PermissionMap.Users.viewStaff,
    RoleManagement.SystemUsers
  ),
  createProtectedRoute(
    "admin/users/:id",
    PermissionMap.Users.viewStaff,
    RoleManagement.AdminUserDetails
  ),
];

const livestreamRoutes = [
  { path: "admin/livestreams/all-livestreams", element: <LivestreamManagement.AllLivestreams /> },
  { path: "admin/livestreams/scheduled", element: <LivestreamManagement.ScheduledStreams /> },
  createProtectedRoute(
    "admin/livestreams/settings",
    PermissionMap.Settings.view,
    LivestreamManagement.StreamSettings
  ),
  { path: "admin/livestreams/categories", element: <LivestreamManagement.StreamCategories /> },
  { path: "admin/livestreams/featured", element: <LivestreamManagement.FeaturedStreams /> },
  { path: "admin/livestreams/analytics", element: <LivestreamManagement.StreamAnalytics /> },
  { path: "admin/livestreams/moderation", element: <LivestreamManagement.StreamModeration /> },
  createProtectedRoute(
    "admin/livestreams/reported",
    PermissionMap.ViewReported,
    LivestreamManagement.ReportedStreams
  ),
];

const financeRoutes = [
  createProtectedRoute(
    "admin/finance/forex/dashboard",
    PermissionMap.Transactions.view,
    ForexManagement.ForexDashboard
  ),
  createProtectedRoute(
    "admin/finance/forex/currencies",
    PermissionMap.Transactions.view,
    ForexManagement.Currencies
  ),
  createProtectedRoute(
    "admin/finance/forex/currency-pairs",
    PermissionMap.Transactions.view,
    ForexManagement.CurrencyPairs
  ),
  createProtectedRoute(
    "admin/finance/forex/exchange-rates",
    PermissionMap.Transactions.view,
    ForexManagement.ExchangeRates
  ),
  createProtectedRoute(
    "admin/finance/forex/alerts",
    PermissionMap.Transactions.view,
    ForexManagement.UserAlerts
  ),
  createProtectedRoute(
    "admin/finance/forex/settings",
    PermissionMap.Transactions.view,
    ForexManagement.ForexSettings
  ),

  createProtectedRoute(
    "admin/finance/transactions",
    PermissionMap.Transactions.view,
    FinanceManagement.Transactions
  ),
  createProtectedRoute(
    "admin/finance/transactions/receipt/:id",
    PermissionMap.Transactions.view,
    FinanceManagement.Receipt
  ),
  createProtectedRoute(
    "admin/finance/tariffs",
    PermissionMap.Settings.view,
    FinanceManagement.Tarrifs
  ),
  createProtectedRoute(
    "admin/finance/tariffs/edit/:id",
    PermissionMap.Settings.view,
    FinanceManagement.EditTariff
  ),
  createProtectedRoute(
    "admin/finance/tariffs/add",
    PermissionMap.Settings.view,
    FinanceManagement.AddTarrif
  ),

  createProtectedRoute(
    "admin/finance/limits",
    PermissionMap.Settings.view,
    FinanceManagement.Limits
  ),
  createProtectedRoute(
    "admin/finance/limits/add",
    PermissionMap.Settings.view,
    FinanceManagement.AddLimit
  ),
  createProtectedRoute(
    "admin/finance/limits/edit/:id",
    PermissionMap.Settings.view,
    FinanceManagement.EditLimit
  ),
  createProtectedRoute(
    "admin/finance/compliance",
    PermissionMap.Settings.view,
    FinanceManagement.Compliance
  ),
  createProtectedRoute(
    "admin/finance/compliance/rules/:id",
    PermissionMap.Settings.view,
    FinanceManagement.ViewRule
  ),
  createProtectedRoute(
    "admin/finance/limits/verification",
    PermissionMap.Settings.view,
    FinanceManagement.Verification
  ),
  createProtectedRoute(
    "admin/finance/wallets",
    PermissionMap.Wallets.view,
    FinanceManagement.Wallets
  ),
  createProtectedRoute(
    "admin/finance/wallets/reversal-requests",
    PermissionMap.Wallets.view,
    FinanceManagement.ReversalRequests
  ),
  createProtectedRoute(
    "admin/finance/wallets/reversal-requests/:id",
    PermissionMap.Wallets.view,
    FinanceManagement.ReversalRequestDetails
  ),
  createProtectedRoute(
    "admin/finance/banks",
    PermissionMap.Settings.view,
    FinanceManagement.Banks
  ),
  createProtectedRoute(
    "admin/finance/user-wallets",
    PermissionMap.Wallets.view,
    FinanceManagement.UserWallets
  ),
  createProtectedRoute(
    "admin/finance/user-wallets/:id",
    PermissionMap.Wallets.view,
    FinanceManagement.WalletDetail
  ),
  createProtectedRoute(
    "admin/finance/withdrawals",
    PermissionMap.Transactions.view,
    FinanceManagement.Withdrawals
  ),
  createProtectedRoute(
    "admin/finance/top-ups",
    PermissionMap.Transactions.view,
    FinanceManagement.TopUps
  ),
  createProtectedRoute(
    "admin/finance/payment-methods",
    PermissionMap.Settings.view,
    FinanceManagement.PaymentMethods
  ),
  createProtectedRoute(
    "admin/finance/reports",
    PermissionMap.Finance,
    FinanceManagement.FinancialReports
  ),
  createProtectedRoute(
    "admin/finance/gift-history",
    PermissionMap.Transactions.view,
    FinanceManagement.GiftHistory
  ),
];

const mediaRoutes = [
  createProtectedRoute(
    "admin/Wallpaper/list-all-wallpaper",
    PermissionMap.Media.view,
    MediaManagement.WallpaperList
  ),
  createProtectedRoute(
    "admin/Wallpaper/add-a-new-wallpaper",
    PermissionMap.Media.create,
    MediaManagement.AddWallpaper
  ),

  createProtectedRoute(
    "admin/Avatar/list-all-avatar",
    PermissionMap.Media.view,
    MediaManagement.AvatarList
  ),
  createProtectedRoute(
    "admin/Avatar/add-a-new-avatar",
    PermissionMap.Media.create,
    MediaManagement.AddAvatar
  ),

  createProtectedRoute(
    "admin/media/shorts",
    PermissionMap.Media.view,
    MediaManagement.MediaDashboard
  ),
  createProtectedRoute(
    "admin/media/shorts/moderation",
    PermissionMap.Media.view,
    MediaManagement.VideoModeration
  ),
  createProtectedRoute(
    "admin/media/shorts/moderation/:videoId",
    PermissionMap.Media.view,
    MediaManagement.VideoModeration
  ),
  createProtectedRoute(
    "admin/media/shorts/reports",
    PermissionMap.ViewReported,
    MediaManagement.ReportsPage
  ),
  createProtectedRoute(
    "admin/media/shorts/reports/:reportId",
    PermissionMap.ViewReported,
    MediaManagement.ReportsPage
  ),
  createProtectedRoute(
    "admin/media/shorts/comments",
    PermissionMap.Media.view,
    MediaManagement.CommentsPage
  ),
  createProtectedRoute(
    "admin/media/shorts/comments/:videoId",
    PermissionMap.Media.view,
    MediaManagement.CommentsPage
  ),
  createProtectedRoute(
    "admin/media/shorts/hashtags",
    PermissionMap.Media.view,
    MediaManagement.HashtagsPage
  ),
  createProtectedRoute(
    "admin/media/shorts/hashtags/blocked",
    PermissionMap.Media.view,
    MediaManagement.HashtagsPage
  ),
  createProtectedRoute(
    "admin/media/shorts/hashtags/trending",
    PermissionMap.Media.view,
    MediaManagement.HashtagsPage
  ),
  createProtectedRoute(
    "admin/media/shorts/creators",
    PermissionMap.Media.view,
    MediaManagement.CreatorsPage
  ),
  createProtectedRoute(
    "admin/media/shorts/creators/:creatorId",
    PermissionMap.Media.view,
    MediaManagement.CreatorDetail
  ),
  createProtectedRoute(
    "admin/media/shorts/promotion",
    PermissionMap.Media.view,
    MediaManagement.PromotionPage
  ),
  createProtectedRoute(
    "admin/media/shorts/promotion/trending",
    PermissionMap.Media.view,
    MediaManagement.PromotionPage
  ),
  createProtectedRoute(
    "admin/media/shorts/promotion/featured",
    PermissionMap.Media.view,
    MediaManagement.PromotionPage
  ),
  createProtectedRoute(
    "admin/media/shorts/analytics",
    PermissionMap.Media.view,
    MediaManagement.AnalyticsPage
  ),
  createProtectedRoute(
    "admin/media/shorts/analytics/videos",
    PermissionMap.Media.view,
    MediaManagement.AnalyticsPage
  ),
  createProtectedRoute(
    "admin/media/shorts/analytics/moderation",
    PermissionMap.Media.view,
    MediaManagement.AnalyticsPage
  ),
  createProtectedRoute(
    "admin/media/shorts/notifications",
    PermissionMap.Media.view,
    MediaManagement.NotificationsPage
  ),
  createProtectedRoute(
    "admin/media/shorts/notifications/templates",
    PermissionMap.Media.view,
    MediaManagement.NotificationsPage
  ),
  createProtectedRoute(
    "admin/media/shorts/settings",
    PermissionMap.Settings.view,
    MediaManagement.ShortsSettings
  ),
];

const settingsRoutes = [
  createProtectedRoute(
    "admin/settings",
    PermissionMap.Settings.view,
    SettingsManagement.GeneralSettings
  ),
  createProtectedRoute(
    "admin/emojis",
    PermissionMap.Settings.view,
    SettingsManagement.Emoji
  ),
  createProtectedRoute(
    "admin/languages",
    PermissionMap.Languages.view,
    SettingsManagement.Languages
  ),
  createProtectedRoute(
    "admin/languages/:id/translations",
    PermissionMap.Languages.view,
    SettingsManagement.Translations
  ),

  createProtectedRoute(
    "admin/chats/moderation",
    PermissionMap.Media.view,
    ModeratorDashboard
  ),
];

const giftRoutes = [
  createProtectedRoute(
    "admin/gifts/gift-list",
    PermissionMap.Media.view,
    GiftManagement.GiftList
  ),
  createProtectedRoute(
    "admin/gifts/add-gift",
    PermissionMap.Media.create,
    GiftManagement.AddGift
  ),
  createProtectedRoute(
    "admin/gifts/gift-categories",
    PermissionMap.Media.view,
    GiftManagement.GiftCategories
  ),
];

const supportRoutes = [
  { path: "admin/support", element: <SupportCenter.SupportDashboard /> },
  { path: "/admin/support/tickets", element: <SupportCenter.Tickets /> },
  { path: "/admin/support/tickets/:id", element: <SupportCenter.TicketDetails /> },
  { path: "/admin/support/agents", element: <SupportCenter.Agents /> },
  { path: "/admin/support/categories/", element: <SupportCenter.Categories /> },
  { path: "/admin/support/canned-responses", element: <SupportCenter.CannedResponses /> },
  { path: "/admin/support/sla", element: <SupportCenter.SLA /> },
  { path: "/admin/support/analytics", element: <SupportCenter.Analytics /> },
];

const auditRoutes = [
  createProtectedRoute(
    "admin/logs",
    PermissionMap.Admin,
    Auditing.Logs
  ),
  createProtectedRoute(
    "admin/audit-logs/:id",
    PermissionMap.Admin,
    Auditing.AuditDetails
  ),
];

const protectedRoutes = [
  { path: "/", index: true, element: <Dashboard /> },
  ...userRoutes,
  ...groupRoutes,
  ...roleRoutes,
  ...livestreamRoutes,
  ...financeRoutes,
  ...mediaRoutes,
  ...settingsRoutes,
  ...giftRoutes,
  ...supportRoutes,
  ...auditRoutes,
];

const AppRouter = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {publicRoutes.map((route, index) => (
          <Route key={`public-${index}`} path={route.path} element={route.element} />
        ))}

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {protectedRoutes.map((route, index) => {
            if ('index' in route && route.index) {
              return <Route key={`protected-${index}`} index element={route.element} />;
            }
            return (
              <Route key={`protected-${index}`} path={route.path} element={route.element} />
            );
          })}
        </Route>

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
