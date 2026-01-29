import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Classifica from '../components/BattleRoyale/Classifica';
import GrigliaScontri from '../components/BattleRoyale/GrigliaScontri';
import Storico from '../components/BattleRoyale/Storico';
import Bracket from '../components/Torneo/Bracket';
import Calendario from '../components/Torneo/Calendario';

export default function PubblicoPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainTab, setMainTab] = useState('battleRoyale'); // battleRoyale | torneo
  const [brSubTab, setBrSubTab] = useState('classifica'); // classifica | griglia | storico
  const [torneoSubTab, setTorneoSubTab] = useState('calendario'); // calendario | tabellone

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
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

  const giornateCount = data?.giornate
    ? Object.keys(data.giornate).length
    : 0;

  return (
    <>
      <Head>
        <title>FantaTorneo - Competizioni</title>
      </Head>

      <div className="min-h-screen">
        {/* Header */}
        <header className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700 p-4 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-black flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                <i className="fas fa-trophy text-yellow-400"></i>
                FantaTorneo
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-xs bg-slate-700/50 px-3 py-1.5 rounded-full font-mono text-gray-300 border border-slate-600">
                  G24 - G38
                </span>
                {giornateCount > 0 && (
                  <span className="text-xs bg-emerald-900/30 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/30">
                    {giornateCount} giornate
                  </span>
                )}
              </div>
            </div>

            {/* Tab Principali */}
            <div className="flex gap-2 p-1 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <button
                onClick={() => setMainTab('battleRoyale')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  mainTab === 'battleRoyale'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-400 hover:bg-slate-800 hover:text-gray-200'
                }`}
              >
                <i className="fas fa-fist-raised"></i>
                <span className="hidden sm:inline">Battle Royale</span>
                <span className="sm:hidden">BR</span>
              </button>
              <button
                onClick={() => setMainTab('torneo')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  mainTab === 'torneo'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'text-gray-400 hover:bg-slate-800 hover:text-gray-200'
                }`}
              >
                <i className="fas fa-sitemap"></i>
                <span className="hidden sm:inline">Torneo Bracket</span>
                <span className="sm:hidden">Torneo</span>
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto p-4 sm:p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <i className="fas fa-spinner fa-spin text-4xl text-blue-400 mb-4"></i>
                <p className="text-gray-400">Caricamento dati...</p>
              </div>
            </div>
          ) : mainTab === 'battleRoyale' ? (
            /* === BATTLE ROYALE === */
            <div>
              {/* Sub-tabs */}
              <div className="flex gap-1 mb-6 bg-slate-800/50 rounded-lg p-1 border border-slate-700/30">
                {[
                  { id: 'classifica', label: 'Classifica', icon: 'fa-list-ol' },
                  { id: 'griglia', label: 'Griglia Scontri', icon: 'fa-th' },
                  { id: 'storico', label: 'Storico', icon: 'fa-history' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setBrSubTab(tab.id)}
                    className={`flex-1 py-2 rounded-md text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      brSubTab === tab.id
                        ? 'bg-slate-700 text-white shadow'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <i className={`fas ${tab.icon}`}></i>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Contenuto */}
              {brSubTab === 'classifica' && (
                <Classifica
                  classifica={data?.battleRoyale?.classifica || []}
                />
              )}
              {brSubTab === 'griglia' && (
                <GrigliaScontri
                  giornate={data?.giornate || {}}
                  teams={data?.teams || []}
                />
              )}
              {brSubTab === 'storico' && (
                <Storico
                  storico={data?.battleRoyale?.storico || []}
                  teams={data?.teams || []}
                />
              )}
            </div>
          ) : (
            /* === TORNEO === */
            <div>
              {/* Sub-tabs */}
              <div className="flex gap-1 mb-6 bg-slate-800/50 rounded-lg p-1 border border-slate-700/30">
                {[
                  {
                    id: 'calendario',
                    label: 'Calendario',
                    icon: 'fa-calendar-alt',
                  },
                  {
                    id: 'tabellone',
                    label: 'Tabellone',
                    icon: 'fa-sitemap',
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setTorneoSubTab(tab.id)}
                    className={`flex-1 py-2 rounded-md text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      torneoSubTab === tab.id
                        ? 'bg-slate-700 text-white shadow'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <i className={`fas ${tab.icon}`}></i>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Contenuto */}
              {torneoSubTab === 'calendario' && (
                <Calendario matches={data?.torneo || []} />
              )}
              {torneoSubTab === 'tabellone' && (
                <Bracket matches={data?.torneo || []} />
              )}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="text-center text-gray-600 text-xs p-4 border-t border-slate-800 mt-8">
          <p className="flex items-center justify-center gap-2">
            <i className="fas fa-futbol text-blue-500/50"></i>
            FantaTorneo G24-G38
          </p>
        </footer>
      </div>
    </>
  );
}
