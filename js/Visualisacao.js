function atualizarGradeVisual() {
  const app = SpreadsheetApp;
  const arquivo = app.getActiveSpreadsheet();

  const abaVisual = arquivo.getActiveSheet();
  const nomeDaAba = abaVisual.getName();
  let filtroSala = null;

  if (nomeDaAba.startsWith("Visao_") && nomeDaAba != "Visao_Geral") {
    filtroSala = nomeDaAba.replace("Visao_", "").replace(/_/g, " ");
    Logger.log("Filtro de sala ATIVADO: " + filtroSala);
  } else {
    Logger.log("Filtro de sala DESATIVADO  (Visão Geral).");
  }

  const abaDB = arquivo.getSheetByName("DB_Horarios");
  const timeZone = arquivo.getSpreadsheetTimeZone();
  const dadosDB = abaDB.getDataRange().getValues().slice(1);

  const mapaAgendamentos = {};

  for (const linha of dadosDB) {
    const prof = linha[0], sala = linha[1], disciplina = linha[2], dia = linha[3], inicio = linha[4];

    if(!dia || !inicio || !(inicio instanceof Date)) {
      continue;
    }

    const horaFormatada = Utilities.formatDate(inicio, timeZone, "HH:mm");
    const chave = dia.trim() + "_" + horaFormatada;

    const valor = {
      prof: prof,
      sala: sala,
      texto: prof + "\n" + sala + " (" + disciplina + ")"
    };

    if (!mapaAgendamentos[chave]) {
 
      mapaAgendamentos[chave] = []; 
    }

    mapaAgendamentos[chave].push(valor);

  }


  const numDias = abaVisual.getLastColumn() - 1; 
  if (numDias <= 0) { return; }
  const dias = abaVisual.getRange(1, 2, 1, numDias).getValues()[0].map(d => d.toString().trim());
  
  const numHoras = abaVisual.getLastRow() - 1;
  if (numHoras <= 0) { return; }
  const horasRaw = abaVisual.getRange(2, 1, numHoras, 1).getValues(); 
  const horas = horasRaw.map(h => {
    if (h[0] instanceof Date) { return Utilities.formatDate(h[0], timeZone, "HH:mm"); }
    return h[0].toString().trim();
  });
  
 
  const arrayDeSaida = [];
  
  for (const chaveHora of horas) {
    const linhaDeSaida = [];
    
    for (const dia of dias) {
      const chaveFinal = dia + "_" + chaveHora;
      

      const listaDeAulas = mapaAgendamentos[chaveFinal]; 
      
      if (listaDeAulas) { 
        
        let aulasParaPintar = listaDeAulas; 
        

        if (filtroSala != null) {

          aulasParaPintar = listaDeAulas.filter(aula => aula.sala == filtroSala);
        }
        

        if (aulasParaPintar.length > 0) {
         
          const textoFinal = aulasParaPintar
              .map(aula => aula.texto) 
              .join("\n---\n"); 
          
          linhaDeSaida.push(textoFinal);
        } else {
          linhaDeSaida.push(""); 
        }
        
      } else {
        linhaDeSaida.push("");
      }

    }
    arrayDeSaida.push(linhaDeSaida);
  }

  if (arrayDeSaida.length > 0 && arrayDeSaida[0].length > 0) {
    abaVisual.getRange(2, 2, numHoras, numDias)
             .setValues(arrayDeSaida)
             .setWrap(true)
             .setVerticalAlignment("middle");
             
    Logger.log("Grade 'pintada' com sucesso (com empilhamento)!");
    app.getUi().alert("Grade de horários atualizada para: " + nomeDaAba);
  } else {
    Logger.log("ERRO: O 'arrayDeSaida' estava vazio.");
    app.getUi().alert("Erro: Não foi possível gerar a grade.");
  }
}
