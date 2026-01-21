import { Check, Building2, CreditCard, FileCheck, User } from "lucide-react";
export default function Stepper({ step }: { step: number }) {
  const steps = [
    { num: 1, label: "Account & Owner", icon: User },
    { num: 2, label: "Company & Use-Case", icon: Building2 },
    { num: 3, label: "Plan & Agents", icon: CreditCard },
    { num: 4, label: "Review & Create", icon: FileCheck },
  ];

  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((s, i) => (
        <div key={s.num} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                step >= s.num
                  ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {step > s.num ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
            </div>
            <p className={`text-xs mt-2 font-medium ${step >= s.num ? "text-gray-900" : "text-gray-400"}`}>
              {s.label}
            </p>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-1 mx-2 rounded transition-all ${step > s.num ? "bg-gradient-to-r from-emerald-500 to-blue-500" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}