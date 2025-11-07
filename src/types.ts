/**
 * Types pour le calculateur de dose gamma
 * Utilisation de number (double precision float 64-bit en JavaScript/TypeScript)
 */

export type SourceType = 'energy' | 'radionuclide';

export type ShieldMaterial = 'lead' | 'steel' | 'aluminum' | 'uranium' | 'air' | 'concrete' | 'water';

export type RadionuclideId = 'Cs-137' | 'Co-60' | 'Am-241' | 'Ag-110m' | 'Ir-192' | 'I-131' | 'Ba-133' | 'Na-22';

/**
 * Représente une ligne gamma avec son énergie et son intensité
 */
export interface GammaLine {
  energy: number;      // MeV (double precision)
  intensity: number;   // Relative intensity or yield (double precision)
}

/**
 * Données d'un radionucléide
 */
export interface Radionuclide {
  id: RadionuclideId;
  name: string;
  halfLife: number;           // secondes (double precision)
  gammaLines: GammaLine[];
}

/**
 * Source définie par énergie directe
 */
export interface EnergySource {
  type: 'energy';
  energies: GammaLine[];      // Liste d'énergies avec intensités
  photonRate: number;         // photons/seconde (double precision)
}

/**
 * Source définie par radionucléide
 */
export interface RadionuclideSource {
  type: 'radionuclide';
  radionuclide: RadionuclideId;
  activity: number;           // Becquerels (double precision)
}

export type Source = EnergySource | RadionuclideSource;

/**
 * Configuration de l'écran
 */
export interface Shield {
  material: ShieldMaterial;
  thickness: number;          // cm (double precision)
}

/**
 * Paramètres de calcul complets
 */
export interface CalculationParams {
  source: Source;
  distance: number;           // mètres (double precision)
  shield?: Shield;            // optionnel
}

/**
 * Résultat pour une seule énergie gamma
 */
export interface SingleEnergyResult {
  energy: number;             // MeV
  intensity: number;          // Relative intensity
  doseRateUnshielded: number; // µSv/h
  doseRateShielded?: number;  // µSv/h (si écran)
  attenuationFactor?: number; // Facteur d'atténuation
  buildUpFactor?: number;     // Facteur de build-up
}

/**
 * Résultats du calcul de dose
 */
export interface DoseResults {
  totalDoseRateUnshielded: number;  // µSv/h (double precision)
  totalDoseRateShielded?: number;   // µSv/h (double precision)
  totalAttenuationFactor?: number;  // Facteur d'atténuation total
  energyResults: SingleEnergyResult[]; // Détails par énergie
  source: Source;
  distance: number;
  shield?: Shield;
}

/**
 * Coefficient d'atténuation pour un matériau à une énergie donnée
 */
export interface AttenuationCoefficient {
  energy: number;             // MeV
  mu: number;                 // cm^-1 (coefficient d'atténuation linéaire)
  muEn: number;               // cm^-1 (coefficient d'absorption d'énergie massique)
}

/**
 * Données d'atténuation pour un matériau
 */
export interface MaterialData {
  name: string;
  density: number;            // g/cm^3 (double precision)
  attenuationData: AttenuationCoefficient[];
}

/**
 * Facteur de build-up pour un matériau
 */
export interface BuildUpFactorData {
  energy: number;             // MeV
  meanFreePath: number;       // nombre de libre parcours moyens (mfp)
  factor: number;             // Facteur de build-up (double precision)
}
