import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Calendar,
  Eye,
  Ban,
  CheckCircle,
  User,
  Flag,
  Clock,
  Bell,
  X,
  Loader,
  Filter,
  ChevronDown,
  Phone,
  Mail,
  Users,
} from "lucide-react";
import SearchBox from "../../../../components/common/SearchBox";
import Pagination from "../../../../components/common/Pagination";
import { contactService } from "../../../../api/services/contact";
import { FlaggedContact } from "../../../../types";

const FlaggedContactsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [flaggedContacts, setFlaggedContacts] = useState<FlaggedContact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<FlaggedContact[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "safaricom",
    "pending",
    "business",
  ]);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "reviewed" | "cleared"
  >("all");

  const [selectedContact, setSelectedContact] = useState<FlaggedContact | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlaggedContacts = async () => {
      try {
        setIsLoading(true);
        const response = await contactService.getReportedUsers();

        const contactsData = response?.contacts || [];
        const contactsWithStatus = contactsData.map(
          (contact: FlaggedContact) => ({
            ...contact,
            status: (contact.status || "pending") as
              | "pending"
              | "reviewed"
              | "cleared",
            flagged_at: contact.flagged_at || new Date().toISOString(),
            reason:
              contact.reason || "Contact has been flagged by system for review",
            flagged_by: contact.flagged_by || [
              {
                id: "system",
                username: "system",
                first_name: "System",
                last_name: "Monitor",
              },
            ],
          })
        );

        setFlaggedContacts(contactsWithStatus);
        setFilteredContacts(contactsWithStatus);
        setError(null);
      } catch (err) {
        console.error("Error fetching flagged contacts:", err);
        setError("Failed to load flagged contacts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlaggedContacts();
  }, []);

  // Apply filters to the contacts
  useEffect(() => {
    let filtered = [...flaggedContacts];

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((contact) => contact.status === statusFilter);
    }

    // Apply search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (contact) =>
          (contact.user_details.username &&
            contact.user_details.username.toLowerCase().includes(query)) ||
          (contact.user_details.first_name &&
            contact.user_details.first_name.toLowerCase().includes(query)) ||
          (contact.user_details.last_name &&
            contact.user_details.last_name.toLowerCase().includes(query)) ||
          (contact.user_details.email &&
            contact.user_details.email.toLowerCase().includes(query)) ||
          (contact.user_details.phone_number &&
            contact.user_details.phone_number.includes(query)) ||
          (contact.contact_id &&
            contact.contact_id.toLowerCase().includes(query))
      );
    }

    setFilteredContacts(filtered);
    setCurrentPage(1);
  }, [flaggedContacts, statusFilter, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() !== "" && !recentSearches.includes(query)) {
      setRecentSearches((prev) => [query, ...prev.slice(0, 4)]);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (perPage: number) => {
    setItemsPerPage(perPage);
    setCurrentPage(1);
  };

  const handleExport = () => {
    if (filteredContacts.length === 0) {
      alert("No contacts to export");
      return;
    }
    alert("Export functionality would go here");
  };

  const handleViewContact = (contact: FlaggedContact) => {
    setSelectedContact(contact);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedContact(null);
    setShowModal(false);
  };

  const handleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const currentPageData = getCurrentPageData();
    const allSelected = currentPageData.every((contact) =>
      selectedRows.includes(contact.contact_id)
    );

    if (allSelected) {
      setSelectedRows((prev) =>
        prev.filter(
          (id) => !currentPageData.some((contact) => contact.contact_id === id)
        )
      );
    } else {
      const newSelections = currentPageData.map(
        (contact) => contact.contact_id
      );
      setSelectedRows((prev) => [...new Set([...prev, ...newSelections])]);
    }
  };

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredContacts.slice(startIndex, endIndex);
  };

  // Actions for handling flagged contacts
  const handleReviewContact = async (id: string) => {
    try {
      setActionInProgress(id);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Update the local state
      const updatedContacts = flaggedContacts.map((contact) =>
        contact.contact_id === id
          ? { ...contact, status: "reviewed" as const }
          : contact
      );

      setFlaggedContacts(updatedContacts);

      alert("Contact marked as reviewed");
    } catch (error) {
      console.error("Error updating contact status:", error);
      alert("Failed to update contact status. Please try again.");
    } finally {
      setActionInProgress(null);
    }
  };

  const handleClearContact = async (id: string) => {
    try {
      setActionInProgress(id);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Update the local state
      const updatedContacts = flaggedContacts.map((contact) =>
        contact.contact_id === id
          ? { ...contact, status: "cleared" as const }
          : contact
      );

      setFlaggedContacts(updatedContacts);

      alert("Contact cleared from flagged list");
    } catch (error) {
      console.error("Error clearing contact:", error);
      alert("Failed to clear contact. Please try again.");
    } finally {
      setActionInProgress(null);
    }
  };

  const handleBlockContact = async (id: string) => {
    try {
      setActionInProgress(id);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // In a real implementation, you'd call an API to block the contact
      alert("Contact blocked");
    } catch (error) {
      console.error("Error blocking contact:", error);
      alert("Failed to block contact. Please try again.");
    } finally {
      setActionInProgress(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      return { formattedDate, formattedTime };
    } catch (error) {
      console.error("Error formatting date:", error);
      return { formattedDate: "Invalid date", formattedTime: "" };
    }
  };

  // Helper to get the full name of a user
  const getUserFullName = (contact: FlaggedContact) => {
    if (!contact.user_details) return "Unknown User";

    const firstName = contact.user_details.first_name || "";
    const lastName = contact.user_details.last_name || "";

    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }

    return contact.user_details.username || "Unknown User";
  };

  // Helper to get initials for avatar
  const getUserInitials = (contact: FlaggedContact) => {
    const fullName = getUserFullName(contact);

    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Get appropriate color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-100 dark:border-yellow-800/50";
      case "reviewed":
        return "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800/50";
      case "cleared":
        return "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-100 dark:border-green-800/50";
      default:
        return "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-100 dark:border-gray-600";
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Flagged Contacts
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Review and manage contacts that have been flagged for suspicious
            activity
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <motion.button
            className="flex items-center px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 text-sm shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
            whileTap={{ y: 0 }}
          >
            <Bell size={16} className="mr-2" strokeWidth={1.8} />
            Notification Settings
          </motion.button>
          <motion.button
            className="flex items-center px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 text-sm shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
            whileTap={{ y: 0 }}
            onClick={handleExport}
          >
            <Download size={16} className="mr-2" strokeWidth={1.8} />
            Export
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {/* Stats Cards */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center"
          whileHover={{
            y: -4,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div className="mr-4 p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
            <Flag
              size={20}
              className="text-yellow-500 dark:text-yellow-400"
              strokeWidth={1.8}
            />
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              Pending Review
            </p>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {flaggedContacts.filter((c) => c.status === "pending").length}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-xs">
              Needs attention
            </p>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center"
          whileHover={{
            y: -4,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div className="mr-4 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <Eye
              size={20}
              className="text-blue-500 dark:text-blue-400"
              strokeWidth={1.8}
            />
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-xs">Reviewed</p>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {flaggedContacts.filter((c) => c.status === "reviewed").length}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-xs">
              Under investigation
            </p>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center"
          whileHover={{
            y: -4,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div className="mr-4 p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <CheckCircle
              size={20}
              className="text-green-500 dark:text-green-400"
              strokeWidth={1.8}
            />
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-xs">Cleared</p>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {flaggedContacts.filter((c) => c.status === "cleared").length}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-xs">
              No issues found
            </p>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="flex flex-col md:flex-row gap-4 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex-grow">
          <SearchBox
            placeholder="Search contacts by name, email, or phone..."
            onSearch={handleSearch}
            suggestions={["business", "suspicious", "pending"]}
            recentSearches={recentSearches}
            showRecentByDefault={true}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-xl border transition-all 
              ${
                statusFilter !== "all"
                  ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <Filter size={16} strokeWidth={1.8} />
              <span>Status</span>
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>

            {showFilters && (
              <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 w-48 z-10 p-2">
                <div className="p-2 border-b border-gray-100 dark:border-gray-700 mb-2">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Filter by Status
                  </h3>
                </div>
                <div className="space-y-1">
                  {["all", "pending", "reviewed", "cleared"].map((status) => (
                    <div
                      key={status}
                      className={`flex items-center px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                        statusFilter === status
                          ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                          : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                      onClick={() => {
                        setStatusFilter(status as any);
                        setShowFilters(false);
                      }}
                    >
                      <div
                        className={`w-4 h-4 rounded-sm mr-3 flex items-center justify-center ${
                          statusFilter === status
                            ? "bg-indigo-500 dark:bg-indigo-600 text-white"
                            : "border border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        {statusFilter === status && <CheckCircle size={12} />}
                      </div>
                      <span className="text-sm capitalize">
                        {status === "all" ? "All Statuses" : status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {error ? (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-700">
            <p>{error}</p>
            <button
              className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 text-red-800 dark:text-red-200 rounded-md"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader className="h-8 w-8 text-indigo-500 dark:text-indigo-400 animate-spin" />
                <span className="ml-2 text-gray-500 dark:text-gray-400">
                  Loading flagged contacts...
                </span>
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                <Users className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                  No flagged contacts found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  {searchQuery
                    ? "No contacts match your search criteria."
                    : "There are currently no flagged contacts to review."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-indigo-600 focus:ring-indigo-500"
                          checked={
                            getCurrentPageData().length > 0 &&
                            getCurrentPageData().every((contact) =>
                              selectedRows.includes(contact.contact_id)
                            )
                          }
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Contact
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Contact Info
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Flag Count
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Date Flagged
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {getCurrentPageData().map((contact) => {
                      const { formattedDate, formattedTime } = formatDate(
                        contact.flagged_at || new Date().toISOString()
                      );
                      const fullName = getUserFullName(contact);
                      const initials = getUserInitials(contact);

                      return (
                        <tr
                          key={contact.contact_id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-indigo-600 focus:ring-indigo-500"
                              checked={selectedRows.includes(
                                contact.contact_id
                              )}
                              onChange={() =>
                                handleSelectRow(contact.contact_id)
                              }
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {contact.user_details.profile_picture ? (
                                <img
                                  src={contact.user_details.profile_picture}
                                  alt={fullName}
                                  className="w-10 h-10 rounded-full object-cover mr-3"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-medium text-sm mr-3">
                                  {initials}
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-gray-800 dark:text-gray-200">
                                  {fullName}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  @{contact.user_details.username}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <Phone size={14} className="mr-2" />
                                {contact.user_details.phone_number}
                              </div>
                              {contact.user_details.email && (
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                  <Mail size={14} className="mr-2" />
                                  {contact.user_details.email}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                contact.status || "pending"
                              )}`}
                            >
                              {contact.status === "pending" && (
                                <Clock size={12} className="mr-1.5" />
                              )}
                              {contact.status === "reviewed" && (
                                <Eye size={12} className="mr-1.5" />
                              )}
                              {contact.status === "cleared" && (
                                <CheckCircle size={12} className="mr-1.5" />
                              )}
                              {contact.status
                                ? contact.status.charAt(0).toUpperCase() +
                                  contact.status.slice(1)
                                : "Pending"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Flag
                                size={14}
                                className="text-red-500 dark:text-red-400 mr-2"
                              />
                              <span className="text-gray-700 dark:text-gray-300 font-medium">
                                {contact._count.contact_id || 1}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col text-sm">
                              <div className="flex items-center">
                                <Calendar
                                  size={14}
                                  className="text-gray-400 dark:text-gray-500 mr-1.5"
                                  strokeWidth={1.8}
                                />
                                <span className="text-gray-800 dark:text-gray-200">
                                  {formattedDate}
                                </span>
                              </div>
                              {formattedTime && (
                                <div className="flex items-center mt-1">
                                  <Clock
                                    size={14}
                                    className="text-gray-400 dark:text-gray-500 mr-1.5"
                                    strokeWidth={1.8}
                                  />
                                  <span className="text-gray-500 dark:text-gray-400">
                                    {formattedTime}
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-1">
                              <motion.button
                                className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                aria-label="View contact details"
                                onClick={() => handleViewContact(contact)}
                                disabled={
                                  actionInProgress === contact.contact_id
                                }
                              >
                                <Eye size={16} strokeWidth={1.8} />
                              </motion.button>

                              {contact.status === "pending" && (
                                <motion.button
                                  className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  aria-label="Mark as reviewed"
                                  onClick={() =>
                                    handleReviewContact(contact.contact_id)
                                  }
                                  disabled={
                                    actionInProgress === contact.contact_id
                                  }
                                >
                                  <Eye size={16} strokeWidth={1.8} />
                                </motion.button>
                              )}

                              {(contact.status === "pending" ||
                                contact.status === "reviewed") && (
                                <>
                                  <motion.button
                                    className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    aria-label="Block contact"
                                    onClick={() =>
                                      handleBlockContact(contact.contact_id)
                                    }
                                    disabled={
                                      actionInProgress === contact.contact_id
                                    }
                                  >
                                    <Ban size={16} strokeWidth={1.8} />
                                  </motion.button>
                                  <motion.button
                                    className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-600 dark:hover:text-green-400"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    aria-label="Clear flag"
                                    onClick={() =>
                                      handleClearContact(contact.contact_id)
                                    }
                                    disabled={
                                      actionInProgress === contact.contact_id
                                    }
                                  >
                                    <CheckCircle size={16} strokeWidth={1.8} />
                                  </motion.button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Pagination
          totalItems={filteredContacts.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          showItemsPerPage={true}
          itemsPerPageOptions={[10, 25, 50, 100]}
          showSummary={true}
        />
      </motion.div>

      <AnimatePresence>
        {showModal && selectedContact && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  Contact Details
                </h3>
                <button
                  className="p-1 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={handleCloseModal}
                >
                  <X size={20} strokeWidth={1.8} />
                </button>
              </div>

              <div className="p-5 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-6">
                      <div className="flex items-center mb-4">
                        {selectedContact.user_details.profile_picture ? (
                          <img
                            src={selectedContact.user_details.profile_picture}
                            alt={getUserFullName(selectedContact)}
                            className="w-20 h-20 rounded-full object-cover mr-4"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-xl font-medium mr-4">
                            {getUserInitials(selectedContact)}
                          </div>
                        )}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                            {getUserFullName(selectedContact)}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400">
                            @{selectedContact.user_details.username}
                          </p>
                          <div className="mt-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                selectedContact.status || "pending"
                              )}`}
                            >
                              {selectedContact.status === "pending" && (
                                <Clock size={12} className="mr-1.5" />
                              )}
                              {selectedContact.status === "reviewed" && (
                                <Eye size={12} className="mr-1.5" />
                              )}
                              {selectedContact.status === "cleared" && (
                                <CheckCircle size={12} className="mr-1.5" />
                              )}
                              {selectedContact.status
                                ? selectedContact.status
                                    .charAt(0)
                                    .toUpperCase() +
                                  selectedContact.status.slice(1)
                                : "Pending"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                        <div className="flex items-center">
                          <Phone
                            size={16}
                            className="text-gray-500 dark:text-gray-400 mr-3"
                          />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Phone Number
                            </p>
                            <p className="text-gray-800 dark:text-gray-200">
                              {selectedContact.user_details.phone_number}
                            </p>
                          </div>
                        </div>

                        {selectedContact.user_details.email && (
                          <div className="flex items-center">
                            <Mail
                              size={16}
                              className="text-gray-500 dark:text-gray-400 mr-3"
                            />
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Email
                              </p>
                              <p className="text-gray-800 dark:text-gray-200">
                                {selectedContact.user_details.email}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center">
                          <Flag
                            size={16}
                            className="text-red-500 dark:text-red-400 mr-3"
                          />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Flag Count
                            </p>
                            <p className="text-gray-800 dark:text-gray-200">
                              {selectedContact._count.contact_id || 1} time(s)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Flag Information
                      </h4>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600 dark:text-gray-400 text-sm">
                            Status:
                          </span>
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              selectedContact.status || "pending"
                            )}`}
                          >
                            {selectedContact.status === "pending" && (
                              <Clock size={12} className="mr-1.5" />
                            )}
                            {selectedContact.status === "reviewed" && (
                              <Eye size={12} className="mr-1.5" />
                            )}
                            {selectedContact.status === "cleared" && (
                              <CheckCircle size={12} className="mr-1.5" />
                            )}
                            {selectedContact.status
                              ? selectedContact.status.charAt(0).toUpperCase() +
                                selectedContact.status.slice(1)
                              : "Pending"}
                          </span>
                        </div>

                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600 dark:text-gray-400 text-sm">
                            Flagged At:
                          </span>
                          <span className="text-gray-800 dark:text-gray-200 text-sm">
                            {
                              formatDate(
                                selectedContact.flagged_at ||
                                  new Date().toISOString()
                              ).formattedDate
                            }
                          </span>
                        </div>

                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600 dark:text-gray-400 text-sm">
                            Contact ID:
                          </span>
                          <span className="text-gray-800 dark:text-gray-200 text-sm font-mono text-xs">
                            {selectedContact.contact_id}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Flag Reason
                      </h4>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                          {selectedContact.reason ||
                            "This contact has been flagged for review."}
                        </p>
                      </div>
                    </div>

                    {selectedContact.flagged_by &&
                      selectedContact.flagged_by.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            Flagged By
                          </h4>
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <ul className="space-y-2">
                              {selectedContact.flagged_by.map(
                                (flagger, index) => (
                                  <li key={index} className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-3">
                                      <User
                                        size={14}
                                        className="text-gray-500 dark:text-gray-400"
                                      />
                                    </div>
                                    <div>
                                      <p className="text-gray-800 dark:text-gray-200 text-sm">
                                        {flagger.first_name && flagger.last_name
                                          ? `${flagger.first_name} ${flagger.last_name}`
                                          : flagger.username}
                                      </p>
                                    </div>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        </div>
                      )}

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Actions
                      </h4>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex flex-wrap gap-2">
                        {selectedContact.status === "pending" && (
                          <button
                            className="flex items-center px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm"
                            onClick={() => {
                              handleReviewContact(selectedContact.contact_id);
                              handleCloseModal();
                            }}
                          >
                            <Eye size={16} className="mr-2" strokeWidth={1.8} />
                            Mark as Reviewed
                          </button>
                        )}

                        {(selectedContact.status === "pending" ||
                          selectedContact.status === "reviewed") && (
                          <>
                            <button
                              className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
                              onClick={() => {
                                handleBlockContact(selectedContact.contact_id);
                                handleCloseModal();
                              }}
                            >
                              <Ban
                                size={16}
                                className="mr-2"
                                strokeWidth={1.8}
                              />
                              Block Contact
                            </button>
                            <button
                              className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                              onClick={() => {
                                handleClearContact(selectedContact.contact_id);
                                handleCloseModal();
                              }}
                            >
                              <CheckCircle
                                size={16}
                                className="mr-2"
                                strokeWidth={1.8}
                              />
                              Clear Flag
                            </button>
                          </>
                        )}

                        <button
                          className="flex items-center px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg text-sm ml-auto"
                          onClick={handleCloseModal}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FlaggedContactsPage;
