// Struttura completa del torneo bracket (G24-G38)
// eliminationMatch: true = il perdente viene eliminato dal torneo
// teamA/teamB: nomi reali oppure placeholder "Vinc. MX" / "Perd. MX"

export const initialMatches = [
  // --- GIORNATA 24 ---
  { id: 'M1', day: 24, bracket: 'upper', teamA: 'Energy Team', teamB: 'Fessa Kyoto FC', scoreA: null, scoreB: null, winner: null, eliminated: null, eliminationMatch: false },
  { id: 'M2', day: 24, bracket: 'upper', teamA: 'Rocks Pirates', teamB: 'Padre Tempo', scoreA: null, scoreB: null, winner: null, eliminated: null, eliminationMatch: false },
  { id: 'M6', day: 24, bracket: 'mid', teamA: 'Fredin Fc', teamB: 'SohMatta', scoreA: null, scoreB: null, winner: null, eliminated: null, eliminationMatch: false },
  { id: 'M7', day: 24, bracket: 'mid', teamA: 'Lang Olodelsesso', teamB: 'Come VaVA', scoreA: null, scoreB: null, winner: null, eliminated: null, eliminationMatch: false },
  { id: 'M8', day: 24, bracket: 'mid', teamA: 'Cani della Malesia', teamB: 'Napolethanos', scoreA: null, scoreB: null, winner: null, eliminated: null, eliminationMatch: false },
  { id: 'M9', day: 24, bracket: 'mid', teamA: 'Sesko e Sambia', teamB: 'One Pisa', scoreA: null, scoreB: null, winner: null, eliminated: null, eliminationMatch: false },
  { id: 'M4', day: 24, bracket: 'lower', teamA: 'Qarabaggio', teamB: 'Figli di Putin', scoreA: null, scoreB: null, winner: null, eliminated: null, eliminationMatch: true },
  { id: 'M5', day: 24, bracket: 'lower', teamA: 'Beautiful Abyssinian', teamB: 'Rubin Kebab', scoreA: null, scoreB: null, winner: null, eliminated: null, eliminationMatch: true },

  // --- GIORNATA 25 ---
  { id: 'M10', day: 25, bracket: 'mid', teamA: 'Vinc. M6', teamB: 'Vinc. M7', scoreA: null, scoreB: null, winner: null, eliminated: null, eliminationMatch: false },
  { id: 'M11', day: 25, bracket: 'mid', teamA: 'Vinc. M8', teamB: 'Vinc. M9', scoreA: null, scoreB: null, winner: null, eliminated: null, eliminationMatch: false },
  { id: 'M16', day: 25, bracket: 'mid', teamA: 'Perd. M6', teamB: 'Perd. M7', scoreA: null, scoreB: null, winner: null, eliminated: null, eliminationMatch: false },
  { id: 'M17', day: 25, bracket: 'mid', teamA: 'Perd. M8', teamB: 'Perd. M9', scoreA: null, scoreB: null, winner: null, eliminated: null, eliminationMatch: false },

  // --- GIORNATA 26 ---
  { id: 'M3', day: 26, bracket: 'upper', teamA: 'Vinc. M1', teamB: 'Vinc. M2', scoreA: null, scoreB: null, winner: null, eliminated: null, eliminationMatch: false },
  { id: 'M12', day: 26, bracket: 'mid', teamA: 'Vinc. M10', teamB: 'Perd. M1', scoreA: null, scoreB: null, winner: null, eliminated: null, eliminationMatch: false },
  { id: 'M13', day: 26, bracket: 'mid', teamA: 'Vinc. M11', teamB: 'Perd. M2', scoreA: null, scoreB: null, winner: null, eliminated: null, eliminationMatch: false },
  { id: 'M18', day: 26, bracket: 'lower', teamA: 'Perd. M10', teamB: 'Vinc. M16', scoreA: null, scoreB: null, winner: null, eliminated: null, eliminationMatch: false },
  { id: 'M19', day: 26, bracket: 'lower', teamA: 'Perd. M11', teamB: 'Vinc. M17', scoreA: null, scoreB: null, winner: null, eliminated: null, eliminationMatch: false },
  { id: 'M20', day: 26, bracket: 'lower', teamA: 'Vinc. M4', teamB: 'Perd. M16', scoreA: null, scoreB: null, winner: null, eliminated: null, eliminationMatch: true },
  { id: 'M21', day: 26, bracket: 'lower', teamA: 'Vinc. M5', teamB: 'Perd. M17', scoreA: null, scoreB: null, winner: null, eliminated: null, eliminationMatch: true },

  // --- GIORNATA 27 ---
  { id: 'M14', day: 27, bracket: 'mid', teamA: 'Vinc. M12', teamB: 'Vinc. M13', scoreA: null, scoreB: null, winner: null, eliminated: null, eliminationMatch: false },
  { id: 'M22', day: 27, bracket: 'lower', teamA: 'Vinc. M18', teamB: 'Perd. M12', scoreA: null, scoreB: null, winner: null, eliminated: null, eliminationMatch: false },
  { id: 'M23', day: 27, bracket: 'lower', teamA: 'Vinc. M19', teamB: 'Perd. M13', scoreA: null, scoreB: null, winner: null, eliminated: null, eliminationMatch: false },
  { id: 'M24', day: 27, bracket: 'lower', teamA: 'Vinc. M20', teamB: 'Perd. M18', scoreA: null, scoreB: null, winner: null, eliminated: null, eliminationMatch: true },
  { id: 'M25', day: 27, bracket: 'lower', teamA: 'Vinc. M21', teamB: 'Perd. M19', scoreA: null, scoreB: null, winner: null, eliminated: null, eliminationMatch: true },

  // --- GIORNATA 28 ---
  { id: 'M15', day: 28, bracket: 'mid', teamA: 'Vinc. M14', teamB: 'Perd. M3', scoreA: null, scoreB: null, winner: null, eliminated: null, eliminationMatch: false },
  { id: 'M26', day: 28, bracket: 'lower', teamA: 'Vinc. M22', teamB: 'Vinc. M23', scoreA: null, scoreB: null, winner: null, eliminated: null, eliminationMatch: false },
  { id: 'M27', day: 28, bracket: 'lower', teamA: 'Vinc. M24', teamB: 'Perd. M22', scoreA: null, scoreB: null, winner: null, eliminated: null, eliminationMatch: true },
  { id: 'M28', day: 28, bracket: 'lower', teamA: 'Vinc. M25', teamB: 'Perd. M23', scoreA: null, scoreB: null, winner: null, eliminated: null, eliminationMatch: true },

  // --- GIORNATA 29 ---
  { id: 'M30', day: 29, bracket: 'lower', teamA: 'Vinc. M26', teamB: 'Perd. M14', scoreA: null, scoreB: null, winner: null, eliminated: null, eliminationMatch: false },
  { id: 'M29', day: 29, bracket: 'lower', teamA: 'Vinc. M27', teamB: 'Vinc. M28', scoreA: null, scoreB: null, winner: null, eliminated: null, eliminationMatch: true },

  // --- GIORNATA 30 ---
  { id: 'M31', day: 30, bracket: 'lower', teamA: 'Vinc. M30', teamB: 'Perd. M15', scoreA: null, scoreB: null, winner: null, eliminated: null, eliminationMatch: false },
  { id: 'M32', day: 30, bracket: 'lower', teamA: 'Vinc. M29', teamB: 'Perd. M26', scoreA: null, scoreB: null, winner: null, eliminated: null, eliminationMatch: true },

  // --- GIORNATA 31 ---
  { id: 'M33', day: 31, bracket: 'lower', teamA: 'Vinc. M32', teamB: 'Perd. M30', scoreA: null, scoreB: null, winner: null, eliminated: null, eliminationMatch: true },

  // --- GIORNATA 32 ---
  { id: 'M34', day: 32, bracket: 'lower', teamA: 'Vinc. M33', teamB: 'Perd. M31', scoreA: null, scoreB: null, winner: null, eliminated: null, eliminationMatch: true },

  // --- GIORNATA 34 (QUARTI) ---
  { id: 'M35', day: 34, bracket: 'finals', teamA: 'Vinc. M3', teamB: 'Vinc. M15', scoreA: null, scoreB: null, winner: null, eliminated: null, eliminationMatch: false, label: 'Upper Final' },
  { id: 'M36', day: 34, bracket: 'finals', teamA: 'Vinc. M31', teamB: 'Vinc. M34', scoreA: null, scoreB: null, winner: null, eliminated: null, eliminationMatch: true, label: 'Lower Final' },

  // --- GIORNATA 36 (SEMIFINALE) ---
  { id: 'M37', day: 36, bracket: 'finals', teamA: 'Perd. M35', teamB: 'Vinc. M36', scoreA: null, scoreB: null, winner: null, eliminated: null, eliminationMatch: true, label: 'Semifinale' },

  // --- GIORNATA 38 (FINALE) ---
  { id: 'Final', day: 38, bracket: 'finals', teamA: 'Vinc. M35', teamB: 'Vinc. M37', scoreA: null, scoreB: null, winner: null, eliminated: null, eliminationMatch: true, label: 'FINALISSIMA' },
];
