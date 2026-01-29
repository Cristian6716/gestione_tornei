import MatchCard from './MatchCard';

export default function Bracket({ matches }) {
  if (!matches || matches.length === 0) {
    return (
      <div className="text-center text-gray-400 py-12">
        <i className="fas fa-sitemap text-4xl mb-3 opacity-30"></i>
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

  return (
    <div className="relative border border-slate-700/50 rounded-xl bg-slate-900/30 shadow-inner overflow-hidden">
      {/* Indicatore scroll */}
      <div className="absolute top-2 right-4 text-xs text-blue-400/50 pointer-events-none animate-pulse z-20 hidden md:block">
        <i className="fas fa-arrows-alt-h mr-1"></i> Scorri il tabellone
      </div>

      <div className="overflow-auto bracket-scroll h-[calc(100vh-260px)] w-full p-4">
        <div className="flex gap-6 min-w-max pb-4">
          {sortedDays.map((day) => (
            <div key={day} className="flex flex-col gap-4 w-72">
              <div className="sticky top-0 z-10 bg-slate-800/90 backdrop-blur text-center font-bold text-gray-300 text-sm mb-2 border-b border-blue-500/30 py-2 rounded shadow-lg flex items-center justify-center gap-2">
                <i className="far fa-calendar text-blue-400"></i>
                G{day}
              </div>
              {matchesByDay[day].map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
