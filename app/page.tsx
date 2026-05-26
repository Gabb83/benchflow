"use client";

import { useState } from "react";
import { Registro, geracaoDeDados } from "@/src/utils/generateData";

type CenarioId = 'busca' | 'dashboard' | 'navegacao';
type EstruturaId = 'array' | 'map';

interface Cenario {
  id: CenarioId;
  titulo: string;
  subtitulo: string;
}

export default function Home() {
  const [cenarioAtivo, setCenarioAtivo] = useState<CenarioId>('busca');
  
  const cenarios: Cenario[] = [
    { id: 'busca', titulo: 'Busca e Filtragem', subtitulo: 'listas dinâmicas' },
    { id: 'dashboard', titulo: 'Dashboard', subtitulo: 'atualização dinâmica' },
    { id: 'navegacao', titulo: 'Navegação', subtitulo: 'hierarquia multinível' },
  ];

  const [estrutura, setEstrutura] = useState<EstruturaId>('array');
  const [qtdItens, setQtdItens] = useState<number>(1000);
  const [operacao, setOperacao] = useState<string>('Busca');
  const [iteracoes, setIteracoes] = useState<number>(1000);
  const [termoBusca, setTermoBusca] = useState<string>("Produto #999");

  const [dadosGerados, setDadosGerados] = useState<Registro[]>([]);
  const [tempoExecucao, setTempoExecucao] = useState<number | null>(null);
  const [memoriaConsumida, setMemoriaConsumida] = useState<number | null>(null);
  const [isRodando, setIsRodando] = useState<boolean>(false);

  const validarApenasNumeros = (valor: string, callback: (v: number) => void) => {
    const apenasNumeros = valor.replace(/\D/g, "");
    callback(Number(apenasNumeros));
  };

  const lidarComExecucao = () => {
    setIsRodando(true);
    setMemoriaConsumida(null);
    setTempoExecucao(null);

    setTimeout(() => {
      const suportaMemoria = typeof window !== 'undefined' && window.performance && window.performance.memory;
      const m0 = suportaMemoria ? window.performance.memory.usedJSHeapSize : 0;
      
      const t0 = performance.now();
      
      const listaProdutos = geracaoDeDados(qtdItens);
      setDadosGerados(listaProdutos);

      let mapaProdutos = new Map<string, Registro>();
      if (estrutura === 'map') {
        listaProdutos.forEach(p => mapaProdutos.set(p.nome, p));
      }

      for (let i = 0; i < iteracoes; i++) {
        if (estrutura === 'array') {
          if (operacao === 'Filtragem') {
            listaProdutos.filter(p => p.categoria === 'Eletrônicos' && p.isDisponivel === 1);
          } else if (operacao === 'Busca') {
            listaProdutos.find(p => p.nome === termoBusca);
          } else if (operacao === 'Ordenação') {
            listaProdutos.toSorted((a, b) => b.preco - a.preco); 
          }
        } 
        
        else if (estrutura === 'map') {
          if (operacao === 'Busca') {
            mapaProdutos.get(termoBusca);
          } else if (operacao === 'Filtragem') {
            Array.from(mapaProdutos.values()).filter(p => p.categoria === 'Eletrônicos');
          } else if (operacao === 'Ordenação') {
            Array.from(mapaProdutos.values()).toSorted((a, b) => b.preco - a.preco);
          }
        }
      }

      const t1 = performance.now();
      const m1 = suportaMemoria ? window.performance.memory.usedJSHeapSize : 0;

      if (suportaMemoria) {
        const diferencaBytes = m1 - m0;
        const diferencaMB = diferencaBytes / (1024 * 1024);
        setMemoriaConsumida(diferencaMB > 0 ? parseFloat(diferencaMB.toFixed(2)) : 0.01);
      } else {
        setMemoriaConsumida(null);
      }

      setTempoExecucao(parseFloat((t1 - t0).toFixed(2)));
      setIsRodando(false);
    }, 50);
  };

  const resetarBenchmark = () => {
    setDadosGerados([]);
    setTempoExecucao(null);
  };

  return (
    <div className="bg-[#111111] text-white min-h-screen">
      <header className="bg-[#121212] p-5 flex flex-row items-center justify-between border-b border-[#1e2939]/30">
        <div>
          <h1 className="text-xl font-black tracking-tighter italic">BenchFlow.</h1>
        </div>
        <div className="flex flex-row items-center justify-between gap-5">
          <button className="bg-[#1e2939] hover:bg-[#2b3a50] px-4 py-1.5 rounded-md text-sm font-medium transition-colors">Executar</button>
          <button className="text-sm font-medium hover:text-gray-300 transition-colors">Exportar</button>
          <p className="text-xs bg-[#1e2939]/50 text-gray-400 px-2 py-1 rounded border border-[#1e2939]">MVP v1.0</p>
        </div>
      </header>
      
      <main className="grid grid-cols-12 gap-4 p-4 min-h-[calc(100vh-80px)]">
        <aside className="col-span-4 flex flex-row gap-3">
          {/* COLUNA 1 */}
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
                      <span className={`block text-xs mt-0.5 ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                        {cenario.subtitulo}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="border-t border-dashed border-[#1e2939] pt-4 text-xs text-gray-500 space-y-1">
              <p>• Status: <span className="text-gray-300">Pronto</span></p>
              <p>• Execuções: <span className="text-gray-300">12</span></p>
              <p>• Último teste: <span className="text-gray-300">Há 5m</span></p>
              <div className="border-t border-[#1e2939]/50 pt-4 mt-4">
                <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 text-center">
                  Contexto de Uso
                </span>
                <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-2.5 text-center shadow-inner">
                  <p className="text-xs text-emerald-400 font-medium tracking-wide">
                    Tabelas, feeds, catálogos
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* COLUNA 2 */}
          <div className="flex-1 border border-[#1e2939] bg-[#12151b] rounded-2xl p-4 shadow-sm flex flex-col gap-4">
            <h2 className="text-center font-bold uppercase tracking-wider text-xs text-gray-400">CONFIGURAÇÃO</h2>
            <div className="flex flex-col gap-4 mt-2">
              {cenarioAtivo === 'busca' && (
                <div className="space-y-3 animate-[fadeIn_0.2s_ease-out]">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Estrutura de Dados</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        type="button"
                        onClick={() => setEstrutura('array')}
                        className={`text-xs font-semibold py-2 px-3 rounded-lg transition-all duration-200 cursor-pointer border ${
                          estrutura === 'array'
                            ? 'bg-[#1e2939] border-white text-white shadow-md scale-[1.02]'
                            : 'bg-transparent border-[#1e2939] text-gray-400 hover:bg-[#1e2939]/30'
                        }`}
                      >
                        Array
                      </button>
                      <button 
                        type="button"
                        onClick={() => setEstrutura('map')}
                        className={`text-xs font-semibold py-2 px-3 rounded-lg transition-all duration-200 cursor-pointer border ${
                          estrutura === 'map'
                            ? 'bg-[#1e2939] border-white text-white shadow-md scale-[1.02]'
                            : 'bg-transparent border-[#1e2939] text-gray-400 hover:bg-[#1e2939]/30'
                        }`}
                      >
                        Map
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">QTD. DE ITENS NA LISTA</label>
                    <input 
                      type="text" 
                      inputMode="numeric"
                      value={qtdItens} 
                      onChange={(e) => validarApenasNumeros(e.target.value, setQtdItens)} 
                      className="w-full bg-[#111] border border-[#1e2939] focus:border-gray-400 rounded px-3 py-1.5 text-sm text-white font-mono outline-none transition-colors" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">OPERAÇÃO</label>
                    <select 
                      value={operacao}
                      onChange={(e) => setOperacao(e.target.value)} 
                      className="w-full bg-[#111] border border-[#1e2939] rounded px-3 py-1.5 text-sm text-white outline-none cursor-pointer"
                    >
                      <option value="Busca">Busca</option>
                      <option value="Filtragem">Filtragem</option>
                      <option value="Ordenação">Ordenação</option>
                    </select>
                  </div>

                  {(operacao === 'Busca' || operacao === 'Filtragem') && (
                    <div className="animate-[fadeIn_0.15s_ease-out]">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Alvo do Teste (Termo)</label>
                      <input 
                        type="text"
                        value={termoBusca}
                        onChange={(e) => setTermoBusca(e.target.value)}
                        placeholder="Ex: Produto #999"
                        className="w-full bg-[#111] border border-[#1e2939] rounded px-3 py-1.5 text-sm text-white outline-none font-mono"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">ITERAÇÕES</label>
                    <input  
                      type="text" 
                      inputMode="numeric"
                      value={iteracoes} 
                      onChange={(e) => validarApenasNumeros(e.target.value, setIteracoes)} 
                      className="w-full bg-[#111] border border-[#1e2939] focus:border-gray-400 rounded px-3 py-1.5 text-sm text-white font-mono outline-none transition-colors" 
                    />
                  </div>

                  <div className="pt-1 space-y-2">
                    <button 
                      type="button"
                      disabled={isRodando} 
                      onClick={lidarComExecucao}
                      className="w-full bg-emerald-950/40 border border-emerald-500/30 hover:bg-[#253347] disabled:opacity-50 text-white text-xs font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer"
                    >
                      {isRodando ? 'Processando...' : 'Executar Benchmark'}
                    </button>
                    
                    <div className="grid grid-cols-1 gap-2">
                      <button 
                        type="button"
                        onClick={resetarBenchmark} 
                        className="bg-rose-800/40 border border-rose-500/30 text-white text-xs font-semibold tracking-wide py-2 px-3 rounded-lg transition-all cursor-pointer"
                      >
                        Resetar
                      </button>
                      {/* <button 
                        type="button"
                        className="bg-fuchsia-700 hover:bg-fuchsia-600 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors shadow-lg shadow-fuchsia-900/20 cursor-pointer"
                      >
                        Comparar
                      </button> */}
                    </div>
                  </div>
                </div> 
              )}
              {cenarioAtivo === 'dashboard' && (
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-gray-400">INTERVALO DE ATUALIZAÇÃO</label>
                  <input type="text" defaultValue="500ms" className="w-full bg-[#111] border border-[#1e2939] rounded px-3 py-1.5 text-sm" />
                </div>
              )}
              {cenarioAtivo === 'navegacao' && (
                <div className="space-y-3">
                  <p className="text-xs text-gray-500 italic">Sem configurações específicas para este cenário.</p>
                </div>
              )}
            </div>
          </div>
        </aside>
    
        {/* COLUNA 3 */}
        <section className="col-span-8 border border-[#1e2939] bg-[#12151b] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h1 className="text-xl font-semibold mb-2">Simulador de {operacao} em <span className="capitalize text-fuchsia-400">{estrutura}</span></h1>
            <p className="text-gray-400 text-sm mb-6">Mapeamento de performance baseado em dados estruturados estáticos.</p>

            { isRodando ? (
              <div className="border border-[#1e2939] rounded-xl bg-[#111] p-4 h-90 overflow-y-auto font-mono text-xs text-gray-400">
                <div className="h-full w-full flex flex-col items-center justify-center gap-3 animate-[fadeIn_0.15s_ease-out]">
                  {/* SPINNER CYBERPUNK: Roda em fuchsia com uma borda sutil */}
                  <div className="w-8 h-8 border-2 border-fuchsia-500/20 border-t-fuchsia-500 rounded-full animate-spin"></div>
                  <p className="text-gray-500 text-xs tracking-wider animate-pulse">
                    Processando buffers e estruturas...
                  </p>
                </div>
              </div>
            ) : dadosGerados.length === 0 ? (
              <div className="border border-[#1e2939] rounded-xl bg-[#111] p-4 h-90 overflow-y-auto font-mono text-xs text-gray-400">
                <div className="h-full flex items-center justify-center text-gray-600 italic">
                  [Aguardando execução para renderizar dados amostrais]
                </div>
              </div>
              ) : (
              <div>
                <div className="grid grid-cols-5 gap-4 mb-6">
                  <div className="bg-[#111] border border-[#1e2939] p-4 rounded-xl">
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Tempo Total</p>
                    <p className="text-md font-mono text-fuchsia-400">{tempoExecucao !== null ? `${tempoExecucao.toFixed(2)} ms` : '0.00 ms'}</p>
                  </div>
                  <div className="bg-[#111] border border-[#1e2939] p-4 rounded-xl">
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Tempo Médio</p>
                    <p className="text-md font-mono text-purple-400">
                      {tempoExecucao !== null && iteracoes > 0
                        ? `${(tempoExecucao / iteracoes).toFixed(2)} ms`
                        : '0.00 ms'}
                    </p>
                  </div>
                  <div className="bg-[#111] border border-[#1e2939] p-4 rounded-xl">
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Dados em Memória</p>
                    <p className="text-md font-mono text-emerald-400">{dadosGerados.length.toLocaleString()}</p>
                  </div>
                  <div className="bg-[#111] border border-[#1e2939] p-4 rounded-xl">
                    <p className="text-[10px] text-gray-500 font-bold uppercase">RAM Consumida</p>
                    <p className="text-md font-mono text-emerald-400">
                      {memoriaConsumida !== null ? `${memoriaConsumida} MB` : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-[#111] border border-[#1e2939] p-4 rounded-xl">
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Complexidade Absoluta</p>
                    <p className="text-md font-mono text-blue-400">{Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(qtdItens * iteracoes)} ops</p>
                    {/* {(qtdItens * iteracoes).toExponential(2)} */}
                  </div>
                </div>
                <div className="border border-[#1e2939] rounded-xl bg-[#111] p-4 h-64 overflow-y-auto font-mono text-xs text-gray-400">
                <div className="space-y-1">
                  <p className="text-gray-500 border-b border-[#1e2939] pb-1 mb-2">// Primeiros 5 itens gerados no array:</p>
                  {dadosGerados.slice(0, 5).map((item) => (
                    <div key={item.idx} className="flex gap-4 hover:bg-[#12151b] p-1 rounded">
                      <span className="text-blue-500">idx: {item.idx}</span>
                      <span className="text-white">{item.nome}</span>
                      <span className="text-amber-500">{item.categoria}</span>
                      <span className="text-emerald-500">R$ {item.preco}</span>
                      <span>Disponível: {item.isDisponivel}</span>
                    </div>
                  ))}
                  <p className="text-gray-600 text-[10px] pt-2">... e mais {dadosGerados.length - 5} itens ocultados do preview por performance.</p>
                </div>
              </div>
            </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}