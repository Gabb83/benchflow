import { EstruturaDashboardId } from "../../types/benchmark";

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
              className={`cursor-pointer text-[11px] font-semibold py-2 px-1 rounded-lg border disabled:opacity-40 capitalize ${estruturaDashboard === est ? 'bg-[#1e2939] border-white text-white' : 'bg-transparent border-[#1e2939] text-gray-400'}`}
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
          type="button" 
          onClick={isRodando ? parar : iniciar} 
          className={`w-full flex items-center justify-center gap-2 border text-xs font-bold py-2.5 px-4 rounded-lg shadow-md transition-all duration-200 cursor-pointer active:scale-[0.98] group ${
            isRodando 
              ? 'bg-rose-955/20 border-rose-500/30 text-rose-300 hover:bg-rose-900/40 hover:border-rose-400 hover:text-white' 
              : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/50 hover:border-emerald-400 hover:text-white'
          }`}
        >
          {isRodando ? (
            <>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={2.5} 
                stroke="currentColor" 
                className="w-4 h-4 text-rose-400 animate-pulse"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.342 10.421a1.5 1.5 0 0 1 2.227 0l2.227 2.227a1.5 1.5 0 0 0 2.227 0M10.5 21V3m0 18a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm0-14a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z" />
              </svg>
              <span className="tracking-wide">Parar Monitoramento</span>
            </>
          ) : (
            <>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={2.5} 
                stroke="currentColor" 
                className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.6-5.84 5.96 5.96m-5.96-5.96V4.38A14.92 14.92 0 0 1 9.63 8.42Z" />
              </svg>
              <span>Iniciar Stream de Dados</span>
            </>
          )}
        </button>
        
        <button 
          type="button" 
          onClick={resetar} 
          className="w-full flex items-center justify-center gap-2 bg-rose-950/20 border border-rose-500/30 hover:bg-rose-900/40 hover:border-rose-500/60 text-rose-200 hover:text-white text-xs font-semibold py-2 px-4 rounded-lg shadow-sm transition-all duration-200 cursor-pointer active:scale-[0.98] group"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={2.5} 
            stroke="currentColor" 
            className="w-3.5 h-3.5 text-rose-400/80 group-hover:text-rose-400 group-hover:rotate-45 transition-transform duration-300 ease-out"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          <span>Resetar</span>
        </button>
      </div>
    </div>
  );
}