/**
 * Coefficients d'atténuation basés sur XCOM (NIST)
 * Source: https://www.nist.gov/pml/xcom-photon-cross-sections-database
 *
 * mu/rho: coefficient d'atténuation massique (cm²/g)
 * mu = (mu/rho) * density: coefficient d'atténuation linéaire (cm⁻¹)
 */

import { MaterialData, ShieldMaterial } from '../types';

/**
 * Données XCOM pour le plomb (Pb, Z=82)
 * Densité: 11.35 g/cm³
 */
const LEAD_DATA: MaterialData = {
  name: 'Plomb',
  density: 11.35,
  attenuationData: [
    { energy: 0.010, mu: 61.40, muEn: 52.30 },
    { energy: 0.015, mu: 19.15, muEn: 15.84 },
    { energy: 0.020, mu: 9.144, muEn: 7.212 },
    { energy: 0.030, mu: 3.043, muEn: 2.218 },
    { energy: 0.040, mu: 1.457, muEn: 0.9771 },
    { energy: 0.050, mu: 0.8821, muEn: 0.5589 },
    { energy: 0.060, mu: 0.6294, muEn: 0.3754 },
    { energy: 0.080, mu: 0.3907, muEn: 0.2189 },
    { energy: 0.100, mu: 0.2935, muEn: 0.1543 },
    { energy: 0.150, mu: 0.1832, muEn: 0.08773 },
    { energy: 0.200, mu: 0.1410, muEn: 0.06155 },
    { energy: 0.300, mu: 0.1093, muEn: 0.04058 },
    { energy: 0.400, mu: 0.09468, muEn: 0.03189 },
    { energy: 0.500, mu: 0.08493, muEn: 0.02737 },
    { energy: 0.600, mu: 0.07781, muEn: 0.02444 },
    { energy: 0.662, mu: 0.07436, muEn: 0.02317 }, // Cs-137
    { energy: 0.800, mu: 0.06821, muEn: 0.02095 },
    { energy: 1.000, mu: 0.06278, muEn: 0.01881 },
    { energy: 1.173, mu: 0.05958, muEn: 0.01753 }, // Co-60
    { energy: 1.332, mu: 0.05754, muEn: 0.01673 }, // Co-60
    { energy: 1.500, mu: 0.05566, muEn: 0.01598 },
    { energy: 2.000, mu: 0.05175, muEn: 0.01443 },
    { energy: 3.000, mu: 0.04680, muEn: 0.01242 },
    { energy: 4.000, mu: 0.04403, muEn: 0.01134 },
    { energy: 5.000, mu: 0.04222, muEn: 0.01065 },
    { energy: 6.000, mu: 0.04098, muEn: 0.01018 },
    { energy: 8.000, mu: 0.03941, muEn: 0.009556 },
    { energy: 10.00, mu: 0.03854, muEn: 0.009228 }
  ]
};

/**
 * Données XCOM pour l'acier (approximation Fe, Z=26)
 * Densité: 7.87 g/cm³
 */
const STEEL_DATA: MaterialData = {
  name: 'Acier',
  density: 7.87,
  attenuationData: [
    { energy: 0.010, mu: 27.51, muEn: 26.79 },
    { energy: 0.015, mu: 9.825, muEn: 9.401 },
    { energy: 0.020, mu: 4.664, muEn: 4.396 },
    { energy: 0.030, mu: 1.587, muEn: 1.454 },
    { energy: 0.040, mu: 0.7353, muEn: 0.6528 },
    { energy: 0.050, mu: 0.4200, muEn: 0.3617 },
    { energy: 0.060, mu: 0.2808, muEn: 0.2359 },
    { energy: 0.080, mu: 0.1626, muEn: 0.1332 },
    { energy: 0.100, mu: 0.1179, muEn: 0.09486 },
    { energy: 0.150, mu: 0.07394, muEn: 0.05778 },
    { energy: 0.200, mu: 0.05884, muEn: 0.04453 },
    { energy: 0.300, mu: 0.04581, muEn: 0.03311 },
    { energy: 0.400, mu: 0.03970, muEn: 0.02787 },
    { energy: 0.500, mu: 0.03596, muEn: 0.02478 },
    { energy: 0.600, mu: 0.03329, muEn: 0.02267 },
    { energy: 0.662, mu: 0.03207, muEn: 0.02167 },
    { energy: 0.800, mu: 0.02994, muEn: 0.02020 },
    { energy: 1.000, mu: 0.02788, muEn: 0.01870 },
    { energy: 1.173, mu: 0.02657, muEn: 0.01780 },
    { energy: 1.332, mu: 0.02564, muEn: 0.01717 },
    { energy: 1.500, mu: 0.02478, muEn: 0.01659 },
    { energy: 2.000, mu: 0.02306, muEn: 0.01535 },
    { energy: 3.000, mu: 0.02082, muEn: 0.01360 },
    { energy: 4.000, mu: 0.01952, muEn: 0.01258 },
    { energy: 5.000, mu: 0.01870, muEn: 0.01192 },
    { energy: 6.000, mu: 0.01815, muEn: 0.01146 },
    { energy: 8.000, mu: 0.01746, muEn: 0.01085 },
    { energy: 10.00, mu: 0.01707, muEn: 0.01048 }
  ]
};

