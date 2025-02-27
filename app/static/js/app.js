document.addEventListener("DOMContentLoaded", function () {
    const statusPresenca = {}; // Armazena o status de presença de cada aluno
    const dataHojeElement = document.getElementById("dataHoje");
    const dataHoje = new Date().toLocaleDateString('pt-BR');
    dataHojeElement.textContent = dataHoje;

    const form = document.getElementById("formAdicionarAluno");
    const escolaInput = document.getElementById("escola");
    const turmaInput = document.getElementById("turma");

    // Adicionar aluno
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        let escola = escolaInput.value.trim();
        let turma = turmaInput.value.trim();
        let nome = document.getElementById("aluno").value.trim();

        if (escola !== "" && turma !== "" && nome !== "") {
            adicionarAluno(nome, turma);
            document.getElementById("aluno").value = "";
        }
    });

    // Delegar eventos de clique
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("status-button")) {
            let nome = event.target.dataset.nome;
            let status = event.target.classList.contains('p') ? "Presente" : 
                         event.target.classList.contains('f') ? "Falta" : "Falta Justificada";
            statusPresenca[nome] = status;
            atualizarInterfaceStatus(nome, status);
            const botoesAluno = document.querySelectorAll(`.status-button[data-nome="${nome}"]`);
            botoesAluno.forEach(btn => btn.classList.remove('selected'));
            event.target.classList.add('selected');
        }

        // Excluir aluno
        if (event.target.classList.contains("btn-excluir")) {
            const nome = event.target.dataset.nome;
            if (confirm(`Tem certeza que deseja excluir o aluno ${nome}?`)) {
                excluirAluno(nome);
            }
        }
    });

    // Editar nome do aluno com duplo clique
    document.addEventListener("dblclick", function (event) {
        if (event.target.classList.contains("nome-aluno")) {
            const nomeAtual = event.target.dataset.nome;
            const novoNome = prompt("Digite o novo nome do aluno:", nomeAtual);
            if (novoNome && novoNome.trim() !== "") {
                editarNomeAluno(nomeAtual, novoNome.trim());
            }
        }
    });

    // Função para adicionar aluno
    function adicionarAluno(nome, turma) {
        let tabela = document.querySelector("table");
        let novaLinha = tabela.insertRow(-1);
        novaLinha.setAttribute("data-nome", nome);

        let colunaNome = novaLinha.insertCell(0);
        let colunaPresenca = novaLinha.insertCell(1);
        let colunaObservacao = novaLinha.insertCell(2);

        // Nome do aluno com ícone de lixeira
        colunaNome.innerHTML = `
            <span class="nome-aluno" data-nome="${nome}">${nome}</span>
            <button class="btn-excluir" data-nome="${nome}"><i class="fas fa-trash"></i></button>
        `;

        // Botões de status
        let statusButtonContainer = document.createElement("div");
        statusButtonContainer.classList.add("status-button-container");

        ["p", "f", "fj"].forEach(status => {
            let btn = document.createElement("button");
            btn.classList.add("status-button", status);
            btn.textContent = status === "p" ? "P" : status === "f" ? "F" : "FJ";
            btn.dataset.nome = nome;
            statusButtonContainer.appendChild(btn);
        });

        colunaPresenca.appendChild(statusButtonContainer);

        // Célula de observação
        colunaObservacao.classList.add("editable");
        colunaObservacao.dataset.nome = nome;
        colunaObservacao.contentEditable = "true";

        // Inicializa o status do aluno
        statusPresenca[nome] = "Presente";
        atualizarInterfaceStatus(nome, "Presente");
    }

    // Função para editar o nome do aluno
    function editarNomeAluno(nomeAtual, novoNome) {
        const linha = document.querySelector(`tr[data-nome="${nomeAtual}"]`);
        if (linha) {
            linha.setAttribute("data-nome", novoNome);
            linha.querySelector(".nome-aluno").textContent = novoNome;
            linha.querySelector(".nome-aluno").dataset.nome = novoNome;
            linha.querySelector(".btn-excluir").dataset.nome = novoNome;
            statusPresenca[novoNome] = statusPresenca[nomeAtual];
            delete statusPresenca[nomeAtual];
        }
    }

    // Função para excluir o aluno
    function excluirAluno(nome) {
        const linha = document.querySelector(`tr[data-nome="${nome}"]`);
        if (linha) {
            linha.remove();
            delete statusPresenca[nome];
        }
    }

    // Função para atualizar a interface com base no status
    function atualizarInterfaceStatus(nome, status) {
        const botoesAluno = document.querySelectorAll(`.status-button[data-nome="${nome}"]`);
        botoesAluno.forEach(btn => {
            btn.classList.remove('selected');
            if ((status === "Presente" && btn.classList.contains('p')) ||
                (status === "Falta" && btn.classList.contains('f')) ||
                (status === "Falta Justificada" && btn.classList.contains('fj'))) {
                btn.classList.add('selected');
            }
        });
    }
});