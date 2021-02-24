function servicetask57(attempt, message) {
    try{
        var cpfCnpjTomador = new java.lang.String(hAPI.getCardValue("cpf_tomador"));
        cpfCnpjTomador = cpfCnpjTomador.replaceAll("[^\\d]", "");

        //var estabelecimento =  getEstabelecimento(cpfCnpjTomador);
        var pedido = hAPI.getCardValue("numero_pedido");
        var contrato = hAPI.getCardValue("contrato") == "" ? "0" : hAPI.getCardValue("contrato");
        var cnpjFornecedor = hAPI.getCardValue("cpf_prestador");

        var cstEmpresa = DatasetFactory.createConstraint("empresa", cpfCnpjTomador, cpfCnpjTomador, ConstraintType.MUST);
        var cstEstabelecimento = DatasetFactory.createConstraint("estabelecimento", cpfCnpjTomador, cpfCnpjTomador, ConstraintType.MUST);
        var cstPedido = DatasetFactory.createConstraint("pedido", pedido, pedido, ConstraintType.MUST);
        var cstContrato = DatasetFactory.createConstraint("contrato", contrato, contrato, ConstraintType.MUST);
        var cstCnpjFornecedor = DatasetFactory.createConstraint("cnpjFornecedor", cnpjFornecedor, cnpjFornecedor, ConstraintType.MUST);
        var constraintsDatasul = [cstEmpresa, cstEstabelecimento, cstPedido, cstContrato, cstCnpjFornecedor];

        setAprovador(constraintsDatasul);
        setItems(constraintsDatasul);
        isFilaFilial();

    }catch(error){
        throw error;
    }
    return true;
}

function getEstabelecimento(cpfCnpjTomador){
    
    var cstActive = DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST);
    var dsFilialGrupo = DatasetFactory.getDataset("ds_cadastroFilialGrupo", null, [cstActive], null);

    if(dsFilialGrupo.rowsCount == 0){
        return "";
    }

    var docId = dsFilialGrupo.getValue(0, "documentid");

    var cstActive = DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST);
    var cstTable = DatasetFactory.createConstraint("tablename", "table_filial_grupo", "table_filial_grupo", ConstraintType.MUST);
    var cstDocId = DatasetFactory.createConstraint("documentid", docId, docId, ConstraintType.MUST);
    var dsTableFilialGrupo = DatasetFactory.getDataset("ds_cadastroFilialGrupo", null, [cstActive, cstDocId, cstTable], null);

    if(dsTableFilialGrupo.rowsCount == 0){
        return "";
    }

    for(var i = 0; i < dsTableFilialGrupo.rowsCount; i++){
        var cpfCnpjTable = new java.lang.String(dsTableFilialGrupo.getValue(i, "cpf_cnpj"));
        cpfCnpjTable = cpfCnpjTable.replaceAll("[^\\d]", "");
        if(cpfCnpjTable == cpfCnpjTomador){
            return dsTableFilialGrupo.getValue(i, "estabelecimento");
        }
    }

    return "";
}

function setAprovador(constraintsDatasul){
    var dsAprovador = DatasetFactory.getDataset("dsAprovadorDatasul", null, constraintsDatasul, null);
    if(dsAprovador.rowsCount > 0){
        if(dsAprovador.getValue(0, "ERRO")){
            throw "Erro datasul: " + dsAprovador.getValue(0, "ERRO");
        }
        var userDatasul = dsAprovador.getValue(0, "user");
        var cstUser = DatasetFactory.createConstraint("login", userDatasul, userDatasul, ConstraintType.MUST);
        var dsColleague = DatasetFactory.getDataset("colleague", null, [cstUser], null);
        if(dsColleague.rowsCount > 0){
            var user = dsColleague.getValue(0, "colleaguePK.colleagueId");
            var name = dsColleague.getValue(0, "colleagueName");
            hAPI.setCardValue("aprovador", user);
            hAPI.setCardValue("usuario_aprovador_cod", user)
            hAPI.setCardValue("usuario_aprovador_name", name);
            hAPI.setCardValue("tipo_aprovador", "matriz");
        }
    }
}

function setItems(constraintsDatasul){
    var dsItems = DatasetFactory.getDataset("dsItemsPedidoDatasul", null, constraintsDatasul, null);
    log.info("chamou items-----")
    if(dsItems.rowsCount > 0){
        if(dsItems.getValue(0, "ERRO")){
            throw "Erro datasul: " + dsItems.getValue(0, "ERRO");
        }
        var contrato = dsItems.getValue(0, "contrato");
        hAPI.setCardValue("contrato", contrato);
        for(var i = 0; i < dsItems.rowsCount; i++){
            log.info("adicioanando items-----")
            var childData = new java.util.HashMap();
            childData.put("codigo_item", dsItems.getValue(i, "codigoItem"));
            log.info("adicioanando items1-----")
            childData.put("descricao_item", dsItems.getValue(i, "descricaoItem"));
            log.info("adicioanando items2-----")
            childData.put("numero_ordem", dsItems.getValue(i, "numeroOrdem"));
            log.info("adicioanando items3-----")
            childData.put("centro_custo", dsItems.getValue(i, "centroCusto"));
            log.info("adicioanando items4-----")
            childData.put("conta_contabil", dsItems.getValue(i, "contaContabil"));
            log.info("adicioanando items5-----")
            childData.put("cod_unidade_item", dsItems.getValue(i, "codigoUnidade"));
            log.info("adicioanando items6-----")
            childData.put("quantidade_item", "1");
            var precoUnitario = dsItems.getValue(i, "precoUnitario")
            var floatPrecoUnitario = java.lang.Float.parseFloat(precoUnitario);
            childData.put("preco_item", formatMoney(floatPrecoUnitario));            
            log.info("adicioanando items9-----")
            hAPI.addCardChild("tb_items", childData);
            log.info("adicionou items-----")
        }       
        var nota = hAPI.getCardValue("valor_total_nota");
        var datasulPrice = dsItems.getValue(0, "precoUnitario") 
        var floatDatasulPrice = java.lang.Float.parseFloat(datasulPrice);
        if(formatMoney(floatDatasulPrice) != nota){
            hAPI.setCardValue("hasValidItems", "false");
        }
    }
}

function formatMoney(decimal){
    var brLocale = new java.util.Locale("pt", "BR");
    var brFormat = java.text.NumberFormat.getCurrencyInstance(brLocale);
    var formatedValue = brFormat.format(decimal);
    var value = formatedValue.replaceAll("[^0-9.,]", "");
    return value;
}

function formatDecimal(string){
    var javaString = new java.lang.String(string);
    javaString = javaString.replaceAll("[^0-9.,]", "");
	javaString = javaString.replace(".", "");
	javaString = javaString.replace(",", ".");
	return javaString;
}
