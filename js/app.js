document.addEventListener("DOMContentLoaded", () => {
  // Cria uma instância da classe LinearAlgebra para usar os métodos
  const la = new LinearAlgebra();

  const selOperacao = document.getElementById("operacao");
  const secaoA = document.getElementById("input-a");
  const secaoB = document.getElementById("input-b");
  const secaoAcoes = document.getElementById("acoes");
  const secaoExemplos = document.getElementById("exemplos");
  const secaoResultado = document.getElementById("resultado");
  const secaoErro = document.getElementById("erro");
  const divResultado = document.getElementById("resultado-conteudo");
  const divErro = document.getElementById("erro-conteudo");
  const btnCalcular = document.getElementById("calcular");

  const tipoA = document.getElementById("tipo-a");
  const tipoB = document.getElementById("tipo-b");
  const rowsA = document.getElementById("rows-a");
  const colsA = document.getElementById("cols-a");
  const rowsB = document.getElementById("rows-b");
  const colsB = document.getElementById("cols-b");
  const btnGerarA = document.getElementById("gerar-a");
  const btnGerarB = document.getElementById("gerar-b");
  const gridA = document.getElementById("grid-a");
  const gridB = document.getElementById("grid-b");
  const dimsA = document.getElementById("dims-a");
  const dimsB = document.getElementById("dims-b");

  // Configuração de cada operação: quantas entradas precisa e quais tipos aceita
  const CONFIG = {
    transpose: { inputs: 1, tiposA: ["matrix", "vector"], label: "Transposta" },
    sum: { inputs: 2, tiposA: ["matrix", "vector"], tiposB: ["matrix", "vector"], label: "Soma" },
    times: { inputs: 2, tiposA: ["matrix", "vector"], tiposB: ["matrix", "vector", "escalar"], label: "Multiplicação" },
  };

  // Exemplos prontos para facilitar a demonstração
  const EXEMPLOS = {
    transpose: [
      { nome: "Matriz 2x3", a: { tipo: "matrix", rows: 2, cols: 3, vals: [1,2,3,4,5,6] } },
      { nome: "Vetor 3D", a: { tipo: "vector", rows: 3, cols: 1, vals: [1,2,3] } },
    ],
    sum: [
      { nome: "Matrizes 2x2", a: { tipo: "matrix", rows: 2, cols: 2, vals: [1,2,3,4] }, b: { tipo: "matrix", rows: 2, cols: 2, vals: [5,6,7,8] } },
      { nome: "Vetores 3D", a: { tipo: "vector", rows: 3, cols: 1, vals: [1,2,3] }, b: { tipo: "vector", rows: 3, cols: 1, vals: [4,5,6] } },
    ],
    times: [
      { nome: "Matrizes 2x2", a: { tipo: "matrix", rows: 2, cols: 2, vals: [1,2,3,4] }, b: { tipo: "matrix", rows: 2, cols: 2, vals: [5,6,7,8] } },
      { nome: "Escalar x Matriz", a: { tipo: "matrix", rows: 2, cols: 2, vals: [1,2,3,4] }, b: { tipo: "escalar", vals: [3] } },
      { nome: "Produto Escalar", a: { tipo: "vector", rows: 3, cols: 1, vals: [1,2,3] }, b: { tipo: "vector", rows: 3, cols: 1, vals: [4,5,6] } },
    ],
  };

  // --- Funções utilitárias ---
  function esconder(...els) {
    els.forEach((el) => (el.style.display = "none"));
  }

  function mostrar(...els) {
    els.forEach((el) => (el.style.display = ""));
  }

  function limparGrid(grid) {
    grid.innerHTML = "";
  }

  // Atualiza os campos de dimensão conforme o tipo selecionado
  function atualizarDims(tipoSel, dimsEl, rowsEl, colsEl) {
    const tipo = tipoSel.value;
    if (tipo === "vector") {
      colsEl.parentElement.style.display = "none";
      rowsEl.parentElement.childNodes[0].textContent = "Dimensão: ";
    } else if (tipo === "escalar") {
      dimsEl.style.display = "none";
    } else {
      colsEl.parentElement.style.display = "";
      dimsEl.style.display = "";
      rowsEl.parentElement.childNodes[0].textContent = "Linhas: ";
    }
  }

  // Gera os campos de entrada (grid de inputs) para matriz, vetor ou escalar
  function gerarGrid(grid, tipo, rows, cols) {
    limparGrid(grid);

    if (tipo === "escalar") {
      grid.innerHTML = `<div class="escalar-input"><label>Valor: <input type="number" class="cell" data-i="0" data-j="0" value="1" step="any"></label></div>`;
      return;
    }

    const r = rows;
    const c = tipo === "vector" ? 1 : cols;

    const wrapper = document.createElement("div");
    wrapper.className = "matrix-grid";

    for (let i = 0; i < r; i++) {
      const rowDiv = document.createElement("div");
      rowDiv.className = "grid-row";
      for (let j = 0; j < c; j++) {
        const input = document.createElement("input");
        input.type = "number";
        input.step = "any";
        input.value = "0";
        input.className = "cell";
        input.dataset.i = i;
        input.dataset.j = j;
        rowDiv.appendChild(input);
      }
      wrapper.appendChild(rowDiv);
    }
    grid.appendChild(wrapper);
  }

  // Preenche o grid com valores de um exemplo pronto
  function preencherGrid(grid, vals) {
    const inputs = grid.querySelectorAll(".cell");
    vals.forEach((v, idx) => {
      if (inputs[idx]) inputs[idx].value = v;
    });
  }

  // Lê os valores do grid e cria o objeto correspondente (Matrix, Vector ou número)
  function lerEntrada(grid, tipoSel, rowsEl, colsEl) {
    const tipo = tipoSel.value;

    if (tipo === "escalar") {
      const input = grid.querySelector(".cell");
      const val = parseFloat(input.value);
      if (isNaN(val)) throw new Error("Valor escalar inválido.");
      return val;
    }

    const inputs = grid.querySelectorAll(".cell");
    if (inputs.length === 0) throw new Error("Gere o grid antes de calcular.");

    const elements = Array.from(inputs).map((inp) => {
      const v = parseFloat(inp.value);
      if (isNaN(v)) throw new Error(`Valor inválido: "${inp.value}".`);
      return v;
    });

    if (tipo === "vector") {
      const dim = parseInt(rowsEl.value);
      return new Vector(dim, elements);
    }

    const rows = parseInt(rowsEl.value);
    const cols = parseInt(colsEl.value);
    return new Matrix(rows, cols, elements);
  }

  // Arredonda para evitar exibir números como 0.30000000000000004
  function arredondar(v) {
    return Math.round(v * 1e10) / 1e10;
  }

  // Exibe o resultado na página conforme o tipo (número, vetor ou matriz)
  function renderResultado(res) {
    divResultado.innerHTML = "";

    if (typeof res === "number") {
      divResultado.innerHTML = `<div class="result-scalar">${arredondar(res)}</div>`;
      return;
    }

    if (res instanceof Vector) {
      const vals = res.elements.map(arredondar).join(", ");
      divResultado.innerHTML = `<div class="result-vector">[ ${vals} ]</div>`;
      return;
    }

    if (res instanceof Matrix) {
      const wrapper = document.createElement("div");
      wrapper.className = "result-matrix";

      for (let i = 0; i < res.rows; i++) {
        const rowDiv = document.createElement("div");
        rowDiv.className = "grid-row";
        for (let j = 0; j < res.cols; j++) {
          const cell = document.createElement("span");
          cell.className = "result-cell";
          cell.textContent = arredondar(res.get(i, j));
          rowDiv.appendChild(cell);
        }
        wrapper.appendChild(rowDiv);
      }
      divResultado.appendChild(wrapper);

    }
  }

  function mostrarErro(msg) {
    divErro.textContent = msg;
    mostrar(secaoErro);
    esconder(secaoResultado);
  }

  function mostrarResultadoFinal(res) {
    renderResultado(res);
    mostrar(secaoResultado);
    esconder(secaoErro);
  }

  // Popula o dropdown de tipo com as opções disponíveis para a operação
  function populateTipoSelect(sel, tipos) {
    sel.innerHTML = "";
    const labels = { matrix: "Matriz", vector: "Vetor", escalar: "Escalar" };
    tipos.forEach((t) => {
      const opt = document.createElement("option");
      opt.value = t;
      opt.textContent = labels[t];
      sel.appendChild(opt);
    });
  }

  // --- Eventos ---

  // Quando o usuário seleciona uma operação, mostra os campos de entrada apropriados
  selOperacao.addEventListener("change", () => {
    const op = selOperacao.value;
    esconder(secaoA, secaoB, secaoAcoes, secaoExemplos, secaoResultado, secaoErro);
    limparGrid(gridA);
    limparGrid(gridB);

    if (!op || !CONFIG[op]) return;

    const cfg = CONFIG[op];

    populateTipoSelect(tipoA, cfg.tiposA);
    atualizarDims(tipoA, dimsA, rowsA, colsA);
    mostrar(secaoA, secaoAcoes);

    if (cfg.inputs === 2) {
      populateTipoSelect(tipoB, cfg.tiposB);
      atualizarDims(tipoB, dimsB, rowsB, colsB);
      mostrar(secaoB);
    }

    // Mostra os botões de exemplos prontos
    if (EXEMPLOS[op]) {
      const container = secaoExemplos.querySelector(".exemplos-btns");
      container.innerHTML = "";
      EXEMPLOS[op].forEach((ex) => {
        const btn = document.createElement("button");
        btn.className = "btn btn-exemplo";
        btn.textContent = ex.nome;
        btn.addEventListener("click", () => carregarExemplo(ex));
        container.appendChild(btn);
      });
      mostrar(secaoExemplos);
    }
  });

  tipoA.addEventListener("change", () => {
    atualizarDims(tipoA, dimsA, rowsA, colsA);
    limparGrid(gridA);
  });

  tipoB.addEventListener("change", () => {
    atualizarDims(tipoB, dimsB, rowsB, colsB);
    limparGrid(gridB);
  });

  btnGerarA.addEventListener("click", () => {
    const tipo = tipoA.value;
    const rows = parseInt(rowsA.value);
    const cols = parseInt(colsA.value);
    gerarGrid(gridA, tipo, rows, cols);
  });

  btnGerarB.addEventListener("click", () => {
    const tipo = tipoB.value;
    const rows = parseInt(rowsB.value);
    const cols = parseInt(colsB.value);
    gerarGrid(gridB, tipo, rows, cols);
  });

  // Carrega um exemplo pronto nos campos de entrada
  function carregarExemplo(ex) {
    const op = selOperacao.value;
    const cfg = CONFIG[op];

    tipoA.value = ex.a.tipo;
    atualizarDims(tipoA, dimsA, rowsA, colsA);
    rowsA.value = ex.a.rows;
    colsA.value = ex.a.cols;
    gerarGrid(gridA, ex.a.tipo, ex.a.rows, ex.a.cols);
    preencherGrid(gridA, ex.a.vals);

    if (ex.b && cfg.inputs === 2) {
      tipoB.value = ex.b.tipo;
      atualizarDims(tipoB, dimsB, rowsB, colsB);
      if (ex.b.tipo === "escalar") {
        gerarGrid(gridB, "escalar", 1, 1);
        preencherGrid(gridB, ex.b.vals);
      } else {
        rowsB.value = ex.b.rows;
        colsB.value = ex.b.cols;
        gerarGrid(gridB, ex.b.tipo, ex.b.rows, ex.b.cols);
        preencherGrid(gridB, ex.b.vals);
      }
    }
  }

  // Botão calcular: lê as entradas, executa a operação e mostra o resultado
  btnCalcular.addEventListener("click", () => {
    try {
      esconder(secaoResultado, secaoErro);
      const op = selOperacao.value;
      if (!op) throw new Error("Selecione uma operação.");

      const a = lerEntrada(gridA, tipoA, rowsA, colsA);
      let resultado;

      if (op === "transpose") {
        resultado = la.transpose(a);
      } else if (op === "sum") {
        const b = lerEntrada(gridB, tipoB, rowsB, colsB);
        resultado = la.sum(a, b);
      } else if (op === "times") {
        let b = lerEntrada(gridB, tipoB, rowsB, colsB);
        // Se b é escalar, passa como primeiro argumento: times(escalar, objeto)
        if (typeof b === "number") {
          resultado = la.times(b, a);
        } else if (typeof a === "number") {
          resultado = la.times(a, b);
        } else {
          resultado = la.times(a, b);
        }
      }

      mostrarResultadoFinal(resultado);
    } catch (e) {
      mostrarErro(e.message);
    }
  });
});
