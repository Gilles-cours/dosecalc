/**
 * Facteurs de build-up pour différents matériaux
 *
 * Le facteur de build-up (B) prend en compte la diffusion des photons dans le matériau.
 * Il corrige la simple atténuation exponentielle pour donner une estimation plus précise.
 *
 * Formule de Taylor: B(E, μx) = 1 + α(E) * (μx) * e^(β(E) * μx)
 * où μx est le nombre de libre parcours moyens (mean free paths)
 *
 * Source: ANSI/ANS-6.4.3 standards
 */

import { ShieldMaterial } from '../types';

/**
 * Paramètres de la formule de Taylor pour le build-up
 */
interface BuildUpParams {
  energy: number;  // MeV
  alpha: number;   // Paramètre α
  beta: number;    // Paramètre β
}

/**
 * Données de build-up pour le plomb (Pb)
 */
const LEAD_BUILDUP: BuildUpParams[] = [
  { energy: 0.015, alpha: 0.850, beta: 0.075 },
  { energy: 0.020, alpha: 1.200, beta: 0.085 },
  { energy: 0.030, alpha: 1.800, beta: 0.095 },
  { energy: 0.040, alpha: 2.200, beta: 0.100 },
  { energy: 0.050, alpha: 2.400, beta: 0.105 },
  { energy: 0.060, alpha: 2.500, beta: 0.110 },
  { energy: 0.080, alpha: 2.350, beta: 0.115 },
  { energy: 0.100, alpha: 2.100, beta: 0.118 },
  { energy: 0.150, alpha: 1.600, beta: 0.120 },
  { energy: 0.200, alpha: 1.300, beta: 0.118 },
  { energy: 0.300, alpha: 0.900, beta: 0.112 },
  { energy: 0.400, alpha: 0.700, beta: 0.105 },
  { energy: 0.500, alpha: 0.600, beta: 0.098 },
  { energy: 0.600, alpha: 0.530, beta: 0.092 },
  { energy: 0.662, alpha: 0.500, beta: 0.089 },
  { energy: 0.800, alpha: 0.450, beta: 0.085 },
  { energy: 1.000, alpha: 0.400, beta: 0.078 },
  { energy: 1.173, alpha: 0.370, beta: 0.074 },
  { energy: 1.332, alpha: 0.350, beta: 0.071 },
  { energy: 1.500, alpha: 0.330, beta: 0.068 },
  { energy: 2.000, alpha: 0.280, beta: 0.060 },
  { energy: 3.000, alpha: 0.220, beta: 0.048 },
  { energy: 4.000, alpha: 0.180, beta: 0.040 },
  { energy: 5.000, alpha: 0.150, beta: 0.035 },
  { energy: 6.000, alpha: 0.130, beta: 0.030 },
  { energy: 8.000, alpha: 0.100, beta: 0.022 },
  { energy: 10.00, alpha: 0.080, beta: 0.018 }
];

/**
 * Données de build-up pour l'acier/fer (Fe)
 */
const STEEL_BUILDUP: BuildUpParams[] = [
  { energy: 0.015, alpha: 1.100, beta: 0.090 },
  { energy: 0.020, alpha: 1.650, beta: 0.105 },
  { energy: 0.030, alpha: 2.500, beta: 0.120 },
  { energy: 0.040, alpha: 3.100, beta: 0.130 },
  { energy: 0.050, alpha: 3.400, beta: 0.135 },
  { energy: 0.060, alpha: 3.500, beta: 0.138 },
  { energy: 0.080, alpha: 3.300, beta: 0.140 },
  { energy: 0.100, alpha: 2.950, beta: 0.140 },
  { energy: 0.150, alpha: 2.250, beta: 0.138 },
  { energy: 0.200, alpha: 1.850, beta: 0.133 },
  { energy: 0.300, alpha: 1.350, beta: 0.123 },
  { energy: 0.400, alpha: 1.050, beta: 0.113 },
  { energy: 0.500, alpha: 0.880, beta: 0.105 },
  { energy: 0.600, alpha: 0.770, beta: 0.098 },
  { energy: 0.662, alpha: 0.720, beta: 0.095 },
  { energy: 0.800, alpha: 0.650, beta: 0.089 },
  { energy: 1.000, alpha: 0.570, beta: 0.082 },
  { energy: 1.173, alpha: 0.525, beta: 0.078 },
  { energy: 1.332, alpha: 0.495, beta: 0.075 },
  { energy: 1.500, alpha: 0.465, beta: 0.071 },
  { energy: 2.000, alpha: 0.400, beta: 0.062 },
  { energy: 3.000, alpha: 0.310, beta: 0.049 },
  { energy: 4.000, alpha: 0.255, beta: 0.041 },
  { energy: 5.000, alpha: 0.218, beta: 0.036 },
  { energy: 6.000, alpha: 0.190, beta: 0.031 },
  { energy: 8.000, alpha: 0.150, beta: 0.024 },
  { energy: 10.00, alpha: 0.125, beta: 0.019 }
];

