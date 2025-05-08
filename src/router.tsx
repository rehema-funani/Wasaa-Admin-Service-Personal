import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';

const Dashboard = lazy(() => import('./app/dashboard/page'));
const ErrorPage = lazy(() => import('./app/error/error-page'));

const UserDetails = lazy(() => import('./app/admin/users/user-details/page'));
const Userdetail = lazy(() => import('./app/admin/users/user-details/userdetail'));
const CountrywiseUsers = lazy(() => import('./app/admin/users/countrywise-Analysis/page'));
const ReportedUsers = lazy(() => import('./app/admin/users/reported-user-list/page'));
const CountryDetailPage = lazy(() => import('./app/admin/users/countrywise-Analysis/CountryDetailPage'));

const GroupList = lazy(() => import('./app/admin/Group/all-group-list/page'));
const GroupDetailPage = lazy(() => import('./app/admin/Group/all-group-list/groupdetail'));
const ReportedGroups = lazy(() => import('./app/admin/Group/all-reported-group-list/page'));

const RolesPage = lazy(() => import('./app/admin/roles/roles'));
const RoleDetail = lazy(() => import('./app/admin/roles/roledetail'));
const SystemUsers = lazy(() => import('./app/admin/roles/user-settings'));

const AllLivestreams = lazy(() => import('./app/admin/livestreams/all-livestreams/page'));
const ScheduledStreams = lazy(() => import('./app/admin/livestreams/scheduled/page'));
const StreamSettings = lazy(() => import('./app/admin/livestreams/settings/page'));
const StreamCategories = lazy(() => import('./app/admin/livestreams/categories/page'));
const FeaturedStreams = lazy(() => import('./app/admin/livestreams/featured/page'));
const StreamAnalytics = lazy(() => import('./app/admin/livestreams/analytics/page'));
const StreamModeration = lazy(() => import('./app/admin/livestreams/moderation/page'));
const ReportedStreams = lazy(() => import('./app/admin/livestreams/reported/page'));

const Transactions = lazy(() => import('./app/admin/finance/transactions/page'));
const UserWallets = lazy(() => import('./app/admin/finance/user-wallets/page'));
const WalletDetail = lazy(() => import('./app/admin/finance/user-wallets/walletdetail'));
const Withdrawals = lazy(() => import('./app/admin/finance/withdrawals/page'));
const TopUps = lazy(() => import('./app/admin/finance/top-ups/page'));
const PaymentMethods = lazy(() => import('./app/admin/finance/payment-methods/page'));
const FinancialReports = lazy(() => import('./app/admin/finance/reports/page'));
const GiftHistory = lazy(() => import('./app/admin/finance/gift-history/page'));

const WallpaperList = lazy(() => import('./app/admin/Wallpaper/list-all-wallpaper/page'));
const AddWallpaper = lazy(() => import('./app/admin/Wallpaper/add-a-new-wallpaper/page'));

const AvatarList = lazy(() => import('./app/admin/Avatar/list-all-avatar/page'));
const AddAvatar = lazy(() => import('./app/admin/Avatar/add-a-new-avatar/page'));

const GeneralSettings = lazy(() => import('./app/admin/Settings/page'));
const Languages = lazy(() => import('./app/admin/languages/all-languages/page'));
const Translations = lazy(() => import('./app/admin/languages/all-languages/details'));

const AddGift = lazy(() => import('./app/admin/Gift/add-new-gift/page'));
const GiftList = lazy(() => import('./app/admin/Gift/gift-list/page'));
const GiftCategories = lazy(() => import('./app/admin/Gift/gift-categories/page'));

const Login = lazy(() => import('./app/auth/login/page'));
const VerifyOtp = lazy(() => import('./app/auth/verify/page'));
const ForgotPassword = lazy(() => import('./app/auth/forgot-password/page'));
const Reset = lazy(() => import('./app/auth/forgot-password/reset'));

const Support = lazy(() => import('./app/admin/support/page'));
const Teams = lazy(() => import('./app/admin/support/team'));
const TeamDetail = lazy(() => import('./app/admin/support/viewteam'));
const Tickets = lazy(() => import('./app/admin/support/ticket'));
const TicketDetail = lazy(() => import('./app/admin/support/viewticket'));
const Reassign = lazy(() => import('./app/admin/support/assignticket'));

