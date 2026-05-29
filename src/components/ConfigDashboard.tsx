import { EstruturaDashboardId } from "../types/benchmark";

interface ConfigDashboardProps {
  frequenciaMs: number; setFrequenciaMs: (v: number) => void;
  estruturaDashboard: EstruturaDashboardId; setEstruturaDashboard: (e: EstruturaDashboardId) => void;
  volumeAtualizacao: number; setVolumeAtualizacao: (v: number) => void;
  tamanhoBuffer: number; setTamanhoBuffer: (v: number) => void;
  isRodando: boolean; iniciar: () => void; parar: () => void;
  resetar: () => void;
}

export default function ConfigDashboard({ 
  frequenciaMs, setFrequenciaMs, estruturaDashboard, setEstruturaDashboard, volumeAtualizacao, setVolumeAtualizacao, tamanhoBuffer, setTamanhoBuffer, isRodando, iniciar, parar, resetar
}: ConfigDashboardProps) {
  const validarNumeros = (valor: string, callback: (v: number) => void) => {
    callback(Number(valor.replace(/\D/g, "")));
  };

  return (
    <div className="space-y-3 animate-[fadeIn_0.2s_ease-out]">
      <div>
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">INTERVALO DE ATUALIZAÇÃO</label>
        <select value={frequenciaMs} onChange={(e) => setFrequenciaMs(Number(e.target.value))} disabled={isRodando} className="w-full bg-[#111] border border-[#1e2939] rounded px-3 py-1.5 text-sm text-white outline-none disabled:opacity-40 p-1">
          <option value={50}>50ms (Tempo Real)</option>
          <option value={100}>100ms</option>
          <option value={500}>500ms (Padrão)</option>
          <option value={1000}>1000ms</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Estrutura do Painel</label>
        <div className="grid grid-cols-3 gap-1.5">
          {(['array', 'map', 'fila'] as EstruturaDashboardId[]).map((est) => (
            <button 
              key={est} type="button" disabled={isRodando} onClick={() => setEstruturaDashboard(est)}
              className={`text-[11px] font-semibold py-2 px-1 rounded-lg border disabled:opacity-40 capitalize ${estruturaDashboard === est ? 'bg-[#1e2939] border-white text-white' : 'bg-transparent border-[#1e2939] text-gray-400'}`}
            >
              {est}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">VOLUME DE ATUALIZAÇÃO (RAJADA)</label>
        <input type="text" inputMode="numeric" disabled={isRodando} value={volumeAtualizacao} onChange={(e) => validarNumeros(e.target.value, setVolumeAtualizacao)} className="w-full bg-[#111] border border-[#1e2939] rounded px-3 py-1.5 text-sm font-mono disabled:opacity-40" />
      </div>

      <div>
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">TAMANHO DO BUFFER (MÁX ITENS)</label>
        <input type="text" inputMode="numeric" disabled={isRodando} value={tamanhoBuffer} onChange={(e) => validarNumeros(e.target.value, setTamanhoBuffer)} className="w-full bg-[#111] border border-[#1e2939] rounded px-3 py-1.5 text-sm font-mono disabled:opacity-40" />
      </div>

      <div className="pt-2 space-y-2">
        <button 
          type="button" onClick={isRodando ? parar : iniciar} 
          className={`w-full border text-white text-xs font-semibold py-2 px-4 rounded-lg cursor-pointer transition-colors ${isRodando ? 'bg-red-950/40 border-red-500/30 hover:bg-red-900/50' : 'bg-emerald-950/40 border-emerald-500/30 hover:bg-emerald-900/60'}`}
        >
          {isRodando ? 'Parar Monitoramento' : 'Iniciar Stream de Dados'}
        </button>
        <button
          type="reset"
          onClick={resetar}
          className="w-full bg-rose-800/40 border border-rose-500/30 text-white text-xs font-semibold py-2 rounded-lg cursor-pointer"
        >
          Resetar
        </button>
      </div>
    </div>
  );
}