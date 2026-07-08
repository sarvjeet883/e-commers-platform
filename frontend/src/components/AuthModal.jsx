import React, { useState } from "react";
import { X, Loader2, Eye, EyeOff, Mail, Lock, User, Shield, Heart, Leaf } from "lucide-react";

const AuthModal = ({
  isLoginForm,
  formData,
  handleInputChange,
  handleFormToggle,
  handleSubmit,
  handleUserClick,
}) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await handleSubmit(e);
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm";

  return (
    /* Centered dialog on all screen sizes */
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-[26rem] md:max-w-4xl max-h-[90vh] rounded-3xl flex flex-col md:flex-row relative overflow-hidden shadow-2xl animate-fade-up">

        {/* Close button (always visible, above both panels) */}
        <button
          onClick={handleUserClick}
          aria-label="Close"
          className="absolute top-3 right-3 z-20 text-gray-500 hover:text-gray-700 bg-white/80 backdrop-blur-sm hover:bg-gray-100 rounded-full p-2 shadow transition-all duration-200"
          disabled={loading}
        >
          <X className="h-4 w-4" />
        </button>

        {/* Left panel — desktop only */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 p-8 flex-col items-center justify-center text-center relative overflow-hidden">
          {/* Glow blobs */}
          <div className="absolute top-10 left-8 w-28 h-28 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-16 right-8 w-40 h-40 bg-teal-300/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-emerald-300/20 rounded-full blur-2xl" />

          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl flex items-center justify-center shadow-lg mb-5 mx-auto">
              <Leaf className="w-8 h-8 text-emerald-200" />
            </div>

            <h2 className="font-serif text-3xl font-bold text-white mb-3">
              Welcome to EcoGlam
            </h2>
            <p className="text-emerald-50/90 mb-8 text-sm leading-relaxed max-w-xs mx-auto">
              Join our community for eco-friendly beauty solutions crafted with
              love for you and the planet.
            </p>

            <div className="space-y-3 text-left">
              {[
                { icon: <Leaf className="w-4 h-4 text-emerald-200" />, text: "100% Eco-friendly Products" },
                { icon: <Shield className="w-4 h-4 text-emerald-200" />, text: "Designed by Dermatologists" },
                { icon: <Heart className="w-4 h-4 text-emerald-200 fill-current" />, text: "EWG Certified Excellence" },
              ].map((f) => (
                <div
                  key={f.text}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-4 py-2.5"
                >
                  {f.icon}
                  <span className="text-white/95 font-medium text-sm">{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel — the form */}
        <div className="w-full md:w-1/2 bg-white overflow-y-auto">
          <div className="px-5 xs:px-7 sm:px-8 py-6 sm:py-8 max-w-sm mx-auto">
            {/* Mobile brand header */}
            <div className="md:hidden flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/25">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                EcoGlam
              </span>
            </div>

            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-1">
              {isLoginForm ? "Welcome Back 👋" : "Create Account"}
            </h2>
            <p className="text-gray-500 mb-6 text-sm">
              {isLoginForm
                ? "Sign in to continue your skincare journey"
                : "Join our eco-beauty community"}
            </p>

            <form onSubmit={onSubmit} className="space-y-4">
              {!isLoginForm && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={inputCls}
                      placeholder="Enter your full name"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={inputCls}
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={inputCls}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {!isLoginForm && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={inputCls}
                      placeholder="Confirm your password"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full flex justify-center items-center bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 px-4 rounded-xl font-semibold shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    <span>{isLoginForm ? "Signing in..." : "Creating account..."}</span>
                  </>
                ) : (
                  <span>{isLoginForm ? "Sign In" : "Create Account"}</span>
                )}
              </button>
            </form>

            {/* Toggle between login / signup */}
            <div className="mt-5 text-center text-sm text-gray-500">
              {isLoginForm ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={handleFormToggle}
                className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors duration-200"
                disabled={loading}
              >
                {isLoginForm ? "Sign up" : "Sign in"}
              </button>
            </div>

            {isLoginForm && (
              <div className="mt-3 text-center">
                <button className="text-xs text-gray-400 hover:text-emerald-600 transition-colors duration-200">
                  Forgot your password?
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