/**
 * Données XCOM pour l'aluminium (Al, Z=13)
 * Densité: 2.70 g/cm³
 */
const ALUMINUM_DATA: MaterialData = {
  name: 'Aluminium',
  density: 2.70,
  attenuationData: [
    { energy: 0.010, mu: 10.60, muEn: 10.37 },
    { energy: 0.015, mu: 3.441, muEn: 3.314 },
    { energy: 0.020, mu: 1.485, muEn: 1.408 },
    { energy: 0.030, mu: 0.4608, muEn: 0.4254 },
    { energy: 0.040, mu: 0.2098, muEn: 0.1876 },
    { energy: 0.050, mu: 0.1252, muEn: 0.1091 },
    { energy: 0.060, mu: 0.08679, muEn: 0.07390 },
    { energy: 0.080, mu: 0.05415, muEn: 0.04493 },
    { energy: 0.100, mu: 0.03960, muEn: 0.03226 },
    { energy: 0.150, mu: 0.02541, muEn: 0.02029 },
    { energy: 0.200, mu: 0.02066, muEn: 0.01620 },
    { energy: 0.300, mu: 0.01633, muEn: 0.01254 },
    { energy: 0.400, mu: 0.01422, muEn: 0.01081 },
    { energy: 0.500, mu: 0.01291, muEn: 0.009754 },
    { energy: 0.600, mu: 0.01201, muEn: 0.009028 },
    { energy: 0.662, mu: 0.01160, muEn: 0.008683 },
    { energy: 0.800, mu: 0.01087, muEn: 0.008119 },
    { energy: 1.000, mu: 0.01013, muEn: 0.007550 },
    { energy: 1.173, mu: 0.009646, muEn: 0.007181 },
    { energy: 1.332, mu: 0.009301, muEn: 0.006920 },
    { energy: 1.500, mu: 0.008989, muEn: 0.006681 },
    { energy: 2.000, mu: 0.008349, muEn: 0.006196 },
    { energy: 3.000, mu: 0.007495, muEn: 0.005548 },
    { energy: 4.000, mu: 0.006993, muEn: 0.005166 },
    { energy: 5.000, mu: 0.006671, muEn: 0.004920 },
    { energy: 6.000, mu: 0.006461, muEn: 0.004750 },
    { energy: 8.000, mu: 0.006211, muEn: 0.004529 },
    { energy: 10.00, mu: 0.006073, muEn: 0.004397 }
  ]
};

/**
 * Données XCOM pour l'uranium (U, Z=92)
 * Densité: 19.05 g/cm³
 */
const URANIUM_DATA: MaterialData = {
  name: 'Uranium',
  density: 19.05,
  attenuationData: [
    { energy: 0.010, mu: 87.33, muEn: 78.62 },
    { energy: 0.015, mu: 28.58, muEn: 24.46 },
    { energy: 0.020, mu: 13.63, muEn: 11.23 },
    { energy: 0.030, mu: 4.543, muEn: 3.561 },
    { energy: 0.040, mu: 2.118, muEn: 1.566 },
    { energy: 0.050, mu: 1.239, muEn: 0.8729 },
    { energy: 0.060, mu: 0.8541, muEn: 0.5724 },
    { energy: 0.080, mu: 0.5174, muEn: 0.3216 },
    { energy: 0.100, mu: 0.3773, muEn: 0.2221 },
    { energy: 0.150, mu: 0.2295, muEn: 0.1245 },
    { energy: 0.200, mu: 0.1741, muEn: 0.08645 },
    { energy: 0.300, mu: 0.1320, muEn: 0.05610 },
    { energy: 0.400, mu: 0.1128, muEn: 0.04357 },
    { energy: 0.500, mu: 0.1009, muEn: 0.03671 },
    { energy: 0.600, mu: 0.09254, muEn: 0.03252 },
    { energy: 0.662, mu: 0.08857, muEn: 0.03076 },
    { energy: 0.800, mu: 0.08132, muEn: 0.02782 },
    { energy: 1.000, mu: 0.07515, muEn: 0.02499 },
    { energy: 1.173, mu: 0.07136, muEn: 0.02327 },
    { energy: 1.332, mu: 0.06881, muEn: 0.02213 },
    { energy: 1.500, mu: 0.06657, muEn: 0.02117 },
    { energy: 2.000, mu: 0.06208, muEn: 0.01910 },
    { energy: 3.000, mu: 0.05648, muEn: 0.01645 },
    { energy: 4.000, mu: 0.05337, muEn: 0.01502 },
    { energy: 5.000, mu: 0.05142, muEn: 0.01416 },
    { energy: 6.000, mu: 0.05006, muEn: 0.01358 },
    { energy: 8.000, mu: 0.04825, muEn: 0.01278 },
    { energy: 10.00, mu: 0.04715, muEn: 0.01231 }
  ]
};

