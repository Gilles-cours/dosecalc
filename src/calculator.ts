/**
 * Moteur de calcul de dose gamma
 *
 * Formules utilisées:
 * - Flux de photons à distance r: Φ = S / (4πr²)
 * - Atténuation: Φ_att = Φ * exp(-μx) * B(E, μx)
 * - Débit de dose: Ḋ = Φ * E * μ_en/ρ * conversion
 *
 * Unités:
 * - Débit de dose en µSv/h
 * - Énergie en MeV
 * - Distance en m
 * - Coefficients d'atténuation en cm⁻¹
 */

import {
  CalculationParams,
  DoseResults,
  SingleEnergyResult,
  GammaLine,
  EnergySource,
  RadionuclideSource
} from './types';
import { getRadionuclide } from './data/radionuclides';
import { getAttenuationCoefficient, interpolateAttenuation, MATERIALS, ICRU_TISSUE } from './data/xcom';
import { calculateBuildUpFactor } from './data/buildup';

/**
 * Constantes physiques
 */

/**
 * Facteur de conversion pour obtenir mSv/h :
 * - 1.602e-13 : conversion J/MeV
 * - 3600 : conversion s vers h
 * - 1e3 : conversion Sv vers mSv
 */
const DOSE_CONVERSION_FACTOR = 1.602e-13 * 3600 * 1e3; // (J/MeV) * (s/h) * (mSv/Sv)

/**
 * Convertit une source radionucléide en source d'énergie
 */
function radionuclideToEnergySource(source: RadionuclideSource): GammaLine[] {
  const radionuclide = getRadionuclide(source.radionuclide);
  if (!radionuclide) {
    throw new Error(`Radionucléide inconnu: ${source.radionuclide}`);
  }

  // Calcule le taux de photons pour chaque ligne gamma
  // Taux = Activité (Bq) * Intensité (photons/désintégration)
  return radionuclide.gammaLines.map(line => ({
    energy: line.energy,
    intensity: source.activity * line.intensity // photons/s
  }));
}

/**
 * Calcule le débit de dose pour une seule énergie gamma
 */
function calculateSingleEnergyDose(
  energy: number,           // MeV
  photonRate: number,       // photons/s
  distance: number,         // m
  shieldMaterial?: string,
  shieldThickness?: number  // cm
): SingleEnergyResult {
  // Convertir distance en cm
  const distanceCm = distance * 100;

  // Flux de photons non atténué à la distance r (photons/cm²/s)
  // Φ = S / (4πr²) = Émissivité / (4πd²)
  const unshieldedFlux = photonRate / (4 * Math.PI * distanceCm * distanceCm);

  // Coefficient d'absorption d'énergie massique pour le tissu ICRU
  const { muEn } = interpolateAttenuation(ICRU_TISSUE, energy);
  const muEnMassicTissue = muEn / ICRU_TISSUE.density; // cm²/g

  // Débit de dose non atténué (mSv/h)
  // Ḋ = Φ * E * (μ_en/ρ)tissu * facteur_conversion
  const unshieldedDoseRate = unshieldedFlux * energy * muEnMassicTissue * DOSE_CONVERSION_FACTOR;

  const result: SingleEnergyResult = {
    energy,
    intensity: photonRate,
    flux: unshieldedFlux,
    muEnMassicTissue,
    doseRateUnshielded: unshieldedDoseRate
  };

  // Si un écran est présent, calculer l'atténuation
  if (shieldMaterial && shieldThickness && shieldThickness > 0) {
    // Coefficient d'atténuation linéaire du matériau
    const mu = getAttenuationCoefficient(shieldMaterial as any, energy);

    // Coefficient d'atténuation massique
    const materialData = MATERIALS[shieldMaterial as any];
    const muMassic = mu / materialData.density;

    // Nombre de libre parcours moyens
    const mfp = mu * shieldThickness;

    // Facteur de build-up
    const buildUp = calculateBuildUpFactor(shieldMaterial as any, energy, mfp);

    // Facteur d'atténuation avec build-up
    // T = B * exp(-μx)
    const attenuationFactor = buildUp * Math.exp(-mfp);

    // Débit de dose atténué
    const shieldedDoseRate = unshieldedDoseRate * attenuationFactor;

    result.mu = mu;
    result.muMassic = muMassic;
    result.buildUpFactor = buildUp;
    result.attenuationFactor = attenuationFactor;
    result.doseRateShielded = shieldedDoseRate;
  }

  return result;
}

/**
 * Calcule le débit de dose total pour toutes les énergies
 */
export function calculateDose(params: CalculationParams): DoseResults {
  // Convertir la source en liste d'énergies
  let energies: GammaLine[];

  if (params.source.type === 'energy') {
    const energySource = params.source as EnergySource;
    energies = energySource.energies.map(e => ({
      energy: e.energy,
      intensity: energySource.photonRate * e.intensity
    }));
  } else {
    const radSource = params.source as RadionuclideSource;
    energies = radionuclideToEnergySource(radSource);
  }

  // Calculer la dose pour chaque énergie
  const energyResults: SingleEnergyResult[] = energies.map(e =>
    calculateSingleEnergyDose(
      e.energy,
      e.intensity,
      params.distance,
      params.shield?.material,
      params.shield?.thickness
    )
  );

  // Sommer les contributions de toutes les énergies
  const totalDoseRateUnshielded = energyResults.reduce(
    (sum, r) => sum + r.doseRateUnshielded,
    0
  );

  let totalDoseRateShielded: number | undefined;
  let totalAttenuationFactor: number | undefined;

  if (params.shield) {
    totalDoseRateShielded = energyResults.reduce(
      (sum, r) => sum + (r.doseRateShielded || 0),
      0
    );

    // Facteur d'atténuation total (pondéré par la dose)
    if (totalDoseRateUnshielded > 0) {
      totalAttenuationFactor = totalDoseRateShielded / totalDoseRateUnshielded;
    }
  }

  return {
    totalDoseRateUnshielded,
    totalDoseRateShielded,
    totalAttenuationFactor,
    energyResults,
    source: params.source,
    distance: params.distance,
    shield: params.shield
  };
}

/**
 * Formate un nombre en notation scientifique si nécessaire
 */
export function formatNumber(value: number, precision: number = 3): string {
  if (value === 0) return '0';

  const absValue = Math.abs(value);

  if (absValue >= 1e4 || absValue < 1e-2) {
    return value.toExponential(precision);
  } else {
    return value.toPrecision(precision);
  }
}

/**
 * Formate un résultat de dose avec son unité
 */
export function formatDoseRate(doseRate: number): string {
  if (doseRate >= 1e3) {
    return `${formatNumber(doseRate / 1e3)} Sv/h`;
  } else if (doseRate >= 1.0) {
    return `${formatNumber(doseRate)} mSv/h`;
  } else {
    return `${formatNumber(doseRate * 1000)} µSv/h`;
  }
}
