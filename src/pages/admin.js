import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminPanel from '../components/AdminPanel';

const ADMIN_PASSWORD = 'fantatorneo2025';

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch('/api/data');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Errore caricamento dati:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authenticated) fetchData();
  }, [authenticated]);

  function handleLogin(e) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError('');
    } else {
      setError('Password errata');
    }
  }

  async function handleSave(giornata, punteggi) {
    const res = await fetch('/api/save-giornata', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, giornata, punteggi }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Errore durante il salvataggio');
    await fetchData();
    return json;
  }

  async function handleDelete(giornata) {
    const res = await fetch('/api/delete-giornata', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, giornata }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Errore durante la cancellazione');
    await fetchData();
    return json;
  }

  async function handleSaveOverride(matchId, winner) {
    const res = await fetch('/api/save-torneo-override', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, matchId, winner }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Errore durante il salvataggio override');
    await fetchData();
    return json;
  }

  return (
    <>
      <Head>
        <title>Admin - FantaTorneo</title>
      </Head>

      <div className="min-h-screen bg-black">
        <header className="bg-black border-b-2 border-white p-4 sticky top-0 z-50">
          <div className="max-w-3xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-black uppercase tracking-widest text-white font-mono">
              <span className="text-[#FBBF24]">ADMIN</span> PANEL
            </h1>
            <Link
              href="/pubblico"
              className="text-xs bg-black text-white border border-white px-4 py-2 font-mono font-black uppercase tracking-widest hover:bg-white hover:text-black cursor-pointer"
            >
              Vista Pubblica
            </Link>
          </div>
        </header>

        <main className="max-w-3xl mx-auto p-4 sm:p-6">
          {!authenticated ? (
            <div className="max-w-sm mx-auto mt-20">
              <div className="border-2 border-white p-8">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-black uppercase tracking-widest text-white font-mono">
                    Accesso Admin
                  </h2>
                  <p className="text-xs text-[#555] mt-1 font-mono">
                    Inserisci la password per accedere
                  </p>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-black border-2 border-[#333] px-4 py-3 text-white font-mono focus:border-[#FBBF24] focus:outline-none"
                    autoFocus
                  />
                  {error && (
                    <p className="text-[#DC2626] text-xs font-mono uppercase">{error}</p>
                  )}
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#FBBF24] text-black font-black uppercase tracking-widest font-mono hover:bg-white cursor-pointer"
                  >
                    Accedi
                  </button>
                </form>
              </div>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-[#555] font-mono uppercase tracking-widest text-xs">Caricamento...</p>
            </div>
          ) : (
            <div className="mt-4">
              <AdminPanel
                giornate={data?.giornate || {}}
                onSave={handleSave}
                onDelete={handleDelete}
                torneoMatches={data?.torneo || []}
                torneoOverrides={data?.torneoOverrides || {}}
                onSaveOverride={handleSaveOverride}
              />
            </div>
          )}
        </main>
      </div>
    </>
  );
}