/**
 * Données XCOM pour l'air
 * Densité: 0.001205 g/cm³ (au niveau de la mer, 20°C)
 */
const AIR_DATA: MaterialData = {
  name: 'Air',
  density: 0.001205,
  attenuationData: [
    { energy: 0.010, mu: 5.120, muEn: 5.013 },
    { energy: 0.015, mu: 1.614, muEn: 1.560 },
    { energy: 0.020, mu: 0.7779, muEn: 0.7374 },
    { energy: 0.030, mu: 0.2834, muEn: 0.2617 },
    { energy: 0.040, mu: 0.1485, muEn: 0.1337 },
    { energy: 0.050, mu: 0.09393, muEn: 0.08263 },
    { energy: 0.060, mu: 0.06773, muEn: 0.05859 },
    { energy: 0.080, mu: 0.04381, muEn: 0.03722 },
    { energy: 0.100, mu: 0.03279, muEn: 0.02743 },
    { energy: 0.150, mu: 0.02128, muEn: 0.01739 },
    { energy: 0.200, mu: 0.01732, muEn: 0.01393 },
    { energy: 0.300, mu: 0.01372, muEn: 0.01076 },
    { energy: 0.400, mu: 0.01195, muEn: 0.009246 },
    { energy: 0.500, mu: 0.01084, muEn: 0.008339 },
    { energy: 0.600, mu: 0.01007, muEn: 0.007714 },
    { energy: 0.662, mu: 0.009717, muEn: 0.007425 },
    { energy: 0.800, mu: 0.009090, muEn: 0.006932 },
    { energy: 1.000, mu: 0.008471, muEn: 0.006442 },
    { energy: 1.173, mu: 0.008065, muEn: 0.006128 },
    { energy: 1.332, mu: 0.007778, muEn: 0.005906 },
    { energy: 1.500, mu: 0.007516, muEn: 0.005703 },
    { energy: 2.000, mu: 0.006979, muEn: 0.005288 },
    { energy: 3.000, mu: 0.006257, muEn: 0.004730 },
    { energy: 4.000, mu: 0.005839, muEn: 0.004407 },
    { energy: 5.000, mu: 0.005571, muEn: 0.004200 },
    { energy: 6.000, mu: 0.005393, muEn: 0.004056 },
    { energy: 8.000, mu: 0.005184, muEn: 0.003867 },
    { energy: 10.00, mu: 0.005069, muEn: 0.003754 }
  ]
};

/**
 * Données XCOM pour le béton
 * Densité: 2.30 g/cm³ (béton ordinaire)
 */
