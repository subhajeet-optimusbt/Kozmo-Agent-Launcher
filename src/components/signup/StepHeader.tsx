export default function StepHeader() {
  return (
    <div className="mb-6 flex gap-4 items-start">
      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white font-bold shadow">
        K
      </div>

      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">
          Create Kozmo Account
        </h1>
        <p className="text-sm text-gray-600 max-w-xl">
          Set up a new tenant, choose your first business area, and launch with the right agents.
        </p>
      </div>
    </div>
  );
}
