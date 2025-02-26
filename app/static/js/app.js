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
            if (validarAluno(nome)) {
                adicionarAluno(nome, turma);
                document.getElementById("aluno").value = "";
                mostrarMensagem("Aluno adicionado com sucesso!", "success");
            } else {
                mostrarMensagem("Nome do aluno já existe ou é inválido.", "error");
            }
        } else {
            mostrarMensagem("Preencha todos os campos.", "error");
        }
    });

    // Delegar eventos de clique
    document.addEventListener("click", function (event) {
        // Editar nome do aluno
        if (event.target.classList.contains("btn-editar") || event.target.closest(".btn-editar")) {
            const btnEditar = event.target.classList.contains("btn-editar") ? event.target : event.target.closest(".btn-editar");
            const nome = btnEditar.dataset.nome;
            const nomeAluno = document.querySelector(`.nome-aluno[data-nome="${nome}"]`);
            nomeAluno.contentEditable = true;
            nomeAluno.focus();

            // Adicionar um pequeno atraso para evitar conflito com o evento blur
            setTimeout(() => {
                nomeAluno.addEventListener("keydown", function (e) {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        nomeAluno.contentEditable = false;
                        const novoNome = nomeAluno.textContent.trim();
                        if (novoNome !== "") {
                            editarNomeAluno(nome, novoNome);
                            mostrarMensagem("Nome do aluno atualizado com sucesso!", "success");
                        }
                    }
                });

                nomeAluno.addEventListener("blur", function () {
                    nomeAluno.contentEditable = false;
                    const novoNome = nomeAluno.textContent.trim();
                    if (novoNome !== "") {
                        editarNomeAluno(nome, novoNome);
                        mostrarMensagem("Nome do aluno atualizado com sucesso!", "success");
                    }
                });
            }, 100); // 100ms de atraso
        }

        // Excluir aluno
        if (event.target.classList.contains("btn-excluir") || event.target.closest(".btn-excluir")) {
            const btnExcluir = event.target.classList.contains("btn-excluir") ? event.target : event.target.closest(".btn-excluir");
            const nome = btnExcluir.dataset.nome;
            if (confirm(`Tem certeza que deseja excluir o aluno ${nome}?`)) {
                excluirAluno(nome);
                mostrarMensagem("Aluno excluído com sucesso!", "success");
            }
        }

        // Alterar status de presença
        if (event.target.classList.contains("status-button")) {
            let nome = event.target.dataset.nome;
            let status = event.target.classList.contains('p') ? "Presente" : 
                         event.target.classList.contains('f') ? "Falta" : "Falta Justificada";
            statusPresenca[nome] = status;
            atualizarStatus(nome, status);
            const botoesAluno = document.querySelectorAll(`.status-button[data-nome="${nome}"]`);
            botoesAluno.forEach(btn => btn.classList.remove('selected'));
            event.target.classList.add('selected');
        }
    });

    // Função para adicionar aluno
    function adicionarAluno(nome, turma) {
        let tabela = document.querySelector("table");
        let novaLinha = tabela.insertRow(-1);
        let idUnico = gerarIdUnico(); // Gera um ID único para o aluno
        novaLinha.setAttribute("data-nome", idUnico);

        let colunaNome = novaLinha.insertCell(0);
        let colunaPresenca = novaLinha.insertCell(1);
        let colunaObservacao = novaLinha.insertCell(2);

        // Nome do aluno com ícone de lixeira e lápis
        colunaNome.innerHTML = `
            <span class="nome-aluno" data-nome="${idUnico}" contenteditable="false">${nome}</span>
            <button class="btn-editar" data-nome="${idUnico}"><i class="fas fa-pencil-alt"></i></button>
            <button class="btn-excluir" data-nome="${idUnico}"><i class="fas fa-trash"></i></button>
        `;

        // Botões de status
        let statusButtonContainer = document.createElement("div");
        statusButtonContainer.classList.add("status-button-container");

        ["p", "f", "fj"].forEach(status => {
            let btn = document.createElement("button");
            btn.classList.add("status-button", status);
            btn.textContent = status === "p" ? "P" : status === "f" ? "F" : "FJ";
            btn.dataset.nome = idUnico;
            statusButtonContainer.appendChild(btn);
        });

        colunaPresenca.appendChild(statusButtonContainer);

        // Célula de observação
        colunaObservacao.classList.add("editable");
        colunaObservacao.dataset.nome = idUnico;
        colunaObservacao.contentEditable = "true";

        // Inicializa o status do aluno
        statusPresenca[idUnico] = "Presente";
        atualizarStatus(idUnico, "Presente");
    }

    // Função para editar o nome do aluno
    function editarNomeAluno(nomeAtual, novoNome) {
        const linha = document.querySelector(`tr[data-nome="${nomeAtual}"]`);
        if (linha) {
            const idUnico = gerarIdUnico(); // Novo ID único
            linha.setAttribute("data-nome", idUnico);
            linha.querySelector(".nome-aluno").dataset.nome = idUnico;
            linha.querySelector(".btn-editar").dataset.nome = idUnico;
            linha.querySelector(".btn-excluir").dataset.nome = idUnico;
            statusPresenca[idUnico] = statusPresenca[nomeAtual];
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

    // Função para atualizar o status de presença
    function atualizarStatus(nome, status) {
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

    // Função para validar o nome do aluno
    function validarAluno(nome) {
        return nome.trim() !== "" && !document.querySelector(`.nome-aluno[data-nome="${nome}"]`);
    }

    // Função para gerar um ID único
    function gerarIdUnico() {
        return `aluno-${Date.now()}`;
    }

    // Função para mostrar mensagens de feedback
    function mostrarMensagem(mensagem, tipo) {
        const div = document.createElement("div");
        div.className = `alert alert-${tipo}`;
        div.textContent = mensagem;
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 3000);
    }
});