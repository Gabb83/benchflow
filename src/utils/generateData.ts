// src/utils/generateData.ts
import { NoNavegacao, NoPlanificado } from "../types/benchmark";

// ==========================================
// CONFIGURAÇÕES E GERADOR DOS CENÁRIOS 1 E 2
// ==========================================

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
  return Array.from({ length: tamanho }, (_, i) => ({
    idx: i,
    nome: `Produto #${i}`,
    categoria: categorias[i % categorias.length],
    isDisponivel: Math.random() > 0.3 ? 1 : 0,
    quantidade: Math.floor(Math.random() * 500),
    preco: parseFloat((Math.random() * 1000).toFixed(2)),
  }));
};

// ==========================================
// ARQUITETURA E GERADOR DO CENÁRIO 3
// ==========================================

/**
 * Gera uma estrutura de árvore hierárquica multinível para simular menus/rotas complexas.
 * @param ramificacao Quantos filhos cada nó terá
 * @param profundidadeMaxima Quantos níveis de aninhamento a árvore terá
 */
export function gerarArvoreNavegacao(ramificacao: number, profundidadeMaxima: number): NoNavegacao[] {
  const raizes: NoNavegacao[] = [];

  // Função interna recursiva para construir os nós filhos
  const herdarFilhos = (idPai: string, nivelAtual: number): NoNavegacao[] => {
    if (nivelAtual > profundidadeMaxima) return [];

    const filhos: NoNavegacao[] = [];
    
    for (let i = 1; i <= ramificacao; i++) {
      const idNo = `${idPai}.${i}`;
      filhos.push({
        id: idNo,
        label: `Menu Nível ${nivelAtual} #${i}`,
        url: `/nav/${idNo.replace(/\./g, '/')}`,
        children: herdarFilhos(idNo, nivelAtual + 1)
      });
    }

    return filhos;
  };

  // Cria os nós principais (Raiz - Nível 1)
  for (let i = 1; i <= ramificacao; i++) {
    const idRaiz = `${i}`;
    raizes.push({
      id: idRaiz,
      label: `Home Categoria ${i}`,
      url: `/nav/${idRaiz}`,
      children: herdarFilhos(idRaiz, 2)
    });
  }

  return raizes;
}

/**
 * Função auxiliar para sortear um ID de nó folha (o mais profundo possível)
 * para usarmos como alvo fixo nos testes de busca.
 */
export function obterIdFolhaAleatorio(ramificacao: number, profundidade: number): string {
  const partes: number[] = [];
  for (let i = 0; i < profundidade; i++) {
    partes.push(Math.floor(Math.random() * ramificacao) + 1);
  }
  return partes.join('.');
}

/**
 * Transforma uma árvore profundamente aninhada em um Map linear indexado por ID
 * pré-calculando caminhos de breadcrumbs para buscas O(1).
 */
export function planificarArvore(arvore: NoNavegacao[]): Map<string, NoPlanificado> {
  const mapaPlanificado = new Map<string, NoPlanificado>();

  const percorrer = (nos: NoNavegacao[], parentId: string | null, caminhoPai: string) => {
    for (const no of nos) {
      const caminhoCompleto = caminhoPai ? `${caminhoPai} ➔ ${no.label}` : no.label;

      mapaPlanificado.set(no.id, {
        id: no.id,
        label: no.label,
        url: no.url,
        parentId,
        caminhoCompleto
      });

      if (no.children && no.children.length > 0) {
        percorrer(no.children, no.id, caminhoCompleto);
      }
    }
  };

  percorrer(arvore, null, "");
  return mapaPlanificado;
}