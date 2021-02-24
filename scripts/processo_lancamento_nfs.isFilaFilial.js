function isFilaFilial(){
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
    log.info("DATASETGRUPOFILIALZUIN")
    log.dir(dsTableFilialGrupo.values)
    for(var i = 0; i < dsTableFilialGrupo.rowsCount; i++){
        var cpfCnpjTable = new java.lang.String(dsTableFilialGrupo.getValue(i, "cpf_cnpj"));
        var estadoNota = new java.lang.String(dsTableFilialGrupo.getValue(i, "estado"));
        var cfop_estadual = new java.lang.String(dsTableFilialGrupo.getValue(i, "cfop_estadual"))
        var cfop_interestadual = new java.lang.String(dsTableFilialGrupo.getValue(i, "cfop_interestadual"))
        cpfCnpjTable = cpfCnpjTable.replaceAll("[^\\d]", "");
        if(cpfCnpjTable == cpfCnpjTomador){
       //Ajustes ZUIN , COMPARAÇÃO PARA VER SE O ESTADO DO PRESTADOR É IGUAL AO QUE ESTA NO FORMULARIO AUXILIAR 
       // SE FOR, ELE VAI SETAR O VALOR DE CFOP_ESTADUAL , SE NAO FOR ELE VAI SETAR O CFOP_INTERESTADUAL
            if(hAPI.getCardValue("uf_prestador") == estadoNota)
            {
                hAPI.setCardValue("natureza_operacao" , cfop_estadual)
            }
            else
            {
                hAPI.setCardValue("natureza_operacao" , cfop_interestadual)
            }
            var grupo = dsTableFilialGrupo.getValue(i, "grupo");
            if(grupo != "" && grupo != null){
                hAPI.setCardValue("aprovador", "Pool:Group:" + grupo);
                hAPI.setCardValue("grupo_aprovacao_filial", grupo);
                hAPI.setCardValue("tipo_aprovador", "filial");
                
                
                return true;
            }else{
                return false;
            }
        }
        else
        {
            
        }
    }

    return false;
}