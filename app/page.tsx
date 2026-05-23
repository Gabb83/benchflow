"use client"; // Necessário se estiver usando a App Router do Next.js

import { useState } from "react";

// 1. Definição dos tipos para organizar as opções
type CenarioId = 'busca' | 'dashboard' | 'navegacao';

interface Cenario {
  id: CenarioId;
  titulo: string;
  subtitulo: string;
}

export default function Home() {
  // 2. Estado para controlar qual cenário está ativo
  const [cenarioAtivo, setCenarioAtivo] = useState<CenarioId>('busca');

  // Lista de cenários (para evitar repetição de código no HTML)
  const cenarios: Cenario[] = [
    { id: 'busca', titulo: 'Busca e Filtragem', subtitulo: 'listas dinâmicas' },
    { id: 'dashboard', titulo: 'Dashboard', subtitulo: 'atualização dinâmica' },
    { id: 'navegacao', titulo: 'Navegação', subtitulo: 'hierarquia multinível' },
  ];

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
              <p>• Status: <span className="text-gray-300">Pronto</span></p>
              <p>• Execuções: <span className="text-gray-300">12</span></p>
              <p>• Último teste: <span className="text-gray-300">Há 5m</span></p>
            </div>
          </div>

          {/* COLUNA 2: CONFIGURAÇÃO DINÂMICA */}
          <div className="flex-1 border border-[#1e2939] bg-[#12151b] rounded-2xl p-4 shadow-sm flex flex-col gap-4">
            <h2 className="text-center font-bold uppercase tracking-wider text-xs text-gray-400">CONFIGURAÇÃO</h2>
            <div className="flex flex-col gap-4 mt-2">
              {cenarioAtivo === 'busca' && (
                <div className="space-y-2 animation-fadeIn">
                  <div className="pt-2 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                       <button className="bg-[#1e2939] hover:bg-[#253347] text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors shadow-lg shadow-fuchsia-900/20 cursor-pointer">
                        Array
                      </button>
                      
                      {/* TOQUE DE FUCHSIA: Botão de destaque secundário */}
                      <button className="bg-[#1e2939] hover:bg-[#253347] text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors shadow-lg shadow-fuchsia-900/20 cursor-pointer">
                        Map
                      </button>
                    </div>
                  </div>

                  <label className="block text-xs font-semibold text-gray-400">QTD. DE ITENS NA LISTA</label>
                  <input type="number" defaultValue={1000} className="w-full bg-[#111] border border-[#1e2939] rounded px-3 py-1.5 text-sm" />
                  
                  <label className="block text-xs font-semibold text-gray-400">OPERAÇÃO</label>
                  <select className="w-full bg-[#111] border border-[#1e2939] rounded px-3 py-1.5 text-sm">
                    <option>Busca</option>
                    <option>Filtragem</option>
                    <option>Ordenação</option>
                  </select>

                  <label className="block text-xs font-semibold text-gray-400">ITERAÇÕES</label>
                  <input type="number" defaultValue={1000} className="w-full bg-[#111] border border-[#1e2939] rounded px-3 py-1.5 text-sm" />

                  <div className="pt-2 space-y-2">
                    <button className="w-full bg-[#1e2939] hover:bg-[#253347] text-white text-xs font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer">
                      Executar Benchmark
                    </button>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <button className="border border-[#1e2939] hover:bg-[#1e2939]/30 text-gray-400 hover:text-white text-xs font-semibold py-2 px-3 rounded-lg transition-all cursor-pointer">
                        Resetar
                      </button>
                      
                      {/* TOQUE DE FUCHSIA: Botão de destaque secundário */}
                      <button className="bg-fuchsia-700 hover:bg-fuchsia-600 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors shadow-lg shadow-fuchsia-900/20 cursor-pointer">
                        Comparar
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-[#1e2939]/50 pt-4 mt-6">
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
    
        {/* COLUNA 3: CONTEÚDO PRINCIPAL DINÂMICO */}
        <section className="col-span-8 border border-[#1e2939] bg-[#12151b] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            {cenarioAtivo === 'busca' && (
              <div>
                <h1 className="text-xl font-semibold mb-2">Simulador de Busca e Filtragem</h1>
                <p className="text-gray-400 text-sm mb-4">Mapeamento de performance para renderização de listas complexas.</p>
                <div className="border border-[#1e2939] p-4 rounded-lg bg-[#111] h-64 flex items-center justify-center text-gray-500">
                  [Gráfico ou Tabela de Carga da Lista]
                </div>
              </div>
            )}

            {cenarioAtivo === 'dashboard' && (
              <div>
                <h1 className="text-xl font-semibold mb-2">Métricas do Dashboard Dinâmico</h1>
                <p className="text-gray-400 text-sm mb-4 font-mono text-xs text-amber-500">FPS / Memory Leak Analysis</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-[#1e2939] p-4 rounded-lg bg-[#111]">FPS Estável: 60fps</div>
                  <div className="border border-[#1e2939] p-4 rounded-lg bg-[#111]">Uso de CPU: 4%</div>
                </div>
              </div>
            )}

            {cenarioAtivo === 'navegacao' && (
              <div>
                <h1 className="text-xl font-semibold mb-2">Estrutura de Navegação Multinível</h1>
                <p className="text-gray-400 text-sm mb-4">Profundidade máxima recomendada de nós na árvore DOM.</p>
                <div className="border border-[#1e2939] p-4 rounded-lg bg-[#111] h-64 flex items-center justify-center text-gray-500">
                  [Visualizador da Árvore de Componentes]
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}