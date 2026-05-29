"use client";

import { useState, useRef, useEffect } from "react";

import Header from "@/src/components/Header";
import CenariosList from "@/src/components/CenarioList";
import ConfigBusca from "@/src/components/ConfigBusca";
import ConfigDashboard from "@/src/components/ConfigDashboard";
import { Registro, geracaoDeDados } from "@/src/utils/generateData";
import type { CenarioId, EstruturaId, EstruturaDashboardId, Cenario, PerformanceMemory } from "@/src/types/benchmark";
import PainelResultados from "@/src/components/PainelResultados";

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
          <CenariosList
            cenarios={cenarios}
            cenarioAtivo={cenarioAtivo}
            setCenarioAtivo={setCenarioAtivo}
            isRodando={isRodando}
          />

          {/* COLUNA 2: CONFIGURAÇÃO */}
          <div className="flex-1 border border-[#1e2939] bg-[#12151b] rounded-2xl p-4 shadow-sm flex flex-col gap-4">
            <h2 className="text-center font-bold uppercase tracking-wider text-xs text-gray-400">CONFIGURAÇÃO</h2>
            <div className="flex flex-col gap-4 mt-2">
              {cenarioAtivo === 'busca' && (
                <ConfigBusca 
                  estrutura={estrutura} setEstrutura={setEstrutura}
                  qtdItens={qtdItens} setQtdItens={setQtdItens}
                  operacao={operacao} setOperacao={setOperacao}
                  termoBusca={termoBusca} setTermoBusca={setTermoBusca}
                  iteracoes={iteracoes} setIteracoes={setIteracoes}
                  isRodando={isRodando} executar={lidarComExecucaoCenario1} resetar={resetarBenchmark}
                />
              )}
              {cenarioAtivo === 'dashboard' && (
                <ConfigDashboard 
                  frequenciaMs={frequenciaMs} setFrequenciaMs={setFrequenciaMs}
                  estruturaDashboard={estruturaDashboard} setEstruturaDashboard={setEstruturaDashboard}
                  volumeAtualizacao={volumeAtualizacao} setVolumeAtualizacao={setVolumeAtualizacao}
                  tamanhoBuffer={tamanhoBuffer} setTamanhoBuffer={setTamanhoBuffer}
                  isRodando={isRodando} iniciar={iniciarMonitoramento} parar={pararMonitoramento}
                />
              )}
              {cenarioAtivo === 'navegacao' && (
                <p className="text-xs text-gray-500 italic">Sem configurações específicas para este cenário.</p>
              )}
            </div>
          </div>
        </aside>
    
        {/* COLUNA 3: DASHBOARD / VISUALIZADOR */}
        <PainelResultados 
          cenarioAtivo={cenarioAtivo} operacao={operacao} estrutura={estrutura} estruturaDashboard={estruturaDashboard}
          isRodando={isRodando} dadosGerados={dadosGerados} tempoExecucao={tempoExecucao} memoriaConsumida={memoriaConsumida}
          fps={fps} iteracoes={iteracoes} volumeAtualizacao={volumeAtualizacao} qtdItens={qtdItens} tamanhoBuffer={tamanhoBuffer}
        />
      </main>
    </div>
  );
}