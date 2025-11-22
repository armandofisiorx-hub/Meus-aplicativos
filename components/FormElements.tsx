import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  colSpan?: string;
}

export const Input: React.FC<InputProps> = ({ label, colSpan = '', className = '', ...props }) => (
  <div className={`${colSpan} flex flex-col`}>
    {label && <label className="mb-1 text-xs font-semibold text-slate-600 uppercase tracking-wider">{label}</label>}
    <input
      className={`border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${className}`}
      {...props}
    />
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: string[];
  colSpan?: string;
}

export const Select: React.FC<SelectProps> = ({ label, options, colSpan = '', className = '', ...props }) => (
  <div className={`${colSpan} flex flex-col`}>
    {label && <label className="mb-1 text-xs font-semibold text-slate-600 uppercase tracking-wider">{label}</label>}
    <select
      className={`border border-slate-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${className}`}
      {...props}
    >
      {options.map(opt => (
        <option key={opt} value={opt === '--' ? '' : opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <div className="col-span-full flex items-center gap-4 my-4">
    <h3 className="text-primary-700 font-bold text-lg whitespace-nowrap">{title}</h3>
    <div className="h-px bg-slate-200 w-full"></div>
  </div>
);

export const Checkbox: React.FC<{ label: string; name: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ label, name, checked, onChange }) => (
  <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded transition-colors border border-transparent hover:border-slate-200">
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
    />
    <span className="text-sm text-slate-700">{label}</span>
  </label>
);