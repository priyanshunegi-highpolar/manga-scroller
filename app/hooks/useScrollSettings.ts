import { useState, useEffect } from "react";

export interface ScrollSettings {
  speed: number;
  mode: "auto" | "manual";
  manualScrollAmount: number;
}

const DEFAULT_SETTINGS: ScrollSettings = {
  speed: 50,
  mode: "auto",
  manualScrollAmount: 200,
};

export const useScrollSettings = () => {
  const [settings, setSettings] = useState<ScrollSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const saved = localStorage.getItem("scrollSettings");
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch {
        setSettings(DEFAULT_SETTINGS);
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<ScrollSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem("scrollSettings", JSON.stringify(updated));
      return updated;
    });
  };

  return { settings, updateSettings };
};
