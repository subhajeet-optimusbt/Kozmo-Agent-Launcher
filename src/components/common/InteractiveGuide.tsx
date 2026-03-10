/* eslint-disable react-hooks/exhaustive-deps */
 
 
import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, BookOpen } from "lucide-react";
import { GUIDE_CONTENT } from "../../constants/guides";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface GuideTarget {
  selector: string;
  title: string;
  description: string;
  position?: "top" | "bottom" | "left" | "right";
  padding?: number;
}

interface InteractiveGuideProps {
  isOpen: boolean;
  onClose: () => void;
  moduleKey: string;
  targets: GuideTarget[];
}

// ─── Per-module accent colours (light theme) ─────────────────────────────────
const ACCENT: Record<
  string,
  {
    primary: string;
    dark: string;
    bg: string;
    border: string;
    text: string;
    pill: string;
  }
> = {
  emerald: {
    primary: "#10b981",
    dark: "#059669",
    bg: "#ecfdf5",
    border: "#a7f3d0",
    text: "#065f46",
    pill: "#d1fae5",
  },
  teal: {
    primary: "#14b8a6",
    dark: "#0d9488",
    bg: "#f0fdfa",
    border: "#99f6e4",
    text: "#134e4a",
    pill: "#ccfbf1",
  },
  blue: {
    primary: "#3b82f6",
    dark: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
    text: "#1e3a8a",
    pill: "#dbeafe",
  },
  violet: {
    primary: "#8b5cf6",
    dark: "#7c3aed",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    text: "#4c1d95",
    pill: "#ede9fe",
  },
  amber: {
    primary: "#f59e0b",
    dark: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    text: "#78350f",
    pill: "#fef3c7",
  },
  rose: {
    primary: "#f43f5e",
    dark: "#e11d48",
    bg: "#fff1f2",
    border: "#fecdd3",
    text: "#881337",
    pill: "#ffe4e6",
  },
  orange: {
    primary: "#f97316",
    dark: "#ea580c",
    bg: "#fff7ed",
    border: "#fed7aa",
    text: "#7c2d12",
    pill: "#ffedd5",
  },
};

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

