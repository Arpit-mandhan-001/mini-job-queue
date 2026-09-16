import React from 'react';
import { Layers } from 'lucide-react';

interface HeaderProps {
  onOpenCreateModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCreateModal }) => {
  return (
    <header className="bg-surface-card border-b border-surface-border sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-md bg-brand-primary flex items-center justify-center text-white font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-dark tracking-tight">Mini Job Queue</h1>
            <p className="text-xs text-slate-subtle">SaaS Dashboard & Status Manager</p>
          </div>
        </div>
        <button
          onClick={onOpenCreateModal}
          className="inline-flex items-center justify-center px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white text-sm font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
        >
          + Create Job
        </button>
      </div>
    </header>
  );
};
