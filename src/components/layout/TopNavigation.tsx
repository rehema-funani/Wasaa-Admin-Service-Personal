import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Search,
  X,
  Bell,
  ArrowRight,
  Menu,
  User,
  Settings,
  LogOut,
  CreditCard,
  AlertCircle,
  BarChart3,
  Shield,
  Wallet,
  Sparkles,
  TrendingUp,
  Eye,
  Lock,
  Sun,
  Moon,
} from "lucide-react";
import routes from "../../constants/routes";
import logo from "../../assets/images/logo-wasaa.png";
import {
  getUserPermissions,
  routePermissionsMap,
} from "../../utils/permissions";
import { notificationService } from "../../api/services/notification";
import { useTheme } from "../../context/ThemeContext";

const getRequiredPermissionsForRoute = (path: string) => {
  if (!routePermissionsMap[path]) {
    const pathParts = path.split("/");
    const possibleRoutes = Object.keys(routePermissionsMap);

    for (const route of possibleRoutes) {
      const routeParts = route.split("/");

      if (routeParts.length === pathParts.length) {
        let isMatch = true;

        for (let i = 0; i < routeParts.length; i++) {
          if (routeParts[i].startsWith(":") || routeParts[i] === pathParts[i]) {
            continue;
          } else {
            isMatch = false;
            break;
          }
        }

        if (isMatch) {
          return routePermissionsMap[route];
        }
      }
    }
  }

  return routePermissionsMap[path] || [];
};

const hasPermissionForRoute = (path: string, userPermissions: string[]) => {
  const requiredPermissions = getRequiredPermissionsForRoute(path);
  if (requiredPermissions.length === 0) {
    return true;
  }
  return requiredPermissions.some((permission) =>
    userPermissions.includes(permission)
  );
};

