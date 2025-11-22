import React from 'react';
import { PhysioRecord } from '../types';
import { EditIcon, TrashIcon, FileTextIcon } from './Icons';

interface RecordListProps {
  records: PhysioRecord[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const RecordList: React.FC<RecordListProps> = ({ records, onEdit, onDelete }) => {
  if (records.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
        <div className="text-slate-400 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
        </div>
        <p className="text-slate-500">Nenhum prontuário registrado ainda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {records.map((rec) => (
        <div key={rec.id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow p-5 flex flex-col md:flex-row gap-4 justify-between items-start group">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-primary-50 text-primary-700 text-xs font-bold px-2.5 py-1 rounded border border-primary-100 flex items-center gap-1">
                <FileTextIcon /> {rec.date.split('-').reverse().join('/')} às {rec.time}
              </span>
              <span className="text-slate-500 text-sm">ID: <span className="font-mono">{rec.id?.slice(-6)}</span></span>
              {rec.intercurrences !== 'Não houve' && (
                <span className="bg-red-50 text-red-700 text-xs font-bold px-2 py-1 rounded border border-red-100">
                  Intercorrência
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-700 mb-3">
              <p><strong className="text-slate-900">Profissional:</strong> {rec.professional}</p>
              <p><strong className="text-slate-900">Leito:</strong> {rec.ward}</p>
              <p><strong className="text-slate-900">O₂:</strong> {rec.oxygen_device} {rec.flow ? `(${rec.flow} L/min)` : ''}</p>
              <p><strong className="text-slate-900">SpO₂:</strong> {rec.spo2 || '-'}%</p>
            </div>

            <div className="text-slate-600 text-sm bg-slate-50 p-3 rounded border border-slate-100">
              <p className="line-clamp-2 italic">
                {rec.evolution || "Sem descrição detalhada da evolução."}
              </p>
            </div>
          </div>

          <div className="flex md:flex-col gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => onEdit(rec.id!)}
              className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg border border-transparent hover:border-primary-100 transition-all"
              title="Editar"
            >
              <EditIcon />
            </button>
            <button 
              onClick={() => onDelete(rec.id!)}
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-all"
              title="Excluir"
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};