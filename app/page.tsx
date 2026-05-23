export default function Home() {
  return (
    <div className="bg-[#121212] text-white p-5">
      <header className="flex flex-row items-center justify-between">
        <div>
          <h1 className="text-xl font-black tracking-tighter italic">BenchFlow</h1>
        </div>
        <div className="flex flex-row items-center justify-between gap-5">
          <button>Executar</button>
          <button>Exportar</button>
          <p>MVP v1.0</p>
        </div>
      </header>
    </div>
  );
}
