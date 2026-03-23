import { useState } from 'react';
import { calculateMatchResult, calculateGoals } from '../../utils/battleRoyaleLogic';

export default function GrigliaScontri({ giornate, teams }) {
  const giornateDispo = Object.keys(giornate || {}).sort(
    (a, b) => Number(a) - Number(b)
  );
  const [selectedDay, setSelectedDay] = useState(
    giornateDispo[giornateDispo.length - 1] || null
  );
  const [expandedTeam, setExpandedTeam] = useState(null);

  if (!selectedDay || giornateDispo.length === 0) {
    return (
      <div className="text-center text-[#555] py-12 font-mono uppercase tracking-widest text-xs">
        Nessun dato disponibile.
      </div>
    );
  }

  const punteggi = giornate[selectedDay];

  function getTeamResults(team) {
    const results = [];
    let w = 0, d = 0, l = 0, gf = 0, gs = 0, pts = 0;

    for (const opponent of teams) {
      if (opponent === team) continue;
      const scoreA = punteggi[team];
      const scoreB = punteggi[opponent];
      if (scoreA == null || scoreB == null) continue;

      const match = calculateMatchResult(scoreA, scoreB);
      let outcome;
      if (match.result === 'A') { outcome = 'V'; w++; pts += 3; }
      else if (match.result === 'D') { outcome = 'P'; d++; pts += 1; }
      else { outcome = 'S'; l++; }

      gf += match.golA;
      gs += match.golB;

      results.push({
        opponent,
        scoreOpponent: scoreB,
        golA: match.golA,
        golB: match.golB,
        outcome,
      });
    }

    return { results, w, d, l, gf, gs, pts };
  }

  const sortedTeams = [...teams].sort((a, b) => a.localeCompare(b));

  return (
    <div>
      {/* Selettore giornata */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs text-[#555] font-mono uppercase tracking-widest">Giornata:</span>
        <div className="flex gap-1 flex-wrap">
          {giornateDispo.map((day) => (
            <button
              key={day}
              onClick={() => { setSelectedDay(day); setExpandedTeam(null); }}
              className={`px-3 py-1 text-xs font-black border cursor-pointer ${
                selectedDay === day
                  ? 'bg-[#FBBF24] text-black border-[#FBBF24]'
                  : 'bg-black text-[#555] border-[#333] hover:border-white hover:text-white'
              }`}
            >
              G{day}
            </button>
          ))}
        </div>
      </div>

      {/* Lista squadre */}
      <div className="space-y-1">
        {sortedTeams.map((team) => {
          const isExpanded = expandedTeam === team;
          const score = punteggi[team];
          const goals = calculateGoals(score);
          const teamData = isExpanded ? getTeamResults(team) : null;

          return (
            <div key={team} className="border border-[#333]">
              <button
                onClick={() => setExpandedTeam(isExpanded ? null : team)}
                className="w-full flex items-center justify-between p-3 bg-[#0a0a0a] hover:bg-[#111] cursor-pointer"
              >
                <span className="text-sm font-bold text-white uppercase tracking-wide truncate">
                  {team}
                </span>
                <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                  {score != null && (
                    <>
                      <span className="text-xs text-[#444] font-mono">{goals} gol</span>
                      <span className="font-mono font-black text-[#FBBF24] text-sm">{score}</span>
                    </>
                  )}
                  <span className="text-[#444] text-xs font-mono">{isExpanded ? '▲' : '▼'}</span>
                </div>
              </button>

              {isExpanded && teamData && (
                <div className="p-3 bg-black border-t border-[#333]">
                  {/* Riepilogo */}
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#222]">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="px-2 py-1 border border-[#22C55E] text-[#22C55E] font-black">{teamData.w}V</span>
                      <span className="px-2 py-1 border border-[#FBBF24] text-[#FBBF24] font-black">{teamData.d}P</span>
                      <span className="px-2 py-1 border border-[#DC2626] text-[#DC2626] font-black">{teamData.l}S</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="text-[#555]">
                        GF <span className="text-white font-black">{teamData.gf}</span>
                        {' – '}
                        GS <span className="text-white font-black">{teamData.gs}</span>
                      </span>
                      <span className="border border-[#FBBF24] text-[#FBBF24] font-black px-2 py-1">
                        {teamData.pts} pt
                      </span>
                    </div>
                  </div>

                  {/* Scontri */}
                  <div className="space-y-1">
                    {teamData.results.map((match) => {
                      const color = match.outcome === 'V' ? '#22C55E' : match.outcome === 'S' ? '#DC2626' : '#FBBF24';
                      return (
                        <div
                          key={match.opponent}
                          className="flex items-center justify-between p-2 border border-[#222]"
                        >
                          <span className="text-sm text-white truncate">{match.opponent}</span>
                          <div className="flex items-center gap-3 flex-shrink-0 ml-2 font-mono">
                            <span className="text-xs text-[#444]">{match.scoreOpponent}</span>
                            <span className="font-black text-sm" style={{ color }}>{match.golA}–{match.golB}</span>
                            <span className="text-xs font-black w-4 text-center" style={{ color }}>{match.outcome}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legenda */}
      <div className="flex gap-4 mt-4 text-xs font-mono uppercase">
        <span className="text-[#22C55E]">V = Vittoria</span>
        <span className="text-[#FBBF24]">P = Pareggio</span>
        <span className="text-[#DC2626]">S = Sconfitta</span>
      </div>
    </div>
  );
}
