export default function Home() {
  return (
    <div className="bg-[#111111] text-white">
      <header className="bg-[#121212] p-5 flex flex-row items-center justify-between">
        <div>
          <h1 className="text-xl font-black tracking-tighter italic">BenchFlow.</h1>
        </div>
        <div className="flex flex-row items-center justify-between gap-5">
          <button>Executar</button>
          <button>Exportar</button>
          <p>MVP v1.0</p>
        </div>
      </header>
      
      <main className="grid grid-cols-12 gap-4 p-4 min-h-130">
        <aside className="col-span-4 flex flex-row gap-3">
          <div className="min-h-130 flex-1 border border-[#1e2939] rounded-2xl p-4 bg-[#12151b] text-white shadow-sm flex flex-col gap-6 h-fit">
            <h2 className="text-center font-bold  uppercase tracking-wider text-sm">CENÁRIOS EXPERIMENTAIS</h2>
            <div className="flex flex-col gap-4">
              <button type="button" className="w-full bg-[#1e2939] rounded-lg p-3 text-left cursor-pointer">
                <span className="block font-medium text-sm">Busca e Filtragem</span>
                <span className="block text-sm ">listas dinâmicas</span>
              </button>
              <button type="button" className="w-full bg-[#1e2939] rounded-lg p-3 text-left">
                <span className="block font-medium  text-sm">Dashboard</span>
                <span className="block text-xs ">atualização dinâmica</span>
              </button>
              <button type="button" className="w-full bg-[#1e2939] rounded-lg p-3 text-left">
                <span className="block font-medium  text-sm">Navegação</span>
                <span className="block text-xs ">hierarquia multinível</span>
              </button>
            </div>
            <div className="text-center border-dashed border-[#4b6fa7]">
              <p>Status</p>
              <p>Execuções</p>
              <p>Último</p>
            </div>
          </div>

          <div className="min-h-130 flex-1 border border-[#1e2939]  bg-[#12151b] rounded-2xl p-4 shadow-sm flex flex-col gap-4 h-fit">
            <h2 className="text-center font-bold  uppercase tracking-wider text-sm">CONFIGURAÇÃO</h2>
            <div className="flex flex-col gap-2">
            </div>
          </div>
        </aside>
    
        <section className="col-span-8  border border-[#1e2939]  bg-[#12151b] rounded-2xl p-3 ">
          <h1 className="text-xl font-semibold  mb-4">Conteúdo Principal</h1>
          <p className="">Seu conteúdo ou dashboards vão aqui...</p>
        </section>
      </main>
    </div>
  );
}
