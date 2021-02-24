function beforeTaskSave(colleagueId,nextSequenceId,userList){

    try{
        var atividade = getValue("WKNumState");

        var cpfCnpjTomador = new java.lang.String(hAPI.getCardValue("cpf_tomador"));
        cpfCnpjTomador = cpfCnpjTomador.replaceAll("[^\\d]", "");
        hAPI.setCardValue("cpf_tomador", cpfCnpjTomador);
    
        var cpfCnpPrestador = new java.lang.String(hAPI.getCardValue("cpf_prestador"));
        cpfCnpPrestador = cpfCnpPrestador.replaceAll("[^\\d]", "");
        hAPI.setCardValue("cpf_prestador", cpfCnpPrestador);

        var valorNota = hAPI.getCardValue("valor_total_nota");
        hAPI.setCardValue("valor_total_nota", handleMoneyFormat(valorNota));

        var valorDeducoes = hAPI.getCardValue("valor_total_deducoes");
        hAPI.setCardValue("valor_total_deducoes", handleMoneyFormat(valorDeducoes));

        var baseCalculo = hAPI.getCardValue("base_calculo");
        hAPI.setCardValue("base_calculo", handleMoneyFormat(baseCalculo));

        var aliquota = hAPI.getCardValue("aliquota");
        hAPI.setCardValue("aliquota", handleMoneyFormat(aliquota));

        var valorIss = hAPI.getCardValue("valor_iss");
        hAPI.setCardValue("valor_iss", handleMoneyFormat(valorIss));

        var inss = hAPI.getCardValue("inss");
        hAPI.setCardValue("inss", handleMoneyFormat(inss));

        var irrf = hAPI.getCardValue("irrf");
        hAPI.setCardValue("irrf", handleMoneyFormat(irrf));

        var csll = hAPI.getCardValue("csll");
        hAPI.setCardValue("csll", handleMoneyFormat(csll));

        var cofins = hAPI.getCardValue("cofins");
        hAPI.setCardValue("cofins", handleMoneyFormat(cofins));

        var pis_pasep = hAPI.getCardValue("pis_pasep");
        hAPI.setCardValue("pis_pasep", handleMoneyFormat(pis_pasep));

        handleWrongData();


        if(
            atividade == 13 ||
            atividade == 7 ||
            atividade == 49 ||
            atividade == 6
        )
        if(hAPI.getCardValue("aprovacao") != ""){
            var atividadeName = "";
            if(atividade == 13){
                atividadeName = "Fila das Filiais";
            }else if(atividade == 7){
                atividadeName = "Aprovação da Nota";
            }else if(atividade == 49){
                atividadeName = "Curadoria Aprovação";
            }else if(atividade == 6){
                atividadeName = "Curadoria Manual";
            }
            var decisao = hAPI.getCardValue("aprovacao") == "sim" ? "Aprovado" : hAPI.getCardValue("aprovacao") == "nao" ? "Reprovado" : "Mudança de Aprovador";
            var colleagueName = fluigAPI.getUserService().getCurrent().getFullName();
            var formato = new java.text.SimpleDateFormat('dd/MM/yyyy HH:mm:ss');
            var dataMudanca = formato.format(new java.util.Date());
            var motivo = hAPI.getCardValue("motivo_reprovado");
            var historico = hAPI.getCardValue("historico_observacoes") + "<b>[" + dataMudanca + "] " + atividadeName + " - " + colleagueName + "</b>: " + decisao;
            historico += motivo == "" ? "<br>" : " - " + motivo + "<br>";
            hAPI.setCardValue("historico_observacoes", historico);
            hAPI.setCardValue("motivo_reprovado", "");
        }

        if(atividade == 5){
            verificaNotaDuplicada();
        }

        if(nextSequenceId == 5){
            // isFilaFilial();
            // var cnpjEmpresa = hAPI.getCardValue("cpf_tomador");
            // var cadastroData = getCadastroData(cnpjEmpresa);
            // hAPI.setCardValue("natureza_operacao_codigo", cadastroData.naturezaOperacao);
            // hAPI.setCardValue("estabelecimento", cadastroData.estabelecimento);
        }

        if(atividade == 45 && nextSequenceId == 9){
            if(hAPI.getCardValue("anexos_erp") != ""){
                var jsonAttachmentsNames = JSON.parse(hAPI.getCardValue("anexos_erp"));
                if(
                    (jsonAttachmentsNames.bol.length > 0 || jsonAttachmentsNames.nfse.length > 0) &&
                    hAPI.listAttachments().size() > 0
                ){
                    var processAttachmentFolder = createProcessAttachmentFolder();
                    if(processAttachmentFolder){
                        sendProcessAttachToGed(processAttachmentFolder);
                    }
                }
            }
        }
    }catch(error){
        log.info("ERRO BEFORE TASK SAVE LANCAMENTO NFS ----------");
        log.dir(error);
    }    

}

