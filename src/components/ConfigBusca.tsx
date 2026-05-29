import { EstruturaId } from "../types/benchmark";

interface ConfigBuscaProps {
  estrutura: EstruturaId; setEstrutura: (e: EstruturaId) => void;
  qtdItens: number; setQtdItens: (v: number) => void;
  operacao: string; setOperacao: (v: string) => void;
  termoBusca: string; setTermoBusca: (v: string) => void;
  iteracoes: number; setIteracoes: (v: number) => void;
  isRodando: boolean; executar: () => void; resetar: () => void;
}

export default function ConfigBusca({ estrutura, setEstrutura, qtdItens, setQtdItens, operacao, setOperacao, termoBusca, setTermoBusca, iteracoes, setIteracoes, isRodando, executar, resetar }: ConfigBuscaProps) {
  const validarNumeros = (valor: string, callback: (v: number) => void) => {
    callback(Number(valor.replace(/\D/g, "")));
  };

  return (
    <div className="space-y-3 animate-[fadeIn_0.2s_ease-out]">
      <div className="space-y-1.5">
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Estrutura de Dados</label>
        <div className="grid grid-cols-2 gap-2">
          {(['array', 'map'] as EstruturaId[]).map((est) => (
            <button 
              key={est} type="button" onClick={() => setEstrutura(est)}
              className={`text-xs font-semibold py-2 px-3 rounded-lg border cursor-pointer capitalize ${estrutura === est ? 'bg-[#1e2939] border-white text-white' : 'bg-transparent border-[#1e2939] text-gray-400'}`}
            >
              {est}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">QTD. DE ITENS NA LISTA</label>
        <input type="text" inputMode="numeric" value={qtdItens} onChange={(e) => validarNumeros(e.target.value, setQtdItens)} className="w-full bg-[#111] border border-[#1e2939] rounded px-3 py-1.5 text-sm font-mono" />
      </div>
      
      <div>
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">OPERAÇÃO</label>
        <select value={operacao} onChange={(e) => setOperacao(e.target.value)} className="w-full bg-[#111] border border-[#1e2939] rounded px-3 py-1.5 text-sm text-white outline-none p-1">
          <option value="Busca">Busca</option>
          <option value="Filtragem">Filtragem</option>
          <option value="Ordenação">Ordenação</option>
        </select>
      </div>

      {(operacao === 'Busca' || operacao === 'Filtragem') && (
        <div className="animate-[fadeIn_0.15s_ease-out]">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Alvo do Teste (Termo)</label>
          <input type="text" value={termoBusca} onChange={(e) => setTermoBusca(e.target.value)} className="w-full bg-[#111] border border-[#1e2939] rounded px-3 py-1.5 text-sm font-mono" />
        </div>
      )}

      <div>
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">ITERAÇÕES</label>
        <input type="text" inputMode="numeric" value={iteracoes} onChange={(e) => validarNumeros(e.target.value, setIteracoes)} className="w-full bg-[#111] border border-[#1e2939] rounded px-3 py-1.5 text-sm font-mono" />
      </div>

      <div className="pt-1 space-y-2">
        <button 
          type="button" 
          disabled={isRodando} 
          onClick={executar} 
          className="w-full flex items-center justify-center gap-2 bg-emerald-950/30 border border-emerald-500/30 hover:bg-emerald-900/50 hover:border-emerald-400 text-emerald-300 hover:text-white text-xs font-bold py-2.5 px-4 rounded-lg shadow-md transition-all duration-200 cursor-pointer active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none group"
        >
          {isRodando ? (
            <>
              <svg 
                className="animate-spin h-3.5 w-3.5 text-emerald-400" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-emerald-400/80 tracking-wide">Processando...</span>
            </>
          ) : (
            <>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-3.5 h-3.5 text-emerald-400 group-hover:text-emerald-300 group-hover:scale-110 transition-transform duration-200"
              >
                <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.972 9.5h6.278a.75.75 0 0 1 .58 1.222l-11 13a.75.75 0 0 1-1.22-.852l2.003-7.12H3.35a.75.75 0 0 1-.58-1.222l11-13a.75.75 0 0 1 .845-.138Z" clipRule="evenodd" />
              </svg>
              <span>Executar Benchmark</span>
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