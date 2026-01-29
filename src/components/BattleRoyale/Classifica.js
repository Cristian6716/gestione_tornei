export default function Classifica({ classifica }) {
  if (!classifica || classifica.length === 0) {
    return (
      <div className="text-center text-gray-400 py-12">
        <i className="fas fa-chart-bar text-4xl mb-3 opacity-30"></i>
        <p>Nessun dato disponibile. Inserisci i punteggi dalla pagina admin.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto grid-scroll">
      <table className="w-full text-sm min-w-[700px]">
        <thead>
          <tr className="border-b border-slate-700 text-gray-400 text-xs uppercase tracking-wider">
            <th className="text-left py-3 px-2">#</th>
            <th className="text-left py-3 px-2">Squadra</th>
            <th className="text-center py-3 px-2">Pt</th>
            <th className="text-center py-3 px-2 hidden sm:table-cell">V</th>
            <th className="text-center py-3 px-2 hidden sm:table-cell">P</th>
            <th className="text-center py-3 px-2 hidden sm:table-cell">S</th>
            <th className="text-center py-3 px-2">GF</th>
            <th className="text-center py-3 px-2">GS</th>
            <th className="text-center py-3 px-2">DR</th>
            <th className="text-center py-3 px-2">Fanta</th>
            <th className="text-center py-3 px-2">+/-</th>
          </tr>
        </thead>
        <tbody>
          {classifica.map((team, idx) => (
            <tr
              key={team.team}
              className={`border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors ${
                idx < 4 ? 'bg-emerald-900/10' : ''
              } ${idx >= 12 ? 'bg-red-900/5' : ''}`}
            >
              <td className="py-3 px-2">
                <span
                  className={`font-bold text-sm ${
                    idx === 0
                      ? 'text-yellow-400'
                      : idx < 4
                      ? 'text-emerald-400'
                      : 'text-gray-400'
                  }`}
                >
                  {team.pos}
                </span>
              </td>
              <td className="py-3 px-2 font-semibold text-white truncate max-w-[160px]">
                <div className="flex items-center gap-2">
                  <i className="fas fa-shield-alt text-blue-400 text-xs"></i>
                  {team.team}
                </div>
              </td>
              <td className="text-center py-3 px-2 font-bold text-yellow-400 text-base">
                {team.pts}
              </td>
              <td className="text-center py-3 px-2 text-green-400 hidden sm:table-cell">
                {team.w}
              </td>
              <td className="text-center py-3 px-2 text-gray-400 hidden sm:table-cell">
                {team.d}
              </td>
              <td className="text-center py-3 px-2 text-red-400 hidden sm:table-cell">
                {team.l}
              </td>
              <td className="text-center py-3 px-2 text-gray-300">{team.gf}</td>
              <td className="text-center py-3 px-2 text-gray-300">{team.gs}</td>
              <td className="text-center py-3 px-2 font-medium">
                <span
                  className={
                    team.dr > 0
                      ? 'text-green-400'
                      : team.dr < 0
                      ? 'text-red-400'
                      : 'text-gray-400'
                  }
                >
                  {team.dr > 0 ? `+${team.dr}` : team.dr}
                </span>
              </td>
              <td className="text-center py-3 px-2 text-blue-400 font-mono text-xs">
                {team.fantaTotal.toFixed(1)}
              </td>
              <td className="text-center py-3 px-2">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    team.lastDelta > 20
                      ? 'bg-green-500/20 text-green-400'
                      : team.lastDelta > 0
                      ? 'bg-green-500/10 text-green-300'
                      : 'text-gray-500'
                  }`}
                >
                  {team.lastDelta > 0 ? `+${team.lastDelta}` : team.lastDelta || '-'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
