export interface Registro {
  idx: number;
  nome: string;
  categoria: string;
  isDisponivel: number;
  quantidade: number;
  preco: number;
}

const categorias = [
  "Alimentos",
  "Roupas",
  "Eletrônicos",
  "Ferramentas",
  "Bebidas",
  "Móveis",
  "Livros",
  "Beleza",
  "Esportes",
  "Automóveis",
  "Pets"
];

export const geracaoDeDados = (tamanho: number): Registro[] => {
  return Array.from({length: tamanho}, (_, i) => ({
    idx: i,
    nome: `Produto #${i}`,
    categoria: categorias[i % categorias.length],
    isDisponivel: Math.random() > 0.3 ? 1 : 0,
    quantidade: Math.floor(Math.random() * 500),
    preco: parseFloat((Math.random() * 1000).toFixed(2)),
  }));
};