import { useState } from 'react';
import { calculateGoals } from '../../utils/battleRoyaleLogic';

export default function Storico({ storico, teams }) {
  const [expandedDay, setExpandedDay] = useState(null);

  if (!storico || storico.length === 0) {
    return (
      <div className="text-center text-[#555] py-12 font-mono uppercase tracking-widest text-xs">
        Nessuno storico disponibile.
      </div>
    );
  }

  const sorted = [...storico].sort((a, b) => b.giornata - a.giornata);

  return (
    <div className="space-y-1">
      {sorted.map((day) => {
        const isExpanded = expandedDay === day.giornata;

        const teamsSorted = [...teams]
          .filter((t) => day.punteggi[t] != null)
          .sort((a, b) => (day.punteggi[b] || 0) - (day.punteggi[a] || 0));

        return (
          <div key={day.giornata} className="border border-[#333]">
            <button
              onClick={() => setExpandedDay(isExpanded ? null : day.giornata)}
              className="w-full flex items-center justify-between p-4 bg-[#0a0a0a] hover:bg-[#111] cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="border border-[#FBBF24] text-[#FBBF24] text-xs font-black px-3 py-1 font-mono">
                  G{day.giornata}
                </span>
                <span className="text-[#555] text-xs font-mono">{teamsSorted.length} squadre</span>
              </div>
              <span className="text-[#444] font-mono text-xs">{isExpanded ? '▲' : '▼'}</span>
            </button>

            {isExpanded && (
              <div className="p-4 bg-black border-t border-[#333]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {teamsSorted.map((team, idx) => {
                    const score = day.punteggi[team];
                    const goals = calculateGoals(score);
                    const ds = day.dayStats[team];

                    return (
                      <div
                        key={team}
                        className="flex items-center justify-between p-2.5 border border-[#222]"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xs text-[#444] w-5 text-right font-mono">{idx + 1}.</span>
                          <span className="text-sm text-white truncate font-bold">{team}</span>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0 ml-2 font-mono">
                          <span className="text-xs text-[#444]">{goals} gol</span>
                          <span className="font-black text-[#FBBF24] text-sm">{score}</span>
                          {ds && (
                            <span className="text-xs border border-[#222] px-1">
                              <span className="text-[#22C55E]">{ds.w}V</span>{' '}
                              <span className="text-[#FBBF24]">{ds.d}P</span>{' '}
                              <span className="text-[#DC2626]">{ds.l}S</span>
                              <span className="text-[#444] ml-1">({ds.pts}pt)</span>
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
