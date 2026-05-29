"use client";

import { useState, useRef, useEffect } from "react";
import { Registro, geracaoDeDados } from "@/src/utils/generateData";
import { Fila } from "@/src/utils/fila";
import type { CenarioId, EstruturaId, EstruturaDashboardId } from "@/src/types/benchmark";

export function useBenchmark() {
  const [cenarioAtivo, setCenarioAtivo] = useState<CenarioId>('busca');
  
  // Estados Cenário 1
  const [estrutura, setEstrutura] = useState<EstruturaId>('array');
  const [qtdItens, setQtdItens] = useState<number>(1000);
  const [operacao, setOperacao] = useState<string>('Busca');
  const [iteracoes, setIteracoes] = useState<number>(1000);
  const [termoBusca, setTermoBusca] = useState<string>("Produto #999");

  // Estados Cenário 2
  const [estruturaDashboard, setEstruturaDashboard] = useState<EstruturaDashboardId>('array');
  const [frequenciaMs, setFrequenciaMs] = useState<number>(500);
  const [volumeAtualizacao, setVolumeAtualizacao] = useState<number>(50);
  const [tamanhoBuffer, setTamanhoBuffer] = useState<number>(500);

  // Estados de Telemetria
  const [dadosGerados, setDadosGerados] = useState<Registro[]>([]);
  const [tempoExecucao, setTempoExecucao] = useState<number | null>(null);
  const [memoriaConsumida, setMemoriaConsumida] = useState<number | null>(null);
  const [isRodando, setIsRodando] = useState<boolean>(false);
  const [fps, setFps] = useState<number>(60);

  const streamRef = useRef<NodeJS.Timeout | null>(null);
  const dadosDashboardRef = useRef<{
    array: Registro[];
    map: Map<string, Registro>;
    fila: Fila;
  }>({ array: [], map: new Map(), fila: new Fila() });

  useEffect(() => {
    pararMonitoramento();
    resetarBenchmark();
  }, [cenarioAtivo]);

  useEffect(() => {
    return () => pararMonitoramento();
  }, []);

  const resetarBenchmark = () => {
    setDadosGerados([]);
    setTempoExecucao(null);
    setMemoriaConsumida(null);
    setFps(60);
  };

  const pararMonitoramento = () => {
    if (streamRef.current) {
      clearInterval(streamRef.current);
      streamRef.current = null;
    }
    setIsRodando(false);
  };

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
    dadosDashboardRef.current.fila = new Fila();
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

  return {
    cenarioAtivo, setCenarioAtivo,
    estrutura, setEstrutura,
    qtdItens, setQtdItens,
    operacao, setOperacao,
    iteracoes, setIteracoes,
    termoBusca, setTermoBusca,
    estruturaDashboard, setEstruturaDashboard,
    frequenciaMs, setFrequenciaMs,
    volumeAtualizacao, setVolumeAtualizacao,
    tamanhoBuffer, setTamanhoBuffer,
    dadosGerados, tempoExecucao, memoriaConsumida, isRodando, fps,
    lidarComExecucaoCenario1, iniciarMonitoramento, pararMonitoramento, resetarBenchmark
  };
}