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
        <button type="button" disabled={isRodando} onClick={executar} className="w-full bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/60 disabled:opacity-50 text-white text-xs font-semibold py-2 px-4 rounded-lg cursor-pointer">
          {isRodando ? 'Processando...' : 'Executar Benchmark'}
        </button>
        <button type="button" onClick={resetar} className="w-full bg-rose-800/40 border border-rose-500/30 text-white text-xs font-semibold py-2 rounded-lg cursor-pointer">Resetar</button>
      </div>
    </div>
  );
}