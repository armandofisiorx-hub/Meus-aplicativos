
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
  pain_score: string; // Nova: Escala de Dor (EVA)
  // Objetivo - Condição geral
  decubitus: string;
  hemodynamic: string;
  dva: string;
  // Sinais Vitais
  respiratory_rate: string;
  heart_rate: string;
  blood_pressure: string;
  // Ventilação Espontânea
  breathing: string;
  oxygen_device: string;
  flow: string;
  spo2: string;
  adjustments: string;
  // Ventilação Mecânica (Novos)
  vm_mode: string;
  vm_peep: string;
  vm_fio2: string;
  vm_rr_set: string;
  vm_vt: string;
  vm_pressure_support: string;
  vm_drive_pressure: string;
  vm_plateau: string;
  // Hemogasometria Arterial (Novos)
  gas_ph: string;
  gas_pao2: string;
  gas_paco2: string;
  gas_hco3: string;
  gas_be: string;
  gas_sao2: string;
  gas_lactate: string;
  gas_result: string; // Interpretação
  // Respiratório Físico
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
  mrc_score: string; // Nova: MRC Sum Score
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
  pain_score: '',
  decubitus: '',
  hemodynamic: 'Estável',
  dva: 'Não',
  respiratory_rate: '',
  heart_rate: '',
  blood_pressure: '',
  breathing: 'Espontânea',
  oxygen_device: '',
  flow: '',
  spo2: '',
  adjustments: '',
  vm_mode: '',
  vm_peep: '',
  vm_fio2: '',
  vm_rr_set: '',
  vm_vt: '',
  vm_pressure_support: '',
  vm_drive_pressure: '',
  vm_plateau: '',
  gas_ph: '',
  gas_pao2: '',
  gas_paco2: '',
  gas_hco3: '',
  gas_be: '',
  gas_sao2: '',
  gas_lactate: '',
  gas_result: '',
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
  mrc_score: '',
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
