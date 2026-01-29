import { getData, setData } from '../../utils/storage';
import { teams } from '../../data/teams';

const ADMIN_PASSWORD = 'fantatorneo2025';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password, giornata, punteggi } = req.body;

  // Verifica password
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Password errata' });
  }

  // Validazione dati
  if (!giornata || giornata < 24 || giornata > 38) {
    return res.status(400).json({ error: 'Giornata non valida (24-38)' });
  }

  if (!punteggi || typeof punteggi !== 'object') {
    return res.status(400).json({ error: 'Punteggi mancanti' });
  }

  // Verifica che tutti i team abbiano un punteggio
  const missing = teams.filter((t) => punteggi[t] == null || punteggi[t] === '');
  if (missing.length > 0) {
    return res.status(400).json({
      error: `Punteggi mancanti per: ${missing.join(', ')}`,
    });
  }

  // Converti in numeri
  const parsed = {};
  for (const team of teams) {
    const val = parseFloat(punteggi[team]);
    if (isNaN(val)) {
      return res.status(400).json({
        error: `Punteggio non valido per ${team}: "${punteggi[team]}"`,
      });
    }
    parsed[team] = val;
  }

  try {
    const data = await getData();
    data.giornate[String(giornata)] = parsed;
    await setData(data);

    res.json({ success: true, giornata, message: `Giornata ${giornata} salvata con successo` });
  } catch (error) {
    console.error('Errore salvataggio:', error);
    res.status(500).json({ error: 'Errore durante il salvataggio' });
  }
}
