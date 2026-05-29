import { Registro } from "@/src/utils/generateData";

export class Fila {
  itens: { [key: number]: Registro } = {};
  inicio = 0;
  fim = 0;

  enqueue(item: Registro) {
    this.itens[this.fim] = item;
    this.fim++;
  }

  dequeue() {
    if (this.inicio === this.fim) return null;
    const item = this.itens[this.inicio];
    delete this.itens[this.inicio];
    this.inicio++;
    return item;
  }

  toSortedArray() {
    return Object.values(this.itens).reverse().slice(0, 5);
  }

  get tamanho() {
    return this.fim - this.inicio;
  }
}