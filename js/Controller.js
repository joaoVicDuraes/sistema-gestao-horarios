function onOpen() {
  const ui = SpreadsheetApp.getUi();

  //Menu
  ui.createMenu("Sistema de Horários")
    .addItem('1. Salvar Agendamento', 'salvarAgendamento')
    .addSeparator()
    .addItem('2. Atualizar Grade Visual', 'atualizarGradeVisual')
    .addSeparator()
    .addItem('3. Exluir por ID', 'excluirAgendamento')
    .addToUi();
}


function salvarAgendamento() {
  const app = SpreadsheetApp;
  const arquivoPlanilha = app.getActiveSpreadsheet();
  const abaUI = arquivoPlanilha.getSheetByName("UI_Cadastro"); 
  const abaDB = arquivoPlanilha.getSheetByName("DB_Horarios"); 

  Logger.log("--- Iniciando salvarAgendamento (CORRIGIDO) ---");

  const dadosFormulario = abaUI.getRange("B1:B5").getValues(); 
  
  const novoInicio = dadosFormulario[4][0]; 

  if (!novoInicio) {
    app.getUi().alert("Erro: A 'Hora de Início' (B5) não pode estar vazia.");
    return; // Para a execução
  }

  const novoFim = new Date(novoInicio.getTime() + (45 * 60 * 1000)); 
  Logger.log("Calculado: Início " + novoInicio + ", Fim " + novoFim);

  const novoAgendamento = {
    prof: dadosFormulario[0][0],      
    sala: dadosFormulario[1][0],       
    disciplina: dadosFormulario[2][0], 
    dia: dadosFormulario[3][0],        
    inicio: novoInicio,               
    fim: novoFim                      
  };
  
  Logger.log("Novo Agendamento (Lido Corretamente): " + JSON.stringify(novoAgendamento));

  const agendamentosExistentes = abaDB.getDataRange().getValues();
  const conflito = verificarConflito(novoAgendamento, agendamentosExistentes);

  if (conflito == true) {
    app.getUi().alert("ERRO: Conflito detectado! O professor ou a sala já estão em uso em um horário sobreposto.");
  
  } else {

    const idUnico = Utilities.getUuid();

    const dadosParaSalvar = [
      novoAgendamento.prof,
      novoAgendamento.sala,
      novoAgendamento.disciplina,
      novoAgendamento.dia,
      novoAgendamento.inicio,
      novoAgendamento.fim, 
      idUnico
    ];

    abaDB.appendRow(dadosParaSalvar);
    
    abaUI.getRange("B1:B5").clearContent(); // Limpa os 5 campos
    app.getUi().alert("Agendamento salvo com sucesso!");
  }
}



function excluirAgendamento(){
  const app = SpreadsheetApp;
  const ui = app.getUi();
  const abaDB = app.getActiveSpreadsheet().getSheetByName("DB_Horarios");

  const resposta = ui.prompt(
    'Exluir Agendamento',
    'Cole o ID do agendamento que deseja excluir:',
    ui.ButtonSet.OK_CANCEL
  );

  if (resposta.getSelectedButton() != ui.Button.OK) {
    return;
  }

  const idProcurado = resposta.getResponseText().trim();
  if (idProcurado == "") {
    ui.alert("Nenhum ID informado.")
    return;
  }

  const dados = abaDB.getDataRange().getValues();
  let linhaParaDeletar = -1;

  for (let i = 1; i < dados.length; i++) {
    const idDaLinha = dados[i][6];

    if (idDaLinha ==idProcurado) {
      linhaParaDeletar = i + 1;
      break;
    }
  }

  if (linhaParaDeletar > 0) {
    abaDB.deleteRow(linhaParaDeletar);
    ui.alert("Sucesso o agendamento foi excluido");

    atualizarGradeVisual();
  } else {
    ui.alert("Erro: ID não encontrado no banco de dados.")
  }
}

