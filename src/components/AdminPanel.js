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

  // Carica punteggi esistenti quando si cambia giornata
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
    // Validazione
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
      // Svuota il form
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

  // Giornate disponibili (24-38)
  const giornateRange = Array.from({ length: 15 }, (_, i) => 24 + i);

  return (
    <div className="space-y-6">
      {/* Selettore Giornata */}
      <div>
        <label className="block text-sm text-gray-400 mb-2 font-medium">
          <i className="far fa-calendar-alt mr-2"></i>Seleziona Giornata
        </label>
        <div className="flex gap-1.5 flex-wrap">
          {giornateRange.map((g) => {
            const exists = giornate?.[String(g)];
            return (
              <button
                key={g}
                onClick={() => loadExisting(g)}
                className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                  giornata === g
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : exists
                    ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-900/50'
                    : 'bg-slate-800 text-gray-400 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                {g}
                {exists && giornata !== g && (
                  <i className="fas fa-check ml-1 text-xs"></i>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Form punteggi */}
      <div>
        <h3 className="text-sm text-gray-400 mb-3 font-medium">
          <i className="fas fa-edit mr-2"></i>Punteggi Giornata {giornata}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {teams.map((team, idx) => (
            <div
              key={team}
              className="flex items-center gap-3 bg-slate-800/50 rounded-lg p-3 border border-slate-700/50"
            >
              <span className="text-xs text-gray-500 w-5 text-right">{idx + 1}.</span>
              <i className="fas fa-shield-alt text-blue-400 text-sm"></i>
              <span className="text-sm text-gray-200 flex-1 truncate">{team}</span>
              <input
                type="number"
                step="0.5"
                min="0"
                max="200"
                value={punteggi[team]}
                onChange={(e) => handleChange(team, e.target.value)}
                placeholder="0.0"
                className="w-20 bg-slate-900 border border-slate-600 rounded-lg px-3 py-1.5 text-right font-mono text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Messaggi */}
      {message && (
        <div
          className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-green-900/30 text-green-400 border border-green-500/30'
              : message.type === 'error'
              ? 'bg-red-900/30 text-red-400 border border-red-500/30'
              : message.type === 'warning'
              ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30'
              : 'bg-blue-900/30 text-blue-400 border border-blue-500/30'
          }`}
        >
          <i
            className={`fas ${
              message.type === 'success'
                ? 'fa-check-circle'
                : message.type === 'error'
                ? 'fa-exclamation-circle'
                : message.type === 'warning'
                ? 'fa-exclamation-triangle'
                : 'fa-info-circle'
            }`}
          ></i>
          {message.text}
        </div>
      )}

      {/* Bottoni azioni */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving || deleting}
          className={`flex-1 py-3 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
            saving || deleting
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-500/20'
          }`}
        >
          {saving ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> Salvataggio...
            </>
          ) : (
            <>
              <i className="fas fa-save"></i> Salva Giornata {giornata}
            </>
          )}
        </button>

        {giornate?.[String(giornata)] && (
          <button
            onClick={handleDelete}
            disabled={saving || deleting}
            className={`py-3 px-5 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
              deleting
                ? 'bg-gray-600 cursor-not-allowed'
                : confirmDelete
                ? 'bg-red-600 hover:bg-red-500 shadow-lg shadow-red-500/30 animate-pulse'
                : 'bg-red-900/50 hover:bg-red-800 border border-red-500/30 text-red-300'
            }`}
          >
            {deleting ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-trash-alt"></i>
            )}
          </button>
        )}
      </div>

      {/* Sezione pareggi torneo */}
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

/**
 * Sotto-componente che mostra i pareggi del torneo per la giornata selezionata
 * e permette all'admin di scegliere il vincitore manualmente.
 */
function TorneoDraws({ giornata, giornate, torneoMatches, torneoOverrides, onSaveOverride }) {
  const [savingId, setSavingId] = useState(null);

  if (!torneoMatches || !giornate?.[String(giornata)]) return null;

  // Trova i match del torneo per questa giornata che sono in pareggio
  const drawMatches = torneoMatches.filter((m) => {
    return m.day === giornata && m.draw === true;
  });

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
    <div className="mt-2 p-4 bg-amber-900/10 border border-amber-500/30 rounded-xl">
      <h3 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2">
        <i className="fas fa-exclamation-triangle"></i>
        Pareggi nel Torneo - Giornata {giornata}
      </h3>
      <p className="text-xs text-gray-400 mb-4">
        Le seguenti partite del torneo sono finite in pareggio. Seleziona il vincitore.
      </p>

      <div className="space-y-3">
        {drawMatches.map((match) => {
          const currentOverride = torneoOverrides?.[match.id];
          const isResolved = !!currentOverride;
          const isSaving = savingId === match.id;

          return (
            <div
              key={match.id}
              className={`rounded-lg border p-3 ${
                isResolved
                  ? 'bg-green-900/10 border-green-500/20'
                  : 'bg-slate-800/60 border-amber-500/20'
              }`}
            >
              {/* Info match */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-gray-500">{match.id}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-400">
                    {match.golA}-{match.golB}
                  </span>
                  {match.label && (
                    <span className="text-xs bg-purple-900/30 text-purple-400 px-2 py-0.5 rounded-full">
                      {match.label}
                    </span>
                  )}
                  {isResolved && (
                    <span className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded-full">
                      <i className="fas fa-check mr-1"></i>Risolto
                    </span>
                  )}
                </div>
              </div>

              {/* Punteggi fanta */}
              <div className="text-xs text-gray-500 mb-2 text-center">
                {match.scoreA} vs {match.scoreB}
              </div>

              {/* Bottoni selezione vincitore */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleSelectWinner(match.id, 'A')}
                  disabled={isSaving}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                    currentOverride === 'A'
                      ? 'bg-green-600 text-white shadow-lg shadow-green-500/30'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600 border border-slate-600'
                  }`}
                >
                  {isSaving ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : currentOverride === 'A' ? (
                    <i className="fas fa-trophy"></i>
                  ) : null}
                  <span className="truncate">{match.teamA}</span>
                </button>

                <button
                  onClick={() => handleSelectWinner(match.id, 'B')}
                  disabled={isSaving}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                    currentOverride === 'B'
                      ? 'bg-green-600 text-white shadow-lg shadow-green-500/30'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600 border border-slate-600'
                  }`}
                >
                  {isSaving ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : currentOverride === 'B' ? (
                    <i className="fas fa-trophy"></i>
                  ) : null}
                  <span className="truncate">{match.teamB}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
