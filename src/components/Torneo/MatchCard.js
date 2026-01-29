export default function MatchCard({ match }) {
  // Colori per bracket
  const bracketStyles = {
    upper: {
      border: 'border-emerald-500/50',
      badge: 'bg-emerald-500/20 text-emerald-300',
      icon: 'text-emerald-400',
    },
    mid: {
      border: 'border-amber-500/50',
      badge: 'bg-amber-500/20 text-amber-300',
      icon: 'text-amber-400',
    },
    lower: {
      border: 'border-rose-500/50',
      badge: 'bg-rose-500/20 text-rose-300',
      icon: 'text-rose-400',
    },
    finals: {
      border: 'border-purple-500/50 shadow-purple-500/20 shadow-md',
      badge: 'bg-purple-500/20 text-purple-300',
      icon: 'text-purple-400',
    },
  };

  const style = bracketStyles[match.bracket] || bracketStyles.upper;

  const isEliminatedA =
    match.eliminated === 'A' || match.eliminated === 'both';
  const isEliminatedB =
    match.eliminated === 'B' || match.eliminated === 'both';

  const hasResult = match.scoreA != null && match.scoreB != null;

  return (
    <div
      className={`p-3 rounded-xl border ${style.border} match-card-bg flex flex-col gap-3 min-w-[220px] relative overflow-hidden`}
    >
      {/* Sfondo decorativo */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-10 text-6xl">
        <i className="fas fa-futbol"></i>
      </div>

      {/* Header: ID match + Giornata */}
      <div className="flex justify-between items-center text-xs relative z-10">
        <span className={`px-2.5 py-1 rounded-full font-bold ${style.badge}`}>
          {match.id}
        </span>
        <span className="text-gray-400 font-semibold flex items-center gap-1">
          <i className="far fa-calendar"></i> G{match.day}
        </span>
      </div>

      {/* Label (Semifinale, Finale, ecc.) */}
      {match.label && (
        <div className="text-center text-xs font-bold text-purple-300 uppercase tracking-wider relative z-10">
          {match.label}
        </div>
      )}

      {/* Risultato gol centrale */}
      {hasResult && match.golA != null && (
        <div className="text-center relative z-10">
          <span className="bg-slate-900/80 px-4 py-1 rounded-full text-lg font-black tracking-wider border border-slate-600/50">
            <span className={match.winner === 'A' ? 'text-green-400' : 'text-gray-400'}>{match.golA}</span>
            <span className="text-gray-600 mx-1">-</span>
            <span className={match.winner === 'B' ? 'text-green-400' : 'text-gray-400'}>{match.golB}</span>
          </span>
        </div>
      )}

      {/* Squadre */}
      <div className="flex flex-col gap-2 relative z-10">
        <TeamRow
          teamName={match.teamA}
          score={match.scoreA}
          gol={match.golA}
          isWinner={match.winner === 'A'}
          isEliminated={isEliminatedA}
          iconColor={style.icon}
        />
        <TeamRow
          teamName={match.teamB}
          score={match.scoreB}
          gol={match.golB}
          isWinner={match.winner === 'B'}
          isEliminated={isEliminatedB}
          iconColor={style.icon}
        />
      </div>
    </div>
  );
}

function TeamRow({ teamName, score, gol, isWinner, isEliminated, iconColor }) {
  let statusIcon = null;
  let statusClass = '';

  if (isWinner) {
    statusIcon = (
      <i className="fas fa-check-circle text-green-400 ml-1 text-xs"></i>
    );
    statusClass = 'font-bold text-green-300';
  } else if (isEliminated) {
    statusIcon = (
      <i className="fas fa-times-circle text-red-500 ml-1 text-xs" title="Eliminato"></i>
    );
    statusClass = 'eliminated-team text-red-400';
  } else if (score === null) {
    statusClass = 'text-gray-400';
  }

  return (
    <div
      className={`flex justify-between items-center p-2 rounded-md ${
        isWinner
          ? 'bg-green-900/30'
          : isEliminated
          ? 'bg-red-900/20'
          : ''
      } ${statusClass}`}
    >
      <div className="flex items-center gap-2 truncate min-w-0">
        <i className={`fas fa-shield-alt ${iconColor} flex-shrink-0`}></i>
        <span className="truncate text-sm">{teamName}</span>
        {statusIcon}
      </div>
      <span
        className={`font-mono text-sm flex-shrink-0 ml-2 ${
          score !== null ? 'text-gray-400' : 'text-gray-600'
        }`}
      >
        {score !== null ? score : '-'}
      </span>
    </div>
  );
}