const Logs = lazy(() => import('./app/admin/audits/page'));

const LoadingFallback = () => (
    <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = true;

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
    }

    return <>{children}</>;
};

const AppRouter: React.FC = () => {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/login/verify-otp" element={<VerifyOtp />} />
                <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                <Route path="/auth/reset-password" element={<Reset />} />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Dashboard />} />

                    <Route path="admin/users/user-details" element={<UserDetails />} />
                    <Route path="admin/users/user-details/:id" element={<Userdetail />} />
                    <Route path="admin/users/countrywise-Analysis" element={<CountrywiseUsers />} />
                    <Route path="admin/users/countrywise-Analysis/:id" element={<CountryDetailPage />} />
                    <Route path="admin/users/reported-user-list" element={<ReportedUsers />} />

                    <Route path="admin/Group/all-group-list" element={<GroupList />} />
                    <Route path="admin/Group/all-group-list/:id" element={<GroupDetailPage />} />
                    <Route path="admin/Group/all-reported-group-list" element={<ReportedGroups />} />

                    <Route path="admin/system/roles" element={<RolesPage />} />
                    <Route path="admin/system/roles/:id" element={<RoleDetail />} />
                    <Route path='admin/system/users' element={<SystemUsers />} />

                    <Route path="admin/livestreams/all-livestreams" element={<AllLivestreams />} />
                    <Route path="admin/livestreams/scheduled" element={<ScheduledStreams />} />
                    <Route path="admin/livestreams/settings" element={<StreamSettings />} />
                    <Route path="admin/livestreams/categories" element={<StreamCategories />} />
                    <Route path="admin/livestreams/featured" element={<FeaturedStreams />} />
                    <Route path="admin/livestreams/analytics" element={<StreamAnalytics />} />
                    <Route path="admin/livestreams/moderation" element={<StreamModeration />} />
                    <Route path="admin/livestreams/reported" element={<ReportedStreams />} />

                    <Route path="admin/finance/transactions" element={<Transactions />} />
                    <Route path="admin/finance/user-wallets" element={<UserWallets />} />
                    <Route path="admin/finance/user-wallets/:id" element={<WalletDetail />} />
                    <Route path="admin/finance/withdrawals" element={<Withdrawals />} />
                    <Route path="admin/finance/top-ups" element={<TopUps />} />
                    <Route path="admin/finance/payment-methods" element={<PaymentMethods />} />
                    <Route path="admin/finance/reports" element={<FinancialReports />} />
                    <Route path="admin/finance/gift-history" element={<GiftHistory />} />

                    <Route path="admin/Wallpaper/list-all-wallpaper" element={<WallpaperList />} />
                    <Route path="admin/Wallpaper/add-a-new-wallpaper" element={<AddWallpaper />} />

                    <Route path="admin/Avatar/list-all-avatar" element={<AvatarList />} />
                    <Route path="admin/Avatar/add-a-new-avatar" element={<AddAvatar />} />

                    <Route path="admin/settings" element={<GeneralSettings />} />
                    <Route path="admin/languages" element={<Languages />} />
                    <Route path="admin/languages/:id/translations" element={<Translations />} />

                    <Route path="admin/gifts/gift-list" element={<GiftList />} />
                    <Route path="admin/gifts/add-gift" element={<AddGift />} />
                    <Route path="admin/gifts/gift-categories" element={<GiftCategories />} />

                    <Route path="admin/support" element={<Support />} />
                    <Route path="/admin/support/teams" element={<Teams />} />
                    <Route path="/admin/support/teams/:id" element={<TeamDetail />} />
                    <Route path="/admin/support/tickets" element={<Tickets />} />
                    <Route path="/admin/support/tickets/:id" element={<TicketDetail />} />
                    <Route path="/admin/support/assignments" element={<Reassign />} />

                    <Route path="admin/logs" element={<Logs />} />

                </Route>

                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </Suspense>
    );
};

export default AppRouter;