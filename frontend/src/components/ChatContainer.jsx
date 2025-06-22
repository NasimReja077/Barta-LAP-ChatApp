import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useRef, useState } from "react";
import { axiosInstance } from "../lib/axios";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";
import { Download, Trash2, Copy, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const downloadImage = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-image-${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Error downloading image:", err);
    toast.error("Failed to download image");
  }
};

const ChatContainer = () => {
  const [hiddenMessages, setHiddenMessages] = useState(new Set());
  const [showImagePreview, setShowImagePreview] = useState(null);
  const [hasInteracted, setHasInteracted] = useState(false); // Track user interaction
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    notificationSoundEnabled,
  } = useChatStore();
  const { authUser, onlineUsers } = useAuthStore();
  const messageEndRef = useRef(null);
  const notificationAudio = useRef(null);

  // Initialize audio with error handling
  useEffect(() => {
    try {
      notificationAudio.current = new Audio("/sound/notification1.mp3"); // Adjust path if needed
      notificationAudio.current.preload = "auto"; // Preload audio
      notificationAudio.current.addEventListener("error", () => {
        console.error("Notification audio failed to load");
        toast.error("Notification sound unavailable");
      });
    } catch (err) {
      console.error("Audio initialization failed:", err);
      toast.error("Failed to load notification sound");
    }

    // Detect user interaction
    const handleInteraction = () => {
      setHasInteracted(true);
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
    };
    window.addEventListener("click", handleInteraction);
    window.addEventListener("keydown", handleInteraction);

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
    };
  }, []);

  // Fetch messages and manage subscriptions
  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  // Scroll and play sound logic
  useEffect(() => {
    if (messageEndRef.current && messages?.length) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
      const latestMsg = messages[messages.length - 1];
      const isIncoming = latestMsg?.senderId !== authUser._id;
      if (isIncoming && notificationSoundEnabled && hasInteracted) {
        notificationAudio.current
          .play()
          .catch((err) => {
            console.error("Sound play failed:", err);
            toast.error("Notification sound blocked by browser");
          });
      }
    }
  }, [messages, authUser._id, notificationSoundEnabled, hasInteracted]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto relative bg-gradient-to-b from-base-100 to-base-200">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3">
        <AnimatePresence>
          {messages
            .filter((m) => !hiddenMessages.has(m._id))
            .map((message, index) => (
              <motion.div
                key={message._id}
                className={`chat gap-2 ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  backgroundColor:
                    message.senderId !== authUser._id &&
                    index === messages.length - 1
                      ? "rgba(255,255,255,0.1)"
                      : "transparent",
                }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Avatar */}
                <div
                  className={`chat-image avatar sm:block ${
                    message.senderId === authUser._id ? "hidden mb-1" : "mb-3"
                  }`}
                >
                  <div className="size-9 sm:size-10 rounded-full border border-base-300 relative group">
                    <img
                      src={
                        message.senderId === authUser._id
                          ? authUser.profilePic || "/avatar.png"
                          : selectedUser.profilePic || "/avatar.png"
                      }
                      alt="Profile picture"
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                    />
                    {message.senderId !== authUser._id && (
                      <span
                        className={`absolute bottom-0 right-0 size-2.5 rounded-full border border-base-100 ${
                          onlineUsers.includes(selectedUser._id)
                            ? "bg-success"
                            : "bg-gray-400"
                        }`}
                      />
                    )}
                  </div>
                </div>

                {/* Bubble */}
                <div
                  className={`chat-bubble max-w-[80%] sm:max-w-md relative flex flex-col break-words whitespace-pre-wrap min-w-0 shadow-md rounded-xl p-3 ${
                    message.senderId === authUser._id
                      ? "bg-gradient-to-r from-primary to-primary/80 text-primary-content"
                      : "bg-gradient-to-r from-secondary to-secondary/80 text-secondary-content"
                  }`}
                >
                  {message.image && (
                    <div className="relative sm:max-w-[200px] mb-2 group">
                      <img
                        src={message.image}
                        alt="Attachment"
                        className="rounded-md w-full object-cover group-hover:scale-105 transition-transform duration-200 cursor-pointer"
                        onClick={() => setShowImagePreview(message.image)}
                      />
                    </div>
                  )}
                  {message.text && (
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  )}
                  <div
                    className={`flex gap-2 mt-2 text-xs opacity-75 ${
                      message.senderId === authUser._id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <time>{formatMessageTime(message.createdAt)}</time>
                    {message.senderId === authUser._id && (
                      <motion.span
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {message.status === "sent" && "✓"}
                        {message.status === "delivered" && "✓✓"}
                        {message.status === "read" && (
                          <span className="text-accent">✓✓</span>
                        )}
                      </motion.span>
                    )}
                  </div>

                  {/* Dropdown */}
                  <div
                    className={`absolute dropdown dropdown-top z-30 top-1/2 transform -translate-y-1/2 text-base-content ${
                      message.senderId === authUser._id
                        ? "sm:dropdown-left -left-8"
                        : "dropdown-end sm:dropdown-right -right-8"
                    }`}
                  >
                    <div
                      tabIndex={0}
                      role="button"
                      className="btn rounded-full btn-sm btn-ghost p-1"
                      aria-label="Message options"
                    >
                      <ChevronDown className="size-4" />
                    </div>
                    <motion.ul
                      tabIndex={0}
                      className="dropdown-content menu z-[99] bg-base-100 rounded-box w-40 p-1 shadow"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      {message.image && (
                        <li>
                          <button
                            className="flex items-center gap-2 w-full px-2 py-1 hover:bg-base-200 rounded"
                            onClick={() => downloadImage(message.image)}
                          >
                            <Download className="size-4" />
                            Download Image
                          </button>
                        </li>
                      )}
                      {message.text && (
                        <li>
                          <button
                            className="flex items-center gap-2 w-full px-2 py-1 hover:bg-base-200 rounded"
                            onClick={() => {
                              navigator.clipboard.writeText(message.text);
                              toast.success("Text copied!");
                            }}
                          >
                            <Copy className="size-4" />
                            Copy Text
                          </button>
                        </li>
                      )}
                      <li>
                        <button
                          className="flex items-center gap-2 w-full px-2 py-1 hover:bg-base-200 rounded"
                          onClick={() =>
                            setHiddenMessages((s) => new Set(s).add(message._id))
                          }
                        >
                          <Trash2 className="size-4" />
                          Delete For You
                        </button>
                      </li>
                      {message.senderId === authUser._id && (
                        <li>
                          <button
                            className="flex items-center gap-2 text-error w-full px-2 py-1 hover:bg-base-200 rounded"
                            onClick={async () => {
                              try {
                                await axiosInstance.delete(
                                  `/messages/${message._id}`
                                );
                                setHiddenMessages((s) => new Set(s).add(message._id));
                                toast.success("Message deleted for both");
                              } catch (err) {
                                console.error("Delete failed", err);
                                toast.error("Failed to delete message");
                              }
                            }}
                          >
                            <Trash2 className="size-4" />
                            Delete For Both
                          </button>
                        </li>
                      )}
                    </motion.ul>
                  </div>
                </div>
              </motion.div>
            ))}
        </AnimatePresence>
        <div ref={messageEndRef} />
      </div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {showImagePreview && (
          <motion.div
            className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowImagePreview(null)}
            role="dialog"
            aria-label="Image preview"
          >
            <motion.div
              className="relative max-w-[90vw] max-h-[90vh]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={showImagePreview}
                alt="Full-size image"
                className="max-w-full max-h-[80vh] rounded-lg shadow-2xl object-contain"
              />
              <button
                onClick={() => setShowImagePreview(null)}
                className="absolute top-2 right-2 btn btn-circle btn-sm btn-ghost bg-base-100/80"
                aria-label="Close image preview"
              >
                <X className="size-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;