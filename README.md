# Calculateur de Dose Gamma

Application web en TypeScript pour calculer les débits de dose des rayonnements gamma avec prise en compte de l'atténuation et du facteur de build-up.

## Caractéristiques

### Types de sources
- **Énergie directe** : mono-énergétique ou spectre multi-énergétique
- **Radionucléides** : Cs-137, Co-60, Am-241, Ag-110m, Ir-192, I-131, Ba-133, Na-22

### Paramètres
- Distance source-détecteur (mètres)
- Écrans optionnels avec différents matériaux :
  - Plomb
  - Acier
  - Aluminium
  - Uranium
  - Air
  - Béton
  - Eau

### Physique
- **Coefficients d'atténuation** : Base de données XCOM (NIST)
- **Facteurs de build-up** : Formule de Taylor selon ANSI/ANS-6.4.3
- **Calculs en double précision** : Gestion des nombres très grands et très petits
- **Interpolation logarithmique** : Précision maximale pour les coefficients d'atténuation

## Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Compiler pour la production
npm run build
```

## Utilisation

1. **Choisir le type de source** :
   - Énergie directe : entrer l'énergie (MeV) et le nombre de photons/seconde
   - Radionucléide : sélectionner l'isotope et entrer l'activité (Bq)

2. **Définir la distance** : distance entre la source et le point de calcul (mètres)

3. **Configurer l'écran (optionnel)** :
   - Activer l'écran
   - Choisir le matériau
   - Définir l'épaisseur (cm)

4. **Calculer** : cliquer sur le bouton de calcul pour obtenir les résultats

## Formules physiques

### Flux de photons
```
Φ = S / (4πr²)
```
où :
- Φ = flux de photons (photons/cm²/s)
- S = taux d'émission (photons/s)
- r = distance (cm)

### Atténuation avec build-up
```
T = B(E, μx) × exp(-μx)
```
où :
- T = facteur de transmission
- B = facteur de build-up (formule de Taylor)
- μ = coefficient d'atténuation linéaire (cm⁻¹)
- x = épaisseur du matériau (cm)

### Débit de dose
```
Ḋ = Φ × E × (μₑₙ/ρ) × facteur_conversion
```
où :
- Ḋ = débit de dose (µSv/h)
- E = énergie du photon (MeV)
- μₑₙ/ρ = coefficient d'absorption d'énergie massique (cm²/g)

## Structure du projet

```
dosecalc/
├── src/
│   ├── types.ts              # Définitions TypeScript
│   ├── calculator.ts         # Moteur de calcul
│   ├── main.ts              # Interface utilisateur
│   └── data/
│       ├── radionuclides.ts # Base de radionucléides
│       ├── xcom.ts          # Coefficients XCOM
│       └── buildup.ts       # Facteurs de build-up
├── index.html               # Interface web
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Références

- **XCOM** : https://www.nist.gov/pml/xcom-photon-cross-sections-database
- **ANSI/ANS-6.4.3** : Gamma-Ray Attenuation Coefficients and Buildup Factors
- **IAEA** : Radionuclide data
- **NNDC** : National Nuclear Data Center

## Avertissement

Cet outil est destiné à des fins éducatives et de planification préliminaire. Pour des applications de radioprotection réelles, utilisez des outils certifiés et consultez des experts en radioprotection.

## Licence

MIT
