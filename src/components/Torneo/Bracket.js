import MatchCard from './MatchCard';

export default function Bracket({ matches }) {
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

  return (
    <div className="border-2 border-[#333] bg-black overflow-hidden">
      <div className="overflow-auto bracket-scroll h-[calc(100vh-260px)] w-full p-4">
        <div className="flex gap-4 min-w-max pb-4">
          {sortedDays.map((day) => (
            <div key={day} className="flex flex-col gap-4 w-72">
              <div className="sticky top-0 z-10 bg-black border-b-2 border-[#FBBF24] text-center font-black text-[#FBBF24] text-xs uppercase tracking-widest py-2 font-mono">
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