function createProcessAttachmentFolder(){
    try {
        var processFolderId = getProcessFolderId();
        var processId = getValue("WKNumProces");
        var cnpjTomador = hAPI.getCardValue("cpf_tomador");
        var cnpjPrestador = hAPI.getCardValue("cpf_prestador");
        var dto = docAPI.newDocumentDto();
        dto.setDocumentDescription("Tomador: " + cnpjTomador + " - Prestador: " + cnpjPrestador  + " - Solicitação: " + processId);
        dto.setDocumentType("1");
        dto.setParentDocumentId(parseInt(processFolderId));
        dto.setDocumentTypeId("");
        var folder = docAPI.createFolder(dto, null, null);
        return folder.getDocumentId();
    } catch (error) {
        log.info("Erro create attachement-------");
        log.dir(error);
    }
}

function getProcessFolderId(){
    var dsConfigLancamentoNFS = DatasetFactory.getDataset("dsConfigLancamentoNFS", null, null, null);
    return dsConfigLancamentoNFS.getValue(0, "notasBoletosDefinitiveFolderId");
}

function sendProcessAttachToGed(processAttachmentFolder){
    var calendar = java.util.Calendar.getInstance().getTime();
    var docs = hAPI.listAttachments();
    var jsonAttachmentsNames = JSON.parse(hAPI.getCardValue("anexos_erp"));
    for (var i = 0; i < docs.size(); i++) {
        var doc = docs.get(i);
        
        if (doc.getDocumentType() != "7") {
            continue;
        }

        if(
            jsonAttachmentsNames.bol.indexOf(String(doc.getDocumentDescription())) == -1 && 
            jsonAttachmentsNames.nfse.indexOf(String(doc.getDocumentDescription())) == -1 
        ){
            continue;
        }
        
        doc.setParentDocumentId(processAttachmentFolder);
        doc.setVersionDescription("Processo: " + getValue("WKNumProces"));
        doc.setExpires(false);
        doc.setCreateDate(calendar);
        doc.setInheritSecurity(true);
        doc.setTopicId(1);
        doc.setUserNotify(false);
        doc.setValidationStartDate(calendar);
        doc.setVersionOption("0");
        doc.setUpdateIsoProperties(true);
        
        hAPI.publishWorkflowAttachment(doc);
    }
}


function handleMoneyFormat(string){
    var javaString = new java.lang.String(string);
    javaString = javaString.replaceAll("[^0-9.,]", "");
	return javaString;
}