const CONCRETE_DATA: MaterialData = {
  name: 'Béton',
  density: 2.30,
  attenuationData: [
    { energy: 0.010, mu: 6.042, muEn: 5.916 },
    { energy: 0.015, mu: 1.929, muEn: 1.867 },
    { energy: 0.020, mu: 0.8597, muEn: 0.8175 },
    { energy: 0.030, mu: 0.3052, muEn: 0.2825 },
    { energy: 0.040, mu: 0.1488, muEn: 0.1337 },
    { energy: 0.050, mu: 0.09238, muEn: 0.08116 },
    { energy: 0.060, mu: 0.06554, muEn: 0.05634 },
    { energy: 0.080, mu: 0.04178, muEn: 0.03520 },
    { energy: 0.100, mu: 0.03069, muEn: 0.02543 },
    { energy: 0.150, mu: 0.01967, muEn: 0.01595 },
    { energy: 0.200, mu: 0.01596, muEn: 0.01271 },
    { energy: 0.300, mu: 0.01260, muEn: 0.009823 },
    { energy: 0.400, mu: 0.01096, muEn: 0.008442 },
    { energy: 0.500, mu: 0.009942, muEn: 0.007610 },
    { energy: 0.600, mu: 0.009239, muEn: 0.007052 },
    { energy: 0.662, mu: 0.008917, muEn: 0.006790 },
    { energy: 0.800, mu: 0.008337, muEn: 0.006343 },
    { energy: 1.000, mu: 0.007767, muEn: 0.005897 },
    { energy: 1.173, mu: 0.007395, muEn: 0.005613 },
    { energy: 1.332, mu: 0.007132, muEn: 0.005412 },
    { energy: 1.500, mu: 0.006890, muEn: 0.005225 },
    { energy: 2.000, mu: 0.006401, muEn: 0.004849 },
    { energy: 3.000, mu: 0.005741, muEn: 0.004337 },
    { energy: 4.000, mu: 0.005357, muEn: 0.004039 },
    { energy: 5.000, mu: 0.005113, muEn: 0.003851 },
    { energy: 6.000, mu: 0.004951, muEn: 0.003722 },
    { energy: 8.000, mu: 0.004760, muEn: 0.003545 },
    { energy: 10.00, mu: 0.004655, muEn: 0.003440 }
  ]
};

/**
 * Données XCOM pour l'eau (H2O)
 * Densité: 1.00 g/cm³
 */
const WATER_DATA: MaterialData = {
  name: 'Eau',
  density: 1.00,
  attenuationData: [
    { energy: 0.010, mu: 5.329, muEn: 5.211 },
    { energy: 0.015, mu: 1.673, muEn: 1.614 },
    { energy: 0.020, mu: 0.8096, muEn: 0.7672 },
    { energy: 0.030, mu: 0.2956, muEn: 0.2729 },
    { energy: 0.040, mu: 0.1525, muEn: 0.1372 },
    { energy: 0.050, mu: 0.09552, muEn: 0.08398 },
    { energy: 0.060, mu: 0.06865, muEn: 0.05937 },
    { energy: 0.080, mu: 0.04453, muEn: 0.03779 },
    { energy: 0.100, mu: 0.03321, muEn: 0.02778 },
    { energy: 0.150, mu: 0.02148, muEn: 0.01755 },
    { energy: 0.200, mu: 0.01752, muEn: 0.01409 },
    { energy: 0.300, mu: 0.01386, muEn: 0.01088 },
    { energy: 0.400, mu: 0.01206, muEn: 0.009344 },
    { energy: 0.500, mu: 0.01093, muEn: 0.008418 },
    { energy: 0.600, mu: 0.01015, muEn: 0.007791 },
    { energy: 0.662, mu: 0.009788, muEn: 0.007501 },
    { energy: 0.800, mu: 0.009150, muEn: 0.007002 },
    { energy: 1.000, mu: 0.008522, muEn: 0.006507 },
    { energy: 1.173, mu: 0.008112, muEn: 0.006192 },
    { energy: 1.332, mu: 0.007823, muEn: 0.005969 },
    { energy: 1.500, mu: 0.007558, muEn: 0.005764 },
    { energy: 2.000, mu: 0.007013, muEn: 0.005345 },
    { energy: 3.000, mu: 0.006281, muEn: 0.004783 },
    { energy: 4.000, mu: 0.005858, muEn: 0.004456 },
    { energy: 5.000, mu: 0.005588, muEn: 0.004247 },
    { energy: 6.000, mu: 0.005408, muEn: 0.004101 },
    { energy: 8.000, mu: 0.005196, muEn: 0.003909 },
    { energy: 10.00, mu: 0.005080, muEn: 0.003795 }
  ]
};

/**
 * Map de tous les matériaux disponibles
 */
export const MATERIALS: Record<ShieldMaterial, MaterialData> = {
  lead: LEAD_DATA,
  steel: STEEL_DATA,
  aluminum: ALUMINUM_DATA,
  uranium: URANIUM_DATA,
  air: AIR_DATA,
  concrete: CONCRETE_DATA,
  water: WATER_DATA
};

/**
 * Interpolation linéaire des coefficients d'atténuation
 */
