export default function Select({ label, value, onChange, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-foreground-muted font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-surface-2 border border-outline text-foreground rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 transition-shadow"
      >
        {children}
      </select>
    </div>
  );
}