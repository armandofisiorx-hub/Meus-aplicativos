import React, { useState, useEffect, useMemo } from 'react';
import { PhysioForm } from './components/PhysioForm';
import { RecordList } from './components/RecordList';
import { PrintLayout } from './components/PrintLayout';
import { PhysioRecord } from './types';
import { getRecords, saveRecords } from './services/storageService';
import { DownloadIcon, PrinterIcon, TrashIcon, FileTextIcon } from './components/Icons';
import { Logo } from './components/Logo';

export default function App() {
  const [records, setRecords] = useState<PhysioRecord[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  // Load initial data
  useEffect(() => {
    setRecords(getRecords());
  }, []);

  // Persist data on change
  useEffect(() => {
    saveRecords(records);
  }, [records]);

  const handleSave = (formData: PhysioRecord) => {
    const timestamp = new Date();
    const recordToSave = { ...formData };

    // Auto-fill date/time if missing
    if (!recordToSave.date) recordToSave.date = timestamp.toISOString().slice(0, 10);
    if (!recordToSave.time) recordToSave.time = timestamp.toTimeString().slice(0, 5);

    if (editingId) {
      setRecords(prev => prev.map(r => r.id === editingId ? { ...recordToSave, id: editingId } : r));
      setEditingId(null);
    } else {
      const id = 'rec_' + Date.now();
      setRecords(prev => [{ ...recordToSave, id }, ...prev]);
    }
    
    // Scroll to list after save
    window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' });
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Confirma exclusão deste prontuário?')) {
      setRecords(prev => prev.filter(r => r.id !== id));
      if (editingId === id) setEditingId(null);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('ATENÇÃO: Isso apagará TODOS os registros salvos. Continuar?')) {
      setRecords([]);
      setEditingId(null);
    }
  };

  const exportJSON = () => {
    const dataStr = JSON.stringify(records, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `physio_records_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    if (records.length === 0) return alert('Nenhum registro para exportar.');
    
    // Flatten logic for CSV
    const flattenRecord = (r: PhysioRecord) => {
      const { interventions, ...rest } = r;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const interventionCols: any = {};
      Object.keys(interventions).forEach(key => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        interventionCols[`intervention_${key}`] = (interventions as any)[key];
      });
      return { ...rest, ...interventionCols };
    };

    const flattened = records.map(flattenRecord);
    const headers = Object.keys(flattened[0]);
    
    const csvRows = [
      headers.join(','),
      ...flattened.map(row => headers.map(fieldName => 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        JSON.stringify((row as any)[fieldName], (_, v) => v === null || v === undefined ? '' : v)
      ).join(','))
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `physio_records_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const editingRecord = useMemo(() => 
    records.find(r => r.id === editingId) || null, 
  [records, editingId]);

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      if (filter === 'today') return r.date === new Date().toISOString().slice(0, 10);
      return true;
    }).filter(r => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        (r.professional || '').toLowerCase().includes(q) || 
        (r.ward || '').toLowerCase().includes(q) || 
        (r.evolution || '').toLowerCase().includes(q) ||
        (r.id || '').includes(q)
      );
    });
  }, [records, filter, search]);

  if (showPrintPreview) {
    return (
      <PrintLayout 
        records={filteredRecords} 
        onClose={() => setShowPrintPreview(false)} 
      />
    );
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-slate-900 text-white pt-8 pb-16 px-6 shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Logo className="w-10 h-10 text-white" />
              EVOLUÇÃO ELETRONICA v3
            </h1>
            <p className="text-slate-400 mt-1 text-sm">Prontuário Eletrônico de Fisioterapia</p>
          </div>
          <div className="flex gap-2">
            <button onClick={exportCSV} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm font-medium transition-colors flex items-center gap-2">
              <DownloadIcon /> CSV
            </button>
            <button onClick={exportJSON} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm font-medium transition-colors flex items-center gap-2">
              <DownloadIcon /> JSON
            </button>
            <button onClick={() => setShowPrintPreview(true)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm font-medium transition-colors flex items-center gap-2">
              <FileTextIcon /> PDF
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 -mt-8">
        {/* Main Form Area */}
        <PhysioForm 
          editingRecord={editingRecord} 
          onSave={handleSave} 
          onCancel={() => setEditingId(null)} 
        />

        {/* List Area */}
        <section className="mt-12">
          <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6 gap-4">
            <h2 className="text-xl font-bold text-slate-800">Histórico de Evoluções</h2>
            
            <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0">
                <input 
                  type="text" 
                  placeholder="Buscar (Nome, ID, Evolução)..." 
                  className="pl-4 pr-10 py-2 border border-slate-300 rounded-lg text-sm w-full md:w-64 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              
              <select 
                value={filter} 
                onChange={e => setFilter(e.target.value)} 
                className="border border-slate-300 rounded-lg py-2 px-3 text-sm bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
              >
                <option value="all">Todos os períodos</option>
                <option value="today">Apenas Hoje</option>
              </select>

              <button onClick={() => setShowPrintPreview(true)} className="p-2 bg-white border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50" title="Imprimir (Visualização)">
                <PrinterIcon />
              </button>
              
              {records.length > 0 && (
                <button onClick={handleClearAll} className="p-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50" title="Apagar tudo">
                  <TrashIcon />
                </button>
              )}
            </div>
          </div>

          <div className="bg-slate-100 p-1 rounded-2xl">
             <RecordList 
               records={filteredRecords} 
               onEdit={handleEdit} 
               onDelete={handleDelete} 
             />
          </div>
          
          <div className="text-center mt-6 text-slate-400 text-sm">
            Mostrando {filteredRecords.length} de {records.length} registros. Os dados são salvos localmente no navegador.
          </div>
        </section>
      </main>
    </div>
  );
}