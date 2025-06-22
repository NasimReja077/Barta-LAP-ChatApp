import EmojiPicker from "emoji-picker-react";
import { useRef, useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { Smile, Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const pickerRef = useRef(null);
  const { sendMessage } = useChatStore();

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file?.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setLoading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    setLoading(true);
    try {
      await sendMessage({ text: text.trim(), image: imagePreview });
      setText("");
      setImagePreview(null);
      setShowPicker(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 w-full bg-base-100 border-t border-base-300 relative">
      {/* Emoji Picker */}
      <AnimatePresence>
        {showPicker && (
          <motion.div
            ref={pickerRef}
            className="absolute bottom-20 left-4 z-50 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <EmojiPicker
              onEmojiClick={(emojiData, event) => {
                event.stopPropagation();
                setText((prev) => prev + emojiData.emoji);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview */}
      {imagePreview && (
        <motion.div
          className="mb-3 flex items-center gap-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative group">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-base-300 group-hover:scale-105 transition-transform duration-200"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-error text-error-content flex items-center justify-center shadow"
              type="button"
              aria-label="Remove image"
            >
              <X className="size-4" />
            </button>
          </div>
          {loading && <div className="loading loading-spinner loading-sm" />}
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 bg-base-200 rounded-lg p-2">
          {/* Emoji Button */}
          <motion.button
            type="button"
            className="btn btn-ghost btn-circle"
            onClick={(e) => {
              e.stopPropagation();
              setShowPicker((v) => !v);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle emoji picker"
            title="Add emoji"
          >
            <Smile className="size-5 text-accent" />
          </motion.button>

          {/* Text Input */}
          <input
            type="text"
            className="input input-bordered w-full rounded-lg bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-label="Message input"
          />

          {/* Image Upload Button */}
          <motion.button
            type="button"
            className={`btn btn-ghost btn-circle ${imagePreview ? "text-success" : "text-base-content/60"}`}
            onClick={() => fileInputRef.current?.click()}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Upload image"
            title="Upload image"
            disabled={loading}
          >
            <Image className="size-5" />
          </motion.button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
        </div>

        {/* Send Button */}
        <motion.button
          type="submit"
          className={`btn btn-circle bg-accent hover:bg-primary text-base-100 ${(!text.trim() && !imagePreview) || loading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={(!text.trim() && !imagePreview) || loading}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Send message"
          title="Send message"
        >
          <Send className="size-5" />
        </motion.button>
      </form>
    </div>
  );
};

export default MessageInput;