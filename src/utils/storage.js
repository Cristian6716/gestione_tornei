import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'appData.json');

const defaultData = { giornate: {} };

/**
 * Crea un client Redis (Upstash) se le env vars sono configurate.
 * Supporta sia le variabili Upstash che quelle legacy Vercel KV.
 */
async function getRedis() {
  const url =
    process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (url && token) {
    try {
      const { Redis } = await import('@upstash/redis');
      return new Redis({ url, token });
    } catch {
      return null;
    }
  }
  return null;
}

export async function getData() {
  // Prova Redis (Upstash) per produzione su Vercel
  const redis = await getRedis();
  if (redis) {
    try {
      const data = await redis.get('fantaTorneoData');
      return data || { ...defaultData };
    } catch {
      return { ...defaultData };
    }
  }

  // Fallback: file JSON locale (sviluppo)
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { ...defaultData };
  }
}

export async function setData(data) {
  // Prova Redis (Upstash) per produzione su Vercel
  const redis = await getRedis();
  if (redis) {
    await redis.set('fantaTorneoData', data);
    return;
  }

  // Fallback: file JSON locale (sviluppo)
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}