// ─── Welcome Screen ───────────────────────────────────────────────────────────
const WelcomeScreen: React.FC<{
  moduleKey: string;
  color: (typeof ACCENT)[string];
  totalSteps: number;
  onStart: () => void;
  onClose: () => void;
}> = ({ moduleKey, color, totalSteps, onStart, onClose }) => {
  const [show, setShow] = useState(false);
  const guide = GUIDE_CONTENT[moduleKey];

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 40);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 10001,
          background: "rgba(15,23,42,0.55)",
          backdropFilter: "blur(6px)",
          transition: "opacity 0.3s",
          opacity: show ? 1 : 0,
        }}
        onClick={onClose}
      />

      {/* Card */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: show
            ? "translate(-50%,-50%) scale(1)"
            : "translate(-50%,-48%) scale(0.94)",
          zIndex: 10002,
          background: "#ffffff",
          borderRadius: 20,
          width: "min(460px, 92vw)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.06)",
          overflow: "hidden",
          transition:
            "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s",
          opacity: show ? 1 : 0,
        }}
      >
        {/* Coloured top bar */}
        <div
          style={{
            height: 5,
            background: `linear-gradient(90deg, ${color.primary}, ${color.dark})`,
          }}
        />

        <div style={{ padding: "32px 36px 28px" }}>
          {/* Close */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 18,
              right: 18,
              background: "#f1f5f9",
              border: "none",
              borderRadius: 8,
              width: 30,
              height: 30,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748b",
            }}
          >
            <X size={16} />
          </button>

          {/* Icon */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: color.bg,
              border: `2px solid ${color.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              marginBottom: 20,
              animation: "guideIconPulse 2.2s ease-in-out infinite",
            }}
          >
            {guide?.icon ?? "📖"}
          </div>

          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: color.pill,
              border: `1px solid ${color.border}`,
              borderRadius: 20,
              padding: "4px 12px",
              fontSize: 11,
              fontWeight: 700,
              color: color.text,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            <BookOpen size={12} /> Interactive Guide
          </div>

          <h2
            style={{
              fontSize: 22,
              fontWeight: 900,
              color: "#0f172a",
              margin: "0 0 8px",
              letterSpacing: "-0.02em",
            }}
          >
            {guide?.title ?? "Page Tour"}
          </h2>
          <p
            style={{
              fontSize: 13.5,
              color: "#64748b",
              lineHeight: 1.6,
              margin: "0 0 24px",
            }}
          >
            {guide?.subtitle ?? "Walk through the key features of this page."}{" "}
            <strong style={{ color: "#334155" }}>{totalSteps} steps</strong> —
            takes about 1 minute.
          </p>

          {/* Step preview pills */}
          <div style={{ display: "flex", gap: 5, marginBottom: 28 }}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                style={{
                  flex: i === 0 ? 2 : 1,
                  height: 6,
                  borderRadius: 3,
                  background: i === 0 ? color.primary : color.pill,
                  transition: "all 0.3s",
                }}
              />
            ))}
          </div>

          {/* Start button */}
          <button
            onClick={onStart}
            style={{
              width: "100%",
              padding: "13px 0",
              background: `linear-gradient(135deg, ${color.primary}, ${color.dark})`,
              border: "none",
              borderRadius: 12,
              color: "#fff",
              fontSize: 15,
              fontWeight: 800,
              cursor: "pointer",
              letterSpacing: "0.02em",
              boxShadow: `0 4px 16px ${color.primary}40`,
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(-2px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                `0 8px 24px ${color.primary}50`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                `0 4px 16px ${color.primary}40`;
            }}
          >
            ▶ &nbsp;Start Tour
          </button>

          <p
            style={{
              textAlign: "center",
              fontSize: 11.5,
              color: "#94a3b8",
              marginTop: 14,
            }}
          >
            Use{" "}
            <kbd
              style={{
                background: "#f1f5f9",
                border: "1px solid #e2e8f0",
                borderRadius: 4,
                padding: "1px 5px",
                fontFamily: "monospace",
                fontSize: 11,
              }}
            >
              ←
            </kbd>{" "}
            <kbd
              style={{
                background: "#f1f5f9",
                border: "1px solid #e2e8f0",
                borderRadius: 4,
                padding: "1px 5px",
                fontFamily: "monospace",
                fontSize: 11,
              }}
            >
              →
            </kbd>{" "}
            to navigate &nbsp;·&nbsp;{" "}
            <kbd
              style={{
                background: "#f1f5f9",
                border: "1px solid #e2e8f0",
                borderRadius: 4,
                padding: "1px 5px",
                fontFamily: "monospace",
                fontSize: 11,
              }}
            >
              ESC
            </kbd>{" "}
            to close
          </p>
        </div>
      </div>

      <style>{`
        @keyframes guideIconPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
      `}</style>
    </>
  );
};

// ─── Spotlight Overlay ────────────────────────────────────────────────────────
const SpotlightOverlay: React.FC<{
  rect: DOMRect;
  color: (typeof ACCENT)[string];
}> = ({ rect, color }) => {
  const pad = 10;
  const x = rect.left - pad,
    y = rect.top - pad;
  const w = rect.width + pad * 2,
    h = rect.height + pad * 2;

  return (
    <svg
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 10003,
        pointerEvents: "none",
      }}
    >
      <defs>
        <mask id="guide-mask">
          <rect width="100%" height="100%" fill="white" />
          <rect x={x} y={y} width={w} height={h} rx={8} fill="black" />
        </mask>
      </defs>

      {/* Semi-transparent overlay with cutout */}
      <rect
        width="100%"
        height="100%"
        fill="rgba(15,23,42,0.48)"
        mask="url(#guide-mask)"
      />

      {/* Animated border on the highlighted element */}
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={8}
        fill="none"
        stroke={color.primary}
        strokeWidth="2.5"
        style={{ animation: "guideBorderPulse 1.8s ease-in-out infinite" }}
      />
      {/* Outer soft ring */}
      <rect
        x={x - 5}
        y={y - 5}
        width={w + 10}
        height={h + 10}
        rx={12}
        fill="none"
        stroke={color.primary}
        strokeWidth="1"
        opacity="0.3"
        style={{ animation: "guideBorderPulse 1.8s ease-in-out infinite 0.4s" }}
      />

      <style>{`
        @keyframes guideBorderPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
      `}</style>
    </svg>
  );
};

// ─── Tooltip Card ─────────────────────────────────────────────────────────────
const TooltipCard: React.FC<{
  step: GuideTarget;
  currentStep: number;
  totalSteps: number;
  color: (typeof ACCENT)[string];
  pos: { top: number; left: number };
  arrowDir: "top" | "bottom" | "left" | "right";
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  onSkip: () => void;
}> = ({
  step,
  currentStep,
  totalSteps,
  color,
  pos,
  arrowDir,
  onNext,
  onPrev,
  onClose,
  onSkip,
}) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(t);
  }, [currentStep]);

  const isLast = currentStep === totalSteps - 1;
  const progress = Math.round(((currentStep + 1) / totalSteps) * 100);

  // Arrow position
  const arrowBase: React.CSSProperties = {
    position: "absolute",
    width: 12,
    height: 12,
    background: "#ffffff",
    border: "1px solid #e2e8f0",
  };
  const arrowStyles: Record<string, React.CSSProperties> = {
    bottom: {
      ...arrowBase,
      top: -7,
      left: "50%",
      marginLeft: -6,
      transform: "rotate(45deg)",
      borderBottom: "none",
      borderRight: "none",
    },
    top: {
      ...arrowBase,
      bottom: -7,
      left: "50%",
      marginLeft: -6,
      transform: "rotate(45deg)",
      borderTop: "none",
      borderLeft: "none",
    },
    right: {
      ...arrowBase,
      left: -7,
      top: "50%",
      marginTop: -6,
      transform: "rotate(45deg)",
      borderTop: "none",
      borderRight: "none",
    },
    left: {
      ...arrowBase,
      right: -7,
      top: "50%",
      marginTop: -6,
      transform: "rotate(45deg)",
      borderBottom: "none",
      borderLeft: "none",
    },
  };

  return (
    <div
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        width: 340,
        zIndex: 10005,
        opacity: visible ? 1 : 0,
        transform: visible
          ? "scale(1) translateY(0)"
          : "scale(0.95) translateY(8px)",
        transition:
          "opacity 0.22s ease, transform 0.28s cubic-bezier(0.34,1.4,0.64,1)",
        pointerEvents: "all",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: 16,
          border: "1px solid #e2e8f0",
          boxShadow:
            "0 16px 48px rgba(0,0,0,0.13), 0 4px 16px rgba(0,0,0,0.06)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Arrow pointer */}
        <div style={arrowStyles[arrowDir]} />

        {/* Progress bar */}
        <div style={{ height: 3, background: "#f1f5f9" }}>
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${color.primary}, ${color.dark})`,
              transition: "width 0.4s ease",
              borderRadius: 2,
            }}
          />
        </div>

        {/* Header */}
        <div
          style={{
            padding: "16px 18px 12px",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            {/* Step number badge */}
            <div
              style={{
                minWidth: 30,
                height: 30,
                borderRadius: 8,
                background: color.bg,
                border: `1.5px solid ${color.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 900,
                color: color.text,
                flexShrink: 0,
              }}
            >
              {currentStep + 1}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: 14,
                  fontWeight: 900,
                  color: "#0f172a",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.35,
                }}
              >
                {step.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 6,
                width: 26,
                height: 26,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#94a3b8",
                flexShrink: 0,
              }}
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Description */}
        <div style={{ padding: "12px 18px 10px" }}>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: "#475569",
              lineHeight: 1.6,
            }}
          >
            {step.description}
          </p>
        </div>

        {/* Step dots */}
        <div
          style={{
            padding: "4px 18px 14px",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              style={{
                height: 5,
                borderRadius: 3,
                width: i === currentStep ? 18 : i < currentStep ? 12 : 7,
                background: i <= currentStep ? color.primary : "#e2e8f0",
                transition: "all 0.3s cubic-bezier(0.34,1.4,0.64,1)",
              }}
            />
          ))}
          <span
            style={{
              marginLeft: "auto",
              fontSize: 11,
              color: "#94a3b8",
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            {currentStep + 1} / {totalSteps}
          </span>
        </div>

        {/* Actions */}
        <div
          style={{
            padding: "10px 18px 16px",
            borderTop: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={onSkip}
            style={{
              background: "none",
              border: "none",
              fontSize: 12,
              color: "#94a3b8",
              cursor: "pointer",
              padding: "4px 0",
              fontWeight: 600,
            }}
          >
            Skip tour
          </button>

          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={onPrev}
              disabled={currentStep === 0}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                padding: "7px 13px",
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                background: currentStep === 0 ? "#f8fafc" : "#ffffff",
                color: currentStep === 0 ? "#cbd5e1" : "#475569",
                fontSize: 12,
                fontWeight: 700,
                cursor: currentStep === 0 ? "not-allowed" : "pointer",
                transition: "all 0.15s",
              }}
            >
              <ChevronLeft size={14} /> Back
            </button>

            <button
              onClick={onNext}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "7px 16px",
                borderRadius: 8,
                border: "none",
                background: `linear-gradient(135deg, ${color.primary}, ${color.dark})`,
                color: "#fff",
                fontSize: 12,
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: `0 2px 10px ${color.primary}35`,
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "";
              }}
            >
              {isLast ? (
                "Finish"
              ) : (
                <>
                  Next <ChevronRight size={14} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const InteractiveGuide: React.FC<InteractiveGuideProps> = ({
  isOpen,
  onClose,
  moduleKey,
  targets,
}) => {
  const [phase, setPhase] = useState<"welcome" | "tour">("welcome");
  const [step, setStep] = useState(0);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const [arrowDir, setArrowDir] = useState<"top" | "bottom" | "left" | "right">(
    "bottom",
  );
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const guide = GUIDE_CONTENT[moduleKey];
  const color = ACCENT[guide?.color ?? "emerald"] ?? ACCENT.emerald;
  const currentTarget = targets?.[step];
  const totalSteps = targets?.length ?? 0;

  // ── Reset every open ────────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setStep(0);
      setPhase("welcome");
    }
  }, [isOpen]);

  // ── Compute tooltip position from live getBoundingClientRect ─────────────────
  const computePos = useCallback(() => {
    if (!currentTarget) return;
    const el = document.querySelector(currentTarget.selector);
    if (!el) {
      console.warn(`[Guide] Element not found: ${currentTarget.selector}`);
      return;
    }

    const rect = el.getBoundingClientRect();
    setTargetRect(rect);

    const PAD = currentTarget.padding ?? 16;
    const TW = 340,
      TH = 270;
    const vw = window.innerWidth,
      vh = window.innerHeight;

    let dir = (currentTarget.position ?? "bottom") as typeof arrowDir;
    if (dir === "bottom" && rect.bottom + TH + PAD > vh) dir = "top";
    if (dir === "top" && rect.top - TH - PAD < 0) dir = "bottom";
    if (dir === "right" && rect.right + TW + PAD > vw) dir = "left";
    if (dir === "left" && rect.left - TW - PAD < 0) dir = "right";

    let top = 0,
      left = 0;
    switch (dir) {
      case "bottom":
        top = rect.bottom + PAD;
        left = clamp(rect.left + rect.width / 2 - TW / 2, 12, vw - TW - 12);
        break;
      case "top":
        top = rect.top - TH - PAD;
        left = clamp(rect.left + rect.width / 2 - TW / 2, 12, vw - TW - 12);
        break;
      case "right":
        top = clamp(rect.top + rect.height / 2 - TH / 2, 12, vh - TH - 12);
        left = rect.right + PAD;
        break;
      case "left":
        top = clamp(rect.top + rect.height / 2 - TH / 2, 12, vh - TH - 12);
        left = rect.left - TW - PAD;
        break;
    }

    top = clamp(top, 12, vh - TH - 12);
    left = clamp(left, 12, vw - TW - 12);

    setArrowDir(dir);
    setTooltipPos({ top, left });
  }, [currentTarget]);

  // ── On step change ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "tour" || !currentTarget) return;
    const el = document.querySelector(currentTarget.selector);

    computePos();

    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      const t = setTimeout(() => computePos(), 380);
      return () => clearTimeout(t);
    }
  }, [phase, step]);  

  // ── On scroll/resize ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "tour") return;
    window.addEventListener("scroll", computePos, { passive: true });
    window.addEventListener("resize", computePos);
    return () => {
      window.removeEventListener("scroll", computePos);
      window.removeEventListener("resize", computePos);
    };
  }, [phase, computePos]);

  // ── Keyboard ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, phase, step]);

  const handleNext = () => {
    if (phase !== "tour") return;
    if (step < totalSteps - 1) {
      setStep((s) => s + 1);
    } else {
      // Last step — just close immediately, no done screen
      handleClose();
    }
  };
  const handlePrev = () => {
    if (phase === "tour" && step > 0) setStep((s) => s - 1);
  };
  const handleClose = () => {
    setPhase("welcome");
    setStep(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {phase === "welcome" && (
        <WelcomeScreen
          moduleKey={moduleKey}
          color={color}
          totalSteps={totalSteps}
          onStart={() => setPhase("tour")}
          onClose={handleClose}
        />
      )}

      {phase === "tour" && currentTarget && (
        <>
          {/* Click-away overlay */}
          <div
            onClick={handleClose}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 10002,
              cursor: "pointer",
            }}
          />

          {targetRect && <SpotlightOverlay rect={targetRect} color={color} />}

          <TooltipCard
            step={currentTarget}
            currentStep={step}
            totalSteps={totalSteps}
            color={color}
            pos={tooltipPos}
            arrowDir={arrowDir}
            onNext={handleNext}
            onPrev={handlePrev}
            onClose={handleClose}
            onSkip={handleClose}
          />
        </>
      )}
    </>
  );
};

export default InteractiveGuide;
