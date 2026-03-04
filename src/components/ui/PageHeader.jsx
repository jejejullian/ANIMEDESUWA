export default function PageHeader({ title, subtitle, emoji }) {
  return (
    <div className="mb-6 md:mb-8">
      <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 tracking-widest uppercase">
        {emoji && <span className="mr-2">{emoji}</span>}
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm md:text-base text-foreground-muted">
          {subtitle}
        </p>
      )}
    </div>
  );
}