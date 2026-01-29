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
      <div className="text-center text-gray-400 py-12">
        <i className="fas fa-th text-4xl mb-3 opacity-30"></i>
        <p>Nessun dato disponibile.</p>
      </div>
    );
  }

  const punteggi = giornate[selectedDay];

  // Calcola tutti i risultati di una squadra contro le altre
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

  // Ordina le squadre alfabeticamente
  const sortedTeams = [...teams].sort((a, b) => a.localeCompare(b));

  return (
    <div>
      {/* Selettore giornata */}
      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm text-gray-400">Giornata:</label>
        <div className="flex gap-1 flex-wrap">
          {giornateDispo.map((day) => (
            <button
              key={day}
              onClick={() => { setSelectedDay(day); setExpandedTeam(null); }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedDay === day
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
              }`}
            >
              G{day}
            </button>
          ))}
        </div>
      </div>

      {/* Lista squadre con container espandibili */}
      <div className="space-y-2">
        {sortedTeams.map((team) => {
          const isExpanded = expandedTeam === team;
          const score = punteggi[team];
          const goals = calculateGoals(score);
          const teamData = isExpanded ? getTeamResults(team) : null;

          return (
            <div
              key={team}
              className="rounded-xl border border-slate-700/50 overflow-hidden"
            >
              {/* Header squadra */}
              <button
                onClick={() => setExpandedTeam(isExpanded ? null : team)}
                className="w-full flex items-center justify-between p-3 sm:p-4 bg-slate-800/60 hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <i className="fas fa-shield-alt text-blue-400 text-sm flex-shrink-0"></i>
                  <span className="text-sm sm:text-base font-semibold text-gray-200 truncate">
                    {team}
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                  {score != null && (
                    <>
                      <span className="text-xs text-gray-500">
                        {goals} gol
                      </span>
                      <span className="font-mono font-bold text-blue-400 text-sm">
                        {score}
                      </span>
                    </>
                  )}
                  <i
                    className={`fas fa-chevron-down text-gray-400 text-xs transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  ></i>
                </div>
              </button>

              {/* Dettaglio scontri */}
              {isExpanded && teamData && (
                <div className="p-3 sm:p-4 bg-slate-900/40">
                  {/* Riepilogo giornata */}
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-700/40">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-1 rounded-full bg-green-900/30 text-green-400 font-bold">
                        {teamData.w}V
                      </span>
                      <span className="px-2 py-1 rounded-full bg-yellow-900/30 text-yellow-400 font-bold">
                        {teamData.d}P
                      </span>
                      <span className="px-2 py-1 rounded-full bg-red-900/30 text-red-400 font-bold">
                        {teamData.l}S
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-gray-400">
                        GF <span className="text-gray-200 font-bold">{teamData.gf}</span>
                        {' '}-{' '}
                        GS <span className="text-gray-200 font-bold">{teamData.gs}</span>
                      </span>
                      <span className="bg-blue-600/20 text-blue-400 font-bold px-2.5 py-1 rounded-full">
                        {teamData.pts} pt
                      </span>
                    </div>
                  </div>

                  {/* Lista scontri */}
                  <div className="space-y-1.5">
                    {teamData.results.map((match) => {
                      let bgClass, labelClass, icon;
                      if (match.outcome === 'V') {
                        bgClass = 'bg-green-900/20 border-green-500/20';
                        labelClass = 'text-green-400';
                        icon = 'fa-check-circle';
                      } else if (match.outcome === 'S') {
                        bgClass = 'bg-red-900/20 border-red-500/20';
                        labelClass = 'text-red-400';
                        icon = 'fa-times-circle';
                      } else {
                        bgClass = 'bg-yellow-900/15 border-yellow-500/20';
                        labelClass = 'text-yellow-400';
                        icon = 'fa-minus-circle';
                      }

                      return (
                        <div
                          key={match.opponent}
                          className={`flex items-center justify-between p-2.5 rounded-lg border ${bgClass}`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <i className={`fas ${icon} ${labelClass} text-xs flex-shrink-0`}></i>
                            <span className="text-sm text-gray-300 truncate">
                              {match.opponent}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                            <span className="text-xs text-gray-500 font-mono">
                              {match.scoreOpponent}
                            </span>
                            <span className={`font-mono font-bold text-sm ${labelClass}`}>
                              {match.golA}-{match.golB}
                            </span>
                            <span className={`text-xs font-bold w-4 text-center ${labelClass}`}>
                              {match.outcome}
                            </span>
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
      <div className="flex gap-4 mt-4 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <i className="fas fa-check-circle text-green-400"></i> V = Vittoria
        </span>
        <span className="flex items-center gap-1">
          <i className="fas fa-minus-circle text-yellow-400"></i> P = Pareggio
        </span>
        <span className="flex items-center gap-1">
          <i className="fas fa-times-circle text-red-400"></i> S = Sconfitta
        </span>
      </div>
    </div>
  );
}
