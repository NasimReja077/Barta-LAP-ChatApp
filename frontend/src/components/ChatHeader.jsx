import { X, User } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion"; 

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showImagePreview, setShowImagePreview] = useState(false);

  const isOnline = selectedUser?._id && onlineUsers.includes(selectedUser._id);

  const getLastSeenText = () => {
    if (!selectedUser?.lastSeen) return "Offline";
    return `Last seen ${formatDistanceToNow(new Date(selectedUser.lastSeen), {
      addSuffix: true,
    })}`;
  };

  return (
    <>
      <div className="p-4 border-b border-base-300 bg-base-100">
        <div className="flex items-center justify-between">
          {/* User Info Section */}
          <div className="flex items-center gap-4">
            {/* Avatar with Status Indicator */}
            <div className="relative group">
              <motion.div
                className="avatar size-12 rounded-full cursor-pointer overflow-hidden ring-2 ring-base-300 transition-transform duration-200 group-hover:scale-105 group-hover:ring-primary"
                onClick={() => setShowImagePreview(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                role="button"
                aria-label={`View ${selectedUser?.fullName}'s profile picture`}
              >
                <img
                  src={selectedUser?.profilePic || "/avatar.png"}
                  alt={`${selectedUser?.fullName}'s profile picture`}
                  className="object-cover w-full h-full"
                />
                {/* Online/Offline Badge */}
                <span
                  className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-base-100 ${
                    isOnline ? "bg-success" : "bg-gray-400"
                  }`}
                  aria-label={isOnline ? "Online" : "Offline"}
                />
              </motion.div>
            </div>

            {/* User Details */}
            <div>
              <h3 className="text-lg font-semibold text-base-content">
                {selectedUser?.fullName || "Unknown User"}
              </h3>
              <p className="text-sm text-base-content/60">
                {isOnline ? "Online" : getLastSeenText()}
              </p>
            </div>
          </div>

          {/* Close Button */}
          <motion.button
            onClick={() => setSelectedUser(null)}
            className="btn btn-ghost btn-circle"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Close chat"
            title="Close chat"
          >
            <X className="size-5 text-base-content/80" />
          </motion.button>
        </div>
      </div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {showImagePreview && (
          <motion.div
            className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowImagePreview(false)}
            role="dialog"
            aria-label="Profile picture preview"
          >
            <motion.div
              className="relative max-w-[90vw] max-h-[90vh]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
            >
              <img
                src={selectedUser?.profilePic || "/avatar.png"}
                alt={`${selectedUser?.fullName}'s full-size profile picture`}
                className="max-w-full max-h-[80vh] rounded-lg shadow-2xl object-contain"
              />
              <button
                onClick={() => setShowImagePreview(false)}
                className="absolute top-2 right-2 btn btn-circle btn-sm btn-ghost bg-base-100/80"
                aria-label="Close image preview"
              >
                <X className="size-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatHeader;