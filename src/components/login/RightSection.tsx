const RightSection = () => {
  return (
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
  )
}

export default RightSection