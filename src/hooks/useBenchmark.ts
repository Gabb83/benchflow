"use client";

import { useState, useRef, useEffect } from "react";
import { Registro, geracaoDeDados, gerarArvoreNavegacao, obterIdFolhaAleatorio, planificarArvore } from "@/src/utils/generateData";
import { Fila } from "@/src/utils/fila";
import type { CenarioId, EstruturaId, EstruturaDashboardId, EstruturaNavegacaoId, OperacaoNavegacaoId, NoNavegacao } from "@/src/types/benchmark";

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

  // Estados do Cenário 3 (Navegação)
  const [estruturaNav, setEstruturaNav] = useState<EstruturaNavegacaoId>('arvore_recursiva');
  const [operacaoNav, setOperacaoNav] = useState<OperacaoNavegacaoId>('buscar_breadcrumb');
  const [ramificacaoNav, setRamificacaoNav] = useState<number>(3);
  const [profundidadeNav, setProfundidadeNav] = useState<number>(5);
  const [iteracoesNav, setIteracoesNav] = useState<number>(1000);

  // Estados de Telemetria Geral
  const [dadosGerados, setDadosGerados] = useState<any[]>([]); // Tipagem genérica flexível para aceitar nós ou produtos
  const [tempoExecucao, setTempoExecucao] = useState<number | null>(null);
  const [memoriaConsumida, setMemoriaConsumida] = useState<number | null>(null);
  const [isRodando, setIsRodando] = useState<boolean>(false);
  const [fps, setFps] = useState<number>(60);
  const [pilhaProfundidade, setPilhaProfundidade] = useState<number | null>(null); // Nova métrica teórica pro cenário 3

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
    setPilhaProfundidade(null);
  };

  const pararMonitoramento = () => {
    if (streamRef.current) {
      clearInterval(streamRef.current);
      streamRef.current = null;
    }
    setIsRodando(false);
  };

  // --- ALGORITMO RECURSIVO DO CENÁRIO 3 (DFS - Depth First Search) ---
  const buscarNoRecursivo = (nos: NoNavegacao[], idAlvo: string, caminhoAtual: string[] = []): string[] | null => {
    for (const no of nos) {
      const novoCaminho = [...caminhoAtual, no.label];
      
      if (no.id === idAlvo) return novoCaminho;
      
      if (no.children && no.children.length > 0) {
        const resultado = buscarNoRecursivo(no.children, idAlvo, novoCaminho);
        if (resultado) return resultado;
      }
    }
    return null;
  };

  // --- EXECUÇÃO DO CENÁRIO 1 (ESTÁTICO) ---
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

  // --- EXECUÇÃO DO CENÁRIO 2 (STREAM DINÂMICO) ---
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

  // --- EXECUÇÃO DO CENÁRIO 3 (NAVEGAÇÃO EM ÁRVORE) ---
  const lidarComExecucaoCenario3 = () => {
    setIsRodando(true);
    setMemoriaConsumida(null);
    setTempoExecucao(null);
    setPilhaProfundidade(null);

    setTimeout(() => {
      const suportaMemoria = typeof window !== 'undefined' && window.performance && window.performance.memory;
      const m0 = suportaMemoria ? window.performance.memory.usedJSHeapSize : 0;
      const t0 = performance.now();

      // 1. Geração da árvore crua em memória
      const arvoreBase = gerarArvoreNavegacao(ramificacaoNav, profundidadeNav);
      
      // Sorteia um ID no fundo máximo para ser o alvo de busca do estresse
      const idAlvoFixo = obterIdFolhaAleatorio(ramificacaoNav, profundidadeNav);

      // 2. Setup do Mapa se a estrutura escolhida for a otimizada
      let mapaPlanificado = new Map();
      if (estruturaNav === 'mapa_planificado') {
        mapaPlanificado = planificarArvore(arvoreBase);
      }

      // 3. Laço de Repetições do Benchmark (Estresse)
      let amostraUltimoResultado: any = null;

      for (let i = 0; i < iteracoesNav; i++) {
        if (operacaoNav === 'buscar_breadcrumb') {
          if (estruturaNav === 'arvore_recursiva') {
            amostraUltimoResultado = buscarNoRecursivo(arvoreBase, idAlvoFixo);
          } else if (estruturaNav === 'mapa_planificado') {
            const noObtido = mapaPlanificado.get(idAlvoFixo);
            amostraUltimoResultado = noObtido ? noObtido.caminhoCompleto.split(" ➔ ") : ["Não encontrado"];
          }
        } else if (operacaoNav === 'planificar_total') {
          amostraUltimoResultado = planificarArvore(arvoreBase);
        }
      }

      const t1 = performance.now();
      const m1 = suportaMemoria ? window.performance.memory.usedJSHeapSize : 0;

      // Grava o resultado visual para renderizar na tela
      if (operacaoNav === 'buscar_breadcrumb' && Array.isArray(amostraUltimoResultado)) {
        setDadosGerados([{ id: idAlvoFixo, caminho: amostraUltimoResultado.join(" ➔ ") }]);
      } else if (operacaoNav === 'planificar_total' && mapaPlanificado) {
        setDadosGerados(Array.from(estruturaNav === 'mapa_planificado' ? mapaPlanificado.values() : planificarArvore(arvoreBase).values()).slice(0, 4));
      }

      if (suportaMemoria) {
        const diferencaBytes = m1 - m0;
        setMemoriaConsumida(diferencaBytes > 0 ? parseFloat((diferencaBytes / (1024 * 1024)).toFixed(2)) : 0.01);
      }

      // Configura as métricas finais
      setTempoExecucao(parseFloat((t1 - t0).toFixed(2)));
      setPilhaProfundidade(estruturaNav === 'arvore_recursiva' ? profundidadeNav : 1); // No Map a pilha é estável em 1
      setIsRodando(false);
    }, 50);
  };

  // --- EXPORTAR RELATÓRIO JSON ---
  const exportarDadosJson = () => {
    const dadosParaExportar = {
      timestamp: new Date().toISOString(),
      cenarioAtual: cenarioAtivo,
      configuracoes: cenarioAtivo === "busca" ? {
        estrutura,
        qtdItens,
        operacao,
        iteracoes,
        termoBusca,
      } : cenarioAtivo === "dashboard" ? {
        estruturaDashboard,
        frequenciaMs,
        volumeAtualizacao,
        tamanhoBuffer,
      } : {
        estruturaNav,
        operacaoNav,
        ramificacaoNav,
        profundidadeNav,
        iteracoesNav
      },
      resultados: {
        tempoExecucaoMs: tempoExecucao,
        memoriaConsumidaMb: memoriaConsumida,
        estabilidadefps: cenarioAtivo === "dashboard" ? fps : null,
        profundidadePilhaMax: cenarioAtivo === "navegacao" ? pilhaProfundidade : null
      },
      amostraDados: dadosGerados,
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dadosParaExportar, null, 2)
    )}`;

    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", `benchflow-${cenarioAtivo}-${Date.now()}.json`);

    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
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
    estruturaNav, setEstruturaNav,
    operacaoNav, setOperacaoNav,
    ramificacaoNav, setRamificacaoNav,
    profundidadeNav, setProfundidadeNav,
    iteracoesNav, setIteracoesNav,
    dadosGerados, tempoExecucao, memoriaConsumida, isRodando, fps, pilhaProfundidade,
    lidarComExecucaoCenario1, iniciarMonitoramento, pararMonitoramento, resetarBenchmark,
    lidarComExecucaoCenario3,
    exportarDadosJson,
  };
}