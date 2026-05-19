export default function LevelHistoryChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-[250px] text-text-muted text-sm">레벨업 기록이 없습니다.</div>;
  }

  return (
    <div className="h-[250px] w-full overflow-y-auto pr-2">
      <div className="relative border-l-2 border-gray-800 ml-4 py-2 space-y-6">
        {data.map((item, i) => (
          <div key={i} className="relative pl-6">
            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-bg-card border-2 border-accent-blue z-10"></div>
            <div className="text-sm font-semibold text-white mb-1">Lv. {item.level} 달성! 🚀</div>
            <div className="text-xs text-text-muted">{new Date(item.date).toLocaleDateString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
