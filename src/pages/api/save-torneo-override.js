import { getData, setData } from '../../utils/storage';

const ADMIN_PASSWORD = 'fantatorneo2025';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password, matchId, winner } = req.body;

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Password errata' });
  }

  if (!matchId || !['A', 'B'].includes(winner)) {
    return res.status(400).json({ error: 'matchId e winner (A/B) richiesti' });
  }

  try {
    const data = await getData();
    if (!data.torneoOverrides) {
      data.torneoOverrides = {};
    }
    data.torneoOverrides[matchId] = winner;
    await setData(data);

    res.json({ success: true, matchId, winner });
  } catch (error) {
    console.error('Errore salvataggio override:', error);
    res.status(500).json({ error: 'Errore durante il salvataggio' });
  }
}
