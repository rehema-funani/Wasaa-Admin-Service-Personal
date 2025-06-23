import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

import AdminLayout from './components/layout/AdminLayout';
import { PermissionMap } from './utils/permissions';
import PermissionRouteGuard from './components/PermissionGuard';
import ModeratorDashboard from './app/admin/chat/page';

// Core application pages
const Dashboard = lazy(() => import('./app/dashboard/page'));
const ErrorPage = lazy(() => import('./app/error/error-page'));
const UnauthorizedPage = lazy(() => import('./app/error/unauthorized-page'));

// Auth pages
const Login = lazy(() => import('./app/auth/login/page'));
const VerifyOtp = lazy(() => import('./app/auth/verify/page'));
const ForgotPassword = lazy(() => import('./app/auth/forgot-password/page'));
const Reset = lazy(() => import('./app/auth/forgot-password/reset'));
const Set = lazy(() => import('./app/auth/forgot-password/set'));

// User management pages
const UserDetails = lazy(() => import('./app/admin/users/user-details/page'));
const Userdetail = lazy(() => import('./app/admin/users/user-details/userdetail'));
const CountrywiseUsers = lazy(() => import('./app/admin/users/countrywise-Analysis/page'));
const ReportedUsers = lazy(() => import('./app/admin/users/reported-user-list/page'));
const CountryDetailPage = lazy(() => import('./app/admin/users/countrywise-Analysis/CountryDetailPage'));

// Group management pages
const GroupList = lazy(() => import('./app/admin/Group/all-group-list/page'));
const GroupDetailPage = lazy(() => import('./app/admin/Group/all-group-list/groupdetail'));
const ReportedGroups = lazy(() => import('./app/admin/Group/all-reported-group-list/page'));

// Role and system user management
const RolesPage = lazy(() => import('./app/admin/roles/roles'));
const RoleDetail = lazy(() => import('./app/admin/roles/roledetail'));
const CreateRole = lazy(() => import('./app/admin/roles/createrole'));
const EditRole = lazy(() => import('./app/admin/roles/editrole'));
const SystemUsers = lazy(() => import('./app/admin/roles/user-settings'));
const AdminUserDetails = lazy(() => import('./app/admin/roles/userdetail'));

// Livestream management
const AllLivestreams = lazy(() => import('./app/admin/livestreams/all-livestreams/page'));
const ScheduledStreams = lazy(() => import('./app/admin/livestreams/scheduled/page'));
const StreamSettings = lazy(() => import('./app/admin/livestreams/settings/page'));
const StreamCategories = lazy(() => import('./app/admin/livestreams/categories/page'));
const FeaturedStreams = lazy(() => import('./app/admin/livestreams/featured/page'));
const StreamAnalytics = lazy(() => import('./app/admin/livestreams/analytics/page'));
const StreamModeration = lazy(() => import('./app/admin/livestreams/moderation/page'));
const ReportedStreams = lazy(() => import('./app/admin/livestreams/reported/page'));

// Forex management
const ForexDashboard = lazy(() => import('./app/admin/finance/forex/dashboard'));
const Currencies = lazy(() => import('./app/admin/finance/forex/currency-management'));
const CurrencyPairs = lazy(() => import('./app/admin/finance/forex/currency-pair'));
const ExchangeRates = lazy(() => import('./app/admin/finance/forex/exchange-rate-viewer'));
const UserAlerts = lazy(() => import('./app/admin/finance/forex/user-alerts'));
const ForexSettings = lazy(() => import('./app/admin/finance/forex/settings'));

