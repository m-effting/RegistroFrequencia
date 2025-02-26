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

    // Alternar presença no switch (checkbox) quando o estado mudar
    document.querySelectorAll(".toggle-presenca").forEach(toggle => {
        toggle.addEventListener("change", function () {
            let nome = this.dataset.nome; // Recupera o nome do aluno do atributo "data-nome"
            let status = this.checked ? "Presente" : "Falta"; // Determina o status com base no estado do switch
            alterarPresenca(nome, status); // Chama a função para alterar a presença do aluno

            // Exibe ou oculta o botão "Falta Justificada" dependendo do status
            let faltaJustificadaButton = this.closest('td').querySelector('.falta-justificada');
            faltaJustificadaButton.style.display = (status === "Falta") ? "inline-block" : "none"; // Exibe se for falta
        });
    });

    // Editar observação ao clicar fora da célula (evento "blur")
    document.querySelectorAll(".editable").forEach(cell => {
        cell.addEventListener("blur", function () {
            let nome = this.dataset.nome; // Recupera o nome do aluno
            let observacao = this.textContent.trim(); // Recupera o texto da observação
            atualizarObservacao(nome, observacao); // Chama a função para atualizar a observação
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

    // Cria o switch de presença (checkbox)
    let switchContainer = document.createElement("label");
    switchContainer.classList.add("switch");

    let inputToggle = document.createElement("input");
    inputToggle.type = "checkbox";
    inputToggle.classList.add("toggle-presenca");
    inputToggle.checked = true; // Garante que o aluno começa como "Presente"
    inputToggle.dataset.nome = nome; // Atribui o nome ao campo de dados do toggle

    let slider = document.createElement("span");
    slider.classList.add("slider");

    switchContainer.appendChild(inputToggle);
    switchContainer.appendChild(slider);
    colunaPresenca.appendChild(switchContainer); // Adiciona o switch na coluna de presença

    // Cria o botão de falta justificada (inicialmente invisível)
    let faltaJustificadaButton = document.createElement("button");
    faltaJustificadaButton.classList.add("falta-justificada");
    faltaJustificadaButton.textContent = "Falta Justificada";
    faltaJustificadaButton.style.display = "none"; // Começa invisível
    colunaPresenca.appendChild(faltaJustificadaButton); // Adiciona o botão na coluna de presença

    // Cria a célula de observação editável
    colunaObservacao.classList.add("editable");
    colunaObservacao.dataset.nome = nome; // Atribui o nome à célula de observação
    colunaObservacao.contentEditable = "true"; // Permite a edição do conteúdo
}
