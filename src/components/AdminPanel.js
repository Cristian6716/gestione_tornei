import { useState } from 'react';
import { teams } from '../data/teams';
import { calculateMatchResult, calculateGoals } from '../utils/battleRoyaleLogic';

export default function AdminPanel({ giornate, onSave, onDelete, torneoMatches, torneoOverrides, onSaveOverride }) {
  const [giornata, setGiornata] = useState(24);
  const [punteggi, setPunteggi] = useState(() => {
    const init = {};
    teams.forEach((t) => (init[t] = ''));
    return init;
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [message, setMessage] = useState(null);

  function loadExisting(day) {
    setGiornata(day);
    setConfirmDelete(false);
    const existing = giornate?.[String(day)];
    if (existing) {
      const loaded = {};
      teams.forEach((t) => (loaded[t] = existing[t] != null ? String(existing[t]) : ''));
      setPunteggi(loaded);
      setMessage({ type: 'info', text: `Punteggi G${day} caricati (esistenti)` });
    } else {
      const empty = {};
      teams.forEach((t) => (empty[t] = ''));
      setPunteggi(empty);
      setMessage(null);
    }
  }

  function handleChange(team, value) {
    setPunteggi((prev) => ({ ...prev, [team]: value }));
  }

  async function handleSave() {
    const empty = teams.filter((t) => !punteggi[t] && punteggi[t] !== '0');
    if (empty.length > 0) {
      setMessage({ type: 'error', text: `Punteggi mancanti per: ${empty.join(', ')}` });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      await onSave(giornata, punteggi);
      setMessage({ type: 'success', text: `Giornata ${giornata} salvata con successo!` });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Errore durante il salvataggio' });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setMessage({ type: 'warning', text: `Sei sicuro? Clicca di nuovo per cancellare la Giornata ${giornata}` });
      return;
    }
    setDeleting(true);
    setMessage(null);
    setConfirmDelete(false);
    try {
      await onDelete(giornata);
      const empty = {};
      teams.forEach((t) => (empty[t] = ''));
      setPunteggi(empty);
      setMessage({ type: 'success', text: `Giornata ${giornata} cancellata!` });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Errore durante la cancellazione' });
    } finally {
      setDeleting(false);
    }
  }

  const giornateRange = Array.from({ length: 15 }, (_, i) => 24 + i);

  return (
    <div className="space-y-6">
      {/* Selettore Giornata */}
      <div>
        <label className="block text-xs text-[#555] mb-2 font-mono uppercase tracking-widest">
          Seleziona Giornata
        </label>
        <div className="flex gap-1 flex-wrap">
          {giornateRange.map((g) => {
            const exists = giornate?.[String(g)];
            return (
              <button
                key={g}
                onClick={() => loadExisting(g)}
                className={`px-3 py-2 text-xs font-black border cursor-pointer font-mono ${
                  giornata === g
                    ? 'bg-[#FBBF24] text-black border-[#FBBF24]'
                    : exists
                    ? 'bg-black text-[#22C55E] border-[#22C55E] hover:bg-[#22C55E] hover:text-black'
                    : 'bg-black text-[#555] border-[#333] hover:border-white hover:text-white'
                }`}
              >
                {g}{exists && giornata !== g && ' ✓'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Form punteggi */}
      <div>
        <h3 className="text-xs text-[#555] mb-3 font-mono uppercase tracking-widest">
          Punteggi Giornata {giornata}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
          {teams.map((team, idx) => (
            <div
              key={team}
              className="flex items-center gap-3 bg-[#0a0a0a] p-3 border border-[#222]"
            >
              <span className="text-xs text-[#444] w-5 text-right font-mono">{idx + 1}.</span>
              <span className="text-sm text-white flex-1 truncate font-bold">{team}</span>
              <input
                type="number"
                step="0.5"
                min="0"
                max="200"
                value={punteggi[team]}
                onChange={(e) => handleChange(team, e.target.value)}
                placeholder="0.0"
                className="w-20 bg-black border-2 border-[#333] px-3 py-1.5 text-right font-mono text-sm text-white focus:border-[#FBBF24] focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Messaggi */}
      {message && (
        <div
          className={`p-3 text-xs font-mono border uppercase tracking-wide ${
            message.type === 'success'
              ? 'border-[#22C55E] text-[#22C55E]'
              : message.type === 'error'
              ? 'border-[#DC2626] text-[#DC2626]'
              : message.type === 'warning'
              ? 'border-[#FBBF24] text-[#FBBF24]'
              : 'border-[#3b82f6] text-[#3b82f6]'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Azioni */}
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={saving || deleting}
          className={`flex-1 py-3 font-black uppercase tracking-widest text-xs border-2 cursor-pointer font-mono ${
            saving || deleting
              ? 'bg-[#222] text-[#555] border-[#222] cursor-not-allowed'
              : 'bg-[#FBBF24] text-black border-[#FBBF24] hover:bg-black hover:text-[#FBBF24]'
          }`}
        >
          {saving ? 'Salvataggio...' : `Salva G${giornata}`}
        </button>

        {giornate?.[String(giornata)] && (
          <button
            onClick={handleDelete}
            disabled={saving || deleting}
            className={`py-3 px-5 font-black uppercase tracking-widest text-xs border-2 cursor-pointer font-mono ${
              deleting
                ? 'bg-[#222] text-[#555] border-[#222] cursor-not-allowed'
                : confirmDelete
                ? 'bg-[#DC2626] text-white border-[#DC2626] hover:bg-black hover:text-[#DC2626]'
                : 'bg-black text-[#DC2626] border-[#DC2626] hover:bg-[#DC2626] hover:text-white'
            }`}
          >
            {deleting ? '...' : confirmDelete ? 'Conferma' : 'DEL'}
          </button>
        )}
      </div>

      <TorneoDraws
        giornata={giornata}
        giornate={giornate}
        torneoMatches={torneoMatches}
        torneoOverrides={torneoOverrides}
        onSaveOverride={onSaveOverride}
      />
    </div>
  );
}

function TorneoDraws({ giornata, giornate, torneoMatches, torneoOverrides, onSaveOverride }) {
  const [savingId, setSavingId] = useState(null);

  if (!torneoMatches || !giornate?.[String(giornata)]) return null;

  const drawMatches = torneoMatches.filter((m) => m.day === giornata && m.draw === true);

  if (drawMatches.length === 0) return null;

  async function handleSelectWinner(matchId, winner) {
    if (!onSaveOverride) return;
    setSavingId(matchId);
    try {
      await onSaveOverride(matchId, winner);
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="mt-2 p-4 border-2 border-[#FBBF24]">
      <h3 className="text-xs font-black text-[#FBBF24] mb-3 font-mono uppercase tracking-widest">
        ⚠ Pareggi Torneo — Giornata {giornata}
      </h3>
      <p className="text-xs text-[#555] mb-4 font-mono">
        Partite finite in pareggio. Seleziona il vincitore.
      </p>

      <div className="space-y-3">
        {drawMatches.map((match) => {
          const currentOverride = torneoOverrides?.[match.id];
          const isResolved = !!currentOverride;
          const isSaving = savingId === match.id;

          return (
            <div
              key={match.id}
              className={`border p-3 ${isResolved ? 'border-[#22C55E]' : 'border-[#FBBF24]/40'}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-[#444]">{match.id}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-[#FBBF24] font-mono">{match.golA}–{match.golB}</span>
                  {match.label && (
                    <span className="text-xs border border-[#555] text-[#555] px-2 py-0.5 font-mono">{match.label}</span>
                  )}
                  {isResolved && (
                    <span className="text-xs border border-[#22C55E] text-[#22C55E] px-2 py-0.5 font-mono uppercase">Risolto</span>
                  )}
                </div>
              </div>

              <div className="text-xs text-[#444] mb-2 text-center font-mono">
                {match.scoreA} vs {match.scoreB}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleSelectWinner(match.id, 'A')}
                  disabled={isSaving}
                  className={`flex-1 py-2 text-xs font-black border-2 cursor-pointer font-mono uppercase truncate ${
                    currentOverride === 'A'
                      ? 'bg-[#22C55E] text-black border-[#22C55E]'
                      : 'bg-black text-white border-[#333] hover:border-white'
                  }`}
                >
                  {isSaving ? '...' : match.teamA}
                </button>
                <button
                  onClick={() => handleSelectWinner(match.id, 'B')}
                  disabled={isSaving}
                  className={`flex-1 py-2 text-xs font-black border-2 cursor-pointer font-mono uppercase truncate ${
                    currentOverride === 'B'
                      ? 'bg-[#22C55E] text-black border-[#22C55E]'
                      : 'bg-black text-white border-[#333] hover:border-white'
                  }`}
                >
                  {isSaving ? '...' : match.teamB}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
