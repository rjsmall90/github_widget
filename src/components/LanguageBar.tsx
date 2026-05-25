import type { LanguageStat } from "../types/github";

interface LanguageBarProps {
  languages: LanguageStat[];
}

export default function LanguageBar({ languages }: LanguageBarProps) {
  const total = languages.reduce((sum, l) => sum + l.size, 0);

  return (
    <div className="gw-language-bar">
      <div className="gw-language-bar__track">
        {languages.map((lang) => (
          <div
            key={lang.name}
            className="gw-language-bar__segment"
            style={{
              width: `${(lang.size / total) * 100}%`,
              backgroundColor: lang.color ?? "#ccc",
            }}
            title={`${lang.name}: ${((lang.size / total) * 100).toFixed(1)}%`}
          />
        ))}
      </div>
      <ul className="gw-language-bar__legend">
        {languages.map((lang) => (
          <li key={lang.name} className="gw-language-bar__legend-item">
            <span
              className="gw-language-bar__dot"
              style={{ backgroundColor: lang.color ?? "#ccc" }}
            />
            <span className="gw-language-bar__name">{lang.name}</span>
            <span className="gw-language-bar__pct">
              {((lang.size / total) * 100).toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
