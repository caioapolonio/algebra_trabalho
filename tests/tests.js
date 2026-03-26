// Testes — executar no console do navegador ou com Node.js

(function () {
  let passed = 0;
  let failed = 0;

  // Cria instância da classe LinearAlgebra
  const la = new LinearAlgebra();

  function assert(condition, msg) {
    if (condition) {
      passed++;
      console.log("  PASS: " + msg);
    } else {
      failed++;
      console.error("  FAIL: " + msg);
    }
  }

  function assertThrows(fn, msg) {
    try {
      fn();
      failed++;
      console.error("  FAIL (sem erro): " + msg);
    } catch (e) {
      passed++;
      console.log("  PASS (erro): " + msg + " -> " + e.message);
    }
  }

  function approx(a, b, tol) {
    return Math.abs(a - b) < (tol || 1e-9);
  }

  // ====== MATRIX ======
  console.log("\n=== MATRIX ===");

  const m1 = new Matrix(2, 3, [1, 2, 3, 4, 5, 6]);
  assert(m1.rows === 2 && m1.cols === 3, "Construtor Matrix 2x3");
  assert(m1.get(0, 0) === 1, "get(0,0) = 1");
  assert(m1.get(0, 2) === 3, "get(0,2) = 3");
  assert(m1.get(1, 1) === 5, "get(1,1) = 5");

  m1.set(1, 2, 99);
  assert(m1.get(1, 2) === 99, "set(1,2,99) funciona");

  assertThrows(() => new Matrix(-1, 2, []), "Rows negativo");
  assertThrows(() => new Matrix(2, 2, [1, 2, 3]), "Array tamanho errado");
  assertThrows(() => m1.get(5, 0), "get fora do intervalo");
  assertThrows(() => m1.set(0, 0, "abc"), "set com string");

  const m1c = m1.clone();
  m1c.set(0, 0, 100);
  assert(m1.get(0, 0) === 1, "Clone não afeta original");

  // ====== VECTOR ======
  console.log("\n=== VECTOR ===");

  const v1 = new Vector(3, [10, 20, 30]);
  assert(v1.dim === 3, "Construtor Vector 3D");
  assert(v1.get(0) === 10, "get(0) = 10");
  assert(v1.get(2) === 30, "get(2) = 30");

  v1.set(1, 99);
  assert(v1.get(1) === 99, "set(1, 99)");

  assertThrows(() => new Vector(2, [1, 2, 3]), "Dim incompatível");
  assertThrows(() => v1.get(5), "get fora do intervalo");

  // ====== TRANSPOSE ======
  console.log("\n=== TRANSPOSE ===");

  const mt = new Matrix(2, 3, [1, 2, 3, 4, 5, 6]);
  const mtT = la.transpose(mt);
  assert(mtT.rows === 3 && mtT.cols === 2, "Transposta 2x3 -> 3x2");
  assert(mtT.get(0, 0) === 1, "T[0,0] = 1");
  assert(mtT.get(0, 1) === 4, "T[0,1] = 4");
  assert(mtT.get(2, 0) === 3, "T[2,0] = 3");
  assert(mtT.get(2, 1) === 6, "T[2,1] = 6");

  const vt = new Vector(3, [1, 2, 3]);
  const vtT = la.transpose(vt);
  assert(vtT instanceof Matrix, "Transposta de Vector retorna Matrix");
  assert(vtT.rows === 1 && vtT.cols === 3, "Vetor transposto é 1x3");

  assertThrows(() => la.transpose(42), "Transposta de número");

  // ====== SUM ======
  console.log("\n=== SUM ===");

  const sa = new Matrix(2, 2, [1, 2, 3, 4]);
  const sb = new Matrix(2, 2, [5, 6, 7, 8]);
  const sr = la.sum(sa, sb);
  assert(sr.get(0, 0) === 6, "Soma [0,0] = 6");
  assert(sr.get(0, 1) === 8, "Soma [0,1] = 8");
  assert(sr.get(1, 0) === 10, "Soma [1,0] = 10");
  assert(sr.get(1, 1) === 12, "Soma [1,1] = 12");

  const va = new Vector(3, [1, 2, 3]);
  const vb = new Vector(3, [4, 5, 6]);
  const vr = la.sum(va, vb);
  assert(vr.get(0) === 5 && vr.get(1) === 7 && vr.get(2) === 9, "Soma vetores");

  assertThrows(
    () => la.sum(new Matrix(2, 2, [1, 2, 3, 4]), new Matrix(3, 3, [1, 2, 3, 4, 5, 6, 7, 8, 9])),
    "Soma dims diferentes"
  );

  // ====== TIMES ======
  console.log("\n=== TIMES ===");

  const em = la.times(2, new Matrix(2, 2, [1, 2, 3, 4]));
  assert(em.get(0, 0) === 2 && em.get(1, 1) === 8, "2 * Matrix");

  const ev = la.times(3, new Vector(2, [1, 2]));
  assert(ev.get(0) === 3 && ev.get(1) === 6, "3 * Vector");

  const ma = new Matrix(2, 2, [1, 2, 3, 4]);
  const mb = new Matrix(2, 2, [5, 6, 7, 8]);
  const mr = la.times(ma, mb);
  assert(mr.get(0, 0) === 19, "MatMul [0,0] = 19");
  assert(mr.get(0, 1) === 22, "MatMul [0,1] = 22");
  assert(mr.get(1, 0) === 43, "MatMul [1,0] = 43");
  assert(mr.get(1, 1) === 50, "MatMul [1,1] = 50");

  const dot = la.times(new Vector(3, [1, 2, 3]), new Vector(3, [4, 5, 6]));
  assert(dot === 32, "Produto escalar = 32");

  assertThrows(
    () => la.times(new Matrix(2, 3, [1, 2, 3, 4, 5, 6]), new Matrix(2, 2, [1, 2, 3, 4])),
    "MatMul dims incompatíveis"
  );

  // ====== GAUSS ======
  console.log("\n=== GAUSS ===");

  const g1 = new Matrix(3, 3, [2, 1, -1, 4, 5, -3, 6, -2, 1]);
  const g1r = la.gauss(g1);
  assert(approx(g1r.get(1, 0), 0), "Gauss: abaixo do pivô é zero [1,0]");
  assert(approx(g1r.get(2, 0), 0), "Gauss: abaixo do pivô é zero [2,0]");
  assert(approx(g1r.get(2, 1), 0), "Gauss: abaixo do pivô é zero [2,1]");

  const g2 = new Matrix(2, 2, [0, 1, 1, 0]);
  const g2r = la.gauss(g2);
  assert(approx(g2r.get(0, 0), 1), "Gauss com troca de linhas");

  // ====== SOLVE ======
  console.log("\n=== SOLVE ===");

  // x + y = 3, 2x - y = 0  =>  x=1, y=2
  const s1 = new Matrix(2, 3, [1, 1, 3, 2, -1, 0]);
  const s1r = la.solve(s1);
  assert(approx(s1r.get(0, 2), 1), "Solve 2x2: x = 1");
  assert(approx(s1r.get(1, 2), 2), "Solve 2x2: y = 2");

  // 2x+y-z=8, -3x-y+2z=-11, -2x+y+2z=-3  =>  x=2, y=3, z=-1
  const s2 = new Matrix(3, 4, [2, 1, -1, 8, -3, -1, 2, -11, -2, 1, 2, -3]);
  const s2r = la.solve(s2);
  assert(approx(s2r.get(0, 3), 2), "Solve 3x3: x = 2");
  assert(approx(s2r.get(1, 3), 3), "Solve 3x3: y = 3");
  assert(approx(s2r.get(2, 3), -1), "Solve 3x3: z = -1");

  // Sistema impossível
  assertThrows(
    () => la.solve(new Matrix(2, 3, [1, 1, 1, 1, 1, 2])),
    "Sistema impossível"
  );

  // ====== RESUMO ======
  console.log("\n============================");
  console.log(`Total: ${passed + failed} | Passou: ${passed} | Falhou: ${failed}`);
  console.log("============================\n");
})();
