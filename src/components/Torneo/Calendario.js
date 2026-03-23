import MatchCard from './MatchCard';

export default function Calendario({ matches }) {
  if (!matches || matches.length === 0) {
    return (
      <div className="text-center text-[#555] py-12 font-mono uppercase tracking-widest text-xs">
        Nessun dato del torneo disponibile.
      </div>
    );
  }

  const matchesByDay = matches.reduce((acc, match) => {
    if (!acc[match.day]) acc[match.day] = [];
    acc[match.day].push(match);
    return acc;
  }, {});

  const sortedDays = Object.keys(matchesByDay).sort(
    (a, b) => Number(a) - Number(b)
  );

  const pauseDays = [35, 37];

  return (
    <div className="space-y-8 pb-10">
      {sortedDays.map((day) => (
        <div key={day}>
          <div className="flex items-center gap-3 mb-4">
            <span className="border-2 border-white text-white text-xs font-black px-4 py-1.5 font-mono uppercase tracking-widest">
              Giornata {day}
            </span>
            {pauseDays.includes(Number(day)) && (
              <span className="text-xs text-[#444] font-mono uppercase">Pausa</span>
            )}
            {Number(day) === 34 && (
              <span className="text-xs text-[#FBBF24] font-black font-mono uppercase tracking-widest">Quarti</span>
            )}
            {Number(day) === 36 && (
              <span className="text-xs text-[#FBBF24] font-black font-mono uppercase tracking-widest">Semifinale</span>
            )}
            {Number(day) === 38 && (
              <span className="text-xs text-[#FBBF24] font-black font-mono uppercase tracking-widest border border-[#FBBF24] px-2 py-0.5">FINALE</span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {matchesByDay[day].map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
