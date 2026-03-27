// classe LinearAlgebra: contém as operações de álgebra linear
//
// uso:
//   const la = new LinearAlgebra();
//   la.transpose(matriz);
//   la.sum(matrizA, matrizB);
//   la.times(2, matriz);

class LinearAlgebra {
  // retorna a transposta de uma matriz ou vetor
  // transposta = troca linhas por colunas, o elemento (i, j) vai pra (j, i)
  transpose(a) {
    if (a instanceof Matrix) {
      // percorre colunas primeiro, depois linhas, pra inverter as posições
      const elements = []
      for (let j = 0; j < a.cols; j++) {
        for (let i = 0; i < a.rows; i++) {
          elements.push(a.get(i, j))
        }
      }
      // a transposta de uma matriz m x n vira n x m
      return new Matrix(a.cols, a.rows, elements)
    }

    if (a instanceof Vector) {
      // vetor transposto vira uma matriz linha (1 x dim)
      return new Matrix(1, a.dim, [...a.elements])
    }

    throw new Error('Parâmetro deve ser uma instância de Matrix ou Vector.')
  }

  // soma duas matrizes ou dois vetores, elemento a elemento
  // as dimensões precisam ser iguais
  sum(a, b) {
    // soma de matrizes
    if (a instanceof Matrix && b instanceof Matrix) {
      if (a.rows !== b.rows || a.cols !== b.cols) {
        throw new Error(
          `Matrizes devem ter mesmas dimensões para soma. A: ${a.rows}x${a.cols}, B: ${b.rows}x${b.cols}.`,
        )
      }
      // soma cada elemento correspondente
      const elements = []
      for (let i = 0; i < a.elements.length; i++) {
        elements.push(a.elements[i] + b.elements[i])
      }
      return new Matrix(a.rows, a.cols, elements)
    }

    // soma de vetores
    if (a instanceof Vector && b instanceof Vector) {
      if (a.dim !== b.dim) {
        throw new Error(
          `Vetores devem ter mesma dimensão para soma. A: ${a.dim}, B: ${b.dim}.`,
        )
      }
      const elements = []
      for (let i = 0; i < a.dim; i++) {
        elements.push(a.get(i) + b.get(i))
      }
      return new Vector(a.dim, elements)
    }

    if (
      (a instanceof Matrix && b instanceof Vector) ||
      (a instanceof Vector && b instanceof Matrix)
    ) {
      throw new Error(
        'Ambos parâmetros devem ser do mesmo tipo (Matrix ou Vector).',
      )
    }

    throw new Error('Parâmetros devem ser instâncias de Matrix ou Vector.')
  }

  // multiplicação, aceita vários tipos:
  //   escalar x matriz: multiplica cada elemento pelo escalar
  //   escalar x vetor: multiplica cada elemento pelo escalar
  //   matriz x matriz: multiplicação matricial (colunas de A = linhas de B)
  //   vetor x vetor: produto escalar (retorna um número)
  times(a, b) {
    // escalar x matriz
    if (typeof a === 'number' && b instanceof Matrix) {
      const elements = b.elements.map((e) => a * e)
      return new Matrix(b.rows, b.cols, elements)
    }

    // escalar x vetor
    if (typeof a === 'number' && b instanceof Vector) {
      const elements = b.elements.map((e) => a * e)
      return new Vector(b.dim, elements)
    }

    // matriz x matriz (multiplicação matricial)
    if (a instanceof Matrix && b instanceof Matrix) {
      if (a.cols !== b.rows) {
        throw new Error(
          `Para multiplicação de matrizes, o número de colunas de A (${a.cols}) deve ser igual ao número de linhas de B (${b.rows}).`,
        )
      }
      const m = a.rows // linhas do resultado
      const n = a.cols // dimensão compartilhada
      const p = b.cols // colunas do resultado
      const elements = []

      // pra cada posição (i, j) do resultado, soma os produtos A[i,k] * B[k,j]
      for (let i = 0; i < m; i++) {
        for (let j = 0; j < p; j++) {
          let soma = 0
          for (let k = 0; k < n; k++) {
            soma += a.get(i, k) * b.get(k, j)
          }
          elements.push(soma)
        }
      }
      return new Matrix(m, p, elements)
    }

    // vetor x vetor (produto escalar / dot product)
    if (a instanceof Vector && b instanceof Vector) {
      if (a.dim !== b.dim) {
        throw new Error(
          `Vetores devem ter mesma dimensão para produto escalar. A: ${a.dim}, B: ${b.dim}.`,
        )
      }
      // soma dos produtos dos elementos correspondentes
      let soma = 0
      for (let i = 0; i < a.dim; i++) {
        soma += a.get(i) * b.get(i)
      }
      return soma
    }

    throw new Error('Combinação de tipos inválida para multiplicação.')
  }
}
