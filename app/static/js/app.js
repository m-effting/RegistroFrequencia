document.addEventListener("DOMContentLoaded", function () {
    // Objeto para armazenar o status de presença de cada aluno
    const statusPresenca = {};

    // Exibe a data atual no canto superior direito
    const dataHojeElement = document.getElementById("dataHoje");
    const dataHoje = new Date().toLocaleDateString('pt-BR'); // Formato: DD/MM/AAAA
    dataHojeElement.textContent = dataHoje;

    // Recupera o formulário de adicionar aluno e os campos de escola e turma
    const form = document.getElementById("formAdicionarAluno");
    const escolaInput = document.getElementById("escola");
    const turmaInput = document.getElementById("turma");

    // Adicionar aluno ao pressionar o botão de enviar no formulário
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Previne o comportamento padrão de envio do formulário

        // Recupera os valores dos campos e remove espaços extras
        let escola = escolaInput.value.trim();
        let turma = turmaInput.value.trim();
        let nome = document.getElementById("aluno").value.trim();

        // Verifica se todos os campos estão preenchidos antes de adicionar o aluno
        if (escola !== "" && turma !== "" && nome !== "") {
            adicionarAluno(nome, turma); // Chama a função para adicionar o aluno
            document.getElementById("aluno").value = ""; // Limpa o campo de nome do aluno
        }
    });

    // Delegar evento de clique para os botões de status
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("status-button")) {
            let nome = event.target.dataset.nome; // Recupera o nome do aluno
            let status = event.target.classList.contains('p') ? "Presente" : 
                         event.target.classList.contains('f') ? "Falta" : "Falta Justificada"; // Determina o status

            // Salva o status no objeto statusPresenca
            statusPresenca[nome] = status;

            // Atualiza a interface para refletir o status atual
            atualizarInterfaceStatus(nome, status);

            // Remove a classe 'selected' de todos os botões do mesmo aluno
            const botoesAluno = document.querySelectorAll(`.status-button[data-nome="${nome}"]`);
            botoesAluno.forEach(btn => btn.classList.remove('selected'));

            // Adiciona a classe 'selected' ao botão clicado
            event.target.classList.add('selected');
        }
    });

    // Função para adicionar aluno na tabela (simulação de backend)
    function adicionarAluno(nome, turma) {
        let tabela = document.querySelector("table"); // Seleciona a tabela onde os alunos serão exibidos

        // Cria uma nova linha na tabela
        let novaLinha = tabela.insertRow(-1);
        let colunaNome = novaLinha.insertCell(0); // Cria a célula para o nome do aluno
        let colunaPresenca = novaLinha.insertCell(1); // Cria a célula para a presença
        let colunaObservacao = novaLinha.insertCell(2); // Cria a célula para observação

        colunaNome.textContent = nome; // Define o nome do aluno na primeira coluna

        // Cria os botões de status
        let statusButtonContainer = document.createElement("div");
        statusButtonContainer.classList.add("status-button-container");

        let btnPresente = document.createElement("button");
        btnPresente.classList.add("status-button", "p");
        btnPresente.textContent = "P"; // Texto do botão
        btnPresente.dataset.nome = nome; // Atribui o nome ao botão
        statusButtonContainer.appendChild(btnPresente);

        let btnFalta = document.createElement("button");
        btnFalta.classList.add("status-button", "f");
        btnFalta.textContent = "F"; // Texto do botão
        btnFalta.dataset.nome = nome; // Atribui o nome ao botão
        statusButtonContainer.appendChild(btnFalta);

        let btnFaltaJustificada = document.createElement("button");
        btnFaltaJustificada.classList.add("status-button", "fj");
        btnFaltaJustificada.textContent = "FJ"; // Texto do botão
        btnFaltaJustificada.dataset.nome = nome; // Atribui o nome ao botão
        statusButtonContainer.appendChild(btnFaltaJustificada);

        colunaPresenca.appendChild(statusButtonContainer); // Adiciona os botões na coluna de presença

        // Cria a célula de observação editável
        colunaObservacao.classList.add("editable");
        colunaObservacao.dataset.nome = nome; // Atribui o nome à célula de observação
        colunaObservacao.contentEditable = "true"; // Permite a edição do conteúdo

        // Inicializa o status do aluno como "Presente" por padrão
        statusPresenca[nome] = "Presente";
        atualizarInterfaceStatus(nome, "Presente"); // Atualiza a interface para refletir o status inicial
    }

    // Função para atualizar a interface com base no status salvo
    function atualizarInterfaceStatus(nome, status) {
        const botoesAluno = document.querySelectorAll(`.status-button[data-nome="${nome}"]`);
        botoesAluno.forEach(btn => {
            btn.classList.remove('selected'); // Remove a classe 'selected' de todos os botões
            if ((status === "Presente" && btn.classList.contains('p')) ||
                (status === "Falta" && btn.classList.contains('f')) ||
                (status === "Falta Justificada" && btn.classList.contains('fj'))) {
                btn.classList.add('selected'); // Adiciona a classe 'selected' ao botão correspondente
            }
        });
    }

    // Função para alterar a presença (simulação de backend)
    function alterarPresenca(nome, status) {
        console.log(`Aluno: ${nome}, Status: ${status}`); // Exibe o status no console (simulação de backend)
    }
});