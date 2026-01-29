import MatchCard from './MatchCard';

export default function Calendario({ matches }) {
  if (!matches || matches.length === 0) {
    return (
      <div className="text-center text-gray-400 py-12">
        <i className="fas fa-calendar-alt text-4xl mb-3 opacity-30"></i>
        <p>Nessun dato del torneo disponibile.</p>
      </div>
    );
  }

  // Raggruppa per giornata
  const matchesByDay = matches.reduce((acc, match) => {
    if (!acc[match.day]) acc[match.day] = [];
    acc[match.day].push(match);
    return acc;
  }, {});

  const sortedDays = Object.keys(matchesByDay).sort(
    (a, b) => Number(a) - Number(b)
  );

  // Giornate "pausa" (senza match)
  const pauseDays = [33, 35, 37];

  return (
    <div className="space-y-8 pb-10">
      {sortedDays.map((day) => (
        <div key={day}>
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-slate-800 text-blue-400 text-sm font-bold px-4 py-1.5 rounded-full border border-slate-700 flex items-center gap-2">
              <i className="far fa-clock"></i>
              Giornata {day}
            </span>
            {pauseDays.includes(Number(day)) && (
              <span className="text-xs text-gray-500 italic flex items-center gap-1">
                <i className="fas fa-pause-circle"></i> Pausa
              </span>
            )}
            {Number(day) === 34 && (
              <span className="text-xs text-purple-400 font-bold">QUARTI</span>
            )}
            {Number(day) === 36 && (
              <span className="text-xs text-purple-400 font-bold">SEMIFINALE</span>
            )}
            {Number(day) === 38 && (
              <span className="text-xs text-purple-400 font-bold">FINALE</span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matchesByDay[day].map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
