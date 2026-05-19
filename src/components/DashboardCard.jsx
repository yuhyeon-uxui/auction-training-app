export default function DashboardCard({ title, children }) {
  return (
    <div className="card-style flex flex-col justify-center">
      <h3 className="text-xs text-text-muted uppercase tracking-wider mb-4 font-semibold">{title}</h3>
      <div>{children}</div>
    </div>
  );
}
