function verificarConflito(novo, existentes) {
  Logger.log("--- Iniciando verificação de OVERLAP (MAPEAMENTO CORRIGIDO) ---");

  for (let i = 1; i < existentes.length; i++) {
    const linha = existentes[i]; 
    
    const profExistente = linha[0];   
    const salaExistente = linha[1];   
    const diaExistente = linha[3];    
    const inicioExistente = linha[4]; 
    const fimExistente = linha[5];    


    if (!inicioExistente || !fimExistente) {
      Logger.log("AVISO: Pulando linha " + (i+1) + " do DB (data vazia).");
      continue;
    }

    if (novo.dia == diaExistente) {
      
      if (novo.prof == profExistente || novo.sala == salaExistente) {
        
        if (novo.inicio.getTime() < fimExistente.getTime() && inicioExistente.getTime() < novo.fim.getTime()) {
          
          Logger.log("CONFLITO DE SOBREPOSIÇÃO ENCONTRADO! Linha " + (i+1));
          return true;
        }
      }
    }
  }

  Logger.log("Nenhum conflito encontrado.");
  return false; 
}