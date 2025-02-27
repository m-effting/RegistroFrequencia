document.addEventListener("DOMContentLoaded", function () {
    // Exibe a data atual no canto superior direito
    const dataHojeElement = document.getElementById("dataHoje");
    const dataHoje = new Date().toLocaleDateString('pt-BR'); // Formato: DD/MM/AAAA
    dataHojeElement.textContent = dataHoje;

    // Recupera o formulário de adicionar aluno e os campos de escola e turma
    const form = document.getElementById("formAdicionarAluno");
    const escolaInput = document.getElementById("escola");
    const turmaInput = document.getElementById("turma");

    // Restaurar valores salvos da escola e da turma ao carregar a página
    if (localStorage.getItem("escola")) {
        escolaInput.value = localStorage.getItem("escola"); // Preenche o campo de escola com o valor salvo
    }
    if (localStorage.getItem("turma")) {
        turmaInput.value = localStorage.getItem("turma"); // Preenche o campo de turma com o valor salvo
    }

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
            localStorage.setItem("escola", escola); // Salva a escola no localStorage
            localStorage.setItem("turma", turma);   // Salva a turma no localStorage
            document.getElementById("aluno").value = ""; // Limpa o campo de nome do aluno
        }
    });

    // Altera o status de presença ao clicar nos botões
    document.querySelectorAll(".status-button").forEach(button => {
        button.addEventListener("click", function () {
            let nome = this.dataset.nome; // Recupera o nome do aluno
            let status = this.classList.contains('p') ? "Presente" : 
                         this.classList.contains('f') ? "Falta" : "Falta Justificada"; // Determina o status
            alterarPresenca(nome, status); // Chama a função para alterar o status

            // Remover a classe 'selected' de todos os botões
            document.querySelectorAll('.status-button').forEach(btn => {
                btn.classList.remove('selected');
            });

            // Adicionar a classe 'selected' ao botão clicado
            this.classList.add('selected');
        });
    });
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
}
