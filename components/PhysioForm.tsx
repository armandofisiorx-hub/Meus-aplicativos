
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
  const [form, setForm] = useState<PhysioRecord>({ ...EMPTY_RECORD, id: null });

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
        <Input 
          label="Nível de Consciência" 
          name="consciousness" 
          list="consciousness-options"
          value={form.consciousness} 
          onChange={handleChange} 
          placeholder="Selecione ou digite..."
        />
        <datalist id="consciousness-options">
          <option value="Alerta" />
          <option value="Responsivo" />
          <option value="Sonolento" />
          <option value="Não responsivo" />
          <option value="RASS -5" />
          <option value="RASS -4" />
          <option value="RASS -3" />
          <option value="RASS -2" />
          <option value="RASS -1" />
          <option value="RASS 0" />
          <option value="RASS +1" />
        </datalist>

        <Select 
          label="Colaboração" 
          name="collaboration" 
          value={form.collaboration} 
          onChange={handleChange} 
          options={['--', 'Boa', 'Parcial', 'Ausente', 'Nada colaborativo']} 
        />
        <Select 
          label="Decúbito Encontrado" 
          name="decubitus" 
          value={form.decubitus} 
          onChange={handleChange} 
          options={['--', 'DD', 'DL D', 'DL E', 'DV', 'Fowler', 'Poltrona']} 
        />
        <Select 
          label="Escala de Dor (EVA)" 
          name="pain_score" 
          value={form.pain_score} 
          onChange={handleChange} 
          options={['--', 'Não avaliado', '0 - Sem Dor', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10 - Pior dor possível']} 
        />

        {/* Sinais Vitais & Cardio */}
        <SectionTitle title="Sinais Vitais & Hemodinâmica" />
        <div className="flex gap-2 col-span-1 md:col-span-2">
            <Input label="FC (bpm)" name="heart_rate" value={form.heart_rate} onChange={handleChange} placeholder="bpm" className="bg-red-50/50 border-red-200 w-full" />
            <Input label="PA (mmHg)" name="blood_pressure" value={form.blood_pressure} onChange={handleChange} placeholder="Ex: 120x80" className="bg-red-50/50 border-red-200 w-full" />
        </div>
        <div className="flex gap-2 col-span-1 md:col-span-2">
            <Select 
              label="Uso de DVA" 
              name="dva" 
              value={form.dva} 
              onChange={handleChange} 
              options={['Não', 'Sim (Noradrenalina)', 'Sim (Dobutamina)', 'Sim (Vasopressina)']} 
              className="w-full"
            />
             <Select 
              label="Perfusão" 
              name="perfusion" 
              value={form.perfusion} 
              onChange={handleChange} 
              options={['Adequada', 'Reduzida', 'Filiforme']} 
              className="w-full"
            />
        </div>

        {/* Ventilação */}
        <SectionTitle title="Suporte Ventilatório" />
        <div className="col-span-1 md:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-4 bg-blue-50/30 p-4 rounded-lg border border-blue-100">
           <Select 
            label="Tipo de Ventilação" 
            name="breathing" 
            value={form.breathing} 
            onChange={handleChange} 
            colSpan="md:col-span-4"
            options={['Espontânea (Ar Ambiente)', 'Espontânea (Cateter Nasal)', 'Espontânea (Máscara)', 'Espontânea (VNI)', 'Ventilação Mecânica (TQT)', 'Ventilação Mecânica (TOT)']} 
          />
          
          {form.breathing.includes('Ventilação Mecânica') || form.breathing.includes('VNI') ? (
            <>
               <Select label="Modo Ventilatório" name="vm_mode" value={form.vm_mode} onChange={handleChange} options={['PCV', 'VCV', 'PSV', 'CPAP', 'SIMV']} />
               <Input label="PEEP (cmH2O)" name="vm_peep" value={form.vm_peep} onChange={handleChange} placeholder="Ex: 5" />
               <Input label="FiO₂ (%)" name="vm_fio2" value={form.vm_fio2} onChange={handleChange} placeholder="Ex: 40" />
               <Input label="FR Programada (ipm)" name="vm_rr_set" value={form.vm_rr_set} onChange={handleChange} placeholder="Ex: 14" />
               
               <Input label="Volume Corrente (Vt)" name="vm_vt" value={form.vm_vt} onChange={handleChange} placeholder="Ex: 450ml" />
               <Input label="Pressão Suporte" name="vm_pressure_support" value={form.vm_pressure_support} onChange={handleChange} placeholder="cmH2O" />
               <Input label="Driving Pressure (ΔP)" name="vm_drive_pressure" value={form.vm_drive_pressure} onChange={handleChange} placeholder="cmH2O" />
               <Input label="Pressão de Platô" name="vm_plateau" value={form.vm_plateau} onChange={handleChange} placeholder="cmH2O" />
            </>
          ) : (
            <>
              <Input label="Dispositivo O₂ (Detalhe)" name="oxygen_device" value={form.oxygen_device} onChange={handleChange} placeholder="Ex: Oclussor, Venturi 50%" />
              <Input label="Fluxo (L/min)" name="flow" value={form.flow} onChange={handleChange} placeholder="L/min" />
              <Input label="SpO₂ (%)" name="spo2" value={form.spo2} onChange={handleChange} placeholder="%" />
              <Input label="FR (ipm)" name="respiratory_rate" value={form.respiratory_rate} onChange={handleChange} placeholder="ipm" />
            </>
          )}
        </div>

        {/* Hemogasometria */}
        <SectionTitle title="Hemogasometria Arterial" />
        <div className="col-span-1 md:col-span-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 bg-emerald-50/30 p-4 rounded-lg border border-emerald-100">
           <Input label="pH" name="gas_ph" value={form.gas_ph} onChange={handleChange} placeholder="7.35-7.45" />
           <Input label="PaO₂" name="gas_pao2" value={form.gas_pao2} onChange={handleChange} placeholder="mmHg" />
           <Input label="PaCO₂" name="gas_paco2" value={form.gas_paco2} onChange={handleChange} placeholder="35-45" />
           <Input label="HCO₃" name="gas_hco3" value={form.gas_hco3} onChange={handleChange} placeholder="22-26" />
           <Input label="BE" name="gas_be" value={form.gas_be} onChange={handleChange} placeholder="+/- 2" />
           <Input label="SatO₂" name="gas_sao2" value={form.gas_sao2} onChange={handleChange} placeholder="%" />
           <Input label="Lactato" name="gas_lactate" value={form.gas_lactate} onChange={handleChange} placeholder="mmol/L" />
           
           <div className="col-span-2 md:col-span-4 lg:col-span-7 mt-2">
             <label className="mb-1 text-xs font-semibold text-emerald-800 uppercase tracking-wider">Interpretação / Resultado</label>
             <select name="gas_result" value={form.gas_result} onChange={handleChange} className="w-full border border-emerald-200 rounded-md px-3 py-2 text-sm bg-white">
                <option value="">-- Selecione o Resultado --</option>
                <option value="Gasometria dentro da normalidade">Dentro da normalidade</option>
                <option value="Acidose Metabólica">Acidose Metabólica</option>
                <option value="Acidose Respiratória">Acidose Respiratória</option>
                <option value="Alcalose Metabólica">Alcalose Metabólica</option>
                <option value="Alcalose Respiratória">Alcalose Respiratória</option>
                <option value="Distúrbio Misto">Distúrbio Misto</option>
                <option value="Hipoxemia">Hipoxemia</option>
                <option value="Hipercapnia">Hipercapnia Permissiva</option>
             </select>
           </div>
        </div>

        {/* Respiratório Físico */}
        <SectionTitle title="Mecânica & Ausculta" />
        <Select 
          label="Padrão Ventilatório" 
          name="ventilatory_pattern" 
          value={form.ventilatory_pattern} 
          onChange={handleChange} 
          options={['--', 'Eupneico', 'Torácico', 'Abdominal', 'Misto', 'Paradoxal', 'Kussmaul', 'Cheyne-Stokes']} 
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
          options={['Ausente', 'Leve', 'Moderado', 'Acentuado', 'Tiragem Intercostal', 'Batimento de Asa de Nariz']} 
        />
        <Select 
          label="Secreção" 
          name="secretion" 
          value={form.secretion} 
          onChange={handleChange} 
          options={['Ausente', 'Escassa (Fluida)', 'Escassa (Espessa)', 'Moderada (Fluida)', 'Moderada (Espessa)', 'Abundante (Fluida)', 'Abundante (Espessa)', 'Purulenta', 'Hemática']} 
        />
        <Select 
          label="Ausculta (Direita)" 
          name="ausc_right" 
          colSpan="md:col-span-2"
          value={form.ausc_right} 
          onChange={handleChange} 
          options={['MV presente', 'Roncos', 'Sibilos', 'MV diminuído', 'Crepitações', 'Estertores']} 
        />
        <Select 
          label="Ausculta (Esquerda)" 
          name="ausc_left" 
          colSpan="md:col-span-2"
          value={form.ausc_left} 
          onChange={handleChange} 
          options={['MV presente', 'Roncos', 'Sibilos', 'MV diminuído', 'Crepitações', 'Estertores']} 
        />

        {/* Edemas */}
        <div className="md:col-span-4 grid grid-cols-4 gap-2 mt-2">
          <Input label="Edema MSD" name="edema_msd" value={form.edema_msd} onChange={handleChange} placeholder="+/4+" />
          <Input label="Edema MSE" name="edema_mse" value={form.edema_mse} onChange={handleChange} placeholder="+/4+" />
          <Input label="Edema MID" name="edema_mid" value={form.edema_mid} onChange={handleChange} placeholder="+/4+" />
          <Input label="Edema MIE" name="edema_mie" value={form.edema_mie} onChange={handleChange} placeholder="+/4+" />
        </div>

        {/* Funcional */}
        <SectionTitle title="Funcionalidade & Mobilidade" />
        <Select 
          label="ADM Passiva" 
          name="adm_passive" 
          value={form.adm_passive} 
          onChange={handleChange} 
          options={['Preservada', 'Reduzida', 'Rigidez']} 
        />
        <Select 
          label="ADM Ativa" 
          name="adm_active" 
          value={form.adm_active} 
          onChange={handleChange} 
          options={['Preservada', 'Reduzida', 'Não realiza']} 
        />
        <Input label="Força Muscular Global" name="muscle_force" value={form.muscle_force} onChange={handleChange} placeholder="Grau 0-5" />
        <Input label="MRC (Score 0-60)" name="mrc_score" value={form.mrc_score} onChange={handleChange} placeholder="Ex: 48" />
        
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
        
        <div className="md:col-span-4 mt-2">
          <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-200">
            <strong>Legenda:</strong> 
            <span className="ml-2"><strong>IMS:</strong> Escala de Mobilidade em UTI (0-10)</span>
            <span className="ml-2">| <strong>MRC:</strong> Medical Research Council Sum Score (0-60)</span>
          </p>
        </div>

        {/* Exames Complementares */}
        <SectionTitle title="Exames Complementares" />
        <div className="md:col-span-4">
          <textarea 
            name="complementary_exams" 
            value={form.complementary_exams} 
            onChange={handleChange} 
            rows={3} 
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            placeholder="Descreva resultados de exames de imagem, laboratoriais ou outros exames relevantes..."
          />
        </div>

        {/* Condutas */}
        <SectionTitle title="Plano Terapêutico & Condutas" />
        <div className="md:col-span-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <Checkbox label="Monitorização cardiorrespiratória" name="interventions.monitor" checked={form.interventions.monitor} onChange={handleChange} />
            <Checkbox label="Ajuste/gerenciamento de O₂/VM" name="interventions.oxygen_adjust" checked={form.interventions.oxygen_adjust} onChange={handleChange} />
            <Checkbox label="Manobras de Reexpansão Pulmonar" name="interventions.incentive_ip" checked={form.interventions.incentive_ip} onChange={handleChange} />
            <Checkbox label="Treino muscular respiratório (TMR)" name="interventions.ventilatory_training" checked={form.interventions.ventilatory_training} onChange={handleChange} />
            <Checkbox label="Higiene brônquica / Aspiração" name="interventions.bronchial_hygiene" checked={form.interventions.bronchial_hygiene} onChange={handleChange} />
            <Checkbox label="Mobilização passiva" name="interventions.passive_mobilization" checked={form.interventions.passive_mobilization} onChange={handleChange} />
            <Checkbox label="Mobilização ativa/assistida" name="interventions.active_mobilization" checked={form.interventions.active_mobilization} onChange={handleChange} />
            <Checkbox label="Treino funcional / Sedestação" name="interventions.functional_training" checked={form.interventions.functional_training} onChange={handleChange} />
            <Checkbox label="Posicionamento no leito" name="interventions.positioning" checked={form.interventions.positioning} onChange={handleChange} />
            <Checkbox label="Orientações ao paciente/família" name="interventions.orientation" checked={form.interventions.orientation} onChange={handleChange} />
          </div>
        </div>
        
        <Input label="Outras Condutas" name="interventions.other" value={form.interventions.other} onChange={handleChange} colSpan="md:col-span-4" />
        
        <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-1 text-xs font-semibold text-slate-600 uppercase tracking-wider">INTERCORRÊNCIAS</label>
            <textarea 
              name="intercurrences" 
              value={form.intercurrences} 
              onChange={handleChange} 
              rows={4} 
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="Houve alguma intercorrência durante o atendimento?"
            />
          </div>
          <div>
            <label className="mb-1 text-xs font-semibold text-slate-600 uppercase tracking-wider">EVOLUÇÃO DO PACIENTE</label>
            <textarea 
              name="evolution" 
              value={form.evolution} 
              onChange={handleChange} 
              rows={4} 
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="Descrição da resposta do paciente ao atendimento e evolução geral..."
            />
          </div>
        </div>

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
