import React, { useState } from 'react';
import { PhysioRecord, Interventions } from '../types';
import { PrinterIcon, CloseIcon, DownloadIcon } from './Icons';
import { Logo } from './Logo';

interface PrintLayoutProps {
  records: PhysioRecord[];
  onClose: () => void;
}

export const PrintLayout: React.FC<PrintLayoutProps> = ({ records, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  // Helper to format interventions list
  const getInterventionsList = (i: Interventions) => {
    const active = [];
    if (i.monitor) active.push('monitorização cardiorrespiratória');
    if (i.oxygen_adjust) active.push('ajuste/gerenciamento de O₂');
    if (i.incentive_ip) active.push('incentivo à inspiração profunda');
    if (i.ventilatory_training) active.push('treino ventilatório');
    if (i.bronchial_hygiene) active.push('higiene brônquica');
    if (i.passive_mobilization) active.push('mobilização passiva');
    if (i.active_mobilization) active.push('mobilização ativa/assistida');
    if (i.functional_training) active.push('treino funcional');
    if (i.positioning) active.push('posicionamento no leito');
    if (i.orientation) active.push('orientações ao paciente/família');
    if (i.other) active.push(i.other.toLowerCase());
    return active;
  };

  // Helper to build the narrative paragraph from structured data
  const formatNarrative = (rec: PhysioRecord) => {
    const sentences = [];

    // Mappings for professional terminology
    const collabMap: Record<string, string> = {
        'Boa': 'com boa colaboração',
        'Parcial': 'com colaboração parcial',
        'Ausente': 'sem colaboração ativa',
        '--': ''
    };

    const decubitusMap: Record<string, string> = {
        'DD': 'em decúbito dorsal',
        'DL D': 'em decúbito lateral direito',
        'DL E': 'em decúbito lateral esquerdo',
        'DV': 'em decúbito ventral',
        'Outro': 'em posicionamento atípico',
        '--': 'em posicionamento não informado'
    };
    
    const auscMap: Record<string, string> = {
        'MV presente': 'murmúrio vesicular fisiológico',
        'MV diminuído': 'murmúrio vesicular diminuído',
        'Roncos': 'roncos',
        'Sibilos': 'sibilos',
        'Crepitações': 'crepitações'
    };

    // 1. NEURO / GERAL
    let neuro = `Paciente encontra-se ${rec.consciousness?.toLowerCase() || 'com nível de consciência não informado'}`;
    
    if (rec.collaboration && rec.collaboration !== '--' && rec.collaboration !== '') {
        neuro += `, ${collabMap[rec.collaboration] || rec.collaboration.toLowerCase()}`;
    }
    
    neuro += `, ${decubitusMap[rec.decubitus] || 'posicionamento não informado'}.`;
    
    if (rec.dva === 'Sim') {
        neuro += ' Em uso de drogas vasoativas.';
    }
    sentences.push(neuro);

    // 2. RESPIRATÓRIO
    let resp = `Apresenta ventilação ${rec.breathing?.toLowerCase() || 'espontânea'}`;
    if (rec.oxygen_device) {
        resp += `, via ${rec.oxygen_device}`;
         if (rec.flow) resp += ` a ${rec.flow} L/min`;
    } else {
        resp += " em ar ambiente";
    }
    
    if (rec.spo2) {
         resp += `, mantendo SpO₂ de ${rec.spo2}%.`;
    } else {
        resp += ".";
    }

    const pattern = rec.ventilatory_pattern && rec.ventilatory_pattern !== '--' ? rec.ventilatory_pattern.toLowerCase() : 'não descrito';
    resp += ` Padrão ventilatório ${pattern}, expansibilidade ${rec.expansibility?.toLowerCase()}, esforço respiratório ${rec.effort?.toLowerCase()}.`;
    
    const right = auscMap[rec.ausc_right] || rec.ausc_right?.toLowerCase();
    const left = auscMap[rec.ausc_left] || rec.ausc_left?.toLowerCase();
    resp += ` Ausculta pulmonar com ${right} em hemitórax direito e ${left} em hemitórax esquerdo.`;

    if (rec.secretion && rec.secretion !== 'Ausente') {
        resp += ` Presença de secreção ${rec.secretion.toLowerCase()}`;
        if (rec.secretion_criteria === 'Sim') resp += ' (com critérios para higiene brônquica)';
        resp += '.';
    } else {
         resp += " Vias aéreas livres de secreção.";
    }
    sentences.push(resp);

    // 3. CARDIOVASCULAR
    let cardio = `Hemodinamicamente ${rec.hemodynamic?.toLowerCase() || 'estável'}, com perfusão periférica ${rec.perfusion?.toLowerCase()} e extremidades ${rec.extremity_temp?.toLowerCase()}.`;
    
    const edemas = [];
    if (rec.edema_msd && rec.edema_msd !== '0') edemas.push(`MSD: ${rec.edema_msd}`);
    if (rec.edema_mse && rec.edema_mse !== '0') edemas.push(`MSE: ${rec.edema_mse}`);
    if (rec.edema_mid && rec.edema_mid !== '0') edemas.push(`MID: ${rec.edema_mid}`);
    if (rec.edema_mie && rec.edema_mie !== '0') edemas.push(`MIE: ${rec.edema_mie}`);

    if (edemas.length > 0) {
        cardio += ` Edema observado em: ${edemas.join(', ')}.`;
    } else {
        cardio += " Ausência de edemas em membros.";
    }
    sentences.push(cardio);

    // 4. MOTOR
    let motor = `Do ponto de vista motor, apresenta ADM passiva ${rec.adm_passive?.toLowerCase()} e ativa ${rec.adm_active?.toLowerCase()}.`;
    if (rec.muscle_force) {
         motor += ` Força muscular grau ${rec.muscle_force}`;
         if (rec.force_reason) motor += ` (${rec.force_reason})`;
         motor += '.';
    }
    if (rec.ims_score && rec.ims_score !== '--') {
        motor += ` Avaliação funcional pela escala IMS: ${rec.ims_score}.`;
    }
    sentences.push(motor);

    return sentences.join(' ');
  };

  const formatInterventions = (list: string[]) => {
    if (list.length === 0) return "Nenhuma conduta terapêutica específica foi registrada para este atendimento.";
    
    if (list.length === 1) {
        return `Como conduta terapêutica, foi realizado: ${list[0]}.`;
    }

    const last = list.pop();
    return `O plano terapêutico realizado incluiu: ${list.join(', ')} e ${last}.`;
  };

  const handleDownloadPDF = () => {
    setIsGenerating(true);
    const element = document.getElementById('printable-content');
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const html2pdf = (window as any).html2pdf;

    if (!html2pdf) {
      alert('Erro: Biblioteca de PDF não carregada. Tente recarregar a página.');
      setIsGenerating(false);
      return;
    }

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `Prontuario_Fisioterapia_${new Date().toISOString().slice(0,10)}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css'] }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      setIsGenerating(false);
    }).catch((err: any) => {
      console.error('PDF Generation Error:', err);
      alert('Erro ao gerar PDF.');
      setIsGenerating(false);
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-black p-0 md:p-8 font-sans">
      {/* Toolbar */}
      <div className="fixed top-0 left-0 right-0 bg-slate-900 text-white p-4 flex justify-between items-center shadow-lg print:hidden z-50">
        <div className="font-bold text-lg flex items-center gap-2">
          <PrinterIcon /> Visualização de Impressão / PDF
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <CloseIcon /> Fechar
          </button>
          
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? 'Gerando...' : <><DownloadIcon /> Baixar PDF</>}
          </button>

          <button
            onClick={() => window.print()}
            disabled={isGenerating}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <PrinterIcon /> Imprimir
          </button>
        </div>
      </div>

      {/* Spacer for toolbar */}
      <div className="h-20 print:hidden"></div>

      {/* Printable Content */}
      <div id="printable-content" className="max-w-[210mm] mx-auto bg-white print:max-w-full shadow-xl print:shadow-none min-h-[297mm]">
        
        {/* Header Geral do Relatório */}
        <div className="bg-white p-8 border-b-2 border-slate-800 mb-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Logo className="w-12 h-12 text-slate-900" />
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold uppercase tracking-wide text-slate-900">PhysioFlow</h1>
                <h2 className="text-lg text-slate-600 font-medium">Registro de Evolução Fisioterapêutica</h2>
              </div>
            </div>
            <div className="text-right text-sm text-slate-500">
              <p className="uppercase tracking-wider text-xs font-bold">Emissão</p>
              <p className="font-mono text-slate-900">{new Date().toLocaleDateString()} às {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {records.length === 0 ? (
            <p className="text-center text-slate-500 italic py-10">Nenhum registro selecionado para impressão.</p>
          ) : (
            records.map((rec, index) => {
              const interventionsList = getInterventionsList(rec.interventions);
              const formattedInterventions = formatInterventions([...interventionsList]);
              
              return (
                <div key={rec.id} className={`break-inside-avoid page-break-inside-avoid mb-10 ${index !== records.length - 1 ? 'border-b-2 border-dashed border-slate-200 pb-10' : ''}`}>
                  
                  {/* Cabeçalho do Registro */}
                  <div className="flex justify-between items-center mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <div className="flex gap-6">
                        <div>
                            <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-0.5">Data do Atendimento</p>
                            <p className="font-bold text-lg text-slate-900">{new Date(rec.date + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-0.5">Horário</p>
                            <p className="font-bold text-lg text-slate-900">{rec.time}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-0.5">Localização</p>
                        <p className="font-bold text-lg text-slate-900">{rec.ward}</p>
                    </div>
                  </div>

                  <div className="space-y-6 px-2">
                    {/* Exame Físico Descritivo */}
                    <div>
                        <h4 className="font-bold text-slate-900 text-xs uppercase border-b border-slate-300 mb-3 pb-1 tracking-wider">AVALIAÇÃO</h4>
                        <p className="text-justify text-slate-800 leading-relaxed text-sm">
                            {formatNarrative(rec)}
                        </p>
                    </div>

                    {/* Condutas - Text Format */}
                    <div>
                        <h4 className="font-bold text-slate-900 text-xs uppercase border-b border-slate-300 mb-3 pb-1 tracking-wider">Plano Terapêutico & Condutas</h4>
                        <p className="text-justify text-slate-800 leading-relaxed text-sm">
                            {formattedInterventions}
                        </p>
                    </div>

                    {/* INTERCORRÊNCIAS (Formerly Evolução) */}
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <h4 className="font-bold text-slate-900 text-xs uppercase mb-2 tracking-wider">INTERCORRÊNCIAS</h4>
                        <p className="text-justify text-slate-800 leading-relaxed text-sm whitespace-pre-wrap">
                            {rec.evolution || 'Sem intercorrências descritas.'}
                        </p>
                        {rec.intercurrences !== 'Não houve' && (
                             <div className="mt-3 pt-3 border-t border-red-100 flex items-center gap-2 text-red-700">
                                 <span className="font-bold text-sm">⚠ Status:</span>
                                 <span className="text-sm">{rec.intercurrences}</span>
                             </div>
                        )}
                    </div>

                    {/* Assinatura */}
                    <div className="mt-12 pt-8 border-t border-slate-300 grid grid-cols-3">
                        <div className="col-span-1">
                            <div className="h-px bg-slate-900 mb-2 w-full"></div>
                            <p className="font-bold text-slate-900 text-sm">{rec.professional || 'Fisioterapeuta Responsável'}</p>
                            <p className="text-xs text-slate-500 uppercase tracking-wider">Assinatura / Carimbo</p>
                        </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};