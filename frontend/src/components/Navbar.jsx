import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

const Navbar = () => {
  const { authUser, logout, onlineUsers } = useAuthStore();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle ESC key to close dropdown
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowProfileDropdown(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const handleLogout = () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p>Are you sure you want to logout?</p>
          <div className="flex gap-2">
            <button
              className="btn btn-sm btn-error"
              onClick={() => {
                logout();
                toast.dismiss(t.id);
                toast.success("Logged out successfully");
                setShowProfileDropdown(false);
                setShowMobileMenu(false);
              }}
            >
              Yes
            </button>
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  return (
    <header
      className="bg-gradient-to-r from-base-100 to-base-200 border-b border-base-300 fixed w-full top-0 z-50 backdrop-blur-lg bg-opacity-80 shadow-sm"
    >
      <div className="container mx-auto px-4 sm:px-6 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 transition-all"
              aria-label="Go to homepage"
            >
              <motion.div
                className="size-10 rounded-lg flex items-center justify-center bg-[url('/BartaLapLogo.png')] bg-cover bg-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              />
              <h1 className="text-2xl font-extrabold tracking-tight text-primary">
                BartaLAP
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/settings"
              className="btn btn-md btn-ghost gap-3 text-base-content hover:bg-base-200 text-base font-semibold"
              aria-label="Go to settings"
              title="Settings"
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Settings className="size-6" />
              </motion.div>
              <span>Settings</span>
            </Link>
            {authUser && (
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  className="btn btn-md btn-ghost gap-3 text-base-content hover:bg-base-200 text-base font-semibold"
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Toggle profile menu"
                  aria-expanded={showProfileDropdown}
                  title="Profile"
                >
                  <div className="avatar relative">
                    <div className="size-8 rounded-full">
                      <img
                        src={authUser.profilePic || "/avatar.png"}
                        alt="User profile"
                        loading="lazy"
                      />
                    </div>
                    <span
                      className={`absolute bottom-0 right-0 size-2.5 rounded-full border border-base-100 ${
                        onlineUsers.includes(authUser._id)
                          ? "bg-success"
                          : "bg-gray-400"
                      }`}
                    />
                  </div>
                  <span className="truncate max-w-[120px]">
                    {authUser.fullName}
                  </span>
                </motion.button>
                <AnimatePresence>
                  {showProfileDropdown && (
                    <motion.ul
                      className="absolute right-0 mt-2 w-60 bg-base-100 border border-base-300 rounded-box shadow-lg z-50 p-3"
                      initial={{ opacity: 0, scale: 0.9, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      transition={{ duration: 0.2, type: "spring", bounce: 0.3 }}
                    >
                      <li className="px-3 py-2 text-sm text-base-content/70">
                        <span className="font-medium">{authUser.fullName}</span>
                        <br />
                        {authUser.email}
                      </li>
                      <li>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 px-3 py-2 hover:bg-base-200 rounded-md text-base"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          <User className="size-5" />
                          Profile
                        </Link>
                      </li>
                      <li>
                        <button
                          className="flex items-center gap-2 px-3 py-2 hover:bg-base-200 rounded-md text-error text-base w-full"
                          onClick={handleLogout}
                        >
                          <LogOut className="size-5" />
                          Logout
                        </button>
                      </li>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden">
            <motion.button
              className="btn btn-md btn-ghost"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle mobile menu"
            >
              <svg
                className="size-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            className="md:hidden bg-base-100 border-t border-base-300"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              <Link
                to="/settings"
                className="btn btn-md btn-ghost gap-3 text-base-content hover:bg-base-200 text-base font-semibold"
                onClick={() => setShowMobileMenu(false)}
                aria-label="Go to settings"
              >
                <Settings className="size-6" />
                Settings
              </Link>
              {authUser && (
                <>
                  <Link
                    to="/profile"
                    className="btn btn-md btn-ghost gap-3 text-base-content hover:bg-base-200 text-base font-semibold"
                    onClick={() => setShowMobileMenu(false)}
                    aria-label="Go to profile"
                  >
                    <User className="size-6" />
                    Profile
                  </Link>
                  <button
                    className="btn btn-md btn-ghost gap-3 text-error hover:bg-base-200 text-base font-semibold"
                    onClick={() => {
                      handleLogout();
                      setShowMobileMenu(false);
                    }}
                    aria-label="Logout"
                  >
                    <LogOut className="size-6" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;