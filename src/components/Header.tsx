"use client";

import type { CenarioId } from "../types/benchmark";

interface HeaderProps {
  cenarioAtivo: CenarioId;
  isRodando: boolean;
  lidarComExecucaoCenario1: () => void;
  iniciarMonitoramento: () => void;
  pararMonitoramento: () => void;
  exportarDados: () => void;
}

export default function Header({
  cenarioAtivo, isRodando, lidarComExecucaoCenario1, iniciarMonitoramento, pararMonitoramento, exportarDados,
}: HeaderProps) {

  const action = () => {
    if (cenarioAtivo === 'busca') lidarComExecucaoCenario1();
    else if (isRodando) pararMonitoramento();
    else iniciarMonitoramento();
  };

  return (
    <header className="bg-[#121212] p-5 flex flex-row items-center justify-between border-b border-[#1e2939]/30">
      <div>
        <h1 className="text-xl font-black tracking-tighter italic">BenchFlow.</h1>
      </div>
      <div className="flex flex-row items-center justify-between gap-4">
        <button 
          onClick={action} 
          disabled={cenarioAtivo === 'busca' && isRodando}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer shadow-md active:scale-95 disabled:opacity-40 disabled:pointer-events-none group ${
            cenarioAtivo === 'dashboard' && isRodando 
              ? 'bg-rose-950/40 border border-rose-500/40 text-rose-200 hover:bg-rose-900/50 hover:border-rose-500 hover:text-white' 
              : 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/60 hover:border-emerald-400 hover:text-white'
          }`}
        >
          {cenarioAtivo === 'dashboard' && isRodando ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-sm h-2 w-2 bg-rose-500"></span>
              </span>
              <span>Parar Stream</span>
            </>
          ) : (
            <>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-3.5 h-3.5 text-emerald-400 group-hover:text-emerald-300 transition-colors"
              >
                <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
              </svg>
              <span>{isRodando ? 'Processando...' : 'Executar'}</span>
            </>
          )}
        </button>
        
        <button 
          onClick={exportarDados}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white bg-[#1a1f29]/40 hover:bg-[#1a1f29]/80 border border-[#1e2939]/60 hover:border-[#3b82f6]/50 rounded-lg shadow-sm transition-all duration-200 cursor-pointer active:scale-95 group"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={2} 
            stroke="currentColor" 
            className="w-4 h-4 text-gray-400 group-hover:text-[#3b82f6] transition-colors duration-200"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          <span>Exportar JSON</span>
        </button>
        
        <div className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono font-medium tracking-wider text-fuchsia-400 bg-fuchsia-950/20 border border-fuchsia-500/30 rounded-md shadow-[0_0_12px_rgba(217,70,239,0.05)] select-none animate-[fadeIn_0.3s_ease-out]">
          <span className="w-1 h-1 rounded-full bg-fuchsia-400 shadow-[0_0_6px_#d946ef]"></span>
          <span>MVP v1.0</span>
        </div>
      </div>
    </header>
  );
}