import { getData, setData } from '../../utils/storage';

const ADMIN_PASSWORD = 'fantatorneo2025';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password, giornata } = req.body;

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Password errata' });
  }

  if (!giornata || giornata < 24 || giornata > 38) {
    return res.status(400).json({ error: 'Giornata non valida (24-38)' });
  }

  try {
    const data = await getData();

    if (!data.giornate[String(giornata)]) {
      return res.status(404).json({ error: `Giornata ${giornata} non trovata` });
    }

    delete data.giornate[String(giornata)];
    await setData(data);

    res.json({ success: true, message: `Giornata ${giornata} cancellata` });
  } catch (error) {
    console.error('Errore cancellazione:', error);
    res.status(500).json({ error: 'Errore durante la cancellazione' });
  }
}
