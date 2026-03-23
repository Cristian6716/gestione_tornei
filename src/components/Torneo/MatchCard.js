export default function MatchCard({ match }) {
  const bracketStyles = {
    upper: {
      border: 'border-2 border-[#14532d]',
      badge: 'bg-[#0a2016] text-[#4ade80]/50 border border-[#14532d]',
      labelColor: 'text-[#4ade80]/50',
    },
    mid: {
      border: 'border-2 border-[#78570a]',
      badge: 'bg-[#2a1c03] text-[#fbbf24]/60 border border-[#78570a]',
      labelColor: 'text-[#fbbf24]/60',
    },
    lower_elim: {
      border: 'border-2 border-[#7f1d1d]',
      badge: 'bg-[#3a0a0a] text-[#f87171]/60 border border-[#7f1d1d]',
      labelColor: 'text-[#f87171]/60',
    },
    lower_survival: {
      border: 'border-2 border-[#3b1764]',
      badge: 'bg-[#1a0a2e] text-[#c084fc]/50 border border-[#3b1764]',
      labelColor: 'text-[#c084fc]/50',
    },
    finals: {
      border: 'border-4 border-[#FBBF24]',
      badge: 'bg-[#FBBF24] text-black border border-[#FBBF24]',
      labelColor: 'text-[#FBBF24]',
    },
  };

  const style =
    match.bracket === 'lower'
      ? (match.eliminationMatch ? bracketStyles.lower_elim : bracketStyles.lower_survival)
      : (bracketStyles[match.bracket] || bracketStyles.upper);

  const isEliminatedA = match.eliminated === 'A' || match.eliminated === 'both';
  const isEliminatedB = match.eliminated === 'B' || match.eliminated === 'both';
  const isLoserA = match.winner != null && match.winner !== 'A' && !isEliminatedA;
  const isLoserB = match.winner != null && match.winner !== 'B' && !isEliminatedB;

  const hasResult = match.scoreA != null && match.scoreB != null;

  return (
    <div className={`p-3 ${style.border} match-card-bg flex flex-col gap-3 min-w-[220px]`}>
      {/* Header: ID + Giornata */}
      <div className="flex justify-between items-center text-xs">
        <span className={`px-2 py-0.5 font-black font-mono ${style.badge}`}>
          {match.id}
        </span>
        <span className="text-[#555] font-mono">G{match.day}</span>
      </div>

      {/* Label */}
      {match.label && (
        <div className={`text-center text-xs font-black uppercase tracking-widest ${style.labelColor}`}>
          {match.label}
        </div>
      )}

      {/* Score */}
      {hasResult && match.golA != null && (
        <div className="text-center">
          <span className="font-black text-lg tracking-widest font-mono">
            <span className={match.winner === 'A' ? 'text-[#FBBF24]' : 'text-[#444]'}>{match.golA}</span>
            <span className="text-[#333] mx-2">–</span>
            <span className={match.winner === 'B' ? 'text-[#FBBF24]' : 'text-[#444]'}>{match.golB}</span>
          </span>
        </div>
      )}

      {/* Squadre */}
      <div className="flex flex-col gap-1">
        <TeamRow
          teamName={match.teamA}
          score={match.scoreA}
          isWinner={match.winner === 'A'}
          isEliminated={isEliminatedA}
          isLoser={isLoserA}
        />
        <TeamRow
          teamName={match.teamB}
          score={match.scoreB}
          isWinner={match.winner === 'B'}
          isEliminated={isEliminatedB}
          isLoser={isLoserB}
        />
      </div>
    </div>
  );
}

function TeamRow({ teamName, score, isWinner, isEliminated, isLoser }) {
  let rowBg = 'border-[#222] bg-black';
  let nameClass = 'text-sm font-bold truncate ';
  let scoreClass = 'font-mono text-sm flex-shrink-0 ml-2 ';

  if (isWinner) {
    rowBg = 'bg-[#FBBF24] border-[#FBBF24]';
    nameClass += 'text-black';
    scoreClass += 'text-black';
  } else if (isEliminated) {
    rowBg = 'border-[#DC2626]/30 bg-black';
    nameClass += 'eliminated-team text-[#DC2626]';
    scoreClass += 'text-[#DC2626]';
  } else if (isLoser) {
    nameClass += 'text-[#444]';
    scoreClass += 'text-[#444]';
  } else {
    nameClass += score != null ? 'text-white' : 'text-[#555]';
    scoreClass += score != null ? 'text-[#888]' : 'text-[#444]';
  }

  return (
    <div className={`p-2 flex justify-between items-center border ${rowBg}`}>
      <span className={nameClass}>{teamName}</span>
      <span className={scoreClass}>{score != null ? score : '–'}</span>
    </div>
  );
}
