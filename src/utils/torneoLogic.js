import { calculateMatchResult } from './battleRoyaleLogic';

/**
 * Risolvi il torneo bracket in base ai punteggi delle giornate.
 * Usa lo stesso sistema di gol/fasce della Battle Royale.
 * In caso di pareggio nei gol, serve una scelta manuale (override).
 * Se non c'è override per un pareggio, il match resta irrisolto.
 *
 * @param {Array} initialMatches - Array dei match del torneo
 * @param {Object} giornate - Punteggi per giornata
 * @param {Object} overrides - Vincitori manuali { matchId: 'A' | 'B' }
 */
export function resolveTournament(initialMatches, giornate, overrides = {}) {
  // Deep copy
  const matches = JSON.parse(JSON.stringify(initialMatches));

  // Ordina per giornata
  matches.sort((a, b) => a.day - b.day);

  for (const match of matches) {
    const dayScores = giornate[String(match.day)];
    if (!dayScores) continue;

    // Controlla che entrambe le squadre siano risolte (non placeholder)
    const isPlaceholderA =
      match.teamA.startsWith('Vinc.') || match.teamA.startsWith('Perd.');
    const isPlaceholderB =
      match.teamB.startsWith('Vinc.') || match.teamB.startsWith('Perd.');

    if (isPlaceholderA || isPlaceholderB) continue;

    // Prendi i punteggi
    const scoreA = dayScores[match.teamA];
    const scoreB = dayScores[match.teamB];

    if (scoreA == null || scoreB == null) continue;

    match.scoreA = scoreA;
    match.scoreB = scoreB;

    // Calcola gol con lo stesso sistema della Battle Royale
    const result = calculateMatchResult(scoreA, scoreB);
    match.golA = result.golA;
    match.golB = result.golB;

    // Determina vincitore
    if (result.golA > result.golB) {
      match.winner = 'A';
    } else if (result.golB > result.golA) {
      match.winner = 'B';
    } else if (scoreA !== scoreB) {
      // Stessi gol ma punteggio fanta diverso: vince chi ha piu punti
      match.winner = scoreA > scoreB ? 'A' : 'B';
    } else {
      // Punteggio fanta identico (es. 71-71): serve override manuale
      match.draw = true;
      if (overrides[match.id]) {
        match.winner = overrides[match.id];
      } else {
        // Nessun override: il match resta irrisolto, non propagare
        continue;
      }
    }

    // Segna eliminato se match ad eliminazione
    if (match.eliminationMatch) {
      match.eliminated = match.winner === 'A' ? 'B' : 'A';
    }

    // Propaga vincitore e perdente ai match successivi
    const winnerTeam = match.winner === 'A' ? match.teamA : match.teamB;
    const loserTeam = match.winner === 'A' ? match.teamB : match.teamA;

    for (const m of matches) {
      if (m.teamA === `Vinc. ${match.id}`) m.teamA = winnerTeam;
      if (m.teamB === `Vinc. ${match.id}`) m.teamB = winnerTeam;
      if (m.teamA === `Perd. ${match.id}`) m.teamA = loserTeam;
      if (m.teamB === `Perd. ${match.id}`) m.teamB = loserTeam;
    }
  }

  return matches;
}
