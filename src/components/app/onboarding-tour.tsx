"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const TOUR_STEPS = [
  {
    target: '[data-tour="dashboard"]',
    title: "Welcome to HelioTrail",
    content: "This is your portfolio dashboard. View KPIs, compliance scores, and recent passport activity.",
    position: "bottom" as const,
  },
  {
    target: '[data-tour="passports"]',
    title: "Manage Passports",
    content: "Create, review, and publish Digital Product Passports for your PV modules.",
    position: "right" as const,
  },
  {
    target: '[data-tour="analytics"]',
    title: "Compliance Analytics",
    content: "Track EU ESPR readiness, certificate health, and material intelligence across your portfolio.",
    position: "right" as const,
  },
  {
    target: '[data-tour="create-passport"]',
    title: "Create Your First Passport",
    content: "Use the 9-step wizard to create a fully compliant Digital Product Passport.",
    position: "bottom" as const,
  },
];

const STORAGE_KEY = "heliotrail_tour_completed";

export function OnboardingTour() {
  const [step, setStep] = useState(-1); // -1 = not started
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) {
      // Small delay to let the DOM render
      const timer = setTimeout(() => setStep(0), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (step < 0 || step >= TOUR_STEPS.length) return;
    const el = document.querySelector(TOUR_STEPS[step].target);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const stepDef = TOUR_STEPS[step];

    let top = 0, left = 0;
    if (stepDef.position === "bottom") {
      top = rect.bottom + 12;
      left = rect.left + rect.width / 2 - 140;
    } else if (stepDef.position === "right") {
      top = rect.top + rect.height / 2 - 40;
      left = rect.right + 12;
    }

    // Clamp to viewport
    left = Math.max(8, Math.min(left, window.innerWidth - 296));
    top = Math.max(8, top);

    setPos({ top, left });

    // Highlight the target
    el.classList.add("ring-2", "ring-primary", "ring-offset-2", "relative", "z-50");
    return () => {
      el.classList.remove("ring-2", "ring-primary", "ring-offset-2", "relative", "z-50");
    };
  }, [step]);

  function next() {
    if (step >= TOUR_STEPS.length - 1) {
      dismiss();
    } else {
      setStep(step + 1);
    }
  }

  function dismiss() {
    setStep(-1);
    localStorage.setItem(STORAGE_KEY, "true");
  }

  if (step < 0 || step >= TOUR_STEPS.length) return null;

  const current = TOUR_STEPS[step];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[60] bg-black/20" onClick={dismiss} />
      {/* Tooltip */}
      <div
        className="fixed z-[70] w-72 border border-primary bg-background p-4 shadow-lg"
        style={{ top: pos.top, left: pos.left }}
      >
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-sm text-foreground">{current.title}</h3>
          <button
            onClick={dismiss}
            className="text-muted-foreground hover:text-foreground -mr-1 -mt-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{current.content}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {step + 1} of {TOUR_STEPS.length}
          </span>
          <div className="flex gap-2">
            <button
              onClick={dismiss}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Skip
            </button>
            <button
              onClick={next}
              className="bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              {step === TOUR_STEPS.length - 1 ? "Done" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
