export default function Background() {
  return (
    <>
      {/* Professional financial gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-gray-950 animate-[subtlePulse_20s_ease-in-out_infinite]" />

      {/* Financial-themed accent overlays with professional colors */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(34,197,94,0.08),transparent_65%),radial-gradient(circle_at_85%_20%,rgba(59,130,246,0.12),transparent_60%),radial-gradient(circle_at_45%_75%,rgba(16,185,129,0.10),transparent_65%),radial-gradient(circle_at_80%_85%,rgba(99,102,241,0.08),transparent_60%),radial-gradient(circle_at_20%_80%,rgba(34,197,94,0.06),transparent_70%)] animate-[financialDrift_45s_linear_infinite]" />

      {/* Subtle geometric pattern overlay for financial sophistication */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(90deg,transparent_49%,rgba(255,255,255,0.5)_50%,transparent_51%),linear-gradient(0deg,transparent_49%,rgba(255,255,255,0.5)_50%,transparent_51%)] bg-[length:60px_60px] animate-[gridShift_35s_linear_infinite]" />

      {/* Additional depth layer with financial accent colors */}
      <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(34,197,94,0.04)_60deg,transparent_120deg,rgba(59,130,246,0.04)_180deg,transparent_240deg,rgba(16,185,129,0.04)_300deg,transparent_360deg)] animate-[financialRotate_60s_linear_infinite]" />
    </>
  );
}
