
import React, { useEffect, useState } from 'react';
import { PhysioRecord, EMPTY_RECORD, Interventions } from '../types';
import { Input, Select, SectionTitle, Checkbox } from './FormElements';
import { SaveIcon, RefreshIcon } from './Icons';

interface PhysioFormProps {
  editingRecord: PhysioRecord | null;
  onSave: (record: PhysioRecord) => void;
  onCancel: () => void;
}

export const PhysioForm: React.FC<PhysioFormProps> = ({ editingRecord, onSave, onCancel }) => {
  const [form, setForm] = useState<PhysioRecord>({ ...EMPTY_RECORD, id: null }); // Ensure ID is initialized

  // When editingRecord changes, populate the form
  useEffect(() => {
    if (editingRecord) {
      setForm(editingRecord);
    } else {
      setForm({ ...EMPTY_RECORD, id: null });
    }
  }, [editingRecord]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const checked = isCheckbox ? (e.target as HTMLInputElement).checked : undefined;

    if (name.startsWith('interventions.')) {
      const key = name.split('.')[1] as keyof Interventions;
      setForm(prev => ({
        ...prev,
        interventions: {
          ...prev.interventions,
          [key]: isCheckbox ? checked : value
        }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const toggleExpansibility = () => {
    setForm(prev => ({
      ...prev,
      expansibility: prev.expansibility === 'Simétrica' ? 'Assimétrica' : 'Simétrica'
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-8 border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          {editingRecord ? 'Editar Evolução' : 'Nova Evolução'}
        </h2>
        <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {editingRecord ? `ID: ${editingRecord.id}` : 'Novo Registro'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Identificação */}
        <Input label="Data" type="date" name="date" value={form.date} onChange={handleChange} required />
        <Input label="Hora" type="time" name="time" value={form.time} onChange={handleChange} required />
        <Input label="Profissional" name="professional" value={form.professional} onChange={handleChange} required placeholder="Nome e Crefito" />
        <Input label="Setor / Leito" name="ward" value={form.ward} onChange={handleChange} required placeholder="Ex: UTI 01 - Leito 05" />

        {/* Subjetivo */}
        <SectionTitle title="Avaliação Neurológica & Geral" />
        <Select 
          label="Nível de Consciência" 
          name="consciousness" 
          value={form.consciousness} 
          onChange={handleChange} 
          options={['--', 'Alerta', 'Responsivo', 'Sonolento', 'Não responsivo']} 
        />
        <Select 
          label="Colaboração" 
          name="collaboration" 
          value={form.collaboration} 
          onChange={handleChange} 
          options={['--', 'Boa', 'Parcial', 'Ausente']} 
        />
        <Select 
          label="Decúbito Encontrado" 
          name="decubitus" 
          value={form.decubitus} 
          onChange={handleChange} 
          options={['--', 'DD', 'DL D', 'DL E', 'DV', 'Outro']} 
        />
        <Select 
          label="Uso de DVA" 
          name="dva" 
          value={form.dva} 
          onChange={handleChange} 
          options={['Não', 'Sim']} 
        />

        {/* Oxigenoterapia */}
        <SectionTitle title="Suporte de Oxigênio" />
        <Input label="Dispositivo de O₂" name="oxygen_device" value={form.oxygen_device} onChange={handleChange} placeholder="Ex: CN, Venturi, TQT" />
        <Input label="Fluxo (L/min)" name="flow" value={form.flow} onChange={handleChange} placeholder="L/min" />
        <Input label="SpO₂ (%)" name="spo2" value={form.spo2} onChange={handleChange} placeholder="%" />
        <Select 
          label="Higiene Brônquica Necessária?" 
          name="secretion_criteria" 
          value={form.secretion_criteria} 
          onChange={handleChange} 
          options={['Não', 'Sim']} 
        />

        {/* Respiratório */}
        <SectionTitle title="Mecânica & Ausculta" />
        <Select 
          label="Padrão Ventilatório" 
          name="ventilatory_pattern" 
          value={form.ventilatory_pattern} 
          onChange={handleChange} 
          options={['--', 'Torácico', 'Abdominal', 'Misto']} 
        />
        <div className="flex flex-col">
          <label className="mb-1 text-xs font-semibold text-slate-600 uppercase tracking-wider">Expansibilidade</label>
          <button 
            type="button" 
            onClick={toggleExpansibility}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border ${form.expansibility === 'Simétrica' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-800 border-amber-200'}`}
          >
            {form.expansibility}
          </button>
        </div>
        <Select 
          label="Esforço Respiratório" 
          name="effort" 
          value={form.effort} 
          onChange={handleChange} 
          options={['Ausente', 'Leve', 'Moderado', 'Acentuado']} 
        />
        <Select 
          label="Secreção" 
          name="secretion" 
          value={form.secretion} 
          onChange={handleChange} 
          options={['Ausente', 'Escassa', 'Moderada', 'Abundante']} 
        />

        <Select 
          label="Ausculta (Direita)" 
          name="ausc_right" 
          colSpan="md:col-span-2"
          value={form.ausc_right} 
          onChange={handleChange} 
          options={['MV presente', 'Roncos', 'Sibilos', 'MV diminuído', 'Crepitações']} 
        />
        <Select 
          label="Ausculta (Esquerda)" 
          name="ausc_left" 
          colSpan="md:col-span-2"
          value={form.ausc_left} 
          onChange={handleChange} 
          options={['MV presente', 'Roncos', 'Sibilos', 'MV diminuído', 'Crepitações']} 
        />

        {/* Cardiovascular */}
        <SectionTitle title="Cardiovascular & Extremidades" />
        <Select 
          label="Perfusão" 
          name="perfusion" 
          value={form.perfusion} 
          onChange={handleChange} 
          options={['Adequada', 'Reduzida']} 
        />
        <Select 
          label="Temp. Extremidades" 
          name="extremity_temp" 
          value={form.extremity_temp} 
          onChange={handleChange} 
          options={['Aquecidas', 'Frias']} 
        />
        <div className="md:col-span-2 grid grid-cols-4 gap-2">
          <Input label="Edema MSD" name="edema_msd" value={form.edema_msd} onChange={handleChange} />
          <Input label="Edema MSE" name="edema_mse" value={form.edema_mse} onChange={handleChange} />
          <Input label="Edema MID" name="edema_mid" value={form.edema_mid} onChange={handleChange} />
          <Input label="Edema MIE" name="edema_mie" value={form.edema_mie} onChange={handleChange} />
        </div>

        {/* Funcional */}
        <SectionTitle title="Funcionalidade" />
        <Select 
          label="ADM Passiva" 
          name="adm_passive" 
          value={form.adm_passive} 
          onChange={handleChange} 
          options={['Preservada', 'Reduzida']} 
        />
        <Select 
          label="ADM Ativa" 
          name="adm_active" 
          value={form.adm_active} 
          onChange={handleChange} 
          options={['Preservada', 'Reduzida']} 
        />
        <Input label="Força Muscular (Grau)" name="muscle_force" value={form.muscle_force} onChange={handleChange} />
        <Input label="Motivo (se não avaliada)" name="force_reason" value={form.force_reason} onChange={handleChange} />
        
        <Select 
          label="Escala IMS (Mobilidade em UTI)" 
          name="ims_score" 
          value={form.ims_score} 
          onChange={handleChange} 
          colSpan="md:col-span-4"
          options={[
            '--',
            '0 - Nada (Passivo)',
            '1 - Sentado no leito',
            '2 - Transf. passiva p/ poltrona',
            '3 - Sentado na beira do leito',
            '4 - Em pé',
            '5 - Transf. leito-poltrona',
            '6 - Marcha no mesmo lugar',
            '7 - Marcha com auxílio (2+ pessoas)',
            '8 - Marcha com auxílio (1 pessoa)',
            '9 - Marcha independente (c/ auxílio)',
            '10 - Marcha independente (s/ auxílio)'
          ]} 
        />

        {/* Condutas */}
        <SectionTitle title="Plano Terapêutico & Condutas" />
        <div className="md:col-span-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <Checkbox label="Monitorização cardiorrespiratória" name="interventions.monitor" checked={form.interventions.monitor} onChange={handleChange} />
            <Checkbox label="Ajuste/gerenciamento de O₂" name="interventions.oxygen_adjust" checked={form.interventions.oxygen_adjust} onChange={handleChange} />
            <Checkbox label="Incentivo à inspiração profunda (IP)" name="interventions.incentive_ip" checked={form.interventions.incentive_ip} onChange={handleChange} />
            <Checkbox label="Treino ventilatório" name="interventions.ventilatory_training" checked={form.interventions.ventilatory_training} onChange={handleChange} />
            <Checkbox label="Higiene brônquica" name="interventions.bronchial_hygiene" checked={form.interventions.bronchial_hygiene} onChange={handleChange} />
            <Checkbox label="Mobilização passiva" name="interventions.passive_mobilization" checked={form.interventions.passive_mobilization} onChange={handleChange} />
            <Checkbox label="Mobilização ativa/assistida" name="interventions.active_mobilization" checked={form.interventions.active_mobilization} onChange={handleChange} />
            <Checkbox label="Treino funcional" name="interventions.functional_training" checked={form.interventions.functional_training} onChange={handleChange} />
            <Checkbox label="Posicionamento no leito" name="interventions.positioning" checked={form.interventions.positioning} onChange={handleChange} />
            <Checkbox label="Orientações ao paciente/família" name="interventions.orientation" checked={form.interventions.orientation} onChange={handleChange} />
          </div>
        </div>
        
        <Input label="Outras Condutas" name="interventions.other" value={form.interventions.other} onChange={handleChange} colSpan="md:col-span-4" />
        
        <div className="md:col-span-4">
          <label className="mb-1 text-xs font-semibold text-slate-600 uppercase tracking-wider">INTERCORRÊNCIAS</label>
          <textarea 
            name="evolution" 
            value={form.evolution} 
            onChange={handleChange} 
            rows={3} 
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            placeholder="Descreva as intercorrências ou observações finais..."
          />
        </div>

        <Select 
          label="Status / Tipo de Intercorrência" 
          name="intercurrences" 
          value={form.intercurrences} 
          onChange={handleChange} 
          options={['Não houve', 'Sim - Bradicardia', 'Sim - Taquicardia', 'Sim - Dessaturação', 'Outra']} 
        />

      </div>

      <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100">
        <button 
          type="button" 
          onClick={onCancel} 
          className="px-6 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
        >
          <RefreshIcon /> Limpar / Cancelar
        </button>
        <button 
          type="submit" 
          className="px-6 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-all flex items-center gap-2"
        >
          <SaveIcon /> {editingRecord ? 'Atualizar Registro' : 'Salvar Evolução'}
        </button>
      </div>
    </form>
  );
};
