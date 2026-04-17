import { useEffect, useState } from "react";

type SaveStatus = "idle" | "saving" | "saved" | "error";

// Debounced field save hook. Returns [local value, setter, status].
export function useSavedField<T>(
  initial: T,
  save: (value: T) => Promise<void>,
  debounceMs: number = 600
): [T, (v: T) => void, SaveStatus] {
  const [value, setValue] = useState<T>(initial);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setValue(initial);
  }, [initial]);

  useEffect(() => {
    if (!dirty) return;
    setStatus("saving");
    const t = setTimeout(async () => {
      try {
        await save(value);
        setStatus("saved");
        setDirty(false);
        setTimeout(() => setStatus("idle"), 1500);
      } catch (e) {
        console.error(e);
        setStatus("error");
      }
    }, debounceMs);
    return () => clearTimeout(t);
  }, [value, dirty, save, debounceMs]);

  const update = (v: T) => {
    setValue(v);
    setDirty(true);
  };

  return [value, update, status];
}

export function SaveBadge({ status }: { status: SaveStatus }) {
  if (status === "idle") return null;
  const label: Record<SaveStatus, string> = {
    idle: "",
    saving: "Saving…",
    saved: "Saved",
    error: "Error",
  };
  const cls: Record<SaveStatus, string> = {
    idle: "",
    saving: "text-[#1D1F28]/50",
    saved: "text-emerald-600",
    error: "text-red-600",
  };
  return <span className={`text-xs font-inter ${cls[status]}`}>{label[status]}</span>;
}
