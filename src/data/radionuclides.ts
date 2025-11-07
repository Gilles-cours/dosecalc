/**
 * Base de données des radionucléides émetteurs gamma
 * Sources : IAEA, NNDC, LNHB
 */

import { Radionuclide } from '../types';

export const RADIONUCLIDES: Record<string, Radionuclide> = {
  'Cs-137': {
    id: 'Cs-137',
    name: 'Césium-137',
    halfLife: 9.4867e8, // ~30.08 ans en secondes
    gammaLines: [
      { energy: 0.6616, intensity: 0.851 } // Ba-137m (daughter)
    ]
  },

  'Co-60': {
    id: 'Co-60',
    name: 'Cobalt-60',
    halfLife: 1.6632e8, // ~5.27 ans en secondes
    gammaLines: [
      { energy: 1.1732, intensity: 0.9985 },
      { energy: 1.3325, intensity: 0.9998 }
    ]
  },

  'Am-241': {
    id: 'Am-241',
    name: 'Américium-241',
    halfLife: 1.3631e10, // ~432.2 ans en secondes
    gammaLines: [
      { energy: 0.0595, intensity: 0.359 },
      { energy: 0.0261, intensity: 0.024 }
    ]
  },

  'Ag-110m': {
    id: 'Ag-110m',
    name: 'Argent-110m',
    halfLife: 2.1546e7, // ~249.79 jours en secondes
    gammaLines: [
      { energy: 0.6578, intensity: 0.9447 },
      { energy: 0.8847, intensity: 0.7290 },
      { energy: 0.9373, intensity: 0.3426 },
      { energy: 1.3840, intensity: 0.2431 },
      { energy: 1.5048, intensity: 0.1301 }
    ]
  },

  'Ir-192': {
    id: 'Ir-192',
    name: 'Iridium-192',
    halfLife: 6.3846e6, // ~73.83 jours en secondes
    gammaLines: [
      { energy: 0.3165, intensity: 0.8268 },
      { energy: 0.4685, intensity: 0.4781 },
      { energy: 0.6044, intensity: 0.0820 },
      { energy: 0.2961, intensity: 0.2870 },
      { energy: 0.3089, intensity: 0.2970 }
    ]
  },

  'I-131': {
    id: 'I-131',
    name: 'Iode-131',
    halfLife: 6.9379e5, // ~8.03 jours en secondes
    gammaLines: [
      { energy: 0.3645, intensity: 0.817 },
      { energy: 0.6369, intensity: 0.072 },
      { energy: 0.2843, intensity: 0.061 }
    ]
  },

  'Ba-133': {
    id: 'Ba-133',
    name: 'Baryum-133',
    halfLife: 3.3185e8, // ~10.52 ans en secondes
    gammaLines: [
      { energy: 0.0810, intensity: 0.3290 },
      { energy: 0.3560, intensity: 0.6205 },
      { energy: 0.3029, intensity: 0.1831 },
      { energy: 0.2764, intensity: 0.0716 }
    ]
  },

  'Na-22': {
    id: 'Na-22',
    name: 'Sodium-22',
    halfLife: 8.2108e7, // ~2.60 ans en secondes
    gammaLines: [
      { energy: 1.2746, intensity: 0.9994 },
      { energy: 0.5110, intensity: 1.7976 } // annihilation + positron
    ]
  }
};

/**
 * Obtient les données d'un radionucléide
 */
export function getRadionuclide(id: string): Radionuclide | undefined {
  return RADIONUCLIDES[id];
}

/**
 * Liste tous les radionucléides disponibles
 */
export function getAllRadionuclides(): Radionuclide[] {
  return Object.values(RADIONUCLIDES);
}
