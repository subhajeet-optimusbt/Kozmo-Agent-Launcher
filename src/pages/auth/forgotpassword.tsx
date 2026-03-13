/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import GradientBackground from "../../components/layout/GradientBackground";
import toast from "react-hot-toast";

type Step = "email" | "sent";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<Step>("email");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});
  const navigate = useNavigate();

  const validateEmail = () => {
    if (!email.trim()) {
      setErrors({ email: "Email is required" });
      toast.error("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: "Enter a valid email address" });
      toast.error("Enter a valid email address");
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSendReset = async () => {
    if (!validateEmail()) return;
    setLoading(true);
    try {
      // Replace with your actual API call:
      // await forgotPasswordApi({ email });
      await new Promise((r) => setTimeout(r, 1200)); // simulate network
      setStep("sent");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) handleSendReset();
  };

  return (
    <>
      <GradientBackground />

      <div className="min-h-screen flex items-center justify-center px-6 py-12 relative">
        <div className="w-full max-w-md">

          {/* ── Brand Header ── */}
          <div className="mb-8 space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-extrabold text-lg shadow-[0_10px_25px_-10px_rgba(0,0,0,0.5)]">
                K
              </div>
              <div className="leading-tight">
                <p className="font-semibold text-lg text-gray-900">Kozmo</p>
                <p className="text-[11px] text-gray-500 tracking-widest uppercase">
                  Workspace Sign-In
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <h1 className="text-2xl font-extrabold text-gray-900 leading-snug">
                {step === "email" ? "Reset your password" : "Check your inbox"}
              </h1>
              <p className="text-sm text-gray-500 leading-relaxed">
                {step === "email"
                  ? "Enter the email linked to your workspace and we'll send you a reset link."
                  : `We've sent a password reset link to ${email}. It may take a minute to arrive.`}
              </p>
            </div>
          </div>

          {/* ── Card ── */}
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_25px_50px_-20px_rgba(0,0,0,0.3)] border border-white/60 p-8">
            {/* Decorative blob */}
            <div className="absolute -top-6 -right-6 h-28 w-28 rounded-full bg-gradient-to-br from-emerald-300/30 to-blue-300/20 blur-2xl pointer-events-none" />

            {/* ── STEP 1: Email Entry ── */}
            {step === "email" && (
              <div className="space-y-5" onKeyDown={handleKeyDown}>

                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Workspace email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors({});
                      }}
                      placeholder="you@company.com"
                      autoComplete="email"
                      autoFocus
                      tabIndex={1}
                      className={`w-full h-11 pl-9 pr-4 rounded-xl border text-sm
                        bg-white focus:outline-none focus:ring-2 transition-all
                        ${
                          errors.email
                            ? "border-red-400 focus:ring-red-400/30"
                            : "border-gray-200 focus:ring-emerald-400/30 focus:border-emerald-400"
                        }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  tabIndex={2}
                  disabled={loading}
                  onClick={handleSendReset}
                  className="
                    w-full h-11 rounded-xl
                    bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600
                    text-white font-semibold text-sm
                    shadow-md shadow-emerald-500/30
                    transition-all duration-300 ease-out
                    hover:shadow-lg hover:shadow-emerald-500/40
                    hover:from-emerald-500 hover:via-emerald-600 hover:to-emerald-700
                    hover:-translate-y-[1px]
                    active:translate-y-0 active:shadow-md
                    disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
                    flex items-center justify-center gap-2
                  "
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Sending reset link…
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                  <span className="font-medium shrink-0">or continue with</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                </div>

                {/* SSO Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() =>
                      (window.location.href =
                        "https://kozmo-saas.azurewebsites.net/auth/microsoft" +
                        "?returnUrl=" +
                        encodeURIComponent(window.location.origin))
                    }
                    tabIndex={3}
                    className="h-10 rounded-xl border border-gray-200 flex items-center justify-center gap-2.5 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                      alt="Microsoft"
                      className="h-4 w-4"
                    />
                    Microsoft
                  </button>

                  <button
                    onClick={() =>
                      (window.location.href =
                        "https://kozmo-saas.azurewebsites.net/auth/google" +
                        "?returnUrl=" +
                        encodeURIComponent(window.location.origin))
                    }
                    tabIndex={4}
                    className="h-10 rounded-xl border border-gray-200 flex items-center justify-center gap-2.5 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                      alt="Google"
                      className="h-4 w-4"
                    />
                    Google
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 2: Confirmation ── */}
            {step === "sent" && (
              <div className="space-y-5 text-center py-2">
                {/* Success Icon */}
                <div className="flex justify-center">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 flex items-center justify-center shadow-sm">
                    <CheckCircle className="h-8 w-8 text-emerald-500" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="font-semibold text-gray-900 text-base">
                    Reset link sent!
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Didn't receive it? Check your spam folder or{" "}
                    <button
                      onClick={() => setStep("email")}
                      className="text-emerald-600 font-medium hover:text-emerald-700 transition underline underline-offset-2"
                    >
                      try a different email
                    </button>
                    .
                  </p>
                </div>

                {/* Resend Button */}
                <button
                  onClick={handleSendReset}
                  disabled={loading}
                  className="
                    w-full h-11 rounded-xl
                    bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600
                    text-white font-semibold text-sm
                    shadow-md shadow-emerald-500/30
                    transition-all duration-300 ease-out
                    hover:shadow-lg hover:shadow-emerald-500/40
                    hover:-translate-y-[1px]
                    active:translate-y-0
                    disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
                    flex items-center justify-center gap-2
                  "
                >
                  {loading ? "Resending…" : "Resend reset link"}
                </button>
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="mt-6 flex flex-col items-center gap-2">
            <button
              onClick={() => navigate("/login")}
              className="inline-flex items-center gap-1.5 text-sm text-emerald-600 font-semibold hover:text-emerald-700 transition group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to Sign in
            </button>

            <p className="text-xs text-gray-400">
              By continuing, you agree to Kozmo's Terms &amp; Privacy Policy.
            </p>
          </div>

        </div>
      </div>
    </>
  );
}