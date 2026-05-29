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