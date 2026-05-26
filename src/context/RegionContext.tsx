"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Region = "IN" | "AE";

const RegionContext = createContext<{
  region: Region;
  setRegion: (r: Region) => void;
}>({ region: "AE", setRegion: () => {} });

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [region, setRegionState] = useState<Region>("AE");

  useEffect(() => {
    const saved = localStorage.getItem("pl_region") as Region | null;
    if (saved === "IN" || saved === "AE") {
      setRegionState(saved);
      return;
    }
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz === "Asia/Kolkata") setRegionState("IN");
    else if (tz === "Asia/Dubai") setRegionState("AE");
  }, []);

  const setRegion = (r: Region) => {
    setRegionState(r);
    localStorage.setItem("pl_region", r);
  };

  return (
    <RegionContext.Provider value={{ region, setRegion }}>
      {children}
    </RegionContext.Provider>
  );
}

export const useRegion = () => useContext(RegionContext);
