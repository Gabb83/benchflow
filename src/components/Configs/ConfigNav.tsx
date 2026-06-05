"use client";

import { EstruturaNavegacaoId, OperacaoNavegacaoId } from "../../types/benchmark";

interface ConfigNavProps {
  isRodando: boolean;
  estrutura: EstruturaNavegacaoId;
  setEstrutura: (id: EstruturaNavegacaoId) => void;
  operacao: OperacaoNavegacaoId;
  setOperacao: (id: OperacaoNavegacaoId) => void;
  ramificacao: number;
  setRamificacao: (qtd: number) => void;
  profundidade: number;
  setProfundidade: (nivel: number) => void;
  iteracoes: number;
  setIteracoes: (qtd: number) => void;
  executarBenchmark: () => void;
}

export default function ConfigNav({
  isRodando,
  estrutura,
  setEstrutura,
  operacao,
  setOperacao,
  ramificacao,
  setRamificacao,
  profundidade,
  setProfundidade,
  iteracoes,
  setIteracoes,
  executarBenchmark,
}: ConfigNavProps) {
  
  // Cálculo rápido para mostrar ao desenvolvedor o tamanho da encrenca na UI
  const totalNosAproximado = Math.round(
    (Math.pow(ramificacao, profundidade + 1) - 1) / (ramificacao - 1)
  ) || 0;

  return (
    <div className="flex flex-col gap-5 animate-[fadeIn_0.2s_ease-out]">
      
      {/* SEÇÃO 1: ARQUITETURA DE DADOS */}
      <div className="flex flex-col gap-2">
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
          Estrutura de dados
        </label>
        <div className="grid grid-cols-2 gap-2 bg-[#161b22]/50 p-1 rounded-lg border border-[#1e2939]/40">
          <button
            type="button"
            disabled={isRodando}
            onClick={() => setEstrutura('arvore_recursiva')}
            className={`py-1.5 px-2 text-xs font-medium rounded-md transition-all cursor-pointer ${
              estrutura === 'arvore_recursiva'
                ? 'bg-[#1e2939] text-fuchsia-400 border border-fuchsia-500/20 shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Árvore
          </button>
          <button
            type="button"
            disabled={isRodando}
            onClick={() => setEstrutura('mapa_planificado')}
            className={`py-1.5 px-2 text-xs font-medium rounded-md transition-all cursor-pointer ${
              estrutura === 'mapa_planificado'
                ? 'bg-[#1e2939] text-emerald-400 border border-emerald-500/20 shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Map
          </button>
        </div>
      </div>

      {/* SEÇÃO 2: ALVO DO TESTE */}
      <div className="flex flex-col gap-2">
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
          Operação do Algoritmo
        </label>
        <select
          disabled={isRodando}
          value={operacao}
          onChange={(e) => setOperacao(e.target.value as OperacaoNavegacaoId)}
          className="w-full bg-[#161b22]/80 border border-[#1e2939]/60 rounded-lg py-2 px-3 text-xs text-gray-200 outline-none focus:border-fuchsia-500/50 transition-colors cursor-pointer appearance-none"
        >
          <option value="buscar_breadcrumb">Rastrear Caminho</option>
          <option value="planificar_total">Planificar Árvore</option>
        </select>
      </div>

      {/* SEÇÃO 3: CONTROLADORES GEOMÉTRICOS */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
            Ramificação
          </label>
          <select
            disabled={isRodando}
            value={ramificacao}
            onChange={(e) => setRamificacao(Number(e.target.value))}
            className="w-full bg-[#161b22]/80 border border-[#1e2939]/60 rounded-lg py-2 px-3 text-xs text-gray-200 outline-none focus:border-fuchsia-500/50 transition-colors cursor-pointer"
          >
            <option value={2}>2 Filhos (Binário)</option>
            <option value={3}>3 Filhos</option>
            <option value={4}>4 Filhos</option>
            <option value={5}>5 Filhos</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
            Profundidade
          </label>
          <select
            disabled={isRodando}
            value={profundidade}
            onChange={(e) => setProfundidade(Number(e.target.value))}
            className="w-full bg-[#161b22]/80 border border-[#1e2939]/60 rounded-lg py-2 px-3 text-xs text-gray-200 outline-none focus:border-fuchsia-500/50 transition-colors cursor-pointer"
          >
            <option value={3}>3 Níveis</option>
            <option value={4}>4 Níveis</option>
            <option value={5}>5 Níveis</option>
            <option value={6}>6 Níveis</option>
            <option value={7}>7 Níveis</option>
          </select>
        </div>
      </div>

      {/* SEÇÃO 4: ITERAÇÕES */}
      <div className="flex flex-col gap-2">
       <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
          Volume de Loops
        </label>
        <select
          disabled={isRodando}
          value={iteracoes}
          onChange={(e) => setIteracoes(Number(e.target.value))}
          className="w-full bg-[#161b22]/80 border border-[#1e2939]/60 rounded-lg py-2 px-3 text-xs text-gray-200 outline-none focus:border-fuchsia-500/50 transition-colors cursor-pointer"
        >
          <option value={100}>100 execuções</option>
          <option value={1000}>1.000 execuções</option>
          <option value={5000}>5.000 execuções</option>
        </select>
      </div>

      {/* CARD DE TELEMETRIA PRÉVIA */}
      <div className="bg-[#1a1f29]/30 border border-[#1e2939]/40 p-2 rounded-lg flex items-center justify-between">
        <span className="text-[12px] font-medium">Elementos:</span>
        <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/20 px-2 rounded border border-cyan-500/20">
          {totalNosAproximado.toLocaleString('pt-BR')}
        </span>
      </div>

      <div className="pt-2">
        {/* ACTION BUTTON (Gatilho da CPU) */}
        <button 
          type="button" 
          disabled={isRodando} 
          onClick={executarBenchmark} 
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
              <span className="text-emerald-400/80 tracking-wide">Calculando Árvore...</span>
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
              <span>Estressar Estrutura</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}