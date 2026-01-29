import { getData } from '../../utils/storage';
import { teams } from '../../data/teams';
import { initialMatches } from '../../data/tournamentMatches';
import { calculateStandings } from '../../utils/battleRoyaleLogic';
import { resolveTournament } from '../../utils/torneoLogic';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = await getData();

    // Calcola classifica Battle Royale
    const battleRoyale = calculateStandings(data.giornate, teams);

    // Risolvi torneo bracket (con eventuali override per i pareggi)
    const torneoOverrides = data.torneoOverrides || {};
    const torneo = resolveTournament(initialMatches, data.giornate, torneoOverrides);

    res.json({
      giornate: data.giornate,
      battleRoyale,
      torneo,
      torneoOverrides,
      teams,
    });
  } catch (error) {
    console.error('Errore caricamento dati:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
}
