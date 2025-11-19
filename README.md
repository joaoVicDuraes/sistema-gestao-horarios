# Teacher Availability Manager (Sistema de Gestão de Horários)

> Sistema automatizado para coleta, validação e organização de disponibilidade de horários de professores, desenvolvido para otimizar a logística acadêmica do IFSP.

## 🎯 O Problema
A coordenação enfrentava dificuldades no processo manual de coleta de horários dos docentes. O processo envolvia múltiplos e-mails, planilhas desconexas e alto risco de conflitos de agenda, consumindo horas preciosas da equipe administrativa.

## 💡 A Solução
Desenvolvi uma automação utilizando **Google Apps Script** integrada ao Google Sheets. O sistema atua como um backend servindo uma interface (ou processando formulários) onde:
1. O professor submete sua disponibilidade.
2. O script valida as regras de negócio (ex: carga horária máxima, dias obrigatórios).
3. Os dados são organizados automaticamente em uma base de dados centralizada, pronta para análise da coordenação.

## 🛠️ Tecnologias Utilizadas
* **Linguagem:** JavaScript (Google Apps Script)
* **Database/Frontend:** Google Sheets & Google Forms
* **Conceitos:** Automação de Processos, Manipulação de DOM/Objetos, Lógica de Validação.

## 🚀 Funcionalidades Principais
* **Validação Automática:** Impede o cadastro de horários que violam as regras da instituição.
* **Centralização de Dados:** Unifica as respostas em um único dataset estruturado.
* **Tratamento de Erros:** Feedback imediato caso o input de dados esteja incorreto.

## 📂 Estrutura do Projeto
Como este projeto roda no ambiente Google (Serverless), o código fonte neste repositório representa a lógica implementada:

* `Code.js` - Lógica principal do backend e triggers.
* `Validation.js` - Funções auxiliares para verificação de regras de horários.
* `macros.js` - Automações de formatação da planilha.

## 📌 Como utilizar (Exemplo)
1. Este script deve ser acoplado a uma Google Sheet via *Extensions > Apps Script*.
2. As triggers de `onFormSubmit` ou `onEdit` acionam as validações automaticamente.

---
*Desenvolvido por João Victor O. Duraes - Aluno de ADS no IFSP Bragança Paulista*
