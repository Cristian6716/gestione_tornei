/**
 * Calcolo gol da punteggio fanta
 * Fasce ogni 6 punti: <66 = 0, 66-71.99 = 1, 72-77.99 = 2, 78-83.99 = 3, ...
 */
export function calculateGoals(score) {
  if (score < 66) return 0;
  return Math.floor((score - 66) / 6) + 1;
}

/**
 * Calcolo risultato scontro diretto tra due squadre
 *
 * Stessa fascia:
 *   diff < 3  → Pareggio (es. 68 vs 66 = 1-1)
 *   diff >= 3 → Vittoria del punteggio piu alto (es. 69 vs 66 = 1-0)
 *
 * Fasce diverse:
 *   diff < 2  → Pareggio alla fascia superiore (es. 72.5 vs 71 = 2-2)
 *   diff >= 2 → Vittoria fascia superiore (es. 73 vs 71 = 2-1)
 */
export function calculateMatchResult(scoreA, scoreB) {
  const bandA = calculateGoals(scoreA);
  const bandB = calculateGoals(scoreB);
  const diff = Math.abs(scoreA - scoreB);

  let golA, golB;

  if (bandA === bandB) {
    // Stessa fascia
    if (diff < 3) {
      golA = bandA;
      golB = bandB;
    } else {
      // Chi ha il punteggio piu alto vince
      if (scoreA > scoreB) {
        golA = Math.max(1, bandA);
        golB = Math.max(0, bandA - 1);
      } else {
        golA = Math.max(0, bandB - 1);
        golB = Math.max(1, bandB);
      }
    }
  } else {
    // Fasce diverse
    if (diff < 2) {
      // Pareggio alla fascia superiore
      const maxBand = Math.max(bandA, bandB);
      golA = maxBand;
      golB = maxBand;
    } else {
      // Ognuno prende i gol della propria fascia
      golA = bandA;
      golB = bandB;
    }
  }

  // Determina risultato
  let result;
  if (golA > golB) result = 'A';
  else if (golB > golA) result = 'B';
  else result = 'D'; // Pareggio

  // Punti classifica
  const ptsA = result === 'A' ? 3 : result === 'D' ? 1 : 0;
  const ptsB = result === 'B' ? 3 : result === 'D' ? 1 : 0;

  return { golA, golB, result, ptsA, ptsB };
}

/**
 * Processa una singola giornata: calcola tutti i 120 scontri (16 squadre = 16*15/2)
 */
export function processGiornata(punteggi, teams) {
  const results = [];

  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      const teamA = teams[i];
      const teamB = teams[j];
      const scoreA = punteggi[teamA];
      const scoreB = punteggi[teamB];

      if (scoreA == null || scoreB == null) continue;

      const match = calculateMatchResult(scoreA, scoreB);
      results.push({
        teamA,
        teamB,
        scoreA,
        scoreB,
        ...match,
      });
    }
  }

  return results;
}

/**
 * Calcola classifica completa da tutte le giornate inserite
 */
export function calculateStandings(giornate, teams) {
  // Inizializza stats per ogni squadra
  const stats = {};
  teams.forEach((team) => {
    stats[team] = {
      team,
      pts: 0,
      w: 0,
      d: 0,
      l: 0,
      gf: 0,
      gs: 0,
      fantaTotal: 0,
      lastDelta: 0,
    };
  });

  const storico = [];
  const scontriPerGiornata = {};

  // Ordina giornate per numero
  const sortedGiornate = Object.entries(giornate).sort(
    ([a], [b]) => Number(a) - Number(b)
  );

  for (const [numGiornata, punteggi] of sortedGiornate) {
    const results = processGiornata(punteggi, teams);
    scontriPerGiornata[numGiornata] = results;

    // Stats per giornata
    const dayStats = {};
    teams.forEach((team) => {
      dayStats[team] = { w: 0, d: 0, l: 0, gf: 0, gs: 0, pts: 0 };
      stats[team].fantaTotal += punteggi[team] || 0;
    });

    for (const match of results) {
      // Stats squadra A
      dayStats[match.teamA].gf += match.golA;
      dayStats[match.teamA].gs += match.golB;
      dayStats[match.teamA].pts += match.ptsA;
      if (match.result === 'A') dayStats[match.teamA].w++;
      else if (match.result === 'D') dayStats[match.teamA].d++;
      else dayStats[match.teamA].l++;

      // Stats squadra B
      dayStats[match.teamB].gf += match.golB;
      dayStats[match.teamB].gs += match.golA;
      dayStats[match.teamB].pts += match.ptsB;
      if (match.result === 'B') dayStats[match.teamB].w++;
      else if (match.result === 'D') dayStats[match.teamB].d++;
      else dayStats[match.teamB].l++;
    }

    // Accumula nelle stats totali
    teams.forEach((team) => {
      stats[team].w += dayStats[team].w;
      stats[team].d += dayStats[team].d;
      stats[team].l += dayStats[team].l;
      stats[team].gf += dayStats[team].gf;
      stats[team].gs += dayStats[team].gs;
      stats[team].pts += dayStats[team].pts;
    });

    storico.push({
      giornata: Number(numGiornata),
      punteggi: { ...punteggi },
      dayStats: { ...dayStats },
    });
  }

  // Calcola delta ultima giornata
  if (storico.length > 0) {
    const lastDay = storico[storico.length - 1];
    teams.forEach((team) => {
      stats[team].lastDelta = lastDay.dayStats[team]?.pts || 0;
    });
  }

  // Ordina classifica: punti > diff reti > gol fatti > fanta totale
  const classifica = Object.values(stats).sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    const drA = a.gf - a.gs;
    const drB = b.gf - b.gs;
    if (drB !== drA) return drB - drA;
    if (b.gf !== a.gf) return b.gf - a.gf;
    return b.fantaTotal - a.fantaTotal;
  });

  classifica.forEach((team, idx) => {
    team.pos = idx + 1;
    team.dr = team.gf - team.gs;
  });

  return { classifica, storico, scontriPerGiornata };
}
