import { useState } from "react";
import { Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";
import GradientBackground from "../../components/layout/GradientBackground";
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <>
      <GradientBackground />

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
            {isExpanded && (
              <div className="hidden lg:flex justify-center items-center animate-fadeIn">
                <div className="relative w-full max-w-lg min-h-[520px] rounded-3xl bg-gradient-to-br from-indigo-50 via-blue-50 to-emerald-50 p-6 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.25)] border border-white/70 flex flex-col justify-between">
                  {/* subtle glow */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 via-transparent to-white/30 pointer-events-none" />

                  {/* Top */}
                  <div className="relative space-y-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-white text-[11px] font-bold tracking-wide text-emerald-600 shadow-sm w-fit">
                      Commercial Intelligence OS
                    </span>

                    <h2 className="text-xl font-bold text-gray-800 leading-snug">
                      Agents that manage your commercial world
                    </h2>

                    <p className="text-sm text-gray-700 leading-relaxed">
                      Kozmo turns messy renewals, proposals, negotiations, and
                      vendor work into structured, agent-managed quests powered
                      by DMA, watchlists, signals, and briefs.
                    </p>
                  </div>

                  {/* Agents */}
                  <div className="relative flex flex-wrap gap-2 mt-6">
                    {[
                      "Document Agent (DMA)",
                      "Contract Agent",
                      "Renewal & Commercial Agents",
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 bg-white/80 rounded-full px-4 py-2 border border-white shadow-sm hover:shadow-md transition"
                      >
                        <span className="h-2 w-2 rounded-full bg-gradient-to-br from-emerald-400 to-blue-600" />
                        <p className="text-xs font-semibold text-gray-800 whitespace-nowrap">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Bottom */}
                  <div className="relative bg-white/70 backdrop-blur-md rounded-2xl px-5 py-5 border border-white shadow-inner space-y-4 mt-6">
                    <ul className="space-y-3 text-xs text-gray-700">
                      <li className="flex items-start gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <p>
                          From open-world chaos to a defined domain using
                          metadata, watchlists, signals, and rubrics.
                        </p>
                      </li>

                      <li className="flex items-start gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                        <p>
                          Every document becomes a quest with a{" "}
                          <span className="font-medium">
                            living Intelligence Brief
                          </span>
                          , not just a file in storage.
                        </p>
                      </li>

                      <li className="flex items-start gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
                        <p>
                          Happy Path execution and Bhashya-style reflection to
                          continuously improve outcomes.
                        </p>
                      </li>
                    </ul>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-700">
                        Renewals & Proposals
                      </span>
                      <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-blue-100 text-blue-700">
                        Negotiation & Vendor
                      </span>
                      <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-indigo-100 text-indigo-700">
                        Team & Enterprise
                      </span>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed pt-1">
                      Sign in once and bring all your commercial work under a
                      single operating system — from small teams using DMA as a
                      commercial desk to enterprises running full multi-agent
                      commercial intelligence.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
