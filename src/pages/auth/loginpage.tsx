/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";
import GradientBackground from "../../components/layout/GradientBackground";
import RightSection from "../../components/login/RightSection";
import { loginApi } from "../../services/authService";
import toast from "react-hot-toast";
import FullscreenLoader from "../../components/ui/FullScreenLoader";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("user");
    if (loggedIn) navigate("/dashboard", { replace: true });
  }, []);

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const response = await loginApi({
        Email: email,
        Password: password,
        RememberMe: keepSignedIn,
      });

      if (!response.isAuthenticated) {
        toast.error("Invalid email or password");
        return;
      }

      // What frontend actually needs
      const userContext = {
        userId: response.userId,
        userName: response.userName,
        email: response.email,
        accounts: response.accounts,
        activeAccountId:
          response.accounts.find((a) => a.isDefault === "Yes")?.accountId ??
          response.accounts[0]?.accountId,
      };

      const storage = keepSignedIn ? localStorage : sessionStorage;
      storage.setItem("user", JSON.stringify(userContext));

      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <>
      <GradientBackground />

      {loading && <FullscreenLoader />}
      <div className="min-h-screen flex items-center justify-center px-6 py-8 relative">
        {/* Collapse/Expand Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="fixed top-6 right-6 z-50 h-10 w-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:shadow-xl transition-all hover:scale-105"
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? (
            <ChevronRight className="h-5 w-5 text-gray-700" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          )}
        </button>

        <div
          className={`w-full transition-all duration-500 ${
            isExpanded ? "max-w-6xl" : "max-w-2xl"
          }`}
        >
          <div
            className={`grid gap-10 items-stretch transition-all duration-500 ${
              isExpanded ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
            }`}
          >
            {/* ================= LEFT: AUTH SECTION ================= */}
            <div className="flex justify-center items-center">
              <div
                className={`w-full flex flex-col justify-center transition-all duration-500 ${
                  isExpanded ? "max-w-lg" : "max-w-xl"
                }`}
              >
                {/* Brand + Context */}
                <div className="mb-8 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-extrabold text-lg shadow-[0_10px_25px_-10px_rgba(0,0,0,0.5)]">
                      K
                    </div>

                    <div className="leading-tight">
                      <p className="font-semibold text-lg text-gray-900">
                        Kozmo
                      </p>
                      <p className="text-[11px] text-gray-500 tracking-widest">
                        WORKSPACE SIGN-IN
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h1 className="text-xl font-extrabold text-gray-900 leading-snug">
                      Sign in to KOZMO DMA
                    </h1>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Use your workspace credentials or sign in with your
                      organisation SSO.
                    </p>
                  </div>
                </div>

                {/* Login Card */}
                <div
                  className={`relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_25px_50px_-20px_rgba(0,0,0,0.35)] border border-white/60 transition-all duration-500 ${
                    isExpanded ? "p-6" : "p-8"
                  }`}
                >
                  {/* subtle inner glow */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 via-transparent to-white/20 pointer-events-none" />

                  <div className="relative space-y-4">
                    {/* User ID */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        User ID
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full h-11 px-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all text-sm"
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>

                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full h-11 px-3 pr-12 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all text-sm"
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 transition"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Utilities */}
                    <div className="flex items-center justify-between text-sm pt-1">
                      {/* Checkbox + Label */}
                      <label className="group flex items-center gap-2 text-gray-600 cursor-pointer transition-all duration-300 hover:text-emerald-600">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-emerald-600
                 focus:ring-emerald-400
                 transition-all duration-300
                 group-hover:border-emerald-500"
                          checked={keepSignedIn}
                          onChange={() => setKeepSignedIn(!keepSignedIn)}
                        />
                        <span className="text-sm group-hover:translate-x-0.5 transition-transform duration-300">
                          Keep me signed in
                        </span>
                      </label>

                      {/* Forgot Password */}
                      <a
                        href="#"
                        className="relative font-medium text-emerald-600
               transition-all duration-300
               hover:text-emerald-700
               after:absolute after:left-0 after:-bottom-0.5
               after:h-[2px] after:w-0
               after:bg-emerald-600
               after:transition-all after:duration-300
               hover:after:w-full"
                      >
                        Forgot password?
                      </a>
                    </div>

                    {/* Primary CTA */}
                    <button
                      className="
    w-full h-11 rounded-lg
    bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600
    text-white font-semibold text-sm
    shadow-md shadow-emerald-500/30
    transition-all duration-300 ease-out
    hover:shadow-lg hover:shadow-emerald-500/40
    hover:from-emerald-500 hover:via-emerald-600 hover:to-emerald-700
    hover:-translate-y-[1px]
    active:translate-y-0 active:shadow-md
  "
                      onClick={handleLogin}
                    >
                      Sign in
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 text-xs text-gray-400 py-2">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                      <span className="font-medium">or continue with</span>
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                    </div>

                    {/* SSO */}
                    <div className="grid grid-cols-2 gap-3">
                      <button className="h-10 rounded-lg border border-gray-200 flex items-center justify-center gap-3 hover:bg-gray-50 transition text-sm">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                          alt="Microsoft"
                          className="h-4 w-4"
                        />
                        <span className="font-medium text-gray-700">
                          Microsoft
                        </span>
                      </button>

                      <button className="h-10 rounded-lg border border-gray-200 flex items-center justify-center gap-3 hover:bg-gray-50 transition text-sm">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                          alt="Google"
                          className="h-4 w-4"
                        />
                        <span className="font-medium text-gray-700">
                          Google
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center space-y-2">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Don't have an account? Step into commercial world — where
                    intelligence orchestrates action{" "}
                    <a
                      href="/signup"
                      className="text-emerald-600 font-semibold hover:text-emerald-700 transition"
                    >
                      Get started with Kozmo →
                    </a>
                  </p>

                  <p className="text-xs text-gray-400">
                    By continuing, you agree to Kozmo's Terms & Privacy Policy.
                  </p>
                </div>
              </div>
            </div>

            {/* ================= RIGHT: PRODUCT STORY ================= */}
            {isExpanded && <RightSection />}
          </div>
        </div>
      </div>
    </>
  );
}