function verificaNotaDuplicada(){
    var numNota = hAPI.getCardValue("numero_nota");
    var cnpjFornecedor = hAPI.getCardValue("cpf_prestador");
    var docId = getValue("WKCardId");
    var serverUrl = fluigAPI.getPageService().getServerURL();

    log.info("TESTE DS adnt lancamento-------------------");
    log.dir(numNota);
    log.dir(cnpjFornecedor);
    log.dir(docId);

    var cstNumNota = DatasetFactory.createConstraint("numero_nota", numNota, numNota, ConstraintType.MUST);
    var cstCnpj = DatasetFactory.createConstraint("cpf_prestador", cnpjFornecedor, cnpjFornecedor, ConstraintType.MUST);
    var cstDocId = DatasetFactory.createConstraint("documentid", docId.toString(), docId.toString(), ConstraintType.MUST_NOT);
    var dsLancamentoNFS = DatasetFactory.getDataset("ds_lancamentoNotas", null, [cstNumNota, cstCnpj, cstDocId], null);
    log.info("TESTE DS lancamento-------------------");
    var notaHistory = "";

    if(!dsLancamentoNFS){
        return;
    }

    for(var i = 0; i < dsLancamentoNFS.rowsCount; i++){
        log.info("TESTE DS-------------------");
        var processId = dsLancamentoNFS.getValue(i, "numero_processo");
        var cstWorkflowProcessId = DatasetFactory.createConstraint("workflowProcessPK.processInstanceId", processId, processId, ConstraintType.MUST);
        var dsWorkflowProcess = DatasetFactory.getDataset("workflowProcess", null, [cstWorkflowProcessId], null);
        var status = dsWorkflowProcess.getValue(0, "status");
        if(status == "2"){
            notaHistory += "Solicitação <a target=\"_blank\" href=\"" + serverUrl + "/portal/p/INPEV/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID=" + processId + "\" class=\"link-default\"><b>" + processId + "</b></a> Referente a essa nota está <b>Finalizada(integrada)!</b><br>";
        }else if(status == "1"){
            notaHistory += "Solicitação <a target=\"_blank\" href=\"" + serverUrl + "/portal/p/INPEV/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID=" + processId + "\" class=\"link-default\"><b>" + processId + "</b></a> Referente a essa nota está <b>Cancelada!</b><br>";
        }else{
            var cstHistoryProcessId = DatasetFactory.createConstraint("processHistoryPK.processInstanceId", processId, processId, ConstraintType.MUST);
            var cstActive = DatasetFactory.createConstraint("active", true, true, ConstraintType.MUST);
            var dsProcessHistory = DatasetFactory.getDataset("processHistory", null, [cstHistoryProcessId, cstActive], null);
            log.info("TESTE DS2-------------------");
            log.dir(dsProcessHistory)
            var actualActivitie = dsProcessHistory.getValue(0, "stateSequence");
            notaHistory += "Solicitação <a target=\"_blank\" href=\"" + serverUrl + "/portal/p/INPEV/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID=" + processId + "\" class=\"link-default\"><b>" + processId + "</b></a> Referente a essa nota está na atividade <b>" + ENVIRONMENT.activitiesNumberToNameMap[actualActivitie] + "!</b><br>" ;
        }
    }

    hAPI.setCardValue("nota_history", notaHistory);
}

function getCadastroData(cnpjEmpresa){
	var data = {
		estabelecimento: "",
		naturezaOperacao: ""
	}

	var cstActive = DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST);
    var dsFilialGrupo = DatasetFactory.getDataset("ds_cadastroFilialGrupo", null, [cstActive], null);

    if(dsFilialGrupo.rowsCount == 0){        
        return data;
    }

    var docId = dsFilialGrupo.getValue(0, "documentid");

    var cstActive = DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST);
    var cstTable = DatasetFactory.createConstraint("tablename", "table_filial_grupo", "table_filial_grupo", ConstraintType.MUST);
    var cstDocId = DatasetFactory.createConstraint("documentid", docId, docId, ConstraintType.MUST);
    var dsTableFilialGrupo = DatasetFactory.getDataset("ds_cadastroFilialGrupo", null, [cstActive, cstDocId, cstTable], null);

    if(dsTableFilialGrupo.rowsCount == 0){
        return data;
    }

    for(var i = 0; i < dsTableFilialGrupo.rowsCount; i++){
        var cpfCnpjTable = new java.lang.String(dsTableFilialGrupo.getValue(i, "cpf_cnpj"));
        cpfCnpjTable = cpfCnpjTable.replaceAll("[^\\d]", "");
        if(cpfCnpjTable == cnpjEmpresa){
            var estadoNota = hAPI.getCardValue("uf_prestador");
            var estadoEstabelecimento = dsTableFilialGrupo.getValue(i, "estado");
            if(estadoNota == estadoEstabelecimento){
                data.naturezaOperacao = dsTableFilialGrupo.getValue(i, "cfop_estadual");
            }else{
                data.naturezaOperacao = dsTableFilialGrupo.getValue(i, "cfop_interestadual");
            }
			data.estabelecimento = dsTableFilialGrupo.getValue(i, "estabelecimento");
            return data;
        }
    }

    return data;
}

function handleWrongData(){
    try{
        var dataEmissao = hAPI.getCardValue("data_emissao");        
        if(dataEmissao.indexOf("-") > 0){
            var comingFormat = new java.text.SimpleDateFormat("yyyy-MM-dd");
            var brFormat = new java.text.SimpleDateFormat("dd/MM/yyyy");
            var dataEmissaoDate = new java.util.Date(comingFormat.parse(dataEmissao).getTime());
            var dataEmissaoFormated = brFormat.format(dataEmissaoDate);
            hAPI.setCardValue("data_emissao", dataEmissaoFormated);
        }
    }catch(error){
        log.info("handleWrongData ------------------------------------");
        log.dir(error);
    }    
}