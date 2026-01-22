export default function FullscreenLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />

      {/* Loader */}
      <div className="relative h-12 w-12">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-emerald-300/20 blur-lg animate-pulse" />

        {/* Spinning gradient ring */}
        <div className="absolute inset-0 rounded-full border-[3px] border-transparent 
          bg-gradient-to-tr from-emerald-400 to-emerald-600 
          animate-spin
          [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]
          [mask-composite:exclude]"
        />

        {/* Center dot */}
        <div className="absolute inset-2 rounded-full bg-white shadow-md" />
      </div>
    </div>
  );
}