// Finance management
const Transactions = lazy(() => import('./app/admin/finance/transactions/page'));
const Receipt = lazy(() => import('./app/admin/finance/transactions/receipt'));
const Tarrifs = lazy(() => import('./app/admin/finance/tariffs/page'));
const EditTariff = lazy(() => import('./app/admin/finance/tariffs/edittariff'));
const AddTarrif = lazy(() => import('./app/admin/finance/tariffs/addtariff'));
const Limits = lazy(() => import('./app/admin/finance/limits/page'));
const AddLimit = lazy(() => import('./app/admin/finance/limits/addkyc'));
const EditLimit = lazy(() => import('./app/admin/finance/limits/editkyc'));
const Compliance = lazy(() => import('./app/admin/finance/system-wallets/amlcompliance'));
const ViewRule = lazy(() => import('./app/admin/finance/system-wallets/view-rule'));
const Verification = lazy(() => import('./app/admin/finance/limits/verification'));
const Wallets = lazy(() => import('./app/admin/finance/system-wallets/page'));
const ReversalRequests = lazy(() => import('./app/admin/finance/system-wallets/reversalrequests'));
const ReversalRequestDetails = lazy(() => import('./app/admin/finance/system-wallets/reversal-detail'));
const Banks = lazy(() => import('./app/admin/finance/banks/page'));
const UserWallets = lazy(() => import('./app/admin/finance/user-wallets/page'));
const WalletDetail = lazy(() => import('./app/admin/finance/user-wallets/walletdetail'));
const Withdrawals = lazy(() => import('./app/admin/finance/withdrawals/page'));
const TopUps = lazy(() => import('./app/admin/finance/top-ups/page'));
const PaymentMethods = lazy(() => import('./app/admin/finance/payment-methods/page'));
const FinancialReports = lazy(() => import('./app/admin/finance/reports/page'));
const GiftHistory = lazy(() => import('./app/admin/finance/gift-history/page'));

// Wallpaper & Avatar management
const WallpaperList = lazy(() => import('./app/admin/Wallpaper/list-all-wallpaper/page'));
const AddWallpaper = lazy(() => import('./app/admin/Wallpaper/add-a-new-wallpaper/page'));
const AvatarList = lazy(() => import('./app/admin/Avatar/list-all-avatar/page'));
const AddAvatar = lazy(() => import('./app/admin/Avatar/add-a-new-avatar/page'));

// Settings management
const GeneralSettings = lazy(() => import('./app/admin/Settings/page'));
const Emoji = lazy(() => import('./app/admin/Settings/emoji'));
const Languages = lazy(() => import('./app/admin/languages/all-languages/page'));
const Translations = lazy(() => import('./app/admin/languages/all-languages/details'));

// Gift management
const AddGift = lazy(() => import('./app/admin/Gift/add-new-gift/page'));
const GiftList = lazy(() => import('./app/admin/Gift/gift-list/page'));
const GiftCategories = lazy(() => import('./app/admin/Gift/gift-categories/page'));

// Media management
const MediaDashboard = lazy(() => import('./app/admin/media/index'));
const VideoModeration = lazy(() => import('./app/admin/media/moderation'));
const ReportsPage = lazy(() => import('./app/admin/media/reports'));
const CommentsPage = lazy(() => import('./app/admin/media/comments'));
const HashtagsPage = lazy(() => import('./app/admin/media/hashtags'));
const CreatorsPage = lazy(() => import('./app/admin/media/creators'));
const CreatorDetail = lazy(() => import('./app/admin/media/creatordetail'));
const PromotionPage = lazy(() => import('./app/admin/media/promotion'));
const AnalyticsPage = lazy(() => import('./app/admin/media/analytics'));
const NotificationsPage = lazy(() => import('./app/admin/notification/notifications'));
const Broadcasts = lazy(() => import('./app/admin/notification/broadcast'));
const AddBroadcast = lazy(() => import('./app/admin/notification/addedit'));
const NotificationsDetail = lazy(() => import('./app/admin/media/viewtemplate'));
const ShortsSettings = lazy(() => import('./app/admin/media/settings'));

