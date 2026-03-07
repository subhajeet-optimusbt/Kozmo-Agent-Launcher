/**
 * FILE: src/hooks/useGuide.ts
 *
 * Thin hook — same API as your existing useGuide.ts.
 * No change needed here unless you want per-page open tracking.
 */

import { useState, useCallback } from "react";

interface UseGuideReturn {
  guideOpen: boolean;
  openGuide: () => void;
  closeGuide: () => void;
}

export const useGuide = (): UseGuideReturn => {
  const [guideOpen, setGuideOpen] = useState(false);

  const openGuide  = useCallback(() => setGuideOpen(true),  []);
  const closeGuide = useCallback(() => setGuideOpen(false), []);

  return { guideOpen, openGuide, closeGuide };
};