"use client";

import Header from "@/src/components/Header";
import CenariosList from "@/src/components/CenarioList";
import ConfigBusca from "@/src/components/ConfigBusca";
import ConfigDashboard from "@/src/components/ConfigDashboard";
import PainelResultados from "@/src/components/PainelResultados";
import { useBenchmark } from "@/src/hooks/useBenchmark";
import type { Cenario } from "@/src/types/benchmark";

export default function Home() {
  const bench = useBenchmark();

  const cenarios: Cenario[] = [
    { id: 'busca', titulo: 'Busca e Filtragem', subtitulo: 'listas dinâmicas', contexto: 'Tabelas, feeds, catálogos' },
    { id: 'dashboard', titulo: 'Dashboard', subtitulo: 'atualização dinâmica', contexto: 'Painéis administrativos e monitoramento de dados' },
    { id: 'navegacao', titulo: 'Navegação', subtitulo: 'hierarquia multinível', contexto: 'Menus multiníveis e estruturas DOM' },
  ];

  return (
    <div className="bg-[#111111] text-white min-h-screen">
      <Header
        cenarioAtivo={bench.cenarioAtivo} 
        isRodando={bench.isRodando} 
        lidarComExecucaoCenario1={bench.lidarComExecucaoCenario1} 
        iniciarMonitoramento={bench.iniciarMonitoramento} 
        pararMonitoramento={bench.pararMonitoramento} 
      />
      
      <main className="grid grid-cols-12 gap-4 p-4 min-h-[calc(100vh-80px)]">
        <aside className="col-span-4 flex flex-row gap-3">
          <CenariosList
            cenarios={cenarios}
            cenarioAtivo={bench.cenarioAtivo}
            setCenarioAtivo={bench.setCenarioAtivo}
            isRodando={bench.isRodando}
          />

          <div className="flex-1 border border-[#1e2939] bg-[#12151b] rounded-2xl p-4 shadow-sm flex flex-col gap-4">
            <h2 className="text-center font-bold uppercase tracking-wider text-xs text-gray-400">CONFIGURAÇÃO</h2>
            <div className="flex flex-col gap-4 mt-2">
              {bench.cenarioAtivo === 'busca' && (
                <ConfigBusca 
                  estrutura={bench.estrutura} setEstrutura={bench.setEstrutura}
                  qtdItens={bench.qtdItens} setQtdItens={bench.setQtdItens}
                  operacao={bench.operacao} setOperacao={bench.setOperacao}
                  termoBusca={bench.termoBusca} setTermoBusca={bench.setTermoBusca}
                  iteracoes={bench.iteracoes} setIteracoes={bench.setIteracoes}
                  isRodando={bench.isRodando} executar={bench.lidarComExecucaoCenario1} resetar={bench.resetarBenchmark}
                />
              )}
              {bench.cenarioAtivo === 'dashboard' && (
                <ConfigDashboard 
                  frequenciaMs={bench.frequenciaMs} setFrequenciaMs={bench.setFrequenciaMs}
                  estruturaDashboard={bench.estruturaDashboard} setEstruturaDashboard={bench.setEstruturaDashboard}
                  volumeAtualizacao={bench.volumeAtualizacao} setVolumeAtualizacao={bench.setVolumeAtualizacao}
                  tamanhoBuffer={bench.tamanhoBuffer} setTamanhoBuffer={bench.setTamanhoBuffer}
                  isRodando={bench.isRodando} iniciar={bench.iniciarMonitoramento} parar={bench.pararMonitoramento}
                  resetar={bench.resetarBenchmark}
                />
              )}
              {bench.cenarioAtivo === 'navegacao' && (
                <p className="text-xs text-gray-500 italic">Sem configurações específicas para este cenário.</p>
              )}
            </div>
          </div>
        </aside>
    
        <PainelResultados 
          cenarioAtivo={bench.cenarioAtivo} operacao={bench.operacao} estrutura={bench.estrutura} estruturaDashboard={bench.estruturaDashboard}
          isRodando={bench.isRodando} dadosGerados={bench.dadosGerados} tempoExecucao={bench.tempoExecucao} memoriaConsumida={bench.memoriaConsumida}
          fps={bench.fps} iteracoes={bench.iteracoes} volumeAtualizacao={bench.volumeAtualizacao} qtdItens={bench.qtdItens} tamanhoBuffer={bench.tamanhoBuffer}
        />
      </main>
    </div>
  );
}