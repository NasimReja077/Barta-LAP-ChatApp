import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, UserRound, UserRoundSearch, Pencil, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile, logout } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [editedFullName, setEditedFullName] = useState(authUser.fullName);
  const [isEditing, setIsEditing] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      try {
        await updateProfile({ profilePic: base64Image });
        toast.success("Profile picture updated");
      } catch (error) {
        toast.error("Failed to update profile picture");
      }
    };
  };

  const handleFullNameUpdate = async () => {
    if (editedFullName.trim() === "" || editedFullName === authUser.fullName) {
      setIsEditing(false);
      return;
    }
    try {
      await updateProfile({
        fullName: editedFullName,
        profilePic: authUser.profilePic,
      });
      toast.success("Full name updated");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update full name");
    }
  };

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
    <div className="min-h-screen pt-20 bg-gradient-to-b from-base-100 to-base-200">
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <motion.div
          className="bg-base-100 rounded-2xl p-6 sm:p-8 shadow-lg space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center">
            <motion.h1
              className="text-3xl sm:text-4xl font-extrabold text-primary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Profile
            </motion.h1>
            <motion.p
              className="mt-2 text-base text-base-content/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Manage your profile information
            </motion.p>
          </div>

          {/* Avatar Upload */}
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="relative group">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-36 sm:size-40 rounded-full object-cover border-4 border-base-300 group-hover:scale-105 transition-transform duration-200"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 bg-primary p-3 rounded-full cursor-pointer 
                  shadow-md hover:bg-primary/90 transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="size-6 text-primary-content" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                  aria-label="Upload profile picture"
                />
              </label>
            </div>
            <p className="text-sm text-base-content/60">
              {isUpdatingProfile ? "Uploading..." : "Click the camera to update your photo"}
            </p>
          </motion.div>

          {/* Info Fields */}
          <div className="space-y-6">
            {/* Full Name */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center justify-between text-base font-medium text-base-content/70">
                <div className="flex items-center gap-3">
                  <UserRound className="size-6" />
                  Full Name
                </div>
                {!isEditing && (
                  <motion.button
                    onClick={() => setIsEditing(true)}
                    className="text-base-content/60 hover:text-base-content"
                    aria-label="Edit full name"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Pencil className="size-5" />
                  </motion.button>
                )}
              </div>
              {isEditing ? (
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={editedFullName}
                    onChange={(e) => setEditedFullName(e.target.value)}
                    className="input input-md input-bordered w-full focus:ring-2 focus:ring-primary"
                    aria-label="Edit full name"
                  />
                  <motion.button
                    onClick={handleFullNameUpdate}
                    className="btn btn-md btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Save
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedFullName(authUser.fullName);
                    }}
                    className="btn btn-md btn-ghost"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              ) : (
                <p className="text-base font-semibold pl-9">{authUser?.fullName}</p>
              )}
            </motion.div>

            {/* User Name */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="flex items-center gap-3 text-base font-medium text-base-content/70">
                <UserRoundSearch className="size-6" />
                User Name
              </div>
              <p className="text-base font-semibold pl-9">{authUser?.userName}</p>
            </motion.div>

            {/* Email */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="flex items-center gap-3 text-base font-medium text-base-content/70">
                <Mail className="size-6" />
                Email Address
              </div>
              <p className="text-base font-semibold pl-9">{authUser?.email}</p>
            </motion.div>
          </div>

          {/* Account Information */}
          <motion.div
            className="bg-base-200 rounded-xl p-6 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">
              Account Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base">
              <div className="flex items-center justify-between py-2 border-b border-base-300 hover:bg-base-300 rounded-md px-2 transition-colors">
                <span className="font-medium">Last Login</span>
                <span>{authUser?.lastLogin ? new Date(authUser.lastLogin).toLocaleString() : "N/A"}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-base-300 hover:bg-base-300 rounded-md px-2 transition-colors">
                <span className="font-medium">Last Logout</span>
                <span>{authUser?.lastLogout ? new Date(authUser.lastLogout).toLocaleString() : "N/A"}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-base-300 hover:bg-base-300 rounded-md px-2 transition-colors">
                <span className="font-medium">Total Logins</span>
                <span>{authUser?.loginCount ?? 0}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-base-300 hover:bg-base-300 rounded-md px-2 transition-colors">
                <span className="font-medium">Messages Sent</span>
                <span>{authUser?.messagesSent ?? 0}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-base-300 hover:bg-base-300 rounded-md px-2 transition-colors">
                <span className="font-medium">Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2 hover:bg-base-300 rounded-md px-2 transition-colors">
                <span className="font-medium">Account Status</span>
                <span className="text-success font-semibold">Active</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <motion.button
                className="flex items-center gap-2 px-6 py-2 text-lg font-semibold text-error border border-error rounded-lg hover:bg-error hover:text-error-content transition-all"
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Logout"
              >
                <LogOut className="size-8" />
                <span className="hidden sm:inline">Logout</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;