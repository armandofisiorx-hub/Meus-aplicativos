
export interface Interventions {
  monitor: boolean;
  oxygen_adjust: boolean;
  incentive_ip: boolean;
  ventilatory_training: boolean;
  bronchial_hygiene: boolean;
  passive_mobilization: boolean;
  active_mobilization: boolean;
  functional_training: boolean;
  positioning: boolean;
  orientation: boolean;
  other: string;
}

export interface PhysioRecord {
  id: string;
  date: string;
  time: string;
  professional: string;
  ward: string;
  // Subjetivo
  consciousness: string;
  collaboration: string;
  complaints: string;
  notes: string;
  // Objetivo - Condição geral
  decubitus: string;
  hemodynamic: string;
  dva: string;
  // Ventilação
  breathing: string;
  oxygen_device: string;
  flow: string;
  spo2: string;
  adjustments: string;
  // Respiratório
  ventilatory_pattern: string;
  expansibility: string;
  effort: string;
  ausc_right: string;
  ausc_left: string;
  secretion: string;
  secretion_criteria: string;
  // Cardiovascular
  perfusion: string;
  extremity_temp: string;
  edema_msd: string;
  edema_mse: string;
  edema_mid: string;
  edema_mie: string;
  // Funcionalidade
  adm_passive: string;
  adm_active: string;
  muscle_force: string;
  force_reason: string;
  ims_score: string;
  // Plano e Intercorrências
  interventions: Interventions;
  intercurrences: string;
  evolution: string;
}

export const EMPTY_RECORD: Omit<PhysioRecord, 'id'> & { id: string | null } = {
  id: null,
  date: '',
  time: '',
  professional: '',
  ward: '',
  consciousness: '',
  collaboration: '',
  complaints: '',
  notes: '',
  decubitus: '',
  hemodynamic: 'Estável',
  dva: 'Não',
  breathing: 'Espontânea',
  oxygen_device: '',
  flow: '',
  spo2: '',
  adjustments: '',
  ventilatory_pattern: '',
  expansibility: 'Simétrica',
  effort: 'Ausente',
  ausc_right: 'MV presente',
  ausc_left: 'MV presente',
  secretion: 'Ausente',
  secretion_criteria: 'Não',
  perfusion: 'Adequada',
  extremity_temp: 'Aquecidas',
  edema_msd: '0',
  edema_mse: '0',
  edema_mid: '0',
  edema_mie: '0',
  adm_passive: 'Preservada',
  adm_active: 'Preservada',
  muscle_force: '',
  force_reason: '',
  ims_score: '--',
  interventions: {
    monitor: false,
    oxygen_adjust: false,
    incentive_ip: false,
    ventilatory_training: false,
    bronchial_hygiene: false,
    passive_mobilization: false,
    active_mobilization: false,
    functional_training: false,
    positioning: false,
    orientation: false,
    other: ''
  },
  intercurrences: 'Não houve',
  evolution: ''
};