/**
 * Données de build-up pour l'aluminium (Al)
 */
const ALUMINUM_BUILDUP: BuildUpParams[] = [
  { energy: 0.015, alpha: 1.250, beta: 0.095 },
  { energy: 0.020, alpha: 1.900, beta: 0.110 },
  { energy: 0.030, alpha: 2.850, beta: 0.128 },
  { energy: 0.040, alpha: 3.550, beta: 0.138 },
  { energy: 0.050, alpha: 3.900, beta: 0.143 },
  { energy: 0.060, alpha: 4.050, beta: 0.146 },
  { energy: 0.080, alpha: 3.850, beta: 0.148 },
  { energy: 0.100, alpha: 3.450, beta: 0.147 },
  { energy: 0.150, alpha: 2.650, beta: 0.143 },
  { energy: 0.200, alpha: 2.180, beta: 0.137 },
  { energy: 0.300, alpha: 1.600, beta: 0.127 },
  { energy: 0.400, alpha: 1.250, beta: 0.117 },
  { energy: 0.500, alpha: 1.050, beta: 0.108 },
  { energy: 0.600, alpha: 0.920, beta: 0.101 },
  { energy: 0.662, alpha: 0.860, beta: 0.098 },
  { energy: 0.800, alpha: 0.780, beta: 0.092 },
  { energy: 1.000, alpha: 0.685, beta: 0.085 },
  { energy: 1.173, alpha: 0.630, beta: 0.080 },
  { energy: 1.332, alpha: 0.595, beta: 0.077 },
  { energy: 1.500, alpha: 0.560, beta: 0.074 },
  { energy: 2.000, alpha: 0.480, beta: 0.064 },
  { energy: 3.000, alpha: 0.375, beta: 0.051 },
  { energy: 4.000, alpha: 0.310, beta: 0.042 },
  { energy: 5.000, alpha: 0.265, beta: 0.037 },
  { energy: 6.000, alpha: 0.230, beta: 0.032 },
  { energy: 8.000, alpha: 0.182, beta: 0.025 },
  { energy: 10.00, alpha: 0.152, beta: 0.020 }
];

/**
 * Données de build-up pour l'uranium (U)
 */
const URANIUM_BUILDUP: BuildUpParams[] = [
  { energy: 0.015, alpha: 0.750, beta: 0.070 },
  { energy: 0.020, alpha: 1.050, beta: 0.080 },
  { energy: 0.030, alpha: 1.600, beta: 0.090 },
  { energy: 0.040, alpha: 1.950, beta: 0.095 },
  { energy: 0.050, alpha: 2.100, beta: 0.100 },
  { energy: 0.060, alpha: 2.150, beta: 0.103 },
  { energy: 0.080, alpha: 2.000, beta: 0.108 },
  { energy: 0.100, alpha: 1.800, beta: 0.110 },
  { energy: 0.150, alpha: 1.350, beta: 0.112 },
  { energy: 0.200, alpha: 1.100, beta: 0.110 },
  { energy: 0.300, alpha: 0.750, beta: 0.105 },
  { energy: 0.400, alpha: 0.580, beta: 0.098 },
  { energy: 0.500, alpha: 0.490, beta: 0.092 },
  { energy: 0.600, alpha: 0.430, beta: 0.086 },
  { energy: 0.662, alpha: 0.400, beta: 0.083 },
  { energy: 0.800, alpha: 0.360, beta: 0.079 },
  { energy: 1.000, alpha: 0.320, beta: 0.073 },
  { energy: 1.173, alpha: 0.295, beta: 0.069 },
  { energy: 1.332, alpha: 0.280, beta: 0.066 },
  { energy: 1.500, alpha: 0.265, beta: 0.063 },
  { energy: 2.000, alpha: 0.225, beta: 0.056 },
  { energy: 3.000, alpha: 0.175, beta: 0.045 },
  { energy: 4.000, alpha: 0.145, beta: 0.037 },
  { energy: 5.000, alpha: 0.122, beta: 0.032 },
  { energy: 6.000, alpha: 0.105, beta: 0.028 },
  { energy: 8.000, alpha: 0.082, beta: 0.020 },
  { energy: 10.00, alpha: 0.065, beta: 0.016 }
];

