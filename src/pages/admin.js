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

  // Carica dati
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
    if (authenticated) {
      fetchData();
    }
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

    if (!res.ok) {
      throw new Error(json.error || 'Errore durante il salvataggio');
    }

    // Ricarica dati dopo salvataggio
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

    if (!res.ok) {
      throw new Error(json.error || 'Errore durante la cancellazione');
    }

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

    if (!res.ok) {
      throw new Error(json.error || 'Errore durante il salvataggio override');
    }

    await fetchData();
    return json;
  }

  return (
    <>
      <Head>
        <title>Admin - FantaTorneo</title>
      </Head>

      <div className="min-h-screen">
        {/* Header */}
        <header className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700 p-4 sticky top-0 z-50">
          <div className="max-w-3xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-black flex items-center gap-3">
              <i className="fas fa-cog text-blue-400"></i>
              <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                Admin Panel
              </span>
            </h1>
            <Link
              href="/pubblico"
              className="text-sm bg-slate-700 hover:bg-slate-600 text-gray-300 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <i className="fas fa-eye"></i> Vista Pubblica
            </Link>
          </div>
        </header>

        <main className="max-w-3xl mx-auto p-4 sm:p-6">
          {!authenticated ? (
            /* Login Form */
            <div className="max-w-sm mx-auto mt-20">
              <div className="bg-slate-800/60 rounded-2xl p-8 border border-slate-700">
                <div className="text-center mb-6">
                  <i className="fas fa-lock text-4xl text-blue-400 mb-3"></i>
                  <h2 className="text-xl font-bold text-gray-200">
                    Accesso Admin
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Inserisci la password per accedere
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    autoFocus
                  />

                  {error && (
                    <p className="text-red-400 text-sm flex items-center gap-2">
                      <i className="fas fa-exclamation-circle"></i>
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-sign-in-alt"></i> Accedi
                  </button>
                </form>
              </div>
            </div>
          ) : loading ? (
            /* Loading */
            <div className="flex items-center justify-center py-20">
              <i className="fas fa-spinner fa-spin text-4xl text-blue-400"></i>
            </div>
          ) : (
            /* Admin Panel */
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
