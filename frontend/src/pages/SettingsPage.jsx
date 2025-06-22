import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Send, Bell } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  const { notificationSoundEnabled, setNotificationSound } = useChatStore();

  const handleThemeChange = (t) => {
    setTheme(t);
    toast.success(`Theme changed to ${t.charAt(0).toUpperCase() + t.slice(1)}`);
  };

  const handleNotificationToggle = () => {
    setNotificationSound(!notificationSoundEnabled);
    toast.success(
      `Notifications ${notificationSoundEnabled ? "disabled" : "enabled"}`
    );
  };

  return (
    <div className="min-h-screen container mx-auto px-4 sm:px-6 pt-20 max-w-5xl bg-gradient-to-b from-base-100 to-base-200">
      <div className="space-y-8">
        {/* Theme Section */}
        <motion.div
          className="bg-base-100 rounded-2xl p-6 sm:p-8 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col gap-2">
            <motion.h2
              className="text-2xl sm:text-3xl font-extrabold text-primary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Theme
            </motion.h2>
            <motion.p
              className="text-base text-base-content/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Choose a theme for your chat interface
            </motion.p>
          </div>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {THEMES.map((t) => (
              <motion.button
                key={t}
                className={`
                  group flex flex-col items-center gap-2 p-3 rounded-lg transition-all
                  ${theme === t ? "bg-base-200 shadow-md" : "hover:bg-base-200/50"}
                `}
                onClick={() => handleThemeChange(t)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Select ${t} theme`}
              >
                <div
                  className="relative h-10 w-full rounded-md overflow-hidden border border-base-300"
                  data-theme={t}
                >
                  <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                    <div className="rounded bg-primary"></div>
                    <div className="rounded bg-secondary"></div>
                    <div className="rounded bg-accent"></div>
                    <div className="rounded bg-neutral"></div>
                  </div>
                </div>
                <span className="text-sm font-semibold truncate w-full text-center">
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </span>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Notifications Section */}
        <motion.div
          className="bg-base-100 rounded-2xl p-6 sm:p-8 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex flex-col gap-2">
            <motion.h2
              className="text-2xl sm:text-3xl font-extrabold text-primary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Notifications
            </motion.h2>
            <motion.p
              className="text-base text-base-content/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Manage your notification preferences
            </motion.p>
          </div>
          <motion.div
            className="flex items-center justify-between bg-base-200 p-4 rounded-lg border border-base-300 shadow-sm mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <Bell className="size-6 text-primary" />
              <span className="text-base font-semibold text-base-content">
                Enable Notifications
              </span>
            </div>
            <motion.input
              type="checkbox"
              className="toggle toggle-primary toggle-lg"
              checked={notificationSoundEnabled}
              onChange={handleNotificationToggle}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle notifications"
            />
          </motion.div>
        </motion.div>

        {/* Preview Section */}
        <motion.div
          className="bg-base-100 rounded-2xl p-6 sm:p-8 shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <motion.h3
            className="text-2xl sm:text-3xl font-extrabold text-primary mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Preview
          </motion.h3>
          <div className="max-w-lg mx-auto bg-base-200 rounded-xl shadow-sm overflow-hidden">
            {/* Chat Header */}
            <div className="px-4 py-3 border-b border-base-300 bg-base-100">
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="size-10 rounded-full">
                    <img
                      src="/avatar.png"
                      alt="John Doe"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-semibold">John Doe</h3>
                  <p className="text-sm text-base-content/70">Online</p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="p-4 space-y-3 min-h-[200px] max-h-[200px] overflow-y-auto bg-gradient-to-b from-base-100 to-base-200">
              <AnimatePresence>
                {PREVIEW_MESSAGES.map((message, index) => (
                  <motion.div
                    key={message.id}
                    className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div
                      className={`
                        max-w-[80%] rounded-xl p-3 shadow-md
                        ${message.isSent ? "bg-gradient-to-r from-primary to-primary/80 text-primary-content" : "bg-gradient-to-r from-secondary to-secondary/80 text-secondary-content"}
                      `}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p
                        className={`
                          text-xs mt-1
                          ${message.isSent ? "text-primary-content/70" : "text-secondary-content/70"}
                        `}
                      >
                        12:00 PM
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-base-300 bg-base-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="input input-bordered input-md flex-1 text-sm focus:ring-2 focus:ring-primary"
                  placeholder="Type a message..."
                  value="This is a preview"
                  readOnly
                  aria-label="Preview chat input"
                />
                <motion.button
                  className="btn btn-primary btn-md h-10 min-h-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Preview send button"
                >
                  <Send className="size-6" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;