/**
 * Données de build-up pour l'air
 */
const AIR_BUILDUP: BuildUpParams[] = [
  { energy: 0.015, alpha: 1.500, beta: 0.105 },
  { energy: 0.020, alpha: 2.300, beta: 0.120 },
  { energy: 0.030, alpha: 3.450, beta: 0.140 },
  { energy: 0.040, alpha: 4.300, beta: 0.152 },
  { energy: 0.050, alpha: 4.750, beta: 0.158 },
  { energy: 0.060, alpha: 4.950, beta: 0.161 },
  { energy: 0.080, alpha: 4.700, beta: 0.163 },
  { energy: 0.100, alpha: 4.200, beta: 0.162 },
  { energy: 0.150, alpha: 3.250, beta: 0.156 },
  { energy: 0.200, alpha: 2.680, beta: 0.149 },
  { energy: 0.300, alpha: 1.975, beta: 0.137 },
  { energy: 0.400, alpha: 1.550, beta: 0.126 },
  { energy: 0.500, alpha: 1.300, beta: 0.117 },
  { energy: 0.600, alpha: 1.140, beta: 0.109 },
  { energy: 0.662, alpha: 1.070, beta: 0.105 },
  { energy: 0.800, alpha: 0.970, beta: 0.099 },
  { energy: 1.000, alpha: 0.850, beta: 0.091 },
  { energy: 1.173, alpha: 0.785, beta: 0.086 },
  { energy: 1.332, alpha: 0.740, beta: 0.083 },
  { energy: 1.500, alpha: 0.695, beta: 0.079 },
  { energy: 2.000, alpha: 0.600, beta: 0.069 },
  { energy: 3.000, alpha: 0.470, beta: 0.055 },
  { energy: 4.000, alpha: 0.390, beta: 0.045 },
  { energy: 5.000, alpha: 0.333, beta: 0.039 },
  { energy: 6.000, alpha: 0.290, beta: 0.034 },
  { energy: 8.000, alpha: 0.230, beta: 0.027 },
  { energy: 10.00, alpha: 0.192, beta: 0.021 }
];

/**
 * Données de build-up pour le béton
 */
const CONCRETE_BUILDUP: BuildUpParams[] = [
  { energy: 0.015, alpha: 1.350, beta: 0.100 },
  { energy: 0.020, alpha: 2.050, beta: 0.115 },
  { energy: 0.030, alpha: 3.100, beta: 0.133 },
  { energy: 0.040, alpha: 3.850, beta: 0.143 },
  { energy: 0.050, alpha: 4.250, beta: 0.148 },
  { energy: 0.060, alpha: 4.400, beta: 0.151 },
  { energy: 0.080, alpha: 4.200, beta: 0.153 },
  { energy: 0.100, alpha: 3.750, beta: 0.152 },
  { energy: 0.150, alpha: 2.900, beta: 0.147 },
  { energy: 0.200, alpha: 2.380, beta: 0.141 },
  { energy: 0.300, alpha: 1.750, beta: 0.131 },
  { energy: 0.400, alpha: 1.370, beta: 0.121 },
  { energy: 0.500, alpha: 1.150, beta: 0.112 },
  { energy: 0.600, alpha: 1.010, beta: 0.105 },
  { energy: 0.662, alpha: 0.945, beta: 0.101 },
  { energy: 0.800, alpha: 0.855, beta: 0.095 },
  { energy: 1.000, alpha: 0.750, beta: 0.088 },
  { energy: 1.173, alpha: 0.690, beta: 0.083 },
  { energy: 1.332, alpha: 0.652, beta: 0.080 },
  { energy: 1.500, alpha: 0.615, beta: 0.076 },
  { energy: 2.000, alpha: 0.530, beta: 0.066 },
  { energy: 3.000, alpha: 0.415, beta: 0.053 },
  { energy: 4.000, alpha: 0.343, beta: 0.044 },
  { energy: 5.000, alpha: 0.293, beta: 0.038 },
  { energy: 6.000, alpha: 0.255, beta: 0.033 },
  { energy: 8.000, alpha: 0.202, beta: 0.026 },
  { energy: 10.00, alpha: 0.169, beta: 0.021 }
];

