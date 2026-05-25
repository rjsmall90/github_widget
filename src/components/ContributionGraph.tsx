import type { ContributionWeek } from "../types/github";

interface ContributionGraphProps {
  weeks: ContributionWeek[];
  totalContributions: number;
}

export default function ContributionGraph({
  weeks,
  totalContributions,
}: ContributionGraphProps) {
  return (
    <div className="gw-contrib">
      <p className="gw-contrib__total">
        {totalContributions.toLocaleString()} contributions in the last year
      </p>
      <div className="gw-contrib__grid">
        {weeks.map((week, wi) => (
          <div key={wi} className="gw-contrib__col">
            {week.contributionDays.map((day) => (
              <div
                key={day.date}
                className="gw-contrib__cell"
                style={{ backgroundColor: day.color }}
                title={`${day.date}: ${day.contributionCount} contributions`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
