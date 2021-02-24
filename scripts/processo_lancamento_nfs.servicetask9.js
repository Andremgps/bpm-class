function servicetask9(attempt, message) {

	var cnpjEmpresa = hAPI.getCardValue("cpf_tomador");	
    var cnpjEstabelecimento = hAPI.getCardValue("estabelecimento");
    var naturezaOperacao = hAPI.getCardValue("natureza_operacao");
	var cnpjFornecedor = hAPI.getCardValue("cpf_prestador");
	var numeroDocto = hAPI.getCardValue("numero_nota");
	var serieDocto = "";
    var codigoObservacao = "4";
    var dataEmissao = validaData(hAPI.getCardValue("data_emissao"));
    var valor_inss = formatDecimal(hAPI.getCardValue("inss"));
    var valor_irrf = formatDecimal(hAPI.getCardValue("irrf"));
    var valor_csll = formatDecimal(hAPI.getCardValue("csll"));
    var valor_cofins = formatDecimal(hAPI.getCardValue("cofins"));
    var valor_pis_pasep = formatDecimal(hAPI.getCardValue("pis_pasep"));    
    var itemRecords = getItemsRecords();
    var linkRecords = getLinksGedRecords();
    var boletoRecords = getBoletosRecords();
    var numeroFluig = hAPI.getCardValue("numero_processo");

	var gson = new com.google.gson.Gson();
    var programName = "fluig/esfluig002.r";
    var procedureName = "geraNotaFiscal";
    var jsonToDatasul = [
        {
            "dataType": "character", 
            "name": "cnpjEmpresa",  
            "value": cnpjEmpresa,
            "type": "input"
        }, {
            "dataType": "character", 
            "name": "cnpjEstab",  
            "value": cnpjEmpresa,
            "type": "input"
        }, {
            "dataType": "character", 
            "name": "cnpjFornecedor",  
            "value": cnpjFornecedor,
            "type": "input"
        }, {
            "dataType": "character", 
            "name": "numeroDocto",  
            "value": numeroDocto,
            "type": "input"
        }, {
            "dataType": "character", 
            "name": "serieDocto",  
            "value": serieDocto,
            "type": "input"
        }, {
            "dataType": "character", 
            "name": "naturezaOperacao",  
            "value": naturezaOperacao,
            "type": "input"
        }, {
            "dataType": "integer", 
            "name": "codigoObservacao",  
            "value": codigoObservacao,
            "type": "input"
        }, {
            "dataType": "character", 
            "name": "dataEmissao",  
            "value": dataEmissao,
            "type": "input"
        }, {
            "dataType": "decimal", 
            "name": "valor_inss",  
            "value": valor_inss,
            "type": "input"
        }, {
            "dataType": "decimal", 
            "name": "valor_irrf",  
            "value": valor_irrf,
            "type": "input"
        }, {
            "dataType": "decimal", 
            "name": "valor_csll",  
            "value": valor_csll,
            "type": "input"
        }, {
            "dataType": "decimal", 
            "name": "valor_cofins",  
            "value": valor_cofins,
            "type": "input"
        }, {
            "dataType": "decimal", 
            "name": "valor_pis_pasep",  
            "value": valor_pis_pasep,
            "type": "input"
        }, {
            "dataType": "integer", 
            "name": "numeroFluig",  
            "value": numeroFluig,
            "type": "input"
        }, {
            "dataType": "character", 
            "name": "pMensagem",  
            "value": "",
            "type": "output"
        }, {
            "dataType": "temptable",
            "name": "tt_item",
            "type": "input",
            "value": {
                "name": "tt_item",
                "fields": [
                    {
                        "name": "numPedido",
                        "label": "Num Pedido",
                        "type": "integer"
                    },{
                        "name": "numContrato",
                        "label": "Num Contrato",
                        "type": "integer"
                    },{
                        "name": "codigoItem",
                        "label": "Codigo Item",
                        "type": "character"
                    },{
                        "name": "quantidade",
                        "label": "Quantidade",
                        "type": "decimal"
                    },{
                        "name": "precoUnitario",
                        "label": "Valor Unitario",
                        "type": "decimal"
                    },{
                        "name": "precoTotal",
                        "label": "Total",
                        "type": "decimal"
                    },{
                        "name": "descricaoItem",
                        "label": "Desc",
                        "type": "character"
                    },{
                        "name": "valorDeducao",
                        "label": "Deducao",
                        "type": "decimal"
                    },{
                        "name": "baseCalculo",
                        "label": "Base Calculo",
                        "type": "decimal"
                    },{
                        "name": "aliquota",
                        "label": "Aliquota",
                        "type": "decimal"
                    },{
                        "name": "valorISS",
                        "label": "Valor ISS",
                        "type": "decimal"
                    },{
                        "name": "retidoISS",
                        "label": "ISS Retido",
                        "type": "character"
                    },{
                        "name": "tt_cod-unid-negoc",
                        "label": "Código unidade",
                        "type": "character"
                    },{
                        "name": "tt_ct-codigo",
                        "label": "Centro de Custo",
                        "type": "character"
                    },{
                        "name": "tt_sc-codigo",
                        "label": "SC",
                        "type": "character"
                    },{
                        "name": "tt_numeroOrdem",
                        "label": "Numero Ordem",
                        "type": "integer"
                    }
                ],
                "records": itemRecords
            }
        }, {
            "dataType": "temptable",
            "name": "tt_linkGed",
            "type": "input",
            "value": {
                "name": "tt_linkGed",
                "fields": [
                    {
                        "name": "tipoDocto",
                        "label": "tipoDocto",
                        "type": "character"
                    },{
                        "name": "linkDocto",
                        "label": "linkDocto",
                        "type": "character"
                    }
                ],
                "records": linkRecords
            }
        }, {
            "dataType": "temptable",
            "name": "tt_boleto",
            "type": "input",
            "value": {
                "name": "tt_boleto",
                "fields": [
                    {
                        "name": "codigoBarra",
                        "label": "codigoBarra",
                        "type": "character"
                    }
                ],
                "records": boletoRecords
            }
        }
	];

    var c1 = DatasetFactory.createConstraint("programName", programName, programName, ConstraintType.MUST);
    var c2 = DatasetFactory.createConstraint("procedureName", procedureName, procedureName, ConstraintType.MUST);
    var c3 = DatasetFactory.createConstraint("json", gson.toJson(jsonToDatasul), gson.toJson(jsonToDatasul), ConstraintType.MUST);
	var dsDatasul = DatasetFactory.getDataset("DatasulCall", null, new Array(c1, c2, c3), null);
	
	try {
		var jsonResponse = dsDatasul.getValue(0, "response");
		if(jsonResponse == "ERRO"){
			throw dsDatasul.getValue(0, "msgErro");
        }	
        var parsedJson = JSON.parse(jsonResponse);
        var mensagemDatasul = parsedJson[0].value;
        if(mensagemDatasul != "Gerou"){
            throw mensagemDatasul;
        }
	} catch (error) {
		throw error;
	}

	return true;

}

