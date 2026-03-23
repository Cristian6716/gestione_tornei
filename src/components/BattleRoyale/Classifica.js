export default function Classifica({ classifica }) {
  if (!classifica || classifica.length === 0) {
    return (
      <div className="text-center text-[#555] py-12 font-mono uppercase tracking-widest text-xs">
        Nessun dato disponibile.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto grid-scroll">
      <table className="w-full text-sm min-w-[700px] border-collapse">
        <thead>
          <tr className="border-b-2 border-white text-[#555] text-xs uppercase tracking-widest">
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
              className={`border-b border-[#222] ${
                idx === 0 ? 'bg-[#FBBF24]' : idx >= 12 ? 'opacity-40' : ''
              }`}
            >
              <td className="py-3 px-2">
                <span className={`font-black text-sm ${idx === 0 ? 'text-black' : 'text-[#555]'}`}>
                  {team.pos}
                </span>
              </td>
              <td className={`py-3 px-2 font-bold truncate max-w-[160px] ${idx === 0 ? 'text-black' : 'text-white'}`}>
                {team.team}
              </td>
              <td className={`text-center py-3 px-2 font-black text-base ${idx === 0 ? 'text-black' : 'text-[#FBBF24]'}`}>
                {team.pts}
              </td>
              <td className={`text-center py-3 px-2 hidden sm:table-cell ${idx === 0 ? 'text-black' : 'text-[#22C55E]'}`}>
                {team.w}
              </td>
              <td className={`text-center py-3 px-2 hidden sm:table-cell ${idx === 0 ? 'text-black' : 'text-[#888]'}`}>
                {team.d}
              </td>
              <td className={`text-center py-3 px-2 hidden sm:table-cell ${idx === 0 ? 'text-black' : 'text-[#DC2626]'}`}>
                {team.l}
              </td>
              <td className={`text-center py-3 px-2 ${idx === 0 ? 'text-black' : 'text-[#ccc]'}`}>{team.gf}</td>
              <td className={`text-center py-3 px-2 ${idx === 0 ? 'text-black' : 'text-[#ccc]'}`}>{team.gs}</td>
              <td className="text-center py-3 px-2 font-bold">
                <span className={idx === 0 ? 'text-black' : team.dr > 0 ? 'text-[#22C55E]' : team.dr < 0 ? 'text-[#DC2626]' : 'text-[#555]'}>
                  {team.dr > 0 ? `+${team.dr}` : team.dr}
                </span>
              </td>
              <td className={`text-center py-3 px-2 font-mono text-xs ${idx === 0 ? 'text-black' : 'text-[#888]'}`}>
                {team.fantaTotal.toFixed(1)}
              </td>
              <td className="text-center py-3 px-2">
                <span className={`text-xs font-black px-2 py-0.5 border ${
                  idx === 0
                    ? 'text-black border-black'
                    : team.lastDelta > 0
                    ? 'text-[#22C55E] border-[#22C55E]'
                    : 'text-[#444] border-[#333]'
                }`}>
                  {team.lastDelta > 0 ? `+${team.lastDelta}` : team.lastDelta || '–'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