export function interpolateAttenuation(
  material: MaterialData,
  energy: number
): { mu: number; muEn: number } {
  const data = material.attenuationData;

  // Si l'énergie est hors limites, utiliser les valeurs extrêmes
  if (energy <= data[0].energy) {
    return { mu: data[0].mu * material.density, muEn: data[0].muEn * material.density };
  }
  if (energy >= data[data.length - 1].energy) {
    const last = data[data.length - 1];
    return { mu: last.mu * material.density, muEn: last.muEn * material.density };
  }

  // Trouver les points d'encadrement
  let i = 0;
  while (i < data.length - 1 && data[i + 1].energy < energy) {
    i++;
  }

  const e1 = data[i].energy;
  const e2 = data[i + 1].energy;
  const mu1 = data[i].mu;
  const mu2 = data[i + 1].mu;
  const muEn1 = data[i].muEn;
  const muEn2 = data[i + 1].muEn;

  // Interpolation logarithmique (plus précise pour les coefficients d'atténuation)
  const logE = Math.log(energy);
  const logE1 = Math.log(e1);
  const logE2 = Math.log(e2);
  const logMu1 = Math.log(mu1);
  const logMu2 = Math.log(mu2);
  const logMuEn1 = Math.log(muEn1);
  const logMuEn2 = Math.log(muEn2);

  const t = (logE - logE1) / (logE2 - logE1);
  const logMu = logMu1 + t * (logMu2 - logMu1);
  const logMuEn = logMuEn1 + t * (logMuEn2 - logMuEn1);

  return {
    mu: Math.exp(logMu) * material.density,
    muEn: Math.exp(logMuEn) * material.density
  };
}

/**
 * Données pour le tissu mammaire ICRU-44 (utilisé pour calcul de dose)
 * Source: NIST XCOM Database - Breast Tissue (ICRU-44)
 * URL: https://physics.nist.gov/PhysRefData/XrayMassCoef/ComTab/breast.html
 * Densité: 1.020 g/cm³
 *
 * Coefficients µ/ρ et µen/ρ en cm²/g (données massiques NIST)
 * Valeurs interpolées pour 0.662, 1.173, 1.332 MeV
 */
export const ICRU_TISSUE: MaterialData = {
  name: 'Tissu mammaire ICRU-44',
  density: 1.020,
  attenuationData: [
    { energy: 0.010, mu: 4.295, muEn: 3.937 },
    { energy: 0.015, mu: 1.378, muEn: 1.094 },
    { energy: 0.020, mu: 0.6889, muEn: 0.4394 },
    { energy: 0.030, mu: 0.3403, muEn: 0.1260 },
    { energy: 0.040, mu: 0.2530, muEn: 0.05792 },
    { energy: 0.050, mu: 0.2186, muEn: 0.03666 },
    { energy: 0.060, mu: 0.2006, muEn: 0.02881 },
    { energy: 0.080, mu: 0.1808, muEn: 0.02470 },
    { energy: 0.100, mu: 0.1688, muEn: 0.02478 },
    { energy: 0.150, mu: 0.1493, muEn: 0.02734 },
    { energy: 0.200, mu: 0.1361, muEn: 0.02945 },
    { energy: 0.300, mu: 0.1179, muEn: 0.03173 },
    { energy: 0.400, mu: 0.1055, muEn: 0.03260 },
    { energy: 0.500, mu: 0.09631, muEn: 0.03281 },
    { energy: 0.600, mu: 0.08904, muEn: 0.03266 },
    { energy: 0.662, mu: 0.08508, muEn: 0.03242 },  // Interpolé Cs-137
    { energy: 0.800, mu: 0.07820, muEn: 0.03188 },
    { energy: 1.000, mu: 0.07031, muEn: 0.03086 },
    { energy: 1.173, mu: 0.06498, muEn: 0.02993 },  // Interpolé Co-60
    { energy: 1.332, mu: 0.06158, muEn: 0.02926 },  // Interpolé Co-60
    { energy: 1.500, mu: 0.05721, muEn: 0.02818 },
    { energy: 2.000, mu: 0.04910, muEn: 0.02592 },
    { energy: 3.000, mu: 0.03937, muEn: 0.02264 },
    { energy: 4.000, mu: 0.03369, muEn: 0.02045 },
    { energy: 5.000, mu: 0.02995, muEn: 0.01891 },
    { energy: 6.000, mu: 0.02731, muEn: 0.01779 },
    { energy: 8.000, mu: 0.02384, muEn: 0.01626 },
    { energy: 10.00, mu: 0.02169, muEn: 0.01529 }
  ]
};

/**
 * Obtient le coefficient d'atténuation linéaire pour un matériau à une énergie donnée
 */
export function getAttenuationCoefficient(material: ShieldMaterial, energy: number): number {
  const materialData = MATERIALS[material];
  const { mu } = interpolateAttenuation(materialData, energy);
  return mu;
}
