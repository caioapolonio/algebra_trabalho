// classe Vector: representa um vetor de dimensão dim
//
// os elementos ficam num array simples
// exemplo: Vector(3, [1, 2, 3]) representa o vetor [1, 2, 3]
class Vector {
  constructor(dim, elements) {
    // validações dos parâmetros
    if (!Number.isInteger(dim) || dim <= 0) {
      throw new Error("Dimensão deve ser um inteiro positivo.");
    }
    if (!Array.isArray(elements)) {
      throw new Error("Elementos devem ser um array.");
    }
    if (elements.length !== dim) {
      throw new Error(
        `Array de elementos deve ter exatamente ${dim} elementos. Recebido: ${elements.length}.`
      );
    }

    this.dim = dim;
    this.elements = [...elements];
  }

  // retorna o valor no índice i do vetor
  get(i) {
    if (i < 0 || i >= this.dim) {
      throw new Error(
        `Índice fora do intervalo. Esperado: 0 a ${this.dim - 1}, recebido: ${i}.`
      );
    }
    return this.elements[i];
  }

  // atribui um valor no índice i do vetor
  set(i, value) {
    if (i < 0 || i >= this.dim) {
      throw new Error(
        `Índice fora do intervalo. Esperado: 0 a ${this.dim - 1}, recebido: ${i}.`
      );
    }
    if (typeof value !== "number" || isNaN(value)) {
      throw new Error("Valor deve ser um número.");
    }
    this.elements[i] = value;
  }

  // retorna uma cópia do vetor
  clone() {
    return new Vector(this.dim, [...this.elements]);
  }

  // retorna o vetor como texto, ex: [1, 2, 3]
  toString() {
    const vals = this.elements.map((v) => {
      return (Math.round(v * 1e10) / 1e10).toString();
    });
    return "[" + vals.join(", ") + "]";
  }
}
