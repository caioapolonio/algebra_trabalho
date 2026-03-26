// classe LinearAlgebra: contém as operações de álgebra linear
//
// uso:
//   const la = new LinearAlgebra();
//   la.transpose(matriz);
//   la.sum(matrizA, matrizB);
//   la.times(2, matriz);
//   la.gauss(matriz);
//   la.solve(matrizAumentada);
class LinearAlgebra {

  // retorna a transposta de uma matriz ou vetor
  // transposta = troca linhas por colunas, o elemento (i, j) vai pra (j, i)
  transpose(a) {
    if (a instanceof Matrix) {
      // percorre colunas primeiro, depois linhas, pra inverter as posições
      const elements = [];
      for (let j = 0; j < a.cols; j++) {
        for (let i = 0; i < a.rows; i++) {
          elements.push(a.get(i, j));
        }
      }
      // a transposta de uma matriz m x n vira n x m
      return new Matrix(a.cols, a.rows, elements);
    }

    if (a instanceof Vector) {
      // vetor transposto vira uma matriz linha (1 x dim)
      return new Matrix(1, a.dim, [...a.elements]);
    }

    throw new Error("Parâmetro deve ser uma instância de Matrix ou Vector.");
  }

  // soma duas matrizes ou dois vetores, elemento a elemento
  // as dimensões precisam ser iguais
  sum(a, b) {
    // soma de matrizes
    if (a instanceof Matrix && b instanceof Matrix) {
      if (a.rows !== b.rows || a.cols !== b.cols) {
        throw new Error(
          `Matrizes devem ter mesmas dimensões para soma. A: ${a.rows}x${a.cols}, B: ${b.rows}x${b.cols}.`
        );
      }
      // soma cada elemento correspondente
      const elements = [];
      for (let i = 0; i < a.elements.length; i++) {
        elements.push(a.elements[i] + b.elements[i]);
      }
      return new Matrix(a.rows, a.cols, elements);
    }

    // soma de vetores
    if (a instanceof Vector && b instanceof Vector) {
      if (a.dim !== b.dim) {
        throw new Error(
          `Vetores devem ter mesma dimensão para soma. A: ${a.dim}, B: ${b.dim}.`
        );
      }
      const elements = [];
      for (let i = 0; i < a.dim; i++) {
        elements.push(a.get(i) + b.get(i));
      }
      return new Vector(a.dim, elements);
    }

    if ((a instanceof Matrix && b instanceof Vector) ||
        (a instanceof Vector && b instanceof Matrix)) {
      throw new Error("Ambos parâmetros devem ser do mesmo tipo (Matrix ou Vector).");
    }

    throw new Error("Parâmetros devem ser instâncias de Matrix ou Vector.");
  }

  // multiplicação, aceita vários tipos:
  //   escalar x matriz: multiplica cada elemento pelo escalar
  //   escalar x vetor: multiplica cada elemento pelo escalar
  //   matriz x matriz: multiplicação matricial (colunas de A = linhas de B)
  //   vetor x vetor: produto escalar (retorna um número)
  times(a, b) {
    // escalar x matriz
    if (typeof a === "number" && b instanceof Matrix) {
      const elements = b.elements.map((e) => a * e);
      return new Matrix(b.rows, b.cols, elements);
    }

    // escalar x vetor
    if (typeof a === "number" && b instanceof Vector) {
      const elements = b.elements.map((e) => a * e);
      return new Vector(b.dim, elements);
    }

    // matriz x matriz (multiplicação matricial)
    if (a instanceof Matrix && b instanceof Matrix) {
      if (a.cols !== b.rows) {
        throw new Error(
          `Para multiplicação de matrizes, o número de colunas de A (${a.cols}) deve ser igual ao número de linhas de B (${b.rows}).`
        );
      }
      const m = a.rows;   // linhas do resultado
      const n = a.cols;   // dimensão compartilhada
      const p = b.cols;   // colunas do resultado
      const elements = [];

      // pra cada posição (i, j) do resultado, soma os produtos A[i,k] * B[k,j]
      for (let i = 0; i < m; i++) {
        for (let j = 0; j < p; j++) {
          let soma = 0;
          for (let k = 0; k < n; k++) {
            soma += a.get(i, k) * b.get(k, j);
          }
          elements.push(soma);
        }
      }
      return new Matrix(m, p, elements);
    }

    // vetor x vetor (produto escalar / dot product)
    if (a instanceof Vector && b instanceof Vector) {
      if (a.dim !== b.dim) {
        throw new Error(
          `Vetores devem ter mesma dimensão para produto escalar. A: ${a.dim}, B: ${b.dim}.`
        );
      }
      // soma dos produtos dos elementos correspondentes
      let soma = 0;
      for (let i = 0; i < a.dim; i++) {
        soma += a.get(i) * b.get(i);
      }
      return soma;
    }

    throw new Error("Combinação de tipos inválida para multiplicação.");
  }

