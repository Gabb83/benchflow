"use client";

import { Registro } from "@/src/utils/generateData";
import { CenarioId } from "../types/benchmark";

interface PainelResultadosProps {
  cenarioAtivo: CenarioId;
  isRodando: boolean;
  dadosGerados: any[];
  tempoExecucao: number | null;
  memoriaConsumida: number | null;
  fps: number;
  qtdItens: number;
  
  // Cenário 1
  estrutura: string;
  operacao: string;
  iteracoes: number;
  
  // Cenário 2
  estruturaDashboard: string;
  tamanhoBuffer: number;
  volumeAtualizacao: number;

  // Cenário 3
  estruturaNav: string;
  operacaoNav: string;
  iteracoesNav: number;
  profundidade: number;
  pilhaProfundidade?: number | null;
}

export default function PainelResultados({
  cenarioAtivo,
  isRodando,
  dadosGerados,
  tempoExecucao,
  memoriaConsumida,
  fps,
  qtdItens,
  estrutura,
  operacao,
  iteracoes,
  estruturaDashboard,
  tamanhoBuffer,
  volumeAtualizacao,
  estruturaNav,
  operacaoNav,
  iteracoesNav,
  profundidade,
  pilhaProfundidade
}: PainelResultadosProps) {

  // 1. Título dinâmico
  const obterTitulo = () => {
    if (cenarioAtivo === 'busca') return `Simulador de ${operacao}`;
    if (cenarioAtivo === 'dashboard') return 'Monitor de Atualização de Dashboard';
    return operacaoNav === 'buscar_breadcrumb' 
      ? 'Rastreador de Hierarquia (Breadcrumb)' 
      : 'Planificador de Estrutura de Árvore (Flatten)';
  };

  // 2. Cores e nomes das estruturas ativas
  const obterEstruturaAtiva = () => {
    if (cenarioAtivo === 'busca') return { nome: estrutura, cor: 'text-fuchsia-400' };
    if (cenarioAtivo === 'dashboard') return { nome: estruturaDashboard, cor: 'text-fuchsia-400' };
    return {
      nome: estruturaNav === 'arvore_recursiva' ? 'Árvore Recursiva' : 'Mapa Plano O(1)',
      cor: estruturaNav === 'arvore_recursiva' ? 'text-fuchsia-400' : 'text-emerald-400'
    };
  };

  const estruturaMeta = obterEstruturaAtiva();

  // Condicional de Loading RESTRITA aos cenários síncronos/pesados (1 e 3)
  // O Cenário 2 (Dashboard) ignora o spinner para não travar a UI no stream contínuo
  const deveMostrarLoading = isRodando && cenarioAtivo !== 'dashboard';

  return (
    <section className="col-span-8 border border-[#1e2939] bg-[#12151b] rounded-2xl p-6 flex flex-col justify-between">
      <div className="flex flex-col h-full justify-between">
        <div>
          <h1 className="text-xl font-semibold mb-2">
            {obterTitulo()}{' '}em{' '}
            <span className={`capitalize ${estruturaMeta.cor}`}>{estruturaMeta.nome}</span>
          </h1>
          <p className="text-gray-400 text-sm">
            {cenarioAtivo === 'busca' && 'Mapeamento de performance baseado em dados estruturados estáticos.'}
            {cenarioAtivo === 'dashboard' && 'Mapeamento de mutação e ingestão de streams de dados em tempo real.'}
            {cenarioAtivo === 'navegacao' && 'Análise de travessia, busca em profundidade e algoritmos de indexação em árvores lógicas.'}
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-center min-h-95">
          {deveMostrarLoading ? (
            <div className="border border-[#1e2939] rounded-xl bg-[#111] p-4 h-95 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-fuchsia-500/20 border-t-fuchsia-500 rounded-full animate-spin"></div>
              <p className="text-gray-500 text-xs tracking-wider animate-pulse">
                {cenarioAtivo === 'navegacao' ? 'Percorrendo caminhos e empilhando contextos na CPU...' : 'Processando buffers e estruturas...'}
              </p>
            </div>
          ) : dadosGerados.length === 0 ? (
            <div className="border border-[#1e2939] rounded-xl bg-[#111] p-4 h-95 flex items-center justify-center text-gray-600 italic">
              [Aguardando execução para renderizar dados amostrais]
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* GRID DE MÉTRICAS ADAPTATIVO */}
              <div className="grid grid-cols-5 gap-2.5">
                <div className="bg-[#111] border border-[#1e2939] p-3 rounded-xl text-center">
                  <p className="text-[9px] text-gray-500 font-bold uppercase mb-1">
                    {cenarioAtivo === 'dashboard' ? 'Latência Ingestão' : 'Tempo Total'}
                  </p>
                  <p className="text-sm font-mono text-fuchsia-400">
                    {tempoExecucao !== null ? `${tempoExecucao.toFixed(2)} ms` : '0.00 ms'}
                  </p>
                </div>

                <div className="bg-[#111] border border-[#1e2939] p-3 rounded-xl text-center">
                  <p className="text-[9px] text-gray-500 font-bold uppercase mb-1">
                    {cenarioAtivo === 'dashboard' ? 'Estabilidade UI' : 'Tempo Médio'}
                  </p>
                  <p className={`text-sm font-mono ${cenarioAtivo === 'dashboard' && fps < 45 ? 'text-red-400' : 'text-purple-400'}`}>
                    {cenarioAtivo === 'dashboard' && `${fps} FPS`}
                    {cenarioAtivo === 'busca' && (tempoExecucao !== null && iteracoes > 0 ? `${(tempoExecucao / iteracoes).toFixed(4)} ms` : '0.0000 ms')}
                    {cenarioAtivo === 'navegacao' && (tempoExecucao !== null && iteracoesNav > 0 ? `${(tempoExecucao / iteracoesNav).toFixed(4)} ms` : '0.0000 ms')}
                  </p>
                </div>

                <div className="bg-[#111] border border-[#1e2939] p-3 rounded-xl text-center">
                  <p className="text-[9px] text-gray-500 font-bold uppercase mb-1">
                    {cenarioAtivo === 'navegacao' ? 'Pilha CallStack' : 'Tamanho Buffer'}
                  </p>
                  <p className="text-sm font-mono text-emerald-400">
                    {cenarioAtivo === 'dashboard' && tamanhoBuffer.toLocaleString()}
                    {cenarioAtivo === 'busca' && dadosGerados.length.toLocaleString()}
                    {cenarioAtivo === 'navegacao' && `${pilhaProfundidade ?? profundidade} marcos`}
                  </p>
                </div>

                <div className="bg-[#111] border border-[#1e2939] p-3 rounded-xl text-center">
                  <p className="text-[9px] text-gray-500 font-bold uppercase mb-1">RAM Gasta</p>
                  <p className="text-sm font-mono text-teal-400">
                    {memoriaConsumida !== null ? `${memoriaConsumida} MB` : 'N/A'}
                  </p>
                </div>

                <div className="bg-[#111] border border-[#1e2939] p-3 rounded-xl text-center">
                  <p className="text-[9px] text-gray-500 font-bold uppercase mb-1">Complexidade</p>
                  <p className="text-sm font-mono text-blue-400">
                    {cenarioAtivo === 'dashboard' && `${Intl.NumberFormat('en-US', { notation: 'compact' }).format(volumeAtualizacao)} / s`}
                    {cenarioAtivo === 'busca' && `${Intl.NumberFormat('en-US', { notation: 'compact' }).format(qtdItens * iteracoes)} ops`}
                    {cenarioAtivo === 'navegacao' && `${Intl.NumberFormat('en-US', { notation: 'compact' }).format(iteracoesNav)} loops`}
                  </p>
                </div>
              </div>

              {/* ÁREA DE PREVIEW DE DADOS AMOSTRAIS */}
              <div className="border border-[#1e2939] rounded-xl bg-[#111] p-4 h-60 overflow-y-auto font-mono text-xs text-gray-400">
                
                {/* AMOSTRAGEM PARA OS CENÁRIOS 1 E 2 */}
                {cenarioAtivo !== 'navegacao' && (
                  <div className="space-y-1">
                    <p className="text-gray-500 border-b border-[#1e2939] pb-1 mb-2">
                      {cenarioAtivo === 'dashboard' ? '// Stream ativo: Últimas modificações no buffer (FIFO):' : '// Primeiros elementos gerados no array:'}
                    </p>
                    {dadosGerados.map((item: Registro, index: number) => (
                      <div key={`${item.idx}-${index}`} className="flex gap-4 hover:bg-[#12151b] p-1 rounded transition-colors">
                        <span className="text-blue-500">idx: {item.idx}</span>
                        <span className="text-white">{item.nome}</span>
                        <span className="text-amber-500">{item.categoria}</span>
                        <span className="text-emerald-500">
                          R$ {item.preco !== undefined && item.preco !== null ? item.preco.toFixed(2) : '0.00'}
                        </span>
                        {cenarioAtivo === 'dashboard' && <span className="text-xs text-gray-600 animate-pulse">● Live</span>}
                      </div>
                    ))}
                  </div>
                )}

                {/* AMOSTRAGEM PARA O CENÁRIO 3 */}
                {cenarioAtivo === 'navegacao' && (
                  <div className="space-y-3">
                    {operacaoNav === 'buscar_breadcrumb' ? (
                      <div>
                        <p className="text-gray-500 border-b border-[#1e2939] pb-1 mb-3">
                          {`// Rastro de árvore computado para o ID Alvo [${dadosGerados[0]?.id || 'Nó Folha'}]:`}
                        </p>
                        <div className="bg-[#161b22]/40 border border-[#1e2939]/30 p-4 rounded-xl flex items-center gap-2 flex-wrap">
                          {dadosGerados[0]?.caminho ? (
                            dadosGerados[0].caminho.split(" ➔ ").map((noText: string, idxNo: number, arrNo: any[]) => (
                              <div key={idxNo} className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded text-[11px] font-sans font-medium border transition-all ${
                                  idxNo === arrNo.length - 1 
                                    ? 'bg-fuchsia-950/40 text-fuchsia-400 border-fuchsia-500/30 font-bold shadow-[0_0_12px_rgba(217,70,239,0.1)]' 
                                    : 'bg-[#1a1f29]/50 text-gray-300 border-[#1e2939]/40'
                                }`}>
                                  {noText}
                                </span>
                                {idxNo < arrNo.length - 1 && <span className="text-gray-600 text-sm">➔</span>}
                              </div>
                            ))
                          ) : (
                            <span className="text-gray-600 italic">// Nenhum rastro retornado ou ID não localizado</span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-gray-500 border-b border-[#1e2939] pb-1 mb-2">
                          // Amostra estrutural do mapa plano (Flatten) indexado na memória Heap:
                        </p>
                        {dadosGerados.slice(0, 5).map((itemNo: any, index: number) => (
                          <div key={itemNo.id || index} className="flex flex-col gap-0.5 border-b border-[#1e2939]/20 py-2 last:border-0 hover:bg-[#12151b] px-1 rounded transition-colors">
                            <div className="flex items-center gap-4">
                              <span className="text-cyan-400 font-bold text-[11px]">ID: {itemNo.id}</span>
                              <span className="text-white font-sans font-semibold">{itemNo.label}</span>
                              <span className="text-gray-600 text-[10px] bg-[#161b22] px-1.5 py-0.2 rounded border border-[#1e2939]/30">URL: {itemNo.url}</span>
                            </div>
                            <div className="text-[11px] text-gray-500 pl-4 mt-0.5">
                              <span className="text-fuchsia-500/70 font-mono">Breadcrumb:</span> {itemNo.caminhoCompleto || itemNo.caminho}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}