// Support center
const SupportDashboard = lazy(() => import('./app/admin/support/dashboard'));
const Tickets = lazy(() => import('./app/admin/support/ticketlist'));
const TicketDetails = lazy(() => import('./app/admin/support/ticketdetail'));
const Agents = lazy(() => import('./app/admin/support/agentlist'));
const Categories = lazy(() => import('./app/admin/support/categorymanagement'));
const CannedResponses = lazy(() => import('./app/admin/support/CannedResponses'));
const SLA = lazy(() => import('./app/admin/support/SLAManagement'));
const Analytics = lazy(() => import('./app/admin/support/analytics'));

// Auditing
const Logs = lazy(() => import('./app/admin/audits/page'));
const AuditDetails = lazy(() => import('./app/admin/audits/auditdetails'));

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
  { children: React.ReactNode, fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode, fallback: React.ReactNode }) {
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

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    // Preserve the attempted URL for redirect after login
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AppRouter: React.FC = () => {
  return (
    <RouteErrorBoundary fallback={<ErrorPage />}>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/login/verify-otp" element={<VerifyOtp />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password" element={<Reset />} />
          <Route path="/user/set-password" element={<Set />} />

          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard */}
            <Route index element={<Dashboard />} />

            {/* ===== User Management ===== */}
            <Route path="admin/users/user-details" element={
              <PermissionRouteGuard permissions={PermissionMap.Users.view}>
                <UserDetails />
              </PermissionRouteGuard>
            } />
            <Route path="admin/users/user-details/:id" element={
              <PermissionRouteGuard permissions={PermissionMap.Users.view}>
                <Userdetail />
              </PermissionRouteGuard>
            } />
            <Route path="admin/users/countrywise-Analysis" element={
              <PermissionRouteGuard permissions={PermissionMap.Users.view}>
                <CountrywiseUsers />
              </PermissionRouteGuard>
            } />
            <Route path="admin/users/countrywise-Analysis/:id" element={
              <PermissionRouteGuard permissions={PermissionMap.Users.view}>
                <CountryDetailPage />
              </PermissionRouteGuard>
            } />
            <Route path="admin/users/reported-user-list" element={
              <PermissionRouteGuard permissions={PermissionMap.ViewReported}>
                <ReportedUsers />
              </PermissionRouteGuard>
            } />

            {/* ===== Group Management ===== */}
            <Route path="admin/Group/all-group-list" element={
              <PermissionRouteGuard permissions={PermissionMap.Groups.view}>
                <GroupList />
              </PermissionRouteGuard>
            } />
            <Route path="admin/Group/all-group-list/:id" element={
              <PermissionRouteGuard permissions={PermissionMap.Groups.view}>
                <GroupDetailPage />
              </PermissionRouteGuard>
            } />
            <Route path="admin/Group/all-reported-group-list" element={
              <PermissionRouteGuard permissions={PermissionMap.ViewReported}>
                <ReportedGroups />
              </PermissionRouteGuard>
            } />

            {/* ===== Role Management ===== */}
            <Route path="admin/system/roles" element={
              <PermissionRouteGuard permissions={PermissionMap.Roles.view}>
                <RolesPage />
              </PermissionRouteGuard>
            } />
            <Route path="admin/system/roles/:id" element={
              <PermissionRouteGuard permissions={PermissionMap.Roles.view}>
                <RoleDetail />
              </PermissionRouteGuard>
            } />
            <Route path="admin/system/roles/create" element={
              <PermissionRouteGuard permissions={PermissionMap.Roles.create}>
                <CreateRole />
              </PermissionRouteGuard>
            } />
            <Route path="admin/system/roles/:id/edit" element={
              <PermissionRouteGuard permissions={PermissionMap.Roles.update}>
                <EditRole />
              </PermissionRouteGuard>
            } />
            <Route path='admin/system/users' element={
              <PermissionRouteGuard permissions={PermissionMap.Users.viewStaff}>
                <SystemUsers />
              </PermissionRouteGuard>
            } />
            <Route path='admin/users/:id' element={
              <PermissionRouteGuard permissions={PermissionMap.Users.viewStaff}>
                <AdminUserDetails />
              </PermissionRouteGuard>
            } />

            {/* ===== Livestream Management ===== */}
            <Route path="admin/livestreams/all-livestreams" element={<AllLivestreams />} />
            <Route path="admin/livestreams/scheduled" element={<ScheduledStreams />} />
            <Route path="admin/livestreams/settings" element={
              <PermissionRouteGuard permissions={PermissionMap.Settings.view}>
                <StreamSettings />
              </PermissionRouteGuard>
            } />
            <Route path="admin/livestreams/categories" element={<StreamCategories />} />
            <Route path="admin/livestreams/featured" element={<FeaturedStreams />} />
            <Route path="admin/livestreams/analytics" element={<StreamAnalytics />} />
            <Route path="admin/livestreams/moderation" element={<StreamModeration />} />
            <Route path="admin/livestreams/reported" element={
              <PermissionRouteGuard permissions={PermissionMap.ViewReported}>
                <ReportedStreams />
              </PermissionRouteGuard>
            } />

            {/* ===== Forex Management ===== */}
            <Route path="admin/finance/forex/dashboard" element={
              <PermissionRouteGuard permissions={PermissionMap.Transactions.view}>
                <ForexDashboard />
              </PermissionRouteGuard>
            } />
            <Route path="admin/finance/forex/currencies" element={
              <PermissionRouteGuard permissions={PermissionMap.Transactions.view}>
                <Currencies />
              </PermissionRouteGuard>
            } />
            <Route path="admin/finance/forex/currency-pairs" element={
              <PermissionRouteGuard permissions={PermissionMap.Transactions.view}>
                <CurrencyPairs />
              </PermissionRouteGuard>
            } />
            <Route path="admin/finance/forex/exchange-rates" element={
              <PermissionRouteGuard permissions={PermissionMap.Transactions.view}>
                <ExchangeRates />
              </PermissionRouteGuard>
            } />
            <Route path="admin/finance/forex/alerts" element={
              <PermissionRouteGuard permissions={PermissionMap.Transactions.view}>
                <UserAlerts />
              </PermissionRouteGuard>
            } />
            <Route path="admin/finance/forex/settings" element={
              <PermissionRouteGuard permissions={PermissionMap.Transactions.view}>
                <ForexSettings />
              </PermissionRouteGuard>
            } />

            {/* ===== Finance Management ===== */}
            <Route path="admin/finance/transactions" element={
              <PermissionRouteGuard permissions={PermissionMap.Transactions.view}>
                <Transactions />
              </PermissionRouteGuard>
            } />
            <Route path="admin/finance/transactions/receipt/:id" element={
              <PermissionRouteGuard permissions={PermissionMap.Transactions.view}>
                <Receipt />
              </PermissionRouteGuard>
            } />
            <Route path="admin/finance/fee-rules" element={
              <PermissionRouteGuard permissions={PermissionMap.Settings.view}>
                <Tarrifs />
              </PermissionRouteGuard>
            } />
            <Route path="admin/finance/fee-rules/edit/:id" element={
              <PermissionRouteGuard permissions={PermissionMap.Settings.view}>
                <EditTariff />
              </PermissionRouteGuard>
            } />
            <Route path="admin/finance/fee-rules/add" element={
              <PermissionRouteGuard permissions={PermissionMap.Settings.view}>
                <AddTarrif />
              </PermissionRouteGuard>
            } />
            <Route path="admin/finance/limits" element={
              <PermissionRouteGuard permissions={PermissionMap.Settings.view}>
                <Limits />
              </PermissionRouteGuard>
            } />
            <Route path="admin/finance/limits/add" element={
              <PermissionRouteGuard permissions={PermissionMap.Settings.view}>
                <AddLimit />
              </PermissionRouteGuard>
            } />
            <Route path="admin/finance/limits/edit/:id" element={
              <PermissionRouteGuard permissions={PermissionMap.Settings.view}>
                <EditLimit />
              </PermissionRouteGuard>
            } />
            <Route path="admin/finance/compliance" element={
              <PermissionRouteGuard permissions={PermissionMap.Settings.view}>
                <Compliance />
              </PermissionRouteGuard>
            } />
            <Route path="admin/finance/compliance/rules/:id" element={
              <PermissionRouteGuard permissions={PermissionMap.Settings.view}>
                <ViewRule />
              </PermissionRouteGuard>
            } />
            <Route path="admin/finance/limits/verification" element={
              <PermissionRouteGuard permissions={PermissionMap.Settings.view}>
                <Verification />
              </PermissionRouteGuard>
            } />
            <Route path="admin/finance/wallets" element={
              <PermissionRouteGuard permissions={PermissionMap.Wallets.view}>
                <Wallets />
              </PermissionRouteGuard>
            } />
            <Route path="admin/finance/wallets/reversal-requests" element={
              <PermissionRouteGuard permissions={PermissionMap.Wallets.view}>
                <ReversalRequests />
              </PermissionRouteGuard>
            } />
            <Route path="admin/finance/wallets/reversal-requests/:id" element={
              <PermissionRouteGuard permissions={PermissionMap.Wallets.view}>
                <ReversalRequestDetails />
              </PermissionRouteGuard>
            } />
            <Route path="admin/finance/banks" element={
              <PermissionRouteGuard permissions={PermissionMap.Settings.view}>
                <Banks />
              </PermissionRouteGuard>
            } />
            <Route path="admin/finance/user-wallets" element={
              <PermissionRouteGuard permissions={PermissionMap.Wallets.view}>
                <UserWallets />
              </PermissionRouteGuard>
            } />
            <Route path="admin/finance/user-wallets/:id" element={
              <PermissionRouteGuard permissions={PermissionMap.Wallets.view}>
                <WalletDetail />
              </PermissionRouteGuard>
            } />
            <Route path="admin/finance/withdrawals" element={
              <PermissionRouteGuard permissions={PermissionMap.Transactions.view}>
                <Withdrawals />
              </PermissionRouteGuard>
            } />
            <Route path="admin/finance/top-ups" element={
              <PermissionRouteGuard permissions={PermissionMap.Transactions.view}>
                <TopUps />
              </PermissionRouteGuard>
            } />
            <Route path="admin/finance/payment-methods" element={
              <PermissionRouteGuard permissions={PermissionMap.Settings.view}>
                <PaymentMethods />
              </PermissionRouteGuard>
            } />
            <Route path="admin/finance/reports" element={
              <PermissionRouteGuard permissions={PermissionMap.Finance}>
                <FinancialReports />
              </PermissionRouteGuard>
            } />
            <Route path="admin/finance/gift-history" element={
              <PermissionRouteGuard permissions={PermissionMap.Transactions.view}>
                <GiftHistory />
              </PermissionRouteGuard>
            } />

            {/* ===== Wallpaper Management ===== */}
            <Route path="admin/Wallpaper/list-all-wallpaper" element={
              <PermissionRouteGuard permissions={PermissionMap.Media.view}>
                <WallpaperList />
              </PermissionRouteGuard>
            } />
            <Route path="admin/Wallpaper/add-a-new-wallpaper" element={
              <PermissionRouteGuard permissions={PermissionMap.Media.create}>
                <AddWallpaper />
              </PermissionRouteGuard>
            } />

            {/* ===== Avatar Management ===== */}
            <Route path="admin/Avatar/list-all-avatar" element={
              <PermissionRouteGuard permissions={PermissionMap.Media.view}>
                <AvatarList />
              </PermissionRouteGuard>
            } />
            <Route path="admin/Avatar/add-a-new-avatar" element={
              <PermissionRouteGuard permissions={PermissionMap.Media.create}>
                <AddAvatar />
              </PermissionRouteGuard>
            } />

            {/* ===== Settings Management ===== */}
            <Route path="admin/settings" element={
              <PermissionRouteGuard permissions={PermissionMap.Settings.view}>
                <GeneralSettings />
              </PermissionRouteGuard>
            } />
            <Route path="admin/emojis" element={
              <PermissionRouteGuard permissions={PermissionMap.Settings.view}>
                <Emoji />
              </PermissionRouteGuard>
            } />
            <Route path="admin/languages" element={
              <PermissionRouteGuard permissions={PermissionMap.Languages.view}>
                <Languages />
              </PermissionRouteGuard>
            } />
            <Route path="admin/languages/:id/translations" element={
              <PermissionRouteGuard permissions={PermissionMap.Languages.view}>
                <Translations />
              </PermissionRouteGuard>
            } />

            {/* ======= chat moderation ======== */}
            <Route path="admin/chats/moderation" element={
              <PermissionRouteGuard permissions={PermissionMap.Media.view}>
                <ModeratorDashboard />
              </PermissionRouteGuard>
            } />

            {/* ===== Gift Management ===== */}
            <Route path="admin/gifts/gift-list" element={
              <PermissionRouteGuard permissions={PermissionMap.Media.view}>
                <GiftList />
              </PermissionRouteGuard>
            } />
            <Route path="admin/gifts/add-gift" element={
              <PermissionRouteGuard permissions={PermissionMap.Media.create}>
                <AddGift />
              </PermissionRouteGuard>
            } />
            <Route path="admin/gifts/gift-categories" element={
              <PermissionRouteGuard permissions={PermissionMap.Media.view}>
                <GiftCategories />
              </PermissionRouteGuard>
            } />

            {/* ===== Media Management ===== */}
            <Route path="admin/media/shorts" element={
              <PermissionRouteGuard permissions={PermissionMap.Media.view}>
                <MediaDashboard />
              </PermissionRouteGuard>
            } />
            <Route path="admin/media/shorts/moderation" element={
              <PermissionRouteGuard permissions={PermissionMap.Media.view}>
                <VideoModeration />
              </PermissionRouteGuard>
            } />
            <Route path="admin/media/shorts/moderation/:videoId" element={
              <PermissionRouteGuard permissions={PermissionMap.Media.view}>
                <VideoModeration />
              </PermissionRouteGuard>
            } />
            <Route path="admin/media/shorts/reports" element={
              <PermissionRouteGuard permissions={PermissionMap.ViewReported}>
                <ReportsPage />
              </PermissionRouteGuard>
            } />
            <Route path="admin/media/shorts/reports/:reportId" element={
              <PermissionRouteGuard permissions={PermissionMap.ViewReported}>
                <ReportsPage />
              </PermissionRouteGuard>
            } />
            <Route path="admin/media/shorts/comments" element={
              <PermissionRouteGuard permissions={PermissionMap.Media.view}>
                <CommentsPage />
              </PermissionRouteGuard>
            } />
            <Route path="admin/media/shorts/comments/:videoId" element={
              <PermissionRouteGuard permissions={PermissionMap.Media.view}>
                <CommentsPage />
              </PermissionRouteGuard>
            } />
            <Route path="admin/media/shorts/hashtags" element={
              <PermissionRouteGuard permissions={PermissionMap.Media.view}>
                <HashtagsPage />
              </PermissionRouteGuard>
            } />
            <Route path="admin/media/shorts/hashtags/blocked" element={
              <PermissionRouteGuard permissions={PermissionMap.Media.view}>
                <HashtagsPage />
              </PermissionRouteGuard>
            } />
            <Route path="admin/media/shorts/hashtags/trending" element={
              <PermissionRouteGuard permissions={PermissionMap.Media.view}>
                <HashtagsPage />
              </PermissionRouteGuard>
            } />
            <Route path="admin/media/shorts/creators" element={
              <PermissionRouteGuard permissions={PermissionMap.Media.view}>
                <CreatorsPage />
              </PermissionRouteGuard>
            } />
            <Route path="admin/media/shorts/creators/:creatorId" element={
              <PermissionRouteGuard permissions={PermissionMap.Media.view}>
                <CreatorDetail />
              </PermissionRouteGuard>
            } />
            <Route path="admin/media/shorts/promotion" element={
              <PermissionRouteGuard permissions={PermissionMap.Media.view}>
                <PromotionPage />
              </PermissionRouteGuard>
            } />
            <Route path="admin/media/shorts/promotion/trending" element={
              <PermissionRouteGuard permissions={PermissionMap.Media.view}>
                <PromotionPage />
              </PermissionRouteGuard>
            } />
            <Route path="admin/media/shorts/promotion/featured" element={
              <PermissionRouteGuard permissions={PermissionMap.Media.view}>
                <PromotionPage />
              </PermissionRouteGuard>
            } />
            <Route path="admin/media/shorts/analytics" element={
              <PermissionRouteGuard permissions={PermissionMap.Media.view}>
                <AnalyticsPage />
              </PermissionRouteGuard>
            } />
            <Route path="admin/media/shorts/analytics/videos" element={
              <PermissionRouteGuard permissions={PermissionMap.Media.view}>
                <AnalyticsPage />
              </PermissionRouteGuard>
            } />
            <Route path="admin/media/shorts/analytics/moderation" element={
              <PermissionRouteGuard permissions={PermissionMap.Media.view}>
                <AnalyticsPage />
              </PermissionRouteGuard>
            } />
            <Route path="admin/media/shorts/notifications" element={
              <PermissionRouteGuard permissions={PermissionMap.Media.view}>
                <NotificationsPage />
              </PermissionRouteGuard>
            } />
            <Route path="admin/media/shorts/notifications/templates" element={
              <PermissionRouteGuard permissions={PermissionMap.Media.view}>
                <NotificationsPage />
              </PermissionRouteGuard>
            } />
            <Route path="admin/media/shorts/notifications/templates/:id" element={
              <PermissionRouteGuard permissions={PermissionMap.Media.view}>
                <NotificationsDetail />
              </PermissionRouteGuard>
            } />

            <Route path="admin/system/notifications/broadcasts" element={
              <PermissionRouteGuard permissions={PermissionMap.Settings.view}>
                <Broadcasts />
              </PermissionRouteGuard>
            } />
            <Route path="admin/communication/broadcasts/add" element={
              <PermissionRouteGuard permissions={PermissionMap.Settings.view}>
                <AddBroadcast />
              </PermissionRouteGuard>
            } />
            <Route path="admin/communication/broadcasts/edit/:id" element={
              <PermissionRouteGuard permissions={PermissionMap.Settings.view}>
                <AddBroadcast />
              </PermissionRouteGuard>
            } />

            <Route path="admin/media/shorts/settings" element={
              <PermissionRouteGuard permissions={PermissionMap.Settings.view}>
                <ShortsSettings />
              </PermissionRouteGuard>
            } />

            {/* ===== Support Center ===== */}
            <Route path="admin/support" element={<SupportDashboard />} />
            <Route path="/admin/support/tickets" element={<Tickets />} />
            <Route path="/admin/support/tickets/:id" element={<TicketDetails />} />
            <Route path="/admin/support/agents" element={<Agents />} />
            <Route path="/admin/support/categories/" element={<Categories />} />
            <Route path="/admin/support/canned-responses" element={<CannedResponses />} />
            <Route path="/admin/support/sla" element={<SLA />} />
            <Route path="/admin/support/analytics" element={<Analytics />} />

            {/* ===== Audit Logs ===== */}
            <Route path="admin/logs" element={
              <PermissionRouteGuard permissions={PermissionMap.Admin}>
                <Logs />
              </PermissionRouteGuard>
            } />
            <Route path="admin/audit-logs/:id" element={
              <PermissionRouteGuard permissions={PermissionMap.Admin}>
                <AuditDetails />
              </PermissionRouteGuard>
            } />
          </Route>

          {/* ===== 404 Route ===== */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
    </RouteErrorBoundary>
  );
};

export default AppRouter;
