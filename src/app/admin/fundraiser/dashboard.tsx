import { useState, useEffect } from "react";
import { fundraiserService } from "../../../api/services/fundraiser";
import { toast } from "react-hot-toast";
import DashboardHeader from "../../../components/fundraiser/DashboardHeader";
import StatisticsCards from "../../../components/fundraiser/StatisticsCards";
import AnalyticsSection from "../../../components/fundraiser/AnalyticsSection";
import CampaignsList from "../../../components/fundraiser/CampaignsList";
import ReportModal from "../../../components/fundraiser/ReportModal";

const FundraisingDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({
    campaigns: {
      total: 0,
      pending: 0,
      active: 0,
      completed: 0,
      flagged: 0,
    },
    payouts: {
      total: 0,
      pending: 0,
      approved: 0,
    },
    donations: {
      total: 0,
    },
    revenue: {
      totalRaised: 0,
      platformFees: 0,
    },
    compliance: {
      pendingKYC: 0,
      verifiedOrganizers: 0,
      riskAlerts: 0,
    },
    support: {
      openTickets: 0,
      resolvedToday: 0,
    },
    fraud: {
      highRiskCampaigns: 0,
      suspiciousTransactions: 0,
    },
  });

  // Analytics state
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [donationAnalytics, setDonationAnalytics] = useState(null);
  const [campaignAnalytics, setCampaignAnalytics] = useState(null);

  // Report modal state
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        const response = await fundraiserService.getDashboardStats();
        const res = await fundraiserService.getCampaigns(1, 4);
        setStats(response.data);
        setCampaigns(res.data);

        await loadAnalyticsData();
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const loadAnalyticsData = async () => {
    setAnalyticsLoading(true);
    try {
      const [performanceRes, donationRes, campaignRes] = await Promise.all([
        fundraiserService.getPerformanceMetrics(),
        fundraiserService.getDonationAnalytics(),
        fundraiserService.getCampaignAnalytics(),
      ]);

      // Parse performance metrics data
      if (performanceRes.data) {
        const parsedPerformanceMetrics = {
          systemHealth: performanceRes.data.systemHealth || {},
          platformMetrics: performanceRes.data.platformMetrics || {},
          financialMetrics: {
            ...performanceRes.data.financialMetrics,
            totalRevenue: formatDotSeparatedAmount(
              performanceRes.data.financialMetrics?.totalRevenue
            ),
            platformFee: performanceRes.data.financialMetrics?.platformFee || 0,
            processingFee:
              performanceRes.data.financialMetrics?.processingFee || 0,
            netRevenue: performanceRes.data.financialMetrics?.netRevenue || 0,
          },
        };
        setPerformanceMetrics(parsedPerformanceMetrics);
      }

      // Parse campaign analytics data
      if (campaignRes.data) {
        // Format totalDonations and calculate proper average
        const totalDonationsAmount = formatDotSeparatedAmount(
          campaignRes.data.totalDonations
        );
        const avgDonation =
          campaignRes.data.averageDonation ||
          (campaignRes.data.donationsCount > 0
            ? (totalDonationsAmount / campaignRes.data.donationsCount).toFixed(
                2
              )
            : 0);

        // Calculate recent trend from daily stats
        const recentTrend = campaignRes.data.dailyStats
          ? calculateTrend(campaignRes.data.dailyStats)
          : { direction: "stable", percentage: 0 };

        const processedDailyStats = campaignRes.data.dailyStats.map((day) => ({
          date: day.date,
          donorsCount: day.donorsCount,
          donationsAmount: formatDotSeparatedAmount(day.donations),
        }));

        setCampaignAnalytics({
          totalDonations: totalDonationsAmount,
          donationsCount: campaignRes.data.donationsCount,
          averageDonation: avgDonation,
          completionPercentage: campaignRes.data.completionPercentage || 0,
          daysRemaining: campaignRes.data.daysRemaining || 0,
          dailyStats: processedDailyStats,
          topDonors:
            campaignRes.data.topDonors.map((donor) => ({
              ...donor,
              amount: formatDotSeparatedAmount(donor.amount),
            })) || [],
          period: campaignRes.data.period || "month",
          recentTrend: recentTrend,
        });
      }

      // Set donation analytics
      setDonationAnalytics(donationRes.data);
    } catch (error) {
      console.error("Error loading analytics data:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Helper function to format dot-separated amount strings
  const formatDotSeparatedAmount = (amountString) => {
    if (!amountString) return 0;

    // Remove dots and extract actual numbers
    const cleanedString = amountString.replace(/\./g, "");

    // Parse as a number
    try {
      const numbers = cleanedString.match(/\d+/g) || [];
      return numbers.reduce((sum, num) => sum + parseInt(num, 10), 0);
    } catch (e) {
      console.error("Error parsing amount string:", e);
      return 0;
    }
  };

  // Calculate trend helper function
  const calculateTrend = (dailyStats) => {
    if (!dailyStats || dailyStats.length < 2)
      return { direction: "stable", percentage: 0 };

    const latestPeriod = dailyStats[dailyStats.length - 1];
    const previousPeriod = dailyStats[dailyStats.length - 2];

    if (!latestPeriod || !previousPeriod)
      return { direction: "stable", percentage: 0 };

    const latestDonors = latestPeriod.donorsCount || 0;
    const previousDonors = previousPeriod.donorsCount || 0;

    if (previousDonors === 0) return { direction: "up", percentage: 100 };

    const percentageChange =
      ((latestDonors - previousDonors) / previousDonors) * 100;
    const direction =
      percentageChange > 0 ? "up" : percentageChange < 0 ? "down" : "stable";

    return {
      direction,
      percentage: Math.abs(Math.round(percentageChange)),
    };
  };

  return (
    <div className="p-6 w-full mx-auto max-w-[1600px]">
      <div className="">
        <DashboardHeader />

        <StatisticsCards stats={stats} isLoading={isLoading} />

        <AnalyticsSection
          performanceMetrics={performanceMetrics}
          donationAnalytics={donationAnalytics}
          campaignAnalytics={campaignAnalytics}
          analyticsLoading={analyticsLoading}
        />

        <CampaignsList
          campaigns={campaigns}
          isLoading={isLoading}
          setShowReportModal={setShowReportModal}
        />

        <ReportModal
          showModal={showReportModal}
          setShowModal={setShowReportModal}
        />
      </div>
    </div>
  );
};

export default FundraisingDashboard;
