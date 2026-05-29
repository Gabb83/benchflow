import { Registro } from "@/src/utils/generateData";
import { CenarioId } from "../types/benchmark";

interface PainelResultadosProps {
  cenarioAtivo: CenarioId; operacao: string; estrutura: string; estruturaDashboard: string;
  isRodando: boolean; dadosGerados: Registro[]; tempoExecucao: number | null; memoriaConsumida: number | null;
  fps: number; iteracoes: number; volumeAtualizacao: number; qtdItens: number; tamanhoBuffer: number;
}

export default function PainelResultados({
 cenarioAtivo, operacao, estrutura, estruturaDashboard, isRodando, dadosGerados, tempoExecucao, memoriaConsumida, fps, iteracoes, volumeAtualizacao, qtdItens, tamanhoBuffer 
}: PainelResultadosProps) {
  return (
    <section className="col-span-8 border border-[#1e2939] bg-[#12151b] rounded-2xl p-6 flex flex-col justify-between">
      <div className="flex flex-col h-full justify-between">
        <div>
          <h1 className="text-xl font-semibold mb-2">
            {cenarioAtivo === 'busca' ? `Simulador de ${operacao}` : 'Monitor de Atualização de Dashboard'} em{' '}
            <span className="capitalize text-fuchsia-400">{cenarioAtivo === 'busca' ? estrutura : estruturaDashboard}</span>
          </h1>
          <p className="text-gray-400 text-sm">
            {cenarioAtivo === 'busca' ? 'Mapeamento de performance baseado em dados estruturados estáticos.' : 'Mapeamento de mutação e ingestão de streams de dados em tempo real.'}
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-center min-h-95">
          {cenarioAtivo === 'busca' && isRodando ? (
            <div className="border border-[#1e2939] rounded-xl bg-[#111] p-4 h-95 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-fuchsia-500/20 border-t-fuchsia-500 rounded-full animate-spin"></div>
              <p className="text-gray-500 text-xs tracking-wider animate-pulse">Processando buffers e estruturas...</p>
            </div>
          ) : dadosGerados.length === 0 ? (
            <div className="border border-[#1e2939] rounded-xl bg-[#111] p-4 h-95 flex items-center justify-center text-gray-600 italic">
              [Aguardando execução para renderizar dados amostrais]
            </div>
          ) : (
            <div className="space-y-4">
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

              <div className="border border-[#1e2939] rounded-xl bg-[#111] p-4 h-60 overflow-y-auto font-mono text-xs text-gray-400">
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
  );
}