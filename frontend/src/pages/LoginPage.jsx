import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const { login, isLoggingIn, error } = useAuthStore();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Valid email is required";
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    try {
      await login(formData);
      toast.success("Logged in successfully");
    } catch (err) {
      toast.error(error || "Login failed");
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-b from-base-100 to-base-200">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <motion.div
          className="w-full max-w-md bg-base-100/90 backdrop-blur-md rounded-3xl p-8 sm:p-10 shadow-xl border border-base-300/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo */}
          <motion.div
            className="text-center mb-10"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
          >
            <div className="flex flex-col items-center gap-3 group">
              <motion.div
                className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageSquare className="size-8 text-primary" />
              </motion.div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-primary mt-2">
                Welcome Back
              </h1>
              <p className="text-base text-base-content/70">
                Sign in to your account
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base font-semibold">
                  Email
                </span>
              </label>
              <motion.div
                className="relative"
                animate={errors.email ? { x: [-5, 5, -5, 5, 0] } : {}}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-6 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered input-md w-full pl-12 ${
                    errors.email ? "input-error" : ""
                  }`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  aria-label="Email address"
                />
                {errors.email && (
                  <p className="text-error text-sm mt-1">{errors.email}</p>
                )}
              </motion.div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-base font-semibold">
                  Password
                </span>
              </label>
              <motion.div
                className="relative"
                animate={errors.password ? { x: [-5, 5, -5, 5, 0] } : {}}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-6 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered input-md w-full pl-12 pr-12 ${
                    errors.password ? "input-error" : ""
                  }`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  aria-label="Password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-6 text-base-content/40" />
                  ) : (
                    <Eye className="size-6 text-base-content/40" />
                  )}
                </button>
              </motion.div>
              {errors.password && (
                <p className="text-error text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <motion.button
              type="submit"
              className="btn btn-primary w-full btn-md bg-gradient-to-r from-primary to-primary/80 text-primary-content hover:from-primary/90 hover:to-primary shadow-md"
              disabled={isLoggingIn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="size-6 animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </motion.button>
          </form>

          <motion.div
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-base text-base-content/70">
              Don't have an account?{" "}
              <Link to="/signup" className="link link-primary font-semibold">
                Create account
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title="Welcome back!"
        subtitle="Sign in to continue your conversations and catch up with your messages."
      />
    </div>
  );
};

export default LoginPage;