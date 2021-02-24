function verificaConfiabillidade(){
    log.info('>>>>>>>>>> VALIDAÇÃO CONFIABILIDADE <<<<<<<<<')
    
    if(hAPI.getCardValue("hasValidItems") == "false"){
        log.info('>>>>>>>>>> VALOR DOS ITEMS NÃO BATE COM O DA NOTA')
        return false;
    }

    var cstActive = DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST);
    var dsCamposObrigatorios = DatasetFactory.getDataset("ds_camposObrigatorios", null, [cstActive], null);
    if(dsCamposObrigatorios.rowsCount == 0){
        log.info('>>>>>>>>>> NÃO EXISTE CAMPOS OBRIGATÓRIOS')
        return true;
    }
    if(dsCamposObrigatorios.getValue(0, "numero_processo") == "on" && hAPI.getCardValue("numero_processo") == ""){
        log.info('>>>>>>>>>> NECESSÁRIO PREENCHER NÚMERO DO PROCESSO')
        return false;
    }
    if(dsCamposObrigatorios.getValue(0, "numero_nota") == "on" && hAPI.getCardValue("numero_nota") == ""){
        log.info('>>>>>>>>>> NECESSÁRIO PREENCHER NÚMERO DA NOTA')
        return false;
    }
    if(dsCamposObrigatorios.getValue(0, "data_emissao") == "on" && hAPI.getCardValue("data_emissao") == ""){
        log.info('>>>>>>>>>> NECESSÁRIO PREENCHER DATA DA EMISSÃO')
        return false;
    }
    if(dsCamposObrigatorios.getValue(0, "data_prestacao") == "on" && hAPI.getCardValue("data_prestacao") == ""){
        log.info('>>>>>>>>>> NECESSÁRIO PREENCHER DATA DA PRESTAÇÃO')
        return false;
    }
    if(dsCamposObrigatorios.getValue(0, "numero_pedido") == "on" && hAPI.getCardValue("numero_pedido") == ""){
        log.info('>>>>>>>>>> NECESSÁRIO PREENCHER NÚMERO DO PEDIDO')
        return false;
    }
    if(dsCamposObrigatorios.getValue(0, "contrato") == "on" && hAPI.getCardValue("contrato") == ""){
        log.info('>>>>>>>>>> NECESSÁRIO PREENCHER CONTRATO')
        return false;
    }
    if(dsCamposObrigatorios.getValue(0, "natureza_operacao") == "on" && hAPI.getCardValue("natureza_operacao") == ""){
        log.info('>>>>>>>>>> NECESSÁRIO PREENCHER NATUREZA DA OPERAÇÃO')
        return false;
    }
    if(dsCamposObrigatorios.getValue(0, "nome_tomador") == "on" && hAPI.getCardValue("nome_tomador") == ""){
        log.info('>>>>>>>>>> NECESSÁRIO PREENCHER NOME DO TOMADOR')
        return false;
    }
    if(dsCamposObrigatorios.getValue(0, "cpf_tomador") == "on" && hAPI.getCardValue("cpf_tomador") == ""){
        log.info('>>>>>>>>>> NECESSÁRIO PREENCHER CNPJ DO TOMADOR')
        return false;
    }
    if(dsCamposObrigatorios.getValue(0, "inscricao_municipal") == "on" && hAPI.getCardValue("inscricao_municipal") == ""){
        log.info('>>>>>>>>>> NECESSÁRIO PREENCHER INSCRIÇÃO MUNICIPAL')
        return false;
    }
    if(dsCamposObrigatorios.getValue(0, "endereco_tomador") == "on" && hAPI.getCardValue("endereco_tomador") == ""){
        log.info('>>>>>>>>>> NECESSÁRIO PREENCHER ENDEREÇO DO TOMADOR')
        return false;
    }
    if(dsCamposObrigatorios.getValue(0, "nome_prestador") == "on" && hAPI.getCardValue("nome_prestador") == ""){
        log.info('>>>>>>>>>> NECESSÁRIO PREENCHER NOME DO PRESTADOR')
        return false;
    }
    if(dsCamposObrigatorios.getValue(0, "cpf_prestador") == "on" && hAPI.getCardValue("cpf_prestador") == ""){
        log.info('>>>>>>>>>> NECESSÁRIO PREENCHER CNPJ PRESTADOR')
        return false;
    }
    if(dsCamposObrigatorios.getValue(0, "endereco_prestador") == "on" && hAPI.getCardValue("endereco_prestador") == ""){
        log.info('>>>>>>>>>> NECESSÁRIO PREENCHER ENDEREÇO DO PRESTADOR')
        return false;
    }
    if(dsCamposObrigatorios.getValue(0, "discriminacao_servicos") == "on" && hAPI.getCardValue("discriminacao_servicos") == ""){
        log.info('>>>>>>>>>> NECESSÁRIO PREENCHER DISCRIMINAÇÃO DOS SERVIÇOS')
        return false;
    }
    if(dsCamposObrigatorios.getValue(0, "valor_total_nota") == "on" && hAPI.getCardValue("valor_total_nota") == ""){
        log.info('>>>>>>>>>> NECESSÁRIO PREENCHER VALOR TOTAL DA NOTA')
        return false;
    }
    if(dsCamposObrigatorios.getValue(0, "valor_total_deducoes") == "on" && hAPI.getCardValue("valor_total_deducoes") == ""){
        log.info('>>>>>>>>>> NECESSÁRIO PREENCHER VALOR TOTAL DEDUÇÕES')
        return false;
    }
    if(dsCamposObrigatorios.getValue(0, "base_calculo") == "on" && hAPI.getCardValue("base_calculo") == ""){
        log.info('>>>>>>>>>> NECESSÁRIO PREENCHER BASE DE CÁLCULO')
        return false;
    }
    if(dsCamposObrigatorios.getValue(0, "aliquota") == "on" && hAPI.getCardValue("aliquota") == ""){
        log.info('>>>>>>>>>> NECESSÁRIO PREENCHER ALIQUOTA')
        return false;
    }
    if(dsCamposObrigatorios.getValue(0, "valor_iss") == "on" && hAPI.getCardValue("valor_iss") == ""){
        log.info('>>>>>>>>>> NECESSÁRIO PREENCHER VALOR DE ISS')
        return false;
    }
    if(dsCamposObrigatorios.getValue(0, "iss_retido") == "on" && hAPI.getCardValue("iss_retido") == ""){
        log.info('>>>>>>>>>> NECESSÁRIO PREENCHER ISS RETIDO')
        return false;
    }
    if(dsCamposObrigatorios.getValue(0, "inss") == "on" && hAPI.getCardValue("inss") == ""){
        log.info('>>>>>>>>>> NECESSÁRIO PREENCHER INSS')
        return false;
    }
    if(dsCamposObrigatorios.getValue(0, "irrf") == "on" && hAPI.getCardValue("irrf") == ""){
        log.info('>>>>>>>>>> NECESSÁRIO PREENCHER IRRF')
        return false;
    }
    if(dsCamposObrigatorios.getValue(0, "csll") == "on" && hAPI.getCardValue("csll") == ""){
        log.info('>>>>>>>>>> NECESSÁRIO PREENCHER CSLL')
        return false;
    }
    if(dsCamposObrigatorios.getValue(0, "cofins") == "on" && hAPI.getCardValue("cofins") == ""){
        log.info('>>>>>>>>>> NECESSÁRIO PREENCHER COFINS')
        return false;
    }
    if(dsCamposObrigatorios.getValue(0, "pis_pasep") == "on" && hAPI.getCardValue("pis_pasep") == ""){
        log.info('>>>>>>>>>> NECESSÁRIO PREENCHER PIS/PASEP')
        return false;
    }    
    if(dsCamposObrigatorios.getValue(0, "outras_informacoes") == "on" && hAPI.getCardValue("outras_informacoes") == ""){
        log.info('>>>>>>>>>> NECESSÁRIO PREENCHER OUTRAS INFORMAÇõES')
        return false;
    }
    if(dsCamposObrigatorios.getValue(0, "codigo_barras") == "on"){
        var valid = true;
        var hasAtLeastOne = false;
        var numProcess = getValue("WKNumProces");
        var formFields = hAPI.getCardData(numProcess);
        var contador = formFields.keySet().iterator();
        while(contador.hasNext()){
            var fieldId = contador.next();
            if(fieldId.match(/codigo_barras___/)){
                hasAtLeastOne = true;
                var sequence = fieldId.split("___")[1];
                if(hAPI.getCardValue("codigo_barras___" + sequence) == ""){
                    log.info('>>>>>>>>>> NECESSÁRIO PREENCHER CÓDIGO DE BARRAS')
                    valid = false;
                }
            }
        }
        return hasAtLeastOne && valid;
    }
    if (validaData(hAPI.getCardValue("data_emissao")) == "") {
        log.info('>>>>>>>>>> REPROVADO POR NÃO CONTER DATA CORRETA')
        return false;
    }

    //Validação de itens
    var hasAtLeastOneItem = false;
    var numProcess = getValue("WKNumProces");
    var formFields = hAPI.getCardData(numProcess);
    var contador = formFields.keySet().iterator();
    while(contador.hasNext()){
        var fieldId = contador.next();
        if(fieldId.match(/codigo_item___/)){
            hasAtLeastOneItem = true;
            var sequence = fieldId.split("___")[1];
            if(
                hAPI.getCardValue("codigo_item___" + sequence) == "" &&
                dsCamposObrigatorios.getValue(0, "codigo_item") == "on"       
            ){
                log.info('>>>>>>>>>> NECESSÁRIO PREENCHER CÓDIGO DO ITEM')
                return false;
            }
        }
        if(fieldId.match(/quantidade_item___/)){            
            var sequence = fieldId.split("___")[1];
            if(
                hAPI.getCardValue("quantidade_item___" + sequence) == "" &&
                dsCamposObrigatorios.getValue(0, "quantidade_item") == "on"       
            ){
                log.info('>>>>>>>>>> NECESSÁRIO PREENCHER QUANTIDADE DO ITEM')
                return false;
            }
        }
        if(fieldId.match(/cod_unidade_item___/)){            
            var sequence = fieldId.split("___")[1];
            if(
                hAPI.getCardValue("cod_unidade_item___" + sequence) == "" &&
                dsCamposObrigatorios.getValue(0, "cod_unidade_item") == "on"       
            ){
                log.info('>>>>>>>>>> NECESSÁRIO PREENCHER UNIDADE NEFOCIO DO ITEM')
                return false;
            }
        }
        if(fieldId.match(/preco_item___/)){            
            var sequence = fieldId.split("___")[1];
            if(
                hAPI.getCardValue("preco_item___" + sequence) == "" &&
                dsCamposObrigatorios.getValue(0, "preco_item") == "on"       
            ){
                log.info('>>>>>>>>>> NECESSÁRIO PREENCHER PRECO DO ITEM')
                return false;
            }
        }
        if(fieldId.match(/conta_contabil___/)){            
            var sequence = fieldId.split("___")[1];
            if(
                hAPI.getCardValue("conta_contabil___" + sequence) == "" &&
                dsCamposObrigatorios.getValue(0, "conta_contabil") == "on"       
            ){
                log.info('>>>>>>>>>> NECESSÁRIO CONTA CONTABIL DO ITEM')
                return false;
            }
        }
        if(fieldId.match(/centro_custo___/)){            
            var sequence = fieldId.split("___")[1];
            if(
                hAPI.getCardValue("centro_custo___" + sequence) == "" &&
                dsCamposObrigatorios.getValue(0, "centro_custo") == "on"       
            ){
                log.info('>>>>>>>>>> NECESSÁRIO CENTRO DE CUSTO DO ITEM')
                return false;
            }
        }
        if(fieldId.match(/numero_ordem___/)){            
            var sequence = fieldId.split("___")[1];
            if(
                hAPI.getCardValue("numero_ordem___" + sequence) == "" &&
                dsCamposObrigatorios.getValue(0, "numero_ordem") == "on"       
            ){
                log.info('>>>>>>>>>> NECESSÁRIO NUMERO DA ORDEM DO ITEM')
                return false;
            }
        }
    }
    if(!hasAtLeastOneItem){
        log.info('>>>>>>>>>> NENHUM ITEM ENCONTRADO')
        return false;
    }

    return true;
}