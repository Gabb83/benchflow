"use client";

import { useState, useRef, useEffect } from "react";
import { Registro, geracaoDeDados } from "@/src/utils/generateData";
import Header from "@/src/components/Header";
import type { CenarioId, EstruturaId, EstruturaDashboardId, Cenario, PerformanceMemory } from "../src/types/benchmark";

declare global {
  interface Performance {
    memory?: PerformanceMemory;
  }
}

class FilaReal {
  itens: { [key: number]: Registro } = {};
  inicio = 0;
  fim = 0;

  enqueue(item: Registro) {
    this.itens[this.fim] = item;
    this.fim++;
  }

  dequeue() {
    if (this.inicio === this.fim) return null;
    const item = this.itens[this.inicio];
    delete this.itens[this.inicio];
    this.inicio++;
    return item;
  }

  toSortedArray() {
    return Object.values(this.itens).reverse().slice(0, 5);
  }

  get tamanho() {
    return this.fim - this.inicio;
  }
}

export default function Home() {
  const [cenarioAtivo, setCenarioAtivo] = useState<CenarioId>('busca');
  
  const cenarios: Cenario[] = [
    { id: 'busca', titulo: 'Busca e Filtragem', subtitulo: 'listas dinâmicas', contexto: 'Tabelas, feeds, catálogos' },
    { id: 'dashboard', titulo: 'Dashboard', subtitulo: 'atualização dinâmica', contexto: 'Painéis administrativos e monitoramento de dados' },
    { id: 'navegacao', titulo: 'Navegação', subtitulo: 'hierarquia multinível', contexto: 'Menus multiníveis e estruturas DOM' },
  ];

  const [estrutura, setEstrutura] = useState<EstruturaId>('array');
  const [qtdItens, setQtdItens] = useState<number>(1000);
  const [operacao, setOperacao] = useState<string>('Busca');
  const [iteracoes, setIteracoes] = useState<number>(1000);
  const [termoBusca, setTermoBusca] = useState<string>("Produto #999");

  const [estruturaDashboard, setEstruturaDashboard] = useState<EstruturaDashboardId>('array');
  const [frequenciaMs, setFrequenciaMs] = useState<number>(500);
  const [volumeAtualizacao, setVolumeAtualizacao] = useState<number>(50);
  const [tamanhoBuffer, setTamanhoBuffer] = useState<number>(500);

  const [dadosGerados, setDadosGerados] = useState<Registro[]>([]);
  const [tempoExecucao, setTempoExecucao] = useState<number | null>(null);
  const [memoriaConsumida, setMemoriaConsumida] = useState<number | null>(null);
  const [isRodando, setIsRodando] = useState<boolean>(false);
  const [fps, setFps] = useState<number>(60);

  const streamRef = useRef<NodeJS.Timeout | null>(null);
  const dadosDashboardRef = useRef<{
    array: Registro[];
    map: Map<string, Registro>;
    fila: FilaReal;
  }>({ array: [], map: new Map(), fila: new FilaReal() });

  const validarApenasNumeros = (valor: string, callback: (v: number) => void) => {
    const apenasNumeros = valor.replace(/\D/g, "");
    callback(Number(apenasNumeros));
  };

  useEffect(() => {
    pararMonitoramento();
    resetarBenchmark();
  }, [cenarioAtivo]);

  useEffect(() => {
    return () => pararMonitoramento();
  }, []);

  const lidarComExecucaoCenario1 = () => {
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
        } else if (estrutura === 'map') {
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
        setMemoriaConsumida(diferencaBytes > 0 ? parseFloat((diferencaBytes / (1024 * 1024)).toFixed(2)) : 0.01);
      }
      setTempoExecucao(parseFloat((t1 - t0).toFixed(2)));
      setIsRodando(false);
    }, 50);
  };

  const iniciarMonitoramento = () => {
    setIsRodando(true);
    resetarBenchmark();
    
    dadosDashboardRef.current.array = geracaoDeDados(tamanhoBuffer);
    dadosDashboardRef.current.map = new Map(dadosDashboardRef.current.array.map(p => [p.nome, p]));
    dadosDashboardRef.current.fila = new FilaReal();
    dadosDashboardRef.current.array.forEach(p => dadosDashboardRef.current.fila.enqueue(p));

    let ultimoTempoFrame = performance.now();
    let frames = 0;

    const medirFps = () => {
      const agora = performance.now();
      frames++;
      if (agora >= ultimoTempoFrame + 1000) {
        setFps(Math.round((frames * 1000) / (agora - ultimoTempoFrame)));
        frames = 0;
        ultimoTempoFrame = agora;
      }
      if (streamRef.current) requestAnimationFrame(medirFps);
    };
    requestAnimationFrame(medirFps);

    streamRef.current = setInterval(() => {
      const suportaMemoria = typeof window !== 'undefined' && window.performance && window.performance.memory;
      const m0 = suportaMemoria ? window.performance.memory.usedJSHeapSize : 0;
      const t0 = performance.now();

      const novosDados = geracaoDeDados(volumeAtualizacao);

      if (estruturaDashboard === 'array') {
        let arr = [...dadosDashboardRef.current.array];
        novosDados.forEach(novoItem => {
          const indiceExistente = arr.findIndex(p => p.nome === novoItem.nome);
          if (indiceExistente !== -1) {
            arr[indiceExistente] = novoItem;
          } else {
            arr.push(novoItem);
          }
          if (arr.length > tamanhoBuffer) arr.shift();
        });
        dadosDashboardRef.current.array = arr;
        setDadosGerados(arr.slice(0, 5));
      } 
      else if (estruturaDashboard === 'map') {
        let mapa = new Map(dadosDashboardRef.current.map);
        novosDados.forEach(novoItem => {
          mapa.set(novoItem.nome, novoItem);
          if (mapa.size > tamanhoBuffer) {
            const primeiraChave = mapa.keys().next().value;
            if (primeiraChave) mapa.delete(primeiraChave);
          }
        });
        dadosDashboardRef.current.map = mapa;
        setDadosGerados(Array.from(mapa.values()).slice(0, 5));
      } 
      else if (estruturaDashboard === 'fila') {
        let q = dadosDashboardRef.current.fila;
        novosDados.forEach(novoItem => {
          q.enqueue(novoItem);
          if (q.tamanho > tamanhoBuffer) q.dequeue();
        });
        dadosDashboardRef.current.fila = q;
        setDadosGerados(q.toSortedArray());
      }

      const t1 = performance.now();
      const m1 = suportaMemoria ? window.performance.memory.usedJSHeapSize : 0;

      if (suportaMemoria) {
        const diff = m1 - m0;
        setMemoriaConsumida(diff > 0 ? parseFloat((diff / (1024 * 1024)).toFixed(2)) : 0.01);
      }
      setTempoExecucao(parseFloat((t1 - t0).toFixed(2)));
    }, frequenciaMs);
  };

  const pararMonitoramento = () => {
    if (streamRef.current) {
      clearInterval(streamRef.current);
      streamRef.current = null;
    }
    setIsRodando(false);
  };

  const resetarBenchmark = () => {
    setDadosGerados([]);
    setTempoExecucao(null);
    setMemoriaConsumida(null);
    setFps(60);
  };

  return (
    <div className="bg-[#111111] text-white min-h-screen">
      <Header
        cenarioAtivo={cenarioAtivo} 
        isRodando={isRodando} 
        lidarComExecucaoCenario1={lidarComExecucaoCenario1} 
        iniciarMonitoramento={iniciarMonitoramento} 
        pararMonitoramento={pararMonitoramento} 
      />
      
      <main className="grid grid-cols-12 gap-4 p-4 min-h-[calc(100vh-80px)]">
        <aside className="col-span-4 flex flex-row gap-3">
          {/* COLUNA 1: CENÁRIOS */}
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
              <p>• Status: <span className="text-gray-300">{isRodando ? (cenarioAtivo === 'dashboard' ? 'Stream Ativo' : 'Processando') : 'Pronto'}</span></p>
              <p>• Telemetria: <span className="text-gray-300">{cenarioAtivo === 'dashboard' ? 'Frequência Real' : 'Estresse Único'}</span></p>
              <div className="border-t border-[#1e2939]/50 pt-4 mt-4">
                <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 text-center">
                  Contexto de Uso
                </span>
                <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-2.5 text-center shadow-inner">
                  {cenarios.filter((cenario) => cenario.id === cenarioAtivo)
                    .map((cenario, idx) => (
                      <p key={cenario.id || idx} className="text-xs text-emerald-400 font-medium tracking-wide">
                        {cenario.contexto || "Sem contexto definido"}
                      </p>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* COLUNA 2: CONFIGURAÇÃO */}
          <div className="flex-1 border border-[#1e2939] bg-[#12151b] rounded-2xl p-4 shadow-sm flex flex-col gap-4">
            <h2 className="text-center font-bold uppercase tracking-wider text-xs text-gray-400">CONFIGURAÇÃO</h2>
            <div className="flex flex-col gap-4 mt-2">
              
              {cenarioAtivo === 'busca' && (
                <div className="space-y-3 animate-[fadeIn_0.2s_ease-out]">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Estrutura de Dados</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['array', 'map'] as EstruturaId[]).map((est) => (
                        <button 
                          key={est}
                          type="button"
                          onClick={() => setEstrutura(est)}
                          className={`text-xs font-semibold py-2 px-3 rounded-lg transition-all capitalize border cursor-pointer ${
                            estrutura === est ? 'bg-[#1e2939] border-white text-white' : 'bg-transparent border-[#1e2939] text-gray-400'
                          }`}
                        >
                          {est}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">QTD. DE ITENS NA LISTA</label>
                    <input type="text" inputMode="numeric" value={qtdItens} onChange={(e) => validarApenasNumeros(e.target.value, setQtdItens)} className="w-full bg-[#111] border border-[#1e2939] rounded px-3 py-1.5 text-sm font-mono" />
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
                    {/* BUG CORRIGIDO AQUI: setSetIteracoes alterado para setIteracoes */}
                    <input type="text" inputMode="numeric" value={iteracoes} onChange={(e) => validarApenasNumeros(e.target.value, setIteracoes)} className="w-full bg-[#111] border border-[#1e2939] rounded px-3 py-1.5 text-sm font-mono" />
                  </div>

                  <div className="pt-1 space-y-2">
                    <button type="button" disabled={isRodando} onClick={lidarComExecucaoCenario1} className="w-full bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/60 disabled:opacity-50 text-white text-xs font-semibold py-2 px-4 rounded-lg cursor-pointer">
                      Executar Benchmark
                    </button>
                    <button type="button" onClick={resetarBenchmark} className="w-full bg-rose-800/40 border border-rose-500/30 text-white text-xs font-semibold py-2 rounded-lg">Resetar</button>
                  </div>
                </div> 
              )}

              {cenarioAtivo === 'dashboard' && (
                <div className="space-y-3 animate-[fadeIn_0.2s_ease-out]">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">INTERVALO DE ATUALIZAÇÃO</label>
                    <select 
                      value={frequenciaMs} 
                      onChange={(e) => setFrequenciaMs(Number(e.target.value))}
                      disabled={isRodando}
                      className="w-full bg-[#111] border border-[#1e2939] rounded px-3 py-1.5 text-sm text-white outline-none cursor-pointer p-1 disabled:opacity-40"
                    >
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
                          key={est}
                          type="button"
                          disabled={isRodando}
                          onClick={() => setEstruturaDashboard(est)}
                          className={`text-[11px] font-semibold py-2 px-1 rounded-lg transition-all capitalize border cursor-pointer disabled:opacity-40 ${
                            estruturaDashboard === est ? 'bg-[#1e2939] border-white text-white' : 'bg-transparent border-[#1e2939] text-gray-400'
                          }`}
                        >
                          {est}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">VOLUME DE ATUALIZAÇÃO (RAJADA)</label>
                    <input type="text" inputMode="numeric" disabled={isRodando} value={volumeAtualizacao} onChange={(e) => validarApenasNumeros(e.target.value, setVolumeAtualizacao)} className="w-full bg-[#111] border border-[#1e2939] rounded px-3 py-1.5 text-sm font-mono disabled:opacity-40" />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">TAMANHO DO BUFFER (MÁX ITENS)</label>
                    <input type="text" inputMode="numeric" disabled={isRodando} value={tamanhoBuffer} onChange={(e) => validarApenasNumeros(e.target.value, setTamanhoBuffer)} className="w-full bg-[#111] border border-[#1e2939] rounded px-3 py-1.5 text-sm font-mono disabled:opacity-40" />
                  </div>

                  <div className="pt-2 space-y-2">
                    <button 
                      type="button" 
                      onClick={isRodando ? pararMonitoramento : iniciarMonitoramento} 
                      className={`w-full border text-white text-xs font-semibold py-2 px-4 rounded-lg cursor-pointer transition-colors ${
                        isRodando ? 'bg-red-950/40 border-red-500/30 hover:bg-red-900/50' : 'bg-emerald-950/40 border-emerald-500/30 hover:bg-emerald-900/60'
                      }`}
                    >
                      {isRodando ? 'Parar Monitoramento' : 'Iniciar Stream de Dados'}
                    </button>
                  </div>
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
    
        {/* COLUNA 3: DASHBOARD / VISUALIZADOR */}
        <section className="col-span-8 border border-[#1e2939] bg-[#12151b] rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex flex-col h-full justify-between">
            <div>
              <h1 className="text-xl font-semibold mb-2">
                {cenarioAtivo === 'busca' ? `Simulador de ${operacao}` : 'Monitor de Atualização de Dashboard'} em{' '}
                <span className="capitalize text-fuchsia-400">{cenarioAtivo === 'busca' ? estrutura : estruturaDashboard}</span>
              </h1>
              <p className="text-gray-400 text-sm mb-6">
                {cenarioAtivo === 'busca' ? 'Mapeamento de performance baseado em dados estruturados estáticos.' : 'Mapeamento de mutação e ingestão de streams de dados em tempo real.'}
              </p>
            </div>

            <div className="flex-1 flex flex-col justify-center min-h-[380px]">
              {cenarioAtivo === 'busca' && isRodando ? (
                <div className="border border-[#1e2939] rounded-xl bg-[#111] p-4 h-[380px] flex flex-col items-center justify-center gap-3 animate-[fadeIn_0.15s_ease-out]">
                  <div className="w-8 h-8 border-2 border-fuchsia-500/20 border-t-fuchsia-500 rounded-full animate-spin"></div>
                  <p className="text-gray-500 text-xs tracking-wider animate-pulse">Processando buffers e estruturas...</p>
                </div>
              ) : dadosGerados.length === 0 ? (
                <div className="border border-[#1e2939] rounded-xl bg-[#111] p-4 h-[380px] flex items-center justify-center text-gray-600 italic">
                  [Aguardando execução para renderizar dados amostrais]
                </div>
              ) : (
                <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
                  <div className="grid grid-cols-5 gap-2.5">
                    <div className="bg-[#111] border border-[#1e2939] p-3 rounded-xl text-center">
                      <p className="text-[9px] text-gray-500 font-bold uppercase mb-1">
                        {cenarioAtivo === 'dashboard' ? 'Latência Ingestão' : 'Tempo Total'}
                      </p>
                      <p className="text-sm font-mono text-fuchsia-400">{tempoExecucao !== null ? `${tempoExecucao.toFixed(2)} ms` : '0.00 ms'}</p>
                    </div>
                    <div className="bg-[#111] border border-[#1e2939] p-3 rounded-xl text-center">
                      <p className="text-[9px] text-gray-500 font-bold uppercase mb-1">
                        {cenarioAtivo === 'dashboard' ? 'Estabilidade UI' : 'Tempo Médio'}
                      </p>
                      <p className={`text-sm font-mono ${cenarioAtivo === 'dashboard' && fps < 45 ? 'text-red-400' : 'text-purple-400'}`}>
                        {cenarioAtivo === 'dashboard' ? `${fps} FPS` : (tempoExecucao !== null && iteracoes > 0 ? `${(tempoExecucao / iteracoes).toFixed(4)} ms` : '0.0000 ms')}
                      </p>
                    </div>
                    <div className="bg-[#111] border border-[#1e2939] p-3 rounded-xl text-center">
                      <p className="text-[9px] text-gray-500 font-bold uppercase mb-1">Tamanho Buffer</p>
                      <p className="text-sm font-mono text-emerald-400">
                        {cenarioAtivo === 'dashboard' ? tamanhoBuffer.toLocaleString() : dadosGerados.length.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-[#111] border border-[#1e2939] p-3 rounded-xl text-center">
                      <p className="text-[9px] text-gray-500 font-bold uppercase mb-1">RAM Gasta</p>
                      <p className="text-sm font-mono text-teal-400">{memoriaConsumida !== null ? `${memoriaConsumida} MB` : 'N/A'}</p>
                    </div>
                    <div className="bg-[#111] border border-[#1e2939] p-3 rounded-xl text-center">
                      <p className="text-[9px] text-gray-500 font-bold uppercase mb-1">Complexidade</p>
                      <p className="text-sm font-mono text-blue-400">
                        {cenarioAtivo === 'dashboard' 
                          ? `${Intl.NumberFormat('en-US', { notation: 'compact' }).format(volumeAtualizacao)} / s`
                          : `${Intl.NumberFormat('en-US', { notation: 'compact' }).format(qtdItens * iteracoes)} ops`
                        }
                      </p>
                    </div>
                  </div>

                  <div className="border border-[#1e2939] rounded-xl bg-[#111] p-4 h-[240px] overflow-y-auto font-mono text-xs text-gray-400">
                    <div className="space-y-1">
                      <p className="text-gray-500 border-b border-[#1e2939] pb-1 mb-2">
                        {cenarioAtivo === 'dashboard' ? '// Stream ativo: Últimas modificações no buffer (FIFO):' : '// Primeiros 5 itens gerados no array:'}
                      </p>
                      {dadosGerados.map((item) => (
                        <div key={item.idx} className="flex gap-4 hover:bg-[#12151b] p-1 rounded transition-colors">
                          <span className="text-blue-500">idx: {item.idx}</span>
                          <span className="text-white">{item.nome}</span>
                          <span className="text-amber-500">{item.categoria}</span>
                          <span className="text-emerald-500">R$ {item.preco.toFixed(2)}</span>
                          <span className="text-xs text-gray-600 animate-pulse">● Live</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}