/**
 * Données de build-up pour l'eau
 */
const WATER_BUILDUP: BuildUpParams[] = [
  { energy: 0.015, alpha: 1.450, beta: 0.103 },
  { energy: 0.020, alpha: 2.200, beta: 0.118 },
  { energy: 0.030, alpha: 3.300, beta: 0.137 },
  { energy: 0.040, alpha: 4.100, beta: 0.148 },
  { energy: 0.050, alpha: 4.500, beta: 0.154 },
  { energy: 0.060, alpha: 4.700, beta: 0.157 },
  { energy: 0.080, alpha: 4.450, beta: 0.159 },
  { energy: 0.100, alpha: 3.980, beta: 0.158 },
  { energy: 0.150, alpha: 3.075, beta: 0.152 },
  { energy: 0.200, alpha: 2.530, beta: 0.145 },
  { energy: 0.300, alpha: 1.862, beta: 0.134 },
  { energy: 0.400, alpha: 1.460, beta: 0.123 },
  { energy: 0.500, alpha: 1.225, beta: 0.114 },
  { energy: 0.600, alpha: 1.075, beta: 0.107 },
  { energy: 0.662, alpha: 1.008, beta: 0.103 },
  { energy: 0.800, alpha: 0.913, beta: 0.097 },
  { energy: 1.000, alpha: 0.800, beta: 0.089 },
  { energy: 1.173, alpha: 0.738, beta: 0.085 },
  { energy: 1.332, alpha: 0.696, beta: 0.081 },
  { energy: 1.500, alpha: 0.655, beta: 0.078 },
  { energy: 2.000, alpha: 0.565, beta: 0.068 },
  { energy: 3.000, alpha: 0.443, beta: 0.054 },
  { energy: 4.000, alpha: 0.367, beta: 0.045 },
  { energy: 5.000, alpha: 0.313, beta: 0.039 },
  { energy: 6.000, alpha: 0.273, beta: 0.034 },
  { energy: 8.000, alpha: 0.217, beta: 0.027 },
  { energy: 10.00, alpha: 0.181, beta: 0.022 }
];

/**
 * Map de toutes les données de build-up par matériau
 */
const BUILDUP_DATA: Record<ShieldMaterial, BuildUpParams[]> = {
  lead: LEAD_BUILDUP,
  steel: STEEL_BUILDUP,
  aluminum: ALUMINUM_BUILDUP,
  uranium: URANIUM_BUILDUP,
  air: AIR_BUILDUP,
  concrete: CONCRETE_BUILDUP,
  water: WATER_BUILDUP
};

/**
 * Interpolation linéaire des paramètres de build-up
 */
function interpolateBuildUpParams(data: BuildUpParams[], energy: number): BuildUpParams {
  // Si l'énergie est hors limites, utiliser les valeurs extrêmes
  if (energy <= data[0].energy) {
    return data[0];
  }
  if (energy >= data[data.length - 1].energy) {
    return data[data.length - 1];
  }

  // Trouver les points d'encadrement
  let i = 0;
  while (i < data.length - 1 && data[i + 1].energy < energy) {
    i++;
  }

  const e1 = data[i].energy;
  const e2 = data[i + 1].energy;
  const alpha1 = data[i].alpha;
  const alpha2 = data[i + 1].alpha;
  const beta1 = data[i].beta;
  const beta2 = data[i + 1].beta;

  // Interpolation logarithmique pour l'énergie
  const logE = Math.log(energy);
  const logE1 = Math.log(e1);
  const logE2 = Math.log(e2);
  const t = (logE - logE1) / (logE2 - logE1);

  return {
    energy,
    alpha: alpha1 + t * (alpha2 - alpha1),
    beta: beta1 + t * (beta2 - beta1)
  };
}

/**
 * Calcule le facteur de build-up selon la formule de Taylor
 * B(E, μx) = 1 + α(E) * (μx) * e^(β(E) * μx)
 *
 * @param material - Le matériau
 * @param energy - L'énergie du photon en MeV
 * @param mfp - Nombre de libre parcours moyens (μ * x)
 * @returns Le facteur de build-up
 */
export function calculateBuildUpFactor(
  material: ShieldMaterial,
  energy: number,
  mfp: number
): number {
  const data = BUILDUP_DATA[material];
  const params = interpolateBuildUpParams(data, energy);

  // Formule de Taylor
  const buildUp = 1.0 + params.alpha * mfp * Math.exp(params.beta * mfp);

  return buildUp;
}
