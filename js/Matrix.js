// classe Matrix: representa uma matriz de dimensão rows x cols
//
// os elementos ficam num array simples (unidimensional)
// pra acessar a posição (i, j) a gente usa: elements[i * cols + j]
//
// exemplo: Matrix(2, 3, [1,2,3,4,5,6]) fica:
//   | 1  2  3 |
//   | 4  5  6 |
class Matrix {
  constructor(rows, cols, elements) {
    // validações dos parâmetros
    if (!Number.isInteger(rows) || rows <= 0) {
      throw new Error('Número de linhas deve ser um inteiro positivo.')
    }
    if (!Number.isInteger(cols) || cols <= 0) {
      throw new Error('Número de colunas deve ser um inteiro positivo.')
    }
    if (!Array.isArray(elements)) {
      throw new Error('Elementos devem ser um array.')
    }
    if (elements.length !== rows * cols) {
      throw new Error(
        `Array de elementos deve ter exatamente ${rows * cols} elementos. Recebido: ${elements.length}.`,
      )
    }

    this.rows = rows
    this.cols = cols
    // copia o array pra evitar que mudanças externas afetem a matriz
    this.elements = [...elements]
  }

  // retorna o valor na posição (i, j) da matriz
  // usa a fórmula: índice = i * colunas + j
  get(i, j) {
    if (i < 0 || i >= this.rows) {
      throw new Error(
        `Índice de linha fora do intervalo. Esperado: 0 a ${this.rows - 1}, recebido: ${i}.`,
      )
    }
    if (j < 0 || j >= this.cols) {
      throw new Error(
        `Índice de coluna fora do intervalo. Esperado: 0 a ${this.cols - 1}, recebido: ${j}.`,
      )
    }
    return this.elements[i * this.cols + j]
  }

  // atribui um valor na posição (i, j) da matriz
  set(i, j, value) {
    if (i < 0 || i >= this.rows) {
      throw new Error(
        `Índice de linha fora do intervalo. Esperado: 0 a ${this.rows - 1}, recebido: ${i}.`,
      )
    }
    if (j < 0 || j >= this.cols) {
      throw new Error(
        `Índice de coluna fora do intervalo. Esperado: 0 a ${this.cols - 1}, recebido: ${j}.`,
      )
    }
    if (typeof value !== 'number' || isNaN(value)) {
      throw new Error('Valor deve ser um número.')
    }
    this.elements[i * this.cols + j] = value
  }

  // retorna uma cópia da matriz, pra não mexer na original
  clone() {
    return new Matrix(this.rows, this.cols, [...this.elements])
  }

  // retorna os elementos da linha i como array
  getRow(i) {
    const row = []
    for (let j = 0; j < this.cols; j++) {
      row.push(this.get(i, j))
    }
    return row
  }

  // substitui a linha i pelos valores do array
  setRow(i, arr) {
    for (let j = 0; j < this.cols; j++) {
      this.set(i, j, arr[j])
    }
  }

  // troca duas linhas da matriz entre si (usado na eliminação gaussiana)
  swapRows(i1, i2) {
    const temp = this.getRow(i1)
    this.setRow(i1, this.getRow(i2))
    this.setRow(i2, temp)
  }

  // retorna a matriz formatada como texto
  toString() {
    let str = ''
    for (let i = 0; i < this.rows; i++) {
      const row = this.getRow(i).map((v) => {
        const rounded = Math.round(v * 1e10) / 1e10
        return rounded.toString()
      })
      str += '| ' + row.join('\t') + ' |\n'
    }
    return str
  }
}
