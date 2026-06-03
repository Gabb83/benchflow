import { Cenario, CenarioId } from "../types/benchmark";

interface CenariosListProps {
  cenarios: Cenario[];
  cenarioAtivo: CenarioId;
  setCenarioAtivo: (id: CenarioId) => void;
  isRodando: boolean;
}

export default function CenariosList({ 
  cenarios, cenarioAtivo, setCenarioAtivo, isRodando 
}: CenariosListProps) {
  return (
    <div className="flex-1 border border-[#1e2939] rounded-2xl p-4 bg-[#12151b] text-white shadow-sm flex flex-col gap-6 justify-between">
      <div className="flex flex-col gap-6">
        <h2 className="text-center font-bold uppercase tracking-wider text-xs text-gray-400">CENÁRIOS EXPERIMENTAIS</h2>
        <div className="flex flex-col gap-3">
          {cenarios.map((cenario) => {
            const isSelected = cenarioAtivo === cenario.id;
            return (
              <button
                key={cenario.id}
                type="button"
                onClick={() => setCenarioAtivo(cenario.id)}
                className={`w-full rounded-lg p-3 text-left transition-all duration-200 cursor-pointer border ${
                  isSelected 
                    ? 'bg-[#1e2939] border-white text-white shadow-md' 
                    : 'bg-transparent border-transparent text-gray-400 hover:bg-[#1e2939]/30 hover:text-white'
                }`}
              >
                <span className="block font-medium text-sm">{cenario.titulo}</span>
                <span className={`block text-xs mt-0.5 ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>{cenario.subtitulo}</span>
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="border-t border-dashed border-[#1e2939] pt-4 text-xs text-gray-500 space-y-1">
        <p>• Status: <span className="text-gray-300">{isRodando ? (cenarioAtivo === 'dashboard' ? 'Stream Ativo' : 'Processando') : 'Pronto'}</span></p>
        <p>• Telemetria: <span className="text-gray-300">{cenarioAtivo === 'dashboard' ? 'Frequência Real' : 'Estresse Único'}</span></p>
        <div className="border-t border-[#1e2939]/50 pt-4 mt-4">
          <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 text-center">Contexto de Uso</span>
          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-2.5 text-center shadow-inner">
            <p className="text-xs text-emerald-400 font-medium tracking-wide">
              {cenarios.find((c) => c.id === cenarioAtivo)?.contexto || "Sem contexto"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}