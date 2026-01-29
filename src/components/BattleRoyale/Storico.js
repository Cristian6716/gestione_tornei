import { useState } from 'react';
import { calculateGoals } from '../../utils/battleRoyaleLogic';

export default function Storico({ storico, teams }) {
  const [expandedDay, setExpandedDay] = useState(null);

  if (!storico || storico.length === 0) {
    return (
      <div className="text-center text-gray-400 py-12">
        <i className="fas fa-history text-4xl mb-3 opacity-30"></i>
        <p>Nessuno storico disponibile.</p>
      </div>
    );
  }

  // Ordina per giornata decrescente (piu recente prima)
  const sorted = [...storico].sort((a, b) => b.giornata - a.giornata);

  return (
    <div className="space-y-3">
      {sorted.map((day) => {
        const isExpanded = expandedDay === day.giornata;

        // Ordina team per punteggio decrescente
        const teamsSorted = [...teams]
          .filter((t) => day.punteggi[t] != null)
          .sort((a, b) => (day.punteggi[b] || 0) - (day.punteggi[a] || 0));

        return (
          <div
            key={day.giornata}
            className="rounded-xl border border-slate-700/50 overflow-hidden"
          >
            {/* Header giornata */}
            <button
              onClick={() =>
                setExpandedDay(isExpanded ? null : day.giornata)
              }
              className="w-full flex items-center justify-between p-4 bg-slate-800/60 hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="bg-blue-600/20 text-blue-400 text-sm font-bold px-3 py-1 rounded-full">
                  G{day.giornata}
                </span>
                <span className="text-gray-300 text-sm">
                  {teamsSorted.length} squadre
                </span>
              </div>
              <i
                className={`fas fa-chevron-down text-gray-400 transition-transform ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              ></i>
            </button>

            {/* Dettagli */}
            {isExpanded && (
              <div className="p-4 bg-slate-900/40">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {teamsSorted.map((team, idx) => {
                    const score = day.punteggi[team];
                    const goals = calculateGoals(score);
                    const ds = day.dayStats[team];

                    return (
                      <div
                        key={team}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/30"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xs text-gray-500 w-5 text-right">
                            {idx + 1}.
                          </span>
                          <i className="fas fa-shield-alt text-blue-400 text-xs flex-shrink-0"></i>
                          <span className="text-sm text-gray-200 truncate">
                            {team}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                          <span className="text-xs text-gray-500">
                            {goals} gol
                          </span>
                          <span className="font-mono font-bold text-blue-400 text-sm">
                            {score}
                          </span>
                          {ds && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700/50">
                              <span className="text-green-400">{ds.w}V</span>{' '}
                              <span className="text-yellow-400">{ds.d}P</span>{' '}
                              <span className="text-red-400">{ds.l}S</span>
                              <span className="text-gray-400 ml-1">
                                ({ds.pts}pt)
                              </span>
                            </span>
                          )}
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
  );
}
