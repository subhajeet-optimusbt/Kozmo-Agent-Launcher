import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import GradientBackground from "../../components/layout/GradientBackground";
import StepHeader from "../../components/signup/StepHeader";
import Stepper from "../../components/signup/Stepper";

import Step1Account from "../../components/signup/Step1Account";
import Step2Company from "../../components/signup/Step2Company";
import Step3Plan from "../../components/signup/Step3Plan";
import Step4Review from "../../components/signup/Step4Review";
import LivePreview from "../../components/signup/LivePreview";

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [isExpanded, setIsExpanded] = useState(true);

  const [form, setForm] = useState({
    tenantName: "",
    ownerName: "",
    ownerEmail: "",
    password: "",
    region: "",
    companySize: "",
    industry: "",
    role: "",
    useCase: "",
    businessAreaName: "",
    businessAreaType: "",
    plan: "",
    agents: [] as string[],
  });

  const update = (key: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const next = () => setStep((s) => Math.min(4, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  // ✅ Live preview only for steps 1–3
  const showLivePreview = isExpanded && step < 4;

  return (
    <>
      <GradientBackground />

      <div className="min-h-screen px-6 py-6 flex justify-center relative">
        {/* Expand / Collapse Button */}
        <button
          onClick={() => setIsExpanded((v) => !v)}
          className="fixed top-6 right-6 z-50 h-10 w-10 rounded-full bg-white
                     shadow-lg border border-gray-200 flex items-center
                     justify-center hover:shadow-xl transition-all hover:scale-105"
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
            isExpanded ? "max-w-7xl" : "max-w-3xl"
          }`}
        >
          <StepHeader />

          <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl
                          p-6 lg:p-8 border border-white/60">
            <Stepper step={step} />

            {/* MAIN CONTENT */}
            <div
              className={`grid gap-8 mt-6 transition-all duration-500 ${
                showLivePreview
                  ? "grid-cols-1 lg:grid-cols-2"
                  : "grid-cols-1"
              }`}
            >
              {/* LEFT: STEP CONTENT */}
              <div>
                {step === 1 && (
                  <Step1Account form={form} update={update} />
                )}
                {step === 2 && (
                  <Step2Company form={form} update={update} />
                )}
                {step === 3 && (
                  <Step3Plan form={form} update={update} />
                )}
                {step === 4 && <Step4Review form={form} />}
              </div>

              {/* RIGHT: LIVE PREVIEW */}
              {showLivePreview && (
                <div className="hidden lg:flex justify-center items-start">
                  <LivePreview form={form} />
                </div>
              )}
            </div>

            {/* FOOTER NAVIGATION (FULL WIDTH) */}
            <div className="mt-8 flex justify-between">
              <button
                onClick={back}
                disabled={step === 1}
                className="h-10 px-4 rounded-lg border border-gray-200 text-sm
                           disabled:opacity-40 hover:bg-gray-50 transition
                           font-medium text-gray-700"
              >
                Back
              </button>

              <button
                onClick={
                  step === 4
                    ? () => alert("Workspace created!")
                    : next
                }
                className="h-10 px-6 rounded-lg bg-gradient-to-r
                           from-emerald-500 to-emerald-600
                           text-white font-semibold hover:shadow-lg
                           hover:shadow-emerald-500/30 transition-all"
              >
                {step === 4 ? "Create workspace" : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
