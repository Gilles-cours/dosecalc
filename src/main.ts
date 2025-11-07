/**
 * Point d'entrée principal de l'application
 */

import {
  CalculationParams,
  Source,
  EnergySource,
  RadionuclideSource,
  Shield,
  GammaLine
} from './types';
import { calculateDose, formatDoseRate, formatNumber } from './calculator';
import { MATERIALS } from './data/xcom';

/**
 * Gestion de l'interface utilisateur
 */
class DoseCalculatorUI {
  private form: HTMLFormElement;
  private resultsDiv: HTMLElement;
  private resultsContent: HTMLElement;

  constructor() {
    this.form = document.getElementById('doseForm') as HTMLFormElement;
    this.resultsDiv = document.getElementById('results') as HTMLElement;
    this.resultsContent = document.getElementById('resultsContent') as HTMLElement;

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Toggle source type
    const sourceTypeRadios = document.querySelectorAll('input[name="sourceType"]');
    sourceTypeRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        this.toggleSourceType(target.value);
      });
    });

    // Toggle energy type
    const energyTypeSelect = document.getElementById('energyType') as HTMLSelectElement;
    energyTypeSelect?.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      this.toggleEnergyType(target.value);
    });

    // Toggle shield
    const useShieldCheckbox = document.getElementById('useShield') as HTMLInputElement;
    useShieldCheckbox?.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      this.toggleShield(target.checked);
    });

    // Form submission
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.calculate();
    });
  }

  private toggleSourceType(type: string): void {
    const energyInputs = document.getElementById('energyInputs');
    const radionuclideInputs = document.getElementById('radionuclideInputs');

    if (type === 'energy') {
      energyInputs?.classList.add('active');
      radionuclideInputs?.classList.remove('active');
    } else {
      energyInputs?.classList.remove('active');
      radionuclideInputs?.classList.add('active');
    }
  }

  private toggleEnergyType(type: string): void {
    const monoEnergy = document.getElementById('monoEnergy');
    const multiEnergy = document.getElementById('multiEnergy');

    if (type === 'mono') {
      monoEnergy?.classList.add('active');
      multiEnergy?.classList.remove('active');
    } else {
      monoEnergy?.classList.remove('active');
      multiEnergy?.classList.add('active');
    }
  }

  private toggleShield(enabled: boolean): void {
    const shieldInputs = document.getElementById('shieldInputs');

    if (enabled) {
      shieldInputs?.classList.add('active');
    } else {
      shieldInputs?.classList.remove('active');
    }
  }

  private getFormData(): CalculationParams {
    const formData = new FormData(this.form);
    const sourceType = formData.get('sourceType') as string;

    // Parse source
    let source: Source;

    if (sourceType === 'energy') {
      const energyType = (document.getElementById('energyType') as HTMLSelectElement).value;
      const photonRate = parseFloat((document.getElementById('photonRate') as HTMLInputElement).value);

      let energies: GammaLine[];

      if (energyType === 'mono') {
        const energy = parseFloat((document.getElementById('singleEnergy') as HTMLInputElement).value);
        energies = [{ energy, intensity: 1.0 }];
      } else {
        const energyListText = (document.getElementById('energyList') as HTMLTextAreaElement).value;
        energies = energyListText
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .map(line => {
            const [energyStr, intensityStr] = line.split(',').map(s => s.trim());
            return {
              energy: parseFloat(energyStr),
              intensity: parseFloat(intensityStr || '1.0')
            };
          });
      }

      source = {
        type: 'energy',
        energies,
        photonRate
      } as EnergySource;
    } else {
      const radionuclide = (document.getElementById('radionuclide') as HTMLSelectElement).value;
      const activity = parseFloat((document.getElementById('activity') as HTMLInputElement).value);

      source = {
        type: 'radionuclide',
        radionuclide,
        activity
      } as RadionuclideSource;
    }

    // Parse distance
    const distance = parseFloat((document.getElementById('distance') as HTMLInputElement).value);

    // Parse shield
    let shield: Shield | undefined;
    const useShield = (document.getElementById('useShield') as HTMLInputElement).checked;

    if (useShield) {
      const material = (document.getElementById('shieldMaterial') as HTMLSelectElement).value;
      const thickness = parseFloat((document.getElementById('shieldThickness') as HTMLInputElement).value);

      shield = {
        material: material as any,
        thickness
      };
    }

    return {
      source,
      distance,
      shield
    };
  }

  private calculate(): void {
    try {
      const params = this.getFormData();
      const results = calculateDose(params);

      this.displayResults(results);
    } catch (error) {
      alert(`Erreur de calcul: ${error}`);
      console.error(error);
    }
  }

  private displayResults(results: any): void {
    let html = '';

    // Résultats principaux
    html += `
      <div class="result-item">
        <div class="result-label">📍 Distance</div>
        <div class="result-value">${formatNumber(results.distance)} <span class="unit">m</span></div>
      </div>
    `;

    html += `
      <div class="result-item">
        <div class="result-label">☢️ Débit de dose sans écran</div>
        <div class="result-value">${formatDoseRate(results.totalDoseRateUnshielded)}</div>
      </div>
    `;

    if (results.totalDoseRateShielded !== undefined) {
      const material = MATERIALS[results.shield.material];
      html += `
        <div class="result-item">
          <div class="result-label">🛡️ Écran: ${material.name} (${formatNumber(results.shield.thickness)} cm)</div>
          <div class="result-value">${formatDoseRate(results.totalDoseRateShielded)}</div>
        </div>
      `;

      html += `
        <div class="result-item">
          <div class="result-label">📉 Facteur d'atténuation total</div>
          <div class="result-value">${formatNumber(results.totalAttenuationFactor * 100)} <span class="unit">%</span></div>
        </div>
      `;

      const reductionFactor = 1 / results.totalAttenuationFactor;
      html += `
        <div class="result-item">
          <div class="result-label">🔻 Facteur de réduction</div>
          <div class="result-value">÷ ${formatNumber(reductionFactor)}</div>
        </div>
      `;
    }

    // Détails par énergie
    if (results.energyResults.length > 1) {
      html += `
        <div class="result-item">
          <div class="result-label">📊 Détails par énergie</div>
          <div style="margin-top: 15px;">
      `;

      results.energyResults.forEach((er: any) => {
        const percentage = (er.doseRateUnshielded / results.totalDoseRateUnshielded) * 100;
        html += `
          <div style="background: rgba(255,255,255,0.15); padding: 10px; margin-bottom: 10px; border-radius: 5px;">
            <div style="font-weight: 600;">${formatNumber(er.energy)} MeV</div>
            <div style="font-size: 0.9em;">
              Sans écran: ${formatDoseRate(er.doseRateUnshielded)} (${formatNumber(percentage)}%)
            </div>
        `;

        if (er.doseRateShielded !== undefined) {
          html += `
            <div style="font-size: 0.9em;">
              Avec écran: ${formatDoseRate(er.doseRateShielded)}
            </div>
            <div style="font-size: 0.9em;">
              Build-up: ${formatNumber(er.buildUpFactor)}
            </div>
          `;
        }

        html += `</div>`;
      });

      html += `</div></div>`;
    }

    this.resultsContent.innerHTML = html;
    this.resultsDiv.classList.add('show');

    // Scroll vers les résultats
    this.resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// Initialiser l'application
document.addEventListener('DOMContentLoaded', () => {
  new DoseCalculatorUI();
});