  // eliminação gaussiana: transforma a matriz em forma escalonada
  // (triangular superior), zerando os elementos abaixo de cada pivô
  //
  // usa pivoteamento parcial: escolhe como pivô o maior valor absoluto
  // na coluna, pra evitar divisão por zero e melhorar a precisão
  gauss(a) {
    if (!(a instanceof Matrix)) {
      throw new Error("Parâmetro deve ser uma instância de Matrix.");
    }

    // clona pra não mexer na matriz original
    const M = a.clone();
    const numLinhas = M.rows;
    const numColunas = M.cols;
    let linhaAtual = 0;

    for (let col = 0; col < Math.min(numLinhas, numColunas) && linhaAtual < numLinhas; col++) {
      // pivoteamento parcial: acha a linha com o maior valor absoluto nesta coluna
      let linhaPivo = linhaAtual;
      let maxVal = Math.abs(M.get(linhaAtual, col));
      for (let i = linhaAtual + 1; i < numLinhas; i++) {
        const val = Math.abs(M.get(i, col));
        if (val > maxVal) {
          maxVal = val;
          linhaPivo = i;
        }
      }

      // se o pivô é zero, não tem como eliminar nesta coluna, pula
      if (Math.abs(M.get(linhaPivo, col)) < 1e-10) {
        continue;
      }

      // troca linhas pra colocar o maior pivô na posição atual
      if (linhaPivo !== linhaAtual) {
        M.swapRows(linhaAtual, linhaPivo);
      }

      const pivo = M.get(linhaAtual, col);

      // elimina os elementos abaixo do pivô
      for (let i = linhaAtual + 1; i < numLinhas; i++) {
        const fator = M.get(i, col) / pivo;
        for (let j = col; j < numColunas; j++) {
          M.set(i, j, M.get(i, j) - fator * M.get(linhaAtual, j));
        }
        // força zero pra evitar erro de ponto flutuante
        M.set(i, col, 0);
      }

      linhaAtual++;
    }

    return M;
  }

  // resolve um sistema de equações lineares pelo método de Gauss-Jordan
  // recebe uma matriz aumentada [A|b] e retorna na forma [I|x],
  // onde x é o vetor solução
  //
  // o algoritmo tem duas fases:
  //   1. eliminação pra frente: zera abaixo dos pivôs e normaliza cada pivô pra 1
  //   2. eliminação pra trás: zera acima dos pivôs
  solve(a) {
    if (!(a instanceof Matrix)) {
      throw new Error("Parâmetro deve ser uma instância de Matrix.");
    }

    if (a.cols < a.rows + 1) {
      throw new Error(
        `Matriz aumentada deve ter pelo menos ${a.rows + 1} colunas. Recebido: ${a.cols}.`
      );
    }

    const M = a.clone();
    const n = M.rows;

    // fase 1: eliminação pra frente
    for (let col = 0; col < n; col++) {
      // pivoteamento parcial
      let linhaPivo = col;
      let maxVal = Math.abs(M.get(col, col));
      for (let i = col + 1; i < n; i++) {
        const val = Math.abs(M.get(i, col));
        if (val > maxVal) {
          maxVal = val;
          linhaPivo = i;
        }
      }

      // pivô zero = sistema não tem solução única
      if (Math.abs(M.get(linhaPivo, col)) < 1e-10) {
        throw new Error(
          `Sistema não possui solução única (pivô zero encontrado na coluna ${col}).`
        );
      }

      // troca linhas se precisar
      if (linhaPivo !== col) {
        M.swapRows(col, linhaPivo);
      }

      // normaliza a linha do pivô, divide tudo pelo valor do pivô
      // isso faz o pivô virar 1
      const pivo = M.get(col, col);
      for (let j = 0; j < M.cols; j++) {
        M.set(col, j, M.get(col, j) / pivo);
      }

      // elimina os elementos abaixo do pivô
      for (let i = col + 1; i < n; i++) {
        const fator = M.get(i, col);
        for (let j = 0; j < M.cols; j++) {
          M.set(i, j, M.get(i, j) - fator * M.get(col, j));
        }
        M.set(i, col, 0);
      }
    }

    // fase 2: eliminação pra trás
    // percorre de baixo pra cima, zerando os elementos acima de cada pivô
    for (let col = n - 1; col >= 0; col--) {
      for (let i = 0; i < col; i++) {
        const fator = M.get(i, col);
        for (let j = 0; j < M.cols; j++) {
          M.set(i, j, M.get(i, j) - fator * M.get(col, j));
        }
        M.set(i, col, 0);
      }
    }

    // o resultado é [I|x], a solução fica na última coluna
    return M;
  }
}
