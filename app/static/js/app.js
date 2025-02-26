document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formAdicionarAluno");
    const escolaInput = document.getElementById("escola");
    const turmaInput = document.getElementById("turma");

    // Restaurar valores salvos da escola e da turma ao carregar a página
    if (localStorage.getItem("escola")) {
        escolaInput.value = localStorage.getItem("escola");
    }
    if (localStorage.getItem("turma")) {
        turmaInput.value = localStorage.getItem("turma");
    }

    // Adicionar aluno ao pressionar o botão
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        let escola = escolaInput.value.trim();
        let turma = turmaInput.value.trim();
        let nome = document.getElementById("aluno").value.trim();

        if (escola !== "" && turma !== "" && nome !== "") {
            adicionarAluno(nome, turma);
            localStorage.setItem("escola", escola); // Salva a escola no localStorage
            localStorage.setItem("turma", turma);   // Salva a turma no localStorage
            document.getElementById("aluno").value = "";
        }
    });

    // Alternar presença no switch
    document.querySelectorAll(".toggle-presenca").forEach(toggle => {
        toggle.addEventListener("change", function () {
            let nome = this.dataset.nome;
            let status = this.checked ? "Presente" : "Falta";
            alterarPresenca(nome, status);

            // Exibir ou ocultar o botão "Falta Justificada" dependendo do status
            let faltaJustificadaButton = this.closest('td').querySelector('.falta-justificada');
            faltaJustificadaButton.style.display = (status === "Falta") ? "inline-block" : "none";
        });
    });

    // Editar observação ao clicar fora da célula
    document.querySelectorAll(".editable").forEach(cell => {
        cell.addEventListener("blur", function () {
            let nome = this.dataset.nome;
            let observacao = this.textContent.trim();
            atualizarObservacao(nome, observacao);
        });
    });
});

// Função para adicionar aluno na tabela (simulação de backend)
function adicionarAluno(nome, turma) {
    let tabela = document.querySelector("table");

    let novaLinha = tabela.insertRow(-1);
    let colunaNome = novaLinha.insertCell(0);
    let colunaPresenca = novaLinha.insertCell(1);
    let colunaObservacao = novaLinha.insertCell(2);

    colunaNome.textContent = nome;

    // Criar o switch de presença
    let switchContainer = document.createElement("label");
    switchContainer.classList.add("switch");

    let inputToggle = document.createElement("input");
    inputToggle.type = "checkbox";
    inputToggle.classList.add("toggle-presenca");
    inputToggle.checked = true; // Garante que o aluno começa com "Presente" (verde)
    inputToggle.dataset.nome = nome;

    let slider = document.createElement("span");
    slider.classList.add("slider");

    switchContainer.appendChild(inputToggle);
    switchContainer.appendChild(slider);
    colunaPresenca.appendChild(switchContainer);

    // Criar botão de falta justificada
    let faltaJustificadaButton = document.createElement("button");
    faltaJustificadaButton.classList.add("falta-justificada");
    faltaJustificadaButton.textContent = "Falta Justificada";
    faltaJustificadaButton.style.display = "none"; // Começa invisível
    colunaPresenca.appendChild(faltaJustificadaButton);

    // Criar observação editável
    colunaObservacao.classList.add("editable");
    colunaObservacao.dataset.nome = nome;
    colunaObservacao.contentEditable = "true";
}
