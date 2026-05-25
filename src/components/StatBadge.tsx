interface StatBadgeProps {
  label: string;
  value: string | number;
}

export default function StatBadge({ label, value }: StatBadgeProps) {
  return (
    <span className="gw-stat-badge">
      <span className="gw-stat-badge__value">{value}</span>
      <span className="gw-stat-badge__label">{label}</span>
    </span>
  );
}
