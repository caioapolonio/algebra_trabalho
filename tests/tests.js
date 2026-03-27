// Script de demonstração — executar no console do navegador (F12)

const la = new LinearAlgebra()

function mostrar(label, resultado) {
  console.log(`${label}:\n${resultado}\n`)
}

// ====== MATRIX ======
console.log('=== MATRIX ===')
const m1 = new Matrix(2, 3, [1, 2, 3, 4, 5, 6])
mostrar('Matriz 2x3', m1)

// ====== VECTOR ======
console.log('=== VECTOR ===')
const v1 = new Vector(3, [10, 20, 30])
mostrar('Vetor 3D', v1)

// ====== TRANSPOSE ======
console.log('=== TRANSPOSE ===')
mostrar('Transposta da matriz 2x3', la.transpose(m1))
mostrar('Transposta do vetor', la.transpose(v1))

// ====== SUM ======
console.log('=== SUM ===')
const mA = new Matrix(2, 2, [1, 2, 3, 4])
const mB = new Matrix(2, 2, [5, 6, 7, 8])
mostrar('Soma de matrizes 2x2', la.sum(mA, mB))

const vA = new Vector(3, [1, 2, 3])
const vB = new Vector(3, [4, 5, 6])
mostrar('Soma de vetores 3D', la.sum(vA, vB))

// ====== TIMES ======
console.log('=== TIMES ===')
mostrar('2 * Matriz', la.times(2, mA))
mostrar('3 * Vetor', la.times(3, vA))
mostrar('Multiplicação de matrizes', la.times(mA, mB))
console.log(`Produto escalar: ${la.times(vA, vB)}\n`)
