export const getPageTitle = (pathname: string) => {
    const appName = "Wasaa";
  
    const routeTitles: {[key: string]: string} = {
      "/auth/login": `Login | ${appName}`,
      "/auth/login/verify-otp": `Verify OTP | ${appName}`,
      "/auth/forgot-password": `Forgot Password | ${appName}`,
      "/auth/reset-password": `Reset Password | ${appName}`,
      "/user/set-password": `Set Password | ${appName}`,
      "/unauthorized": `Unauthorized | ${appName}`,
      
      "/": `Dashboard | ${appName}`,
  
      "/admin/users/user-details": `User Management | ${appName}`,
      "/admin/users/countrywise-Analysis": `Users by Country | ${appName}`,
      "/admin/users/reported-user-list": `Reported Users | ${appName}`,
      
      "/admin/Group/all-group-list": `Group Management | ${appName}`,
      "/admin/Group/all-reported-group-list": `Reported Groups | ${appName}`,
      
      "/admin/system/roles": `System Roles | ${appName}`,
      "/admin/system/roles/create": `Create Role | ${appName}`,
      "/admin/system/users": `System Users | ${appName}`,
      
      "/admin/livestreams/all-livestreams": `All Livestreams | ${appName}`,
      "/admin/livestreams/scheduled": `Scheduled Streams | ${appName}`,
      "/admin/livestreams/settings": `Stream Settings | ${appName}`,
      "/admin/livestreams/categories": `Stream Categories | ${appName}`,
      "/admin/livestreams/featured": `Featured Streams | ${appName}`,
      "/admin/livestreams/analytics": `Stream Analytics | ${appName}`,
      "/admin/livestreams/moderation": `Stream Moderation | ${appName}`,
      "/admin/livestreams/reported": `Reported Streams | ${appName}`,
      
      "/admin/finance/transactions": `Transactions | ${appName}`,
      "/admin/finance/tariffs": `Tariffs | ${appName}`,
      "/admin/finance/tariffs/add": `Add Tariff | ${appName}`,
      "/admin/finance/limits": `Transaction Limits | ${appName}`,
      "/admin/finance/limits/add": `Add KYC Level | ${appName}`,
      "/admin/finance/limits/verification": `Verification Management | ${appName}`,
      "/admin/finance/compliance": `AML Compliance | ${appName}`,
      "/admin/finance/wallets": `System Wallets | ${appName}`,
      "/admin/finance/wallets/reversal-requests": `Reversal Requests | ${appName}`,
      "/admin/finance/banks": `Bank Accounts | ${appName}`,
      "/admin/finance/user-wallets": `User Wallets | ${appName}`,
      "/admin/finance/withdrawals": `Withdrawals | ${appName}`,
      "/admin/finance/top-ups": `Top-ups | ${appName}`,
      "/admin/finance/payment-methods": `Payment Methods | ${appName}`,
      "/admin/finance/reports": `Financial Reports | ${appName}`,
      "/admin/finance/gift-history": `Gift Transaction History | ${appName}`,
      
      "/admin/Wallpaper/list-all-wallpaper": `Wallpapers | ${appName}`,
      "/admin/Wallpaper/add-a-new-wallpaper": `Add Wallpaper | ${appName}`,
      "/admin/Avatar/list-all-avatar": `Avatars | ${appName}`,
      "/admin/Avatar/add-a-new-avatar": `Add Avatar | ${appName}`,
      
      "/admin/settings": `General Settings | ${appName}`,
      "/admin/emojis": `Emoji Management | ${appName}`,
      "/admin/languages": `Languages | ${appName}`,
      
      "/admin/gifts/gift-list": `Gift Management | ${appName}`,
      "/admin/gifts/add-gift": `Add Gift | ${appName}`,
      "/admin/gifts/gift-categories": `Gift Categories | ${appName}`,
      
      "/admin/media/shorts": `Shorts Dashboard | ${appName}`,
      "/admin/media/shorts/moderation": `Content Moderation | ${appName}`,
      "/admin/media/shorts/reports": `Content Reports | ${appName}`,
      "/admin/media/shorts/comments": `Comments Management | ${appName}`,
      "/admin/media/shorts/hashtags": `Hashtag Management | ${appName}`,
      "/admin/media/shorts/hashtags/blocked": `Blocked Hashtags | ${appName}`,
      "/admin/media/shorts/hashtags/trending": `Trending Hashtags | ${appName}`,
      "/admin/media/shorts/creators": `Creator Management | ${appName}`,
      "/admin/media/shorts/promotion": `Content Promotion | ${appName}`,
      "/admin/media/shorts/promotion/trending": `Trending Content | ${appName}`,
      "/admin/media/shorts/promotion/featured": `Featured Content | ${appName}`,
      "/admin/media/shorts/analytics": `Content Analytics | ${appName}`,
      "/admin/media/shorts/analytics/videos": `Video Performance | ${appName}`,
      "/admin/media/shorts/analytics/moderation": `Moderation Metrics | ${appName}`,
      "/admin/media/shorts/notifications": `Content Notifications | ${appName}`,
      "/admin/media/shorts/notifications/templates": `Notification Templates | ${appName}`,
      "/admin/media/shorts/settings": `Shorts Settings | ${appName}`,
      
      "/admin/support": `Support Dashboard | ${appName}`,
      "/admin/support/tickets": `Support Tickets | ${appName}`,
      "/admin/support/agents": `Support Agents | ${appName}`,
      "/admin/support/categories": `Support Categories | ${appName}`,
      "/admin/support/canned-responses": `Canned Responses | ${appName}`,
      "/admin/support/sla": `SLA Management | ${appName}`,
      "/admin/support/analytics": `Support Analytics | ${appName}`,
      
      "/admin/logs": `Audit Logs | ${appName}`,
    };
  
    if (pathname.match(/^\/admin\/users\/user-details\/[^/]+$/)) {
      return `User Details | ${appName}`;
    }
    if (pathname.match(/^\/admin\/users\/[^/]+$/)) {
      return `Admin User Profile | ${appName}`;
    }
    if (pathname.match(/^\/admin\/Group\/all-group-list\/[^/]+$/)) {
      return `Group Details | ${appName}`;
    }
    if (pathname.match(/^\/admin\/system\/roles\/[^/]+$/)) {
      return `Role Details | ${appName}`;
    }
    if (pathname.match(/^\/admin\/finance\/transactions\/receipt\/[^/]+$/)) {
      return `Transaction Receipt | ${appName}`;
    }
    if (pathname.match(/^\/admin\/finance\/tariffs\/edit\/[^/]+$/)) {
      return `Edit Tariff | ${appName}`;
    }
    if (pathname.match(/^\/admin\/finance\/limits\/edit\/[^/]+$/)) {
      return `Edit KYC Level | ${appName}`;
    }
    if (pathname.match(/^\/admin\/finance\/user-wallets\/[^/]+$/)) {
      return `Wallet Details | ${appName}`;
    }
    if (pathname.match(/^\/admin\/languages\/[^/]+\/translations$/)) {
      return `Language Translations | ${appName}`;
    }
    if (pathname.match(/^\/admin\/media\/shorts\/moderation\/[^/]+$/)) {
      return `Video Moderation | ${appName}`;
    }
    if (pathname.match(/^\/admin\/media\/shorts\/reports\/[^/]+$/)) {
      return `Report Details | ${appName}`;
    }
    if (pathname.match(/^\/admin\/media\/shorts\/comments\/[^/]+$/)) {
      return `Video Comments | ${appName}`;
    }
    if (pathname.match(/^\/admin\/media\/shorts\/creators\/[^/]+$/)) {
      return `Creator Profile | ${appName}`;
    }
    if (pathname.match(/^\/admin\/support\/tickets\/[^/]+$/)) {
      return `Ticket Details | ${appName}`;
    }
    if (pathname.match(/^\/admin\/audit-logs\/[^/]+$/)) {
      return `Audit Log Details | ${appName}`;
    }
  
    if (pathname === "*") {
      return `Page Not Found | ${appName}`;
    }
  
    return routeTitles[pathname] || `${appName} Admin`;
  };