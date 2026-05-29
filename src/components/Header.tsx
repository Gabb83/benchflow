"use client";

import type { CenarioId } from "../types/benchmark";

interface HeaderProps {
  cenarioAtivo: CenarioId;
  isRodando: boolean;
  lidarComExecucaoCenario1: () => void;
  iniciarMonitoramento: () => void;
  pararMonitoramento: () => void;
}

export default function Header({
  cenarioAtivo, isRodando, lidarComExecucaoCenario1, iniciarMonitoramento, pararMonitoramento
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
      <div className="flex flex-row items-center justify-between gap-5">
        <button 
          onClick={action} 
          disabled={cenarioAtivo === 'busca' && isRodando}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer text-white ${
            cenarioAtivo === 'dashboard' && isRodando ? 'bg-red-800 hover:bg-red-700' : 'bg-[#1e2939] hover:bg-[#2b3a50]'
          }`}
        >
          {cenarioAtivo === 'dashboard' && isRodando ? 'Parar Stream' : 'Executar'}
        </button>
        <button className="text-sm font-medium hover:text-gray-300 transition-colors">Exportar</button>
        <p className="text-xs bg-[#1e2939]/50 text-gray-400 px-2 py-1 rounded border border-[#1e2939]">MVP v1.0</p>
      </div>
    </header>
  );
}
