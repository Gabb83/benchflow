import { Registro } from "@/src/utils/generateData";

export type CenarioId = 'busca' | 'dashboard' | 'navegacao';
export type EstruturaId = 'array' | 'map';
export type EstruturaDashboardId = 'array' | 'map' | 'fila';

export interface Cenario {
  id: CenarioId;
  titulo: string;
  subtitulo: string;
  contexto?: string;
}

export interface PerformanceMemory {
  jsHeapSizeLimit: number;
  totalJSHeapSize: number;
  usedJSHeapSize: number;
}

export interface NoNavegacao {
  id: string;
  label: string;
  url: string;
  children: string | any;
}

export interface NoPlanificado {
  id: string;
  label: string;
  url: string;
  parentId: string | null;
  caminhoCompleto: string; 
}

export type EstruturaNavegacaoId = 'arvore_recursiva' | 'mapa_planificado';
export type OperacaoNavegacaoId = 'buscar_breadcrumb' | 'planificar_total';