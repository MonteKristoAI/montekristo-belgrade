import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { theme, healthTier, statusMeta } from "../theme";

// ------------------------------------------------------------------
// Surface: the base card. Glass-y, layered, low contrast borders.
// ------------------------------------------------------------------
export function Surface({
  children,
  className,
  interactive,
  ...rest
}: HTMLMotionProps<"div"> & { interactive?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: theme.motion.base, ease: theme.motion.ease }}
      className={cn(
        "rounded-xl border",
        "bg-[#0B1325] border-white/10",
        "shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_8px_24px_-8px_rgba(0,0,0,0.6)]",
        interactive &&
          "transition-all hover:border-white/20 hover:bg-[#0F1A33] cursor-pointer",
        className
      )}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

// ------------------------------------------------------------------
// Section: semantic card with title + optional description.
// ------------------------------------------------------------------
export function Section({
  title,
  description,
  action,
  children,
  className,
  dense,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  dense?: boolean;
}) {
  return (
    <Surface className={cn(dense ? "p-4" : "p-6", className)}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            {title && (
              <h2 className="font-poppins text-[15px] font-semibold text-[#F5F0E6] tracking-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="font-inter text-xs text-[#9AA5B8] mt-1 leading-relaxed max-w-2xl">
                {description}
              </p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </Surface>
  );
}

// ------------------------------------------------------------------
// StatBlock: big number with label + optional delta.
// ------------------------------------------------------------------
export function StatBlock({
  label,
  value,
  hint,
  accent = true,
  className,
}: {
  label: string;
  value: number | string;
  hint?: string;
  accent?: boolean;
  className?: string;
}) {
  return (
    <Surface className={cn("px-5 py-4", className)}>
      <p className="font-inter text-[10px] uppercase tracking-[0.14em] text-[#5A6577] font-medium">
        {label}
      </p>
      <p
        className={cn(
          "font-poppins text-3xl font-semibold mt-1.5 tracking-tight leading-none",
          accent ? "text-[#FF5C5C]" : "text-[#F5F0E6]"
        )}
      >
        {value}
      </p>
      {hint && <p className="font-inter text-xs text-[#5A6577] mt-2">{hint}</p>}
    </Surface>
  );
}

// ------------------------------------------------------------------
// Pill: small status badge, many flavors.
// ------------------------------------------------------------------
export function Pill({
  children,
  variant = "neutral",
  className,
  icon,
}: {
  children: ReactNode;
  variant?: "neutral" | "accent" | "success" | "warn" | "danger" | "info";
  className?: string;
  icon?: ReactNode;
}) {
  const variants = {
    neutral: "bg-white/5 text-[#9AA5B8] border-white/10",
    accent: "bg-[rgba(255,92,92,0.12)] text-[#FF8A8A] border-[rgba(255,92,92,0.3)]",
    success: "bg-[rgba(63,185,125,0.12)] text-[#70D7A0] border-[rgba(63,185,125,0.3)]",
    warn: "bg-[rgba(232,183,79,0.12)] text-[#F3CC78] border-[rgba(232,183,79,0.3)]",
    danger: "bg-[rgba(255,92,92,0.12)] text-[#FF8A8A] border-[rgba(255,92,92,0.3)]",
    info: "bg-[rgba(79,179,232,0.12)] text-[#7CC9F0] border-[rgba(79,179,232,0.3)]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-inter text-[10px] font-medium uppercase tracking-wider",
        variants[variant],
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}

// ------------------------------------------------------------------
// StatusPill: shortcut for client status.
// ------------------------------------------------------------------
export function StatusPill({ status }: { status: string }) {
  const meta = statusMeta(status);
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-inter text-[10px] font-medium uppercase tracking-wider"
      style={{ color: meta.fg, background: meta.bg, borderColor: meta.fg + "33" }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.fg }} />
      {meta.label}
    </span>
  );
}

// ------------------------------------------------------------------
// HealthRing: circular score indicator 0-100.
// ------------------------------------------------------------------
export function HealthRing({ score, size = 44 }: { score: number; size?: number }) {
  const tier = healthTier(score);
  const strokeWidth = size * 0.09;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={tier.color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: theme.motion.ease }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <span
        className="absolute font-poppins font-semibold text-[11px] tabular-nums"
        style={{ color: tier.color }}
      >
        {score}
      </span>
    </div>
  );
}

// ------------------------------------------------------------------
// Sparkline: tiny trend line.
// ------------------------------------------------------------------
export function Sparkline({
  values,
  width = 80,
  height = 20,
  color = theme.accent.coralBase,
}: {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
}) {
  if (values.length < 2) {
    return <div className="h-5 w-20 flex items-center text-[10px] text-[#5A6577]">—</div>;
  }
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(max - min, 1);
  const step = width / (values.length - 1);
  const points = values
    .map((v, i) => `${i * step},${height - ((v - min) / range) * height}`)
    .join(" ");
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
        opacity={0.9}
      />
    </svg>
  );
}

// ------------------------------------------------------------------
// EmptyState: polished empty screen.
// ------------------------------------------------------------------
export function EmptyState({
  icon,
  title,
  hint,
  action,
}: {
  icon?: ReactNode;
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      {icon && <div className="text-[#5A6577] mb-3">{icon}</div>}
      <p className="font-poppins text-sm font-medium text-[#F5F0E6]">{title}</p>
      {hint && <p className="font-inter text-xs text-[#5A6577] mt-1 max-w-sm">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ------------------------------------------------------------------
// FieldLabel + FieldGroup + dark-theme inputs.
// ------------------------------------------------------------------
export function FieldLabel({ children, hint }: { children: ReactNode; hint?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-1.5">
      <span className="font-inter text-[11px] uppercase tracking-[0.12em] text-[#9AA5B8] font-medium">
        {children}
      </span>
      {hint}
    </div>
  );
}

export const inputCls =
  "w-full rounded-md bg-[#0A1228] border border-white/10 px-3 py-2 text-sm font-inter text-[#F5F0E6] placeholder:text-[#5A6577] focus:outline-none focus:border-[rgba(255,92,92,0.4)] focus:ring-1 focus:ring-[rgba(255,92,92,0.2)] transition-colors";

export const textareaCls = cn(inputCls, "resize-none leading-relaxed");

export const selectCls = cn(inputCls, "appearance-none cursor-pointer");

// ------------------------------------------------------------------
// Skeleton shimmer.
// ------------------------------------------------------------------
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-md bg-white/5 relative overflow-hidden",
        className
      )}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
      />
    </div>
  );
}

// ------------------------------------------------------------------
// Kbd: keyboard shortcut pill.
// ------------------------------------------------------------------
export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex items-center rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-[#9AA5B8]">
      {children}
    </kbd>
  );
}

// ------------------------------------------------------------------
// Divider.
// ------------------------------------------------------------------
export function Divider({ label }: { label?: string }) {
  if (!label) return <div className="h-px bg-white/10 my-4" />;
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-white/10" />
      <span className="font-inter text-[10px] uppercase tracking-[0.14em] text-[#5A6577]">{label}</span>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  );
}