const TopNavigation = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeNestedDropdown, setActiveNestedDropdown] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoverState, setHoverState] = useState({ section: null, item: null });

  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [showTimeIndicator, setShowTimeIndicator] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  const dropdownRefs = useRef({});
  const searchInputRef = useRef(null);
  const searchResultsRef = useRef(null);
  const notificationsRef = useRef(null);
  const userMenuRef = useRef(null);
  const navRef = useRef(null);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();
  const { isDarkMode, toggleMode } = useTheme();

  const user = localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData"))
    : null;
  const userPermissions = getUserPermissions();

  const getNotifications = async () => {
    try {
      const response = await notificationService.getUserNotifications(user?.id);
      setNotifications(response.notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    getNotifications();
  }, [notificationsOpen]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      }).format(now);
      setCurrentTime(formattedTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleClickOutside = (event: any) => {
      if (activeDropdown) {
        const ref = dropdownRefs.current[activeDropdown];
        if (ref && !ref.contains(event.target)) {
          setActiveDropdown(null);
          setActiveNestedDropdown(null);
        }
      }

      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSearchResults(false);
      }

      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }

      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [activeDropdown]);

  const closeAllMenus = () => {
    setActiveDropdown(null);
    setActiveNestedDropdown(null);
    setNotificationsOpen(false);
    setUserMenuOpen(false);
    setShowSearchResults(false);
    setIsSearchOpen(false);
  };

  const getAllSearchableRoutes = () => {
    const searchableRoutes = [];

    const processRoutes = (items, category = "") => {
      items.forEach((item) => {
        if (item.type === "section") {
          processRoutes(item.items, item.title);
        } else if (item.type === "link") {
          if (hasPermissionForRoute(item.path, userPermissions)) {
            searchableRoutes.push({
              title: item.title,
              path: item.path,
              category: category,
              icon: item.icon,
            });
          }
        } else if (item.type === "dropdown") {
          item.items.forEach((subItem) => {
            if (hasPermissionForRoute(subItem.path, userPermissions)) {
              searchableRoutes.push({
                title: subItem.title,
                path: subItem.path,
                category: item.title,
                icon: item.icon,
              });
            }
          });
        }
      });
    };

    processRoutes(routes);
    return searchableRoutes;
  };

  const performSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setSelectedResultIndex(-1);
      return;
    }

    const allRoutes = getAllSearchableRoutes();
    const term = searchTerm.toLowerCase();

    const filteredResults = allRoutes.filter(
      (route) =>
        route.title.toLowerCase().includes(term) ||
        route.category.toLowerCase().includes(term) ||
        route.path.toLowerCase().includes(term)
    );

    const sortedResults = filteredResults.sort((a, b) => {
      const aExactMatch = a.title.toLowerCase() === term ? -1 : 0;
      const bExactMatch = b.title.toLowerCase() === term ? -1 : 0;

      if (aExactMatch !== bExactMatch) return aExactMatch - bExactMatch;

      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }

      return a.title.localeCompare(b.title);
    });

    setSearchResults(sortedResults.slice(0, 8));
    setSelectedResultIndex(-1);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    performSearch(value);

    if (value.trim()) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  const handleSearchKeyDown = (e: any) => {
    if (!showSearchResults || searchResults.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedResultIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedResultIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (
          selectedResultIndex >= 0 &&
          selectedResultIndex < searchResults.length
        ) {
          handleResultClick(searchResults[selectedResultIndex]);
        } else if (searchResults.length > 0) {
          handleResultClick(searchResults[0]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setShowSearchResults(false);
        setIsSearchOpen(false);
        break;
    }
  };

  const handleResultClick = (result) => {
    navigate(result.path);
    closeAllMenus();
  };

  const markAllAsRead = () => {
    setUnreadNotifications(0);
  };

  const getNotificationIcon = (type: any) => {
    switch (type) {
      case "transaction":
        return (
          <div className="p-2 rounded-full bg-emerald-50/80 dark:bg-emerald-900/50 border border-emerald-400/30 dark:border-emerald-500/30 backdrop-blur-sm shadow-inner shadow-emerald-400/10 dark:shadow-emerald-500/10">
            <CreditCard
              size={16}
              className="text-emerald-500 dark:text-emerald-400"
            />
          </div>
        );
      case "alert":
        return (
          <div className="p-2 rounded-full bg-amber-50/80 dark:bg-amber-900/50 border border-amber-400/30 dark:border-amber-500/30 backdrop-blur-sm shadow-inner shadow-amber-400/10 dark:shadow-amber-500/10">
            <AlertCircle
              size={16}
              className="text-amber-500 dark:text-amber-400"
            />
          </div>
        );
      case "system":
        return (
          <div className="p-2 rounded-full bg-violet-50/80 dark:bg-violet-900/50 border border-violet-400/30 dark:border-violet-500/30 backdrop-blur-sm shadow-inner shadow-violet-400/10 dark:shadow-violet-500/10">
            <Shield
              size={16}
              className="text-violet-500 dark:text-violet-400"
            />
          </div>
        );
      default:
        return (
          <div className="p-2 rounded-full bg-indigo-50/80 dark:bg-indigo-900/50 border border-indigo-400/30 dark:border-indigo-500/30 backdrop-blur-sm shadow-inner shadow-indigo-400/10 dark:shadow-indigo-500/10">
            <Bell size={16} className="text-indigo-500 dark:text-indigo-400" />
          </div>
        );
    }
  };

  const handleNestedDropdownToggle = (key: any) => {
    setActiveNestedDropdown(activeNestedDropdown === key ? null : key);
  };

  const filterItems = (items: any) => {
    return items.filter((item) => {
      if (item.type === "link") {
        return hasPermissionForRoute(item.path, userPermissions);
      } else if (item.type === "dropdown") {
        const filteredDropdownItems = item.items.filter((subItem) =>
          hasPermissionForRoute(subItem.path, userPermissions)
        );
        return filteredDropdownItems.length > 0;
      }
      return true;
    });
  };

  const filterSections = (sections: any) => {
    return sections.filter((section) => {
      if (section.type !== "section") return true;

      const filteredItems = filterItems(section.items);
      return filteredItems.length > 0;
    });
  };

  const renderNestedDropdown = (dropdown: any) => {
    const isActive = activeNestedDropdown === dropdown.key;
    const filteredItems = dropdown.items.filter((item) =>
      hasPermissionForRoute(item.path, userPermissions)
    );

    if (filteredItems.length === 0) return null;

    return (
      <div key={dropdown.key} className="relative">
        <button
          onClick={() => handleNestedDropdownToggle(dropdown.key)}
          onMouseEnter={() =>
            setHoverState({ section: dropdown.key, item: null })
          }
          onMouseLeave={() => setHoverState({ section: null, item: null })}
          className={`w-full flex items-center p-4 rounded-2xl transition-all duration-500 ${
            isActive
              ? "bg-gradient-to-r from-indigo-100/90 dark:from-indigo-900/90 via-violet-100/80 dark:via-violet-900/80 to-sky-100/90 dark:to-sky-900/90 text-indigo-700 dark:text-indigo-300 shadow-xl shadow-indigo-500/10 dark:shadow-indigo-500/20"
              : "hover:bg-gradient-to-r hover:from-indigo-50/60 dark:hover:from-indigo-900/60 hover:via-violet-50/50 dark:hover:via-violet-900/50 hover:to-sky-50/60 dark:hover:to-sky-900/60"
          }`}
        >
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-500 mr-4 shadow-lg ${
              isActive
                ? "bg-gradient-to-br from-indigo-200/90 dark:from-indigo-800/90 via-violet-200/80 dark:via-violet-800/80 to-sky-200/90 dark:to-sky-800/90 scale-105"
                : "bg-gradient-to-br from-white/90 dark:from-gray-800/90 to-slate-50/90 dark:to-gray-700/90 group-hover:from-indigo-100/90 dark:group-hover:from-indigo-900/90 group-hover:to-sky-100/90 dark:group-hover:to-sky-900/90"
            }`}
          >
            <dropdown.icon
              size={20}
              className={`transition-colors duration-500 ${
                isActive
                  ? "text-indigo-700 dark:text-indigo-300"
                  : "text-slate-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
              }`}
            />
          </div>
          <div className="flex-1 text-left">
            <span
              className={`text-sm font-semibold transition-colors duration-500 ${
                isActive
                  ? "text-indigo-700 dark:text-indigo-300"
                  : "text-slate-700 dark:text-gray-300 group-hover:text-indigo-700 dark:group-hover:text-indigo-300"
              }`}
            >
              {dropdown.title}
            </span>
          </div>
          <ChevronDown
            size={16}
            className={`transition-all duration-500 ${
              isActive
                ? "rotate-180 text-indigo-600 dark:text-indigo-400"
                : "text-slate-400 dark:text-gray-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400"
            }`}
          />
        </button>

        {isActive && (
          <div className="mt-2 p-2 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl shadow-2xl shadow-indigo-500/10 dark:shadow-gray-900/30 border border-white/80 dark:border-gray-700/80 animate-dropDown overflow-hidden">
            {filteredItems.map((subItem, subIdx) => (
              <NavLink
                key={subIdx}
                to={subItem.path}
                onClick={() => closeAllMenus()}
                onMouseEnter={() =>
                  setHoverState({ section: dropdown.key, item: subIdx })
                }
                onMouseLeave={() =>
                  setHoverState({ section: dropdown.key, item: null })
                }
                className={({ isActive }) => `
                  group flex items-center p-3 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50/60 dark:hover:from-indigo-900/60 hover:via-violet-50/50 dark:hover:via-violet-900/50 hover:to-sky-50/60 dark:hover:to-sky-900/60 transition-all duration-500 transform hover:translate-x-1
                  ${
                    isActive
                      ? "bg-white/80 dark:bg-gray-700/80 shadow-sm shadow-indigo-500/5 dark:shadow-gray-900/20"
                      : ""
                  }
                `}
              >
                <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-gray-600 group-hover:bg-indigo-400 dark:group-hover:bg-indigo-400 transition-colors duration-500 mr-4 flex-shrink-0"></div>
                <span className="text-sm text-slate-600 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-500">
                  {subItem.title}
                </span>
                <ArrowRight
                  size={14}
                  className="text-slate-300 dark:text-gray-600 group-hover:text-indigo-400 dark:group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:translate-x-1 ml-auto"
                />

                {hoverState.section === dropdown.key &&
                  hoverState.item === subIdx && (
                    <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent animate-expandWidth"></div>
                  )}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderMegaMenu = (section: any) => {
    const filteredItems = filterItems(section.items);

    if (filteredItems.length === 0) return null;

    return (
      <div className="absolute top-full left-0 mt-3 bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-2xl shadow-indigo-900/10 dark:shadow-gray-900/30 border border-white/40 dark:border-gray-700/40 overflow-hidden z-50 animate-fadeInDown min-w-[400px] max-w-[500px]">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/20 dark:from-indigo-900/20 via-violet-50/20 dark:via-violet-900/20 to-white/10 dark:to-gray-800/10 -z-10"></div>
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-400/30 dark:bg-indigo-500/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-sky-400/20 dark:bg-sky-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

        {/* Dynamic glow effect that follows cursor */}
        <div
          className="absolute w-40 h-40 rounded-full blur-3xl bg-indigo-400/10 dark:bg-indigo-500/5 pointer-events-none transition-all duration-300 ease-out"
          style={{
            left: mousePosition.x - 350,
            top: mousePosition.y - 200,
            opacity: 0.3,
            transform: "translate3d(0, 0, 0)",
          }}
        ></div>

        <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar relative">
          <div className="mb-6">
            <h3 className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-[0.15em] mb-1">
              {section.title}
            </h3>
            <div className="w-12 h-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500 rounded-full"></div>
          </div>
          <div className="space-y-2">
            {filteredItems.map((item, idx) => {
              if (item.type === "link") {
                return (
                  <NavLink
                    key={idx}
                    to={item.path}
                    onClick={() => closeAllMenus()}
                    onMouseEnter={() =>
                      setHoverState({ section: section.title, item: idx })
                    }
                    onMouseLeave={() =>
                      setHoverState({ section: null, item: null })
                    }
                    className={({ isActive }) => `
                      group flex items-center p-4 rounded-2xl transition-all duration-500 transform hover:translate-x-1 relative overflow-hidden
                      ${
                        isActive
                          ? "bg-white/70 dark:bg-gray-700/70 shadow-sm shadow-indigo-500/10 dark:shadow-gray-900/20"
                          : "hover:bg-gradient-to-r hover:from-indigo-50/60 dark:hover:from-indigo-900/60 hover:via-violet-50/50 dark:hover:via-violet-900/50 hover:to-sky-50/60 dark:hover:to-sky-900/60"
                      }
                    `}
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-white/90 dark:from-gray-700/90 to-slate-50/90 dark:to-gray-600/90 group-hover:from-indigo-100/90 dark:group-hover:from-indigo-900/90 group-hover:via-violet-100/80 dark:group-hover:via-violet-900/80 group-hover:to-sky-100/90 dark:group-hover:to-sky-900/90 transition-all duration-500 mr-4 shadow-lg group-hover:shadow-xl group-hover:scale-105">
                      <item.icon
                        size={20}
                        className="text-slate-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-500"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-semibold text-slate-700 dark:text-gray-300 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors duration-500 block">
                        {item.title}
                      </span>
                      {item.description && (
                        <span className="text-xs text-slate-500 dark:text-gray-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors duration-500 mt-1 block">
                          {item.description}
                        </span>
                      )}
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-slate-400 dark:text-gray-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:translate-x-1"
                    />

                    {/* Interactive shine effect */}
                    {hoverState.section === section.title &&
                      hoverState.item === idx && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-gray-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none animate-shine-slow"></div>
                      )}
                  </NavLink>
                );
              } else if (item.type === "dropdown") {
                return renderNestedDropdown(item);
              }
              return null;
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderNavItem = (item: any) => {
    if (item.type === "link") {
      if (!hasPermissionForRoute(item.path, userPermissions)) {
        return null;
      }

      return (
        <NavLink
          to={item.path}
          onClick={() => closeAllMenus()}
          onMouseEnter={() => {
            setHoverState({ section: item.title, item: null });
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setShowTimeIndicator(true);
          }}
          onMouseLeave={() => {
            setHoverState({ section: null, item: null });
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(
              () => setShowTimeIndicator(false),
              2000
            );
          }}
          className={({ isActive }) => `
            group flex items-center px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-500 transform hover:scale-105 relative
            ${
              isActive
                ? "text-indigo-700 dark:text-indigo-300 bg-gradient-to-r from-indigo-50/80 dark:from-indigo-900/80 via-violet-50/70 dark:via-violet-900/70 to-sky-50/80 dark:to-sky-900/80 shadow-lg shadow-indigo-500/10 dark:shadow-indigo-500/20"
                : "text-slate-600 dark:text-gray-300 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-gradient-to-r hover:from-indigo-50/50 dark:hover:from-indigo-900/50 hover:via-violet-50/40 dark:hover:via-violet-900/40 hover:to-sky-50/50 dark:hover:to-sky-900/50"
            }
          `}
        >
          <item.icon
            size={18}
            className="mr-3 group-hover:scale-110 transition-transform duration-500"
          />
          <span>{item.title}</span>

          {/* Add subtle particle effect on hover */}
          {hoverState.section === item.title && (
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
              <div className="absolute -top-1 left-1/2 w-1 h-1 rounded-full bg-indigo-300/40 dark:bg-indigo-400/40 animate-float-slow"></div>
              <div className="absolute -bottom-1 left-1/3 w-1 h-1 rounded-full bg-sky-300/40 dark:bg-sky-400/40 animate-float-slow animation-delay-300"></div>
              <div className="absolute top-1/2 right-2 w-1.5 h-1.5 rounded-full bg-violet-300/40 dark:bg-violet-400/40 animate-float-slow animation-delay-700"></div>
            </div>
          )}
        </NavLink>
      );
    } else if (item.type === "section") {
      const filteredItems = filterItems(item.items);

      if (filteredItems.length === 0) {
        return null;
      }

      return (
        <div
          className="relative"
          ref={(el) => {
            dropdownRefs.current[item.title] = el;
          }}
        >
          <button
            onClick={() => {
              const newActiveDropdown =
                activeDropdown === item.title ? null : item.title;
              setActiveDropdown(newActiveDropdown);
              setActiveNestedDropdown(null);
            }}
            onMouseEnter={() => {
              setHoverState({ section: item.title, item: null });
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
              setShowTimeIndicator(true);
            }}
            onMouseLeave={() => {
              setHoverState({ section: null, item: null });
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
              timeoutRef.current = setTimeout(
                () => setShowTimeIndicator(false),
                2000
              );
            }}
            className={`group flex items-center px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-500 transform hover:scale-105 relative ${
              activeDropdown === item.title
                ? "text-indigo-700 dark:text-indigo-300 bg-gradient-to-r from-indigo-50/80 dark:from-indigo-900/80 via-violet-50/70 dark:via-violet-900/70 to-sky-50/80 dark:to-sky-900/80 shadow-lg shadow-indigo-500/10 dark:shadow-indigo-500/20"
                : "text-slate-600 dark:text-gray-300 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-gradient-to-r hover:from-indigo-50/50 dark:hover:from-indigo-900/50 hover:via-violet-50/40 dark:hover:via-violet-900/40 hover:to-sky-50/50 dark:hover:to-sky-900/50"
            }`}
          >
            <span>{item.title}</span>
            <ChevronDown
              size={16}
              className={`ml-2 transition-all duration-500 ${
                activeDropdown === item.title
                  ? "rotate-180 text-indigo-600 dark:text-indigo-400"
                  : "text-slate-400 dark:text-gray-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400"
              }`}
            />

            {/* Add subtle particle effect on hover */}
            {hoverState.section === item.title && (
              <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                <div className="absolute -top-1 left-1/2 w-1 h-1 rounded-full bg-indigo-300/40 dark:bg-indigo-400/40 animate-float-slow"></div>
                <div className="absolute -bottom-1 left-1/3 w-1 h-1 rounded-full bg-sky-300/40 dark:bg-sky-400/40 animate-float-slow animation-delay-300"></div>
                <div className="absolute top-1/2 right-2 w-1.5 h-1.5 rounded-full bg-violet-300/40 dark:bg-violet-400/40 animate-float-slow animation-delay-700"></div>
              </div>
            )}
          </button>
          {activeDropdown === item.title && renderMegaMenu(item)}
        </div>
      );
    }
    return null;
  };

  const groupedResults = searchResults.reduce<
    Record<string, typeof searchResults>
  >((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {});

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
    navigate("/auth/login");
  };

  const getCategoryIcon = (category: any) => {
    const iconMap = {
      Dashboard: BarChart3,
      "User Management": User,
      Finance: Wallet,
      Settings: Settings,
      Transactions: CreditCard,
      System: Shield,
    };

    return iconMap[category] || BarChart3;
  };

  return (
    <div className="fixed top-0 right-0 z-30 left-[60px] w-[calc(100%-60px)]">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/10 dark:from-indigo-900/10 via-transparent to-sky-50/10 dark:to-sky-900/10 pointer-events-none"></div>

      <div className="absolute top-0 left-0 right-0 h-1">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-500 bg-[length:200%_100%] animate-gradient-flow"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-indigo-500/20 to-sky-500/20 blur-sm transform translate-y-0.5"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-sky-500/10 blur-md transform translate-y-1"></div>
      </div>

      <div className="absolute -top-10 right-1/4 w-40 h-40 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl animate-blob-float opacity-50"></div>
      <div className="absolute top-5 right-1/3 w-20 h-20 bg-indigo-400/10 dark:bg-indigo-500/5 rounded-full blur-2xl animate-blob-float animation-delay-3000 opacity-30"></div>
      <div className="absolute -bottom-20 left-1/3 w-60 h-60 bg-sky-400/10 dark:bg-sky-500/5 rounded-full blur-3xl animate-blob-float animation-delay-4000 opacity-40"></div>
      <div className="absolute bottom-5 left-1/4 w-20 h-20 bg-violet-400/10 dark:bg-violet-500/5 rounded-full blur-2xl animate-blob-float animation-delay-5000 opacity-30"></div>

      <div
        className={`relative transition-all duration-500 ${
          scrolled
            ? "bg-white/60 dark:bg-gray-800/60 backdrop-blur-2xl shadow-xl shadow-indigo-900/5 dark:shadow-gray-900/20 border-b border-white/40 dark:border-gray-700/40"
            : "bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl"
        }`}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 left-1/4 w-40 h-1 bg-white/80 dark:bg-gray-700/60 blur-sm rotate-45 transform-gpu animate-shine"></div>
          <div className="absolute top-20 right-1/4 w-60 h-0.5 bg-white/60 dark:bg-gray-700/40 blur-sm -rotate-45 transform-gpu animate-shine animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/3 w-30 h-0.5 bg-white/70 dark:bg-gray-700/50 blur-sm rotate-45 transform-gpu animate-shine animation-delay-4000"></div>
        </div>

        <div className="px-4 lg:px-8 h-16 lg:h-20 flex items-center justify-between relative">
          <div className="flex items-center mr-4 lg:mr-12">
            <div className="relative">
              <img
                src={logo}
                alt="Logo"
                className="w-[150px] h-auto cursor-pointer transition-transform duration-500 hover:scale-105"
                onClick={() => navigate("/")}
              />
              <div className="absolute -inset-1 bg-indigo-500/5 dark:bg-indigo-400/5 blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"></div>
            </div>
          </div>

          <nav
            className="hidden xl:flex items-center flex-1 justify-center"
            ref={navRef}
          >
            <div className="flex items-center space-x-2 bg-white/30 dark:bg-gray-800/30 backdrop-blur-2xl rounded-3xl p-2 shadow-2xl shadow-indigo-500/5 dark:shadow-gray-900/20 border border-white/80 dark:border-gray-700/80 transition-all duration-500 hover:shadow-indigo-500/10 dark:hover:shadow-gray-900/30 relative">
              {showTimeIndicator && (
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-lg border border-white/50 dark:border-gray-700/50 px-3 py-1.5 rounded-xl animate-fadeInDown">
                  <div className="flex items-center space-x-2">
                    <Lock
                      size={12}
                      className="text-indigo-400 dark:text-indigo-400"
                    />
                    <span className="text-xs font-medium bg-gradient-to-r from-indigo-600 to-violet-600 text-transparent bg-clip-text">
                      {currentTime}
                    </span>
                  </div>
                </div>
              )}

              {filterSections(routes).map((item: any, idx: any) => (
                <div key={idx}>{renderNavItem(item)}</div>
              ))}
            </div>
          </nav>

          <div className="flex items-center space-x-1 md:space-x-3">
            <div className="relative" ref={searchInputRef}>
              {isSearchOpen ? (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchValue}
                      onChange={handleSearchChange}
                      onKeyDown={handleSearchKeyDown}
                      placeholder="Search anything..."
                      className="w-56 md:w-80 pl-12 pr-12 py-3 rounded-2xl border border-white/70 dark:border-gray-700/70 focus:border-indigo-400/60 dark:focus:border-indigo-500/60 focus:outline-none focus:ring-4 focus:ring-indigo-300/20 dark:focus:ring-indigo-500/20 transition-all duration-500 text-sm font-medium bg-white/30 dark:bg-gray-800/30 backdrop-blur-2xl shadow-xl text-gray-800 dark:text-gray-200 placeholder-indigo-400/70 dark:placeholder-indigo-400/70"
                      autoFocus
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Search
                        size={16}
                        className="text-indigo-400 dark:text-indigo-400"
                      />
                    </div>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-xl hover:bg-indigo-700/20 dark:hover:bg-indigo-600/20 transition-all duration-300 text-indigo-400 dark:text-indigo-400">
                      <button
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchValue("");
                          setShowSearchResults(false);
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="absolute inset-0 -z-10 rounded-2xl">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-sky-500/10 blur-md animate-pulse-slow"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2.5 rounded-xl hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all duration-500 transform hover:scale-110 group text-gray-600/70 dark:text-gray-400/70 hover:text-indigo-600 dark:hover:text-indigo-400 relative"
                >
                  <Search
                    size={18}
                    className="transition-colors duration-500"
                  />

                  <div className="absolute inset-0 rounded-xl bg-indigo-400/0 group-hover:bg-indigo-400/10 dark:group-hover:bg-indigo-500/10 transition-colors duration-500 -z-10"></div>
                  <div className="absolute inset-0 scale-0 group-hover:scale-100 rounded-xl bg-indigo-400/5 dark:bg-indigo-500/5 blur-sm transition-transform duration-500 -z-10"></div>
                </button>
              )}

              {showSearchResults && searchResults.length > 0 && (
                <div
                  ref={searchResultsRef}
                  className="absolute right-0 mt-3 w-80 bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl rounded-2xl border border-white/70 dark:border-gray-700/70 shadow-2xl shadow-indigo-900/10 dark:shadow-gray-900/30 z-50 overflow-hidden animate-fadeInDown"
                >
                  <div className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-sky-400/10 dark:bg-sky-500/5 rounded-full blur-3xl"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-indigo-500/5 dark:from-indigo-600/5 via-violet-500/5 dark:via-violet-600/5 to-sky-500/5 dark:to-sky-600/5 rounded-full blur-3xl"></div>

                  <div className="p-4 relative">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 flex items-center">
                      <Sparkles
                        size={12}
                        className="mr-1.5 text-indigo-400 dark:text-indigo-400"
                      />
                      <span>
                        {searchResults.length} results found for "{searchValue}"
                      </span>
                    </div>

                    <div className="space-y-4">
                      {Object.entries(groupedResults).map(
                        ([category, results]) => (
                          <div key={category}>
                            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5 flex items-center">
                              {React.createElement(getCategoryIcon(category), {
                                size: 14,
                                className:
                                  "inline mr-1 text-gray-400 dark:text-gray-500",
                              })}
                              {category}
                            </div>
                            <div className="space-y-1">
                              {results.map((result, index) => {
                                const globalIndex = searchResults.findIndex(
                                  (r) =>
                                    r.title === result.title &&
                                    r.path === result.path &&
                                    r.category === result.category
                                );
                                const isSelected =
                                  globalIndex === selectedResultIndex;

                                return (
                                  <div
                                    key={`${result.path}-${index}`}
                                    onClick={() => handleResultClick(result)}
                                    onMouseEnter={() =>
                                      setSelectedResultIndex(globalIndex)
                                    }
                                    className={`
                                    cursor-pointer p-2 rounded-xl transition-all duration-500 flex items-center relative overflow-hidden
                                    ${
                                      isSelected
                                        ? "bg-gradient-to-r from-indigo-50/80 dark:from-indigo-900/80 via-violet-50/70 dark:via-violet-900/70 to-sky-50/80 dark:to-sky-900/80 text-indigo-700 dark:text-indigo-300 shadow-lg shadow-indigo-500/5 dark:shadow-indigo-500/10"
                                        : "hover:bg-white/60 dark:hover:bg-gray-700/60"
                                    }
                                  `}
                                  >
                                    <div
                                      className={`
                                    p-1.5 rounded-xl mr-2 transition-all duration-300
                                    ${
                                      isSelected
                                        ? "bg-white/70 dark:bg-gray-700/70 shadow-sm shadow-indigo-500/10 dark:shadow-indigo-500/20"
                                        : "bg-white/50 dark:bg-gray-700/50"
                                    }
                                  `}
                                    >
                                      {result.icon ? (
                                        <result.icon
                                          size={16}
                                          className="text-indigo-500 dark:text-indigo-400"
                                        />
                                      ) : (
                                        React.createElement(
                                          getCategoryIcon(result.category),
                                          {
                                            size: 16,
                                            className:
                                              "text-indigo-500 dark:text-indigo-400",
                                          }
                                        )
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-sm truncate text-gray-800 dark:text-gray-200">
                                        {result.title}
                                      </div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {result.path}
                                      </div>
                                    </div>
                                    <div
                                      className={`
                                    ml-2 p-1 rounded-full transition-all duration-300
                                    ${
                                      isSelected
                                        ? "bg-white/70 dark:bg-gray-700/70 text-indigo-600 dark:text-indigo-400"
                                        : "text-gray-400 dark:text-gray-500"
                                    }
                                  `}
                                    >
                                      <ArrowRight
                                        size={14}
                                        className={`transition-transform duration-300 ${
                                          isSelected ? "translate-x-0.5" : ""
                                        }`}
                                      />
                                    </div>

                                    {isSelected && (
                                      <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent animate-shine-slow"></div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/50 dark:border-gray-700/50 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
                      <span>
                        <kbd className="px-1.5 py-0.5 rounded-lg bg-white/70 dark:bg-gray-700/70 text-gray-700 dark:text-gray-300 mx-1 shadow-sm border border-white/50 dark:border-gray-600/50">
                          ↑
                        </kbd>
                        <kbd className="px-1.5 py-0.5 rounded-lg bg-white/70 dark:bg-gray-700/70 text-gray-700 dark:text-gray-300 mx-1 shadow-sm border border-white/50 dark:border-gray-600/50">
                          ↓
                        </kbd>
                        to navigate
                      </span>
                      <span>
                        <kbd className="px-1.5 py-0.5 rounded-lg bg-white/70 dark:bg-gray-700/70 text-gray-700 dark:text-gray-300 mx-1 shadow-sm border border-white/50 dark:border-gray-600/50">
                          Enter
                        </kbd>
                        to select
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              className="p-1 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              onClick={toggleMode}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="relative ml-2" ref={userMenuRef}>
              <button
                className="flex items-center space-x-2 py-1.5 px-2 rounded-xl transition-all duration-500 hover:bg-white/60 dark:hover:bg-gray-700/60 text-gray-600/90 dark:text-gray-400/90 hover:text-indigo-600 dark:hover:text-indigo-400 group relative"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600/90 via-violet-600/80 to-sky-600/80 backdrop-blur-xl flex items-center justify-center border border-white/40 dark:border-gray-600/40 group-hover:from-indigo-500/90 group-hover:to-sky-500/80 transition-all duration-500 shadow-lg">
                  <User size={16} className="text-white" />
                </div>
                <span className="hidden md:block text-sm font-medium">
                  {user?.name?.split(" ")[0]}
                </span>
                <ChevronDown
                  size={14}
                  className={`hidden md:block transition-all duration-500 ${
                    userMenuOpen
                      ? "rotate-180 text-indigo-500 dark:text-indigo-400"
                      : "text-indigo-300 dark:text-indigo-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400"
                  }`}
                />

                <div className="absolute inset-0 rounded-xl bg-indigo-400/0 group-hover:bg-indigo-400/10 dark:group-hover:bg-indigo-500/10 transition-colors duration-500 -z-10"></div>
                <div className="absolute inset-0 scale-0 group-hover:scale-100 rounded-xl bg-indigo-400/5 dark:bg-indigo-500/5 blur-sm transition-transform duration-500 -z-10"></div>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl rounded-2xl border border-white/70 dark:border-gray-700/70 shadow-2xl shadow-indigo-900/10 dark:shadow-gray-900/30 z-50 overflow-hidden animate-fadeInDown">
                  <div className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-sky-400/10 dark:bg-sky-500/5 rounded-full blur-3xl"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-indigo-500/5 dark:from-indigo-600/5 via-violet-500/5 dark:via-violet-600/5 to-sky-500/5 dark:to-sky-600/5 rounded-full blur-3xl"></div>

                  <div className="relative">
                    <div className="px-4 py-3 border-b border-white/50 dark:border-gray-700/50">
                      <div className="flex items-center mb-2">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600/90 via-violet-600/80 to-sky-600/80 flex items-center justify-center mr-3 border border-white/40 dark:border-gray-600/40 shadow-md">
                          <User size={18} className="text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200">
                            {user?.first_name} {user?.last_name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                      <div className="mt-1.5 flex items-center">
                        <span className="text-[10px] font-medium px-2 py-0.5 bg-indigo-100/80 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 rounded-full flex items-center">
                          <Shield size={10} className="mr-1" />
                          {user?.role?.title}
                        </span>

                        <div className="ml-2 flex items-center">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 dark:bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 dark:bg-emerald-400"></span>
                          </span>
                          <span className="ml-1.5 text-[10px] text-emerald-600 dark:text-emerald-400">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="px-1 py-1">
                      <NavLink
                        to="/accounts/profile"
                        onClick={() => closeAllMenus()}
                        className={({ isActive }) => `
                          w-full text-left px-3 py-2 rounded-xl hover:bg-indigo-50/50 dark:hover:bg-indigo-900/50 text-sm flex items-center transition-all duration-500 ${
                            isActive
                              ? "bg-indigo-50/30 dark:bg-indigo-900/30"
                              : ""
                          }
                        `}
                      >
                        <User
                          size={16}
                          className="mr-3 text-gray-500 dark:text-gray-400"
                        />
                        <span className="text-gray-700 dark:text-gray-300">
                          My Profile
                        </span>
                      </NavLink>
                      <NavLink
                        to="/admin/settings"
                        onClick={() => closeAllMenus()}
                        className={({ isActive }) => `
                          w-full text-left px-3 py-2 rounded-xl hover:bg-indigo-50/50 dark:hover:bg-indigo-900/50 text-sm flex items-center transition-all duration-500 ${
                            isActive
                              ? "bg-indigo-50/30 dark:bg-indigo-900/30"
                              : ""
                          }
                        `}
                      >
                        <Settings
                          size={16}
                          className="mr-3 text-gray-500 dark:text-gray-400"
                        />
                        <span className="text-gray-700 dark:text-gray-300">
                          Settings
                        </span>
                      </NavLink>

                      <div className="w-full text-left px-3 py-2 rounded-xl hover:bg-indigo-50/50 dark:hover:bg-indigo-900/50 text-sm flex items-center transition-all duration-500 cursor-pointer">
                        <TrendingUp
                          size={16}
                          className="mr-3 text-gray-500 dark:text-gray-400"
                        />
                        <span className="text-gray-700 dark:text-gray-300">
                          Account Activity
                        </span>
                        <div className="ml-auto w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-indigo-500 dark:bg-indigo-400 rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/50 dark:border-gray-700/50 mt-1 px-1 py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-50/70 dark:hover:bg-red-900/70 text-sm flex items-center text-red-600 dark:text-red-400 transition-all duration-500"
                      >
                        <LogOut size={16} className="mr-3" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2.5 rounded-xl hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all duration-500 text-gray-600/70 dark:text-gray-400/70 hover:text-indigo-600 dark:hover:text-indigo-400 ml-1 group relative"
            >
              <Menu size={20} />

              <div className="absolute inset-0 rounded-xl bg-indigo-400/0 group-hover:bg-indigo-400/10 dark:group-hover:bg-indigo-500/10 transition-colors duration-500 -z-10"></div>
              <div className="absolute inset-0 scale-0 group-hover:scale-100 rounded-xl bg-indigo-400/5 dark:bg-indigo-500/5 blur-sm transition-transform duration-500 -z-10"></div>
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-50 left-[60px] w-[calc(100%-60px)] bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl animate-fadeIn">
          <div className="absolute top-40 left-20 w-60 h-60 bg-indigo-400/10 dark:bg-indigo-500/5 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-40 right-10 w-80 h-80 bg-sky-400/10 dark:bg-sky-500/5 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/4 right-20 w-40 h-40 bg-violet-400/10 dark:bg-violet-500/5 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

          <div
            className="absolute w-60 h-60 rounded-full blur-3xl bg-indigo-400/5 dark:bg-indigo-500/3 pointer-events-none transition-all duration-300 ease-out"
            style={{
              left: mousePosition.x - 100,
              top: mousePosition.y - 100,
              opacity: 0.3,
              transform: "translate3d(0, 0, 0)",
            }}
          ></div>

          <div className="p-6 relative">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <img
                  src={logo}
                  alt="Logo"
                  className="w-[150px] h-auto cursor-pointer transition-transform duration-500 hover:scale-105"
                  onClick={() => {
                    navigate("/");
                    closeAllMenus();
                  }}
                />
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-white/60 dark:bg-gray-700/60 hover:bg-indigo-50/80 dark:hover:bg-indigo-900/80 transition-all duration-500 text-gray-600 dark:text-gray-400 shadow-lg border border-white/40 dark:border-gray-600/40"
              >
                <X
                  size={22}
                  className="transition-transform duration-500 hover:rotate-90"
                />
              </button>
            </div>

            <nav className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
              {filterSections(routes).map((item, idx) => (
                <div key={idx} className="py-2">
                  {item.type === "section" && (
                    <>
                      <div className="flex items-center mb-4">
                        <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.15em]">
                          {item.title}
                        </h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-indigo-500/30 via-violet-500/20 to-transparent ml-4"></div>
                      </div>
                      <div className="space-y-2">
                        {filterItems(item.items).map((subItem, subIdx) => {
                          if (subItem.type === "link") {
                            return (
                              <NavLink
                                key={subIdx}
                                to={subItem.path}
                                className={({ isActive }) => `
                                  flex items-center px-4 py-3.5 rounded-2xl transition-all duration-500 group relative overflow-hidden
                                  ${
                                    isActive
                                      ? "bg-gradient-to-r from-indigo-50/90 dark:from-indigo-900/90 via-violet-50/80 dark:via-violet-900/80 to-sky-50/90 dark:to-sky-900/90 border border-white/50 dark:border-gray-700/50 shadow-lg shadow-indigo-500/10 dark:shadow-indigo-500/20"
                                      : "hover:bg-white/60 dark:hover:bg-gray-700/60"
                                  }
                                `}
                                onClick={() => closeAllMenus()}
                              >
                                {subItem.icon && (
                                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-white/90 dark:from-gray-700/90 to-slate-50/90 dark:to-gray-600/90 group-hover:from-indigo-100/90 dark:group-hover:from-indigo-900/90 group-hover:to-sky-100/90 dark:group-hover:to-sky-900/90 transition-all duration-500 mr-4 shadow-lg border border-white/40 dark:border-gray-600/40 group-hover:scale-105">
                                    <subItem.icon
                                      width={18}
                                      height={18}
                                      className="text-indigo-600 dark:text-indigo-400"
                                    />
                                  </div>
                                )}
                                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                  {subItem.title}
                                </span>

                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-gray-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none animate-shine-slow"></div>
                              </NavLink>
                            );
                          } else if (subItem.type === "dropdown") {
                            return renderNestedDropdown(subItem);
                          }
                          return null;
                        })}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-indigo-200/50 dark:border-indigo-800/50">
              <div className="flex items-center p-4 rounded-2xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-xl border border-white/40 dark:border-gray-600/40 shadow-xl shadow-indigo-500/5 dark:shadow-gray-900/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-gray-600/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500 ease-in-out"></div>

                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600/90 via-violet-600/80 to-sky-600/80 flex items-center justify-center mr-4 border border-white/40 dark:border-gray-600/40 shadow-lg">
                  <User size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {user?.name}
                  </div>
                  <div className="text-xs text-indigo-600 dark:text-indigo-400 flex items-center">
                    <Shield size={10} className="mr-1" />
                    {user?.role?.title}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-white/60 dark:bg-gray-600/60 hover:bg-red-50/80 dark:hover:bg-red-900/80 transition-all duration-500 text-red-500 dark:text-red-400 border border-white/40 dark:border-gray-600/40 shadow-lg active:scale-95"
                >
                  <LogOut
                    size={16}
                    className="transition-transform duration-500 hover:rotate-12"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopNavigation;
