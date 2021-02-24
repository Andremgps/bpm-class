function verificaAprovacaoNota(){

    if(hAPI.getCardValue("nota_duplicada") != "" && hAPI.getCardValue("nota_duplicada") != undefined && hAPI.getCardValue("nota_duplicada") != null){
        return false;
    }

    var cstActive = DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST);
    var dsFilialGrupo = DatasetFactory.getDataset("ds_cadastroFilialGrupo", null, [cstActive], null);

    if(dsFilialGrupo.rowsCount == 0){
        return false;
    }

    var docId = dsFilialGrupo.getValue(0, "documentid");

    var cstActive = DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST);
    var cstTable = DatasetFactory.createConstraint("tablename", "table_filial_grupo", "table_filial_grupo", ConstraintType.MUST);
    var cstDocId = DatasetFactory.createConstraint("documentid", docId, docId, ConstraintType.MUST);
    var dsTableFilialGrupo = DatasetFactory.getDataset("ds_cadastroFilialGrupo", null, [cstActive, cstDocId, cstTable], null);

    if(dsTableFilialGrupo.rowsCount == 0){
        return false;
    }

    var cpfCnpjTomador = new java.lang.String(hAPI.getCardValue("cpf_tomador"));
    cpfCnpjTomador = cpfCnpjTomador.replaceAll("[^\\d]", "");
    for(var i = 0; i < dsTableFilialGrupo.rowsCount; i++){
        var cpfCnpjTable = new java.lang.String(dsTableFilialGrupo.getValue(i, "cpf_cnpj"));
        cpfCnpjTable = cpfCnpjTable.replaceAll("[^\\d]", "");
        if(cpfCnpjTable == cpfCnpjTomador){
            var filaFiliais = dsTableFilialGrupo.getValue(i, "fila_filiais");
            if(
                (
                    filaFiliais == "off" || 
                    filaFiliais == null || 
                    filaFiliais == ""
                ) &&
                hAPI.getCardValue("aprovador") != ""
            ){
                return true;
            }else{
                return false;
            }
        }
    }

    return false;
}