function getItemsRecords(){
	var docId = getValue("WKCardId");
	
	var cstActive = DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST);
    var cstTable = DatasetFactory.createConstraint("tablename", "tb_items", "tb_items", ConstraintType.MUST);
    var cstDocId = DatasetFactory.createConstraint("documentid", docId, docId, ConstraintType.MUST);
	var dsTableItems = DatasetFactory.getDataset("ds_lancamentoNotas", null, [cstActive, cstDocId, cstTable], null);
	
	var itemRecords = []

	if(dsTableItems.rowsCount == 0){
		return itemRecords;
	}

	for(var i = 0; i < dsTableItems.rowsCount; i++){
        var quantidade = formatDecimal(dsTableItems.getValue(i, "quantidade_item"));
        var precoUnitario = formatDecimal(dsTableItems.getValue(i, "preco_item"));
        var precoTotal = getPrecoTotal(quantidade, precoUnitario);        
		var itemRecordRow = {
            "numPedido": hAPI.getCardValue("numero_pedido") != "" ? new java.lang.Integer(hAPI.getCardValue("numero_pedido")) : new java.lang.Integer("0"),
            "numContrato": hAPI.getCardValue("contrato") != "" ? new java.lang.Integer(hAPI.getCardValue("contrato")) : new java.lang.Integer("0"),
			"codigoItem": dsTableItems.getValue(i, "codigo_item"),
			"quantidade": quantidade,
			"precoUnitario": precoUnitario,
			"precoTotal": precoTotal.replace(",", "."),
			"descricaoItem": hAPI.getCardValue("discriminacao_servicos"),
			"valorDeducao": formatDecimal(hAPI.getCardValue("valor_total_deducoes")),
			"baseCalculo": formatDecimal(hAPI.getCardValue("base_calculo")),
			"aliquota": formatDecimal(hAPI.getCardValue("aliquota")),
			"valorISS": formatDecimal(hAPI.getCardValue("valor_iss")),
            "retidoISS": hAPI.getCardValue("iss_retido"),
            "tt_cod-unid-negoc": dsTableItems.getValue(i, "cod_unidade_item"),
            "tt_ct-codigo": dsTableItems.getValue(i, "conta_contabil"),
            "tt_sc-codigo": dsTableItems.getValue(i, "centro_custo"), 
            "tt_numeroOrdem": dsTableItems.getValue(i, "numero_ordem") != "" ? new java.lang.Integer(dsTableItems.getValue(i, "numero_ordem")) : new java.lang.Integer("0"),
		}
		itemRecords.push(itemRecordRow);
	}

	return itemRecords;
}

function getPrecoTotal(precoItem, quantidadeItem){
    var decimalFormat = new java.text.DecimalFormat("0.00");
    precoItem = java.lang.Float.parseFloat(precoItem);
    quantidadeItem = java.lang.Float.parseFloat(quantidadeItem);
    var result = precoItem * quantidadeItem;
    return decimalFormat.format(result);
}

function formatDecimal(string){
    var javaString = new java.lang.String(string);
    javaString = javaString.replaceAll("[^0-9.,]", "");
	javaString = javaString.replace(".", "");
	javaString = javaString.replace(",", ".");
	return javaString == "" ? "0" : javaString;
}

function getLinksGedRecords(){
    var linksRecords = []
    var attachments = hAPI.listAttachments();
    var anexosErp = hAPI.getCardValue("anexos_erp");
    if(anexosErp == ""){
        return linksRecords;
    }
    var jsonAttachmentsNames = JSON.parse(anexosErp);
    if(
        (jsonAttachmentsNames.bol.length == 0 && jsonAttachmentsNames.nfse.length == 0) ||
        hAPI.listAttachments().size() == 0
    ){
        return linksRecords;
    }
    for(var i = 0; i < attachments.size(); i++){
        var attachment = attachments.get(i);
        var attachmentName = String(attachment.getDocumentDescription());
        if(jsonAttachmentsNames.bol.indexOf(attachmentName) == -1 && jsonAttachmentsNames.nfse.indexOf(attachmentName) == -1 ){
            continue;
        }
        var attachmentType = jsonAttachmentsNames.bol.indexOf(attachmentName) != -1 ? "bol" : "nfse";
        var attachmentId = attachment.getDocumentId();
        var attachmentUrl = fluigAPI.getDocumentService().getDownloadURL(attachmentId);
        var linkRecordRow = {
            tipoDocto: attachmentType,
            linkDocto: attachmentUrl.replace("\u003d", "=")
        }
        linksRecords.push(linkRecordRow);
    }
    return linksRecords;
}

function getBoletosRecords(){
    var docId = getValue("WKCardId");
	
	var cstActive = DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST);
    var cstTable = DatasetFactory.createConstraint("tablename", "tb_boletos", "tb_boletos", ConstraintType.MUST);
    var cstDocId = DatasetFactory.createConstraint("documentid", docId, docId, ConstraintType.MUST);
	var dsTableBoletos = DatasetFactory.getDataset("ds_lancamentoNotas", null, [cstActive, cstDocId, cstTable], null);
	
	var boletoRecords = []

	if(dsTableBoletos.rowsCount == 0){
		return boletoRecords;
	}

	for(var i = 0; i < dsTableBoletos.rowsCount; i++){
        var codigoBarra = dsTableBoletos.getValue(i, "codigo_barras");
        codigoBarra = codigoBarra.replaceAll("[^0-9]", "");
		var boletoRecordRow = {
			"codigoBarra": codigoBarra,
		}
		boletoRecords.push(boletoRecordRow);
	}

	return boletoRecords;
}