import PyPDF2
import re

def extract_names_from_pdf(file):
    pdf_reader = PyPDF2.PdfReader(file)
    names = []

    # Regex ajustada para capturar os nomes dos alunos
    nome_regex = re.compile(r'^([A-ZÀ-Ú\s]+)\s+\d+\s+\d{2}\.\d{3}-\d{3}$', re.MULTILINE)

    for page_num in range(len(pdf_reader.pages)):
        page = pdf_reader.pages[page_num]
        text = page.extract_text()

        # Depuração: Exibir o texto extraído da página
        print(f"Texto extraído da página {page_num + 1}:\n{text}\n")

        # Encontrar todas as correspondências da regex no texto
        matches = nome_regex.findall(text)
        for match in matches:
            # Ignorar linhas que contenham palavras do cabeçalho
            if not any(word in match for word in ["Código", "Nome", "CEP"]):
                # Remover espaços extras e adicionar o nome à lista
                nome = match.strip()
                names.append(nome)

    return names