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
  const [mainTab, setMainTab] = useState('battleRoyale');
  const [brSubTab, setBrSubTab] = useState('classifica');
  const [torneoSubTab, setTorneoSubTab] = useState('calendario');

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

  const giornateCount = data?.giornate ? Object.keys(data.giornate).length : 0;

  return (
    <>
      <Head>
        <title>FantaTorneo - Competizioni</title>
      </Head>

      <div className="min-h-screen bg-black">
        <header className="bg-black border-b-2 border-white p-4 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-black uppercase tracking-widest text-white">
                <span className="text-[#FBBF24]">FANTA</span>TORNEO
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#555] border border-[#333] px-3 py-1">
                  G25–G38
                </span>
                {giornateCount > 0 && (
                  <span className="text-xs font-mono text-[#FBBF24] border border-[#FBBF24] px-3 py-1">
                    {giornateCount} GRN
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setMainTab('battleRoyale')}
                className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest border-2 cursor-pointer ${
                  mainTab === 'battleRoyale'
                    ? 'bg-[#FBBF24] text-black border-[#FBBF24]'
                    : 'bg-black text-white border-white hover:bg-white hover:text-black'
                }`}
              >
                Battle Royale
              </button>
              <button
                onClick={() => setMainTab('torneo')}
                className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest border-2 cursor-pointer ${
                  mainTab === 'torneo'
                    ? 'bg-[#FBBF24] text-black border-[#FBBF24]'
                    : 'bg-black text-white border-white hover:bg-white hover:text-black'
                }`}
              >
                Torneo Bracket
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto p-4 sm:p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-[#555] font-mono uppercase tracking-widest text-xs">Caricamento...</p>
            </div>
          ) : mainTab === 'battleRoyale' ? (
            <div>
              <div className="flex gap-2 mb-6">
                {[
                  { id: 'classifica', label: 'Classifica' },
                  { id: 'griglia', label: 'Griglia' },
                  { id: 'storico', label: 'Storico' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setBrSubTab(tab.id)}
                    className={`flex-1 py-2 text-xs font-black uppercase tracking-wider border cursor-pointer ${
                      brSubTab === tab.id
                        ? 'bg-white text-black border-white'
                        : 'bg-black text-[#555] border-[#333] hover:border-white hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {brSubTab === 'classifica' && (
                <Classifica classifica={data?.battleRoyale?.classifica || []} />
              )}
              {brSubTab === 'griglia' && (
                <GrigliaScontri giornate={data?.giornate || {}} teams={data?.teams || []} />
              )}
              {brSubTab === 'storico' && (
                <Storico storico={data?.battleRoyale?.storico || []} teams={data?.teams || []} />
              )}
            </div>
          ) : (
            <div>
              <div className="flex gap-2 mb-6">
                {[
                  { id: 'calendario', label: 'Calendario' },
                  { id: 'tabellone', label: 'Tabellone' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setTorneoSubTab(tab.id)}
                    className={`flex-1 py-2 text-xs font-black uppercase tracking-wider border cursor-pointer ${
                      torneoSubTab === tab.id
                        ? 'bg-white text-black border-white'
                        : 'bg-black text-[#555] border-[#333] hover:border-white hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {torneoSubTab === 'calendario' && (
                <Calendario matches={data?.torneo || []} />
              )}
              {torneoSubTab === 'tabellone' && (
                <Bracket matches={data?.torneo || []} />
              )}
            </div>
          )}
        </main>

        <footer className="text-center text-[#333] text-xs p-4 border-t border-[#222] mt-8 font-mono uppercase tracking-widest">
          FantaTorneo G25–G38
        </footer>
      </div>
    </>
  );
}
