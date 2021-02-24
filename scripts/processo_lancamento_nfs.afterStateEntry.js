function afterStateEntry(sequenceId){
    if(sequenceId == 36){
        var notaFileId = hAPI.getCardValue("anexo_nota_id");        
        var boletoFiles = getBoletoFiles();
        if(notaFileId){
            log.info("deltedando nota ---------");
            fluigAPI.getDocumentService().deleteDocument(parseInt(notaFileId));
            hAPI.setCardValue("anexo_nota_id", "");
            hAPI.setCardValue("anexo_nota_name", "");
        }
        if(boletoFiles.length > 0){
            boletoFiles.forEach(function(boletoFile) {
                var boletoFileId = boletoFile.id;
                fluigAPI.getDocumentService().deleteDocument(parseInt(boletoFileId));
            });
            log.info("deletou boletos----------")            
        }        
    }
}
function getBoletoFiles(){
    var boletoFiles = [];
    var docId = getValue("WKCardId");
    var cstActive = DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST);
    var cstTable = DatasetFactory.createConstraint("tablename", "tb_anexos_boleto", "tb_anexos_boleto", ConstraintType.MUST);
    var cstDocId = DatasetFactory.createConstraint("documentid", docId, docId, ConstraintType.MUST);
    var dsTableBoletoAnexos = DatasetFactory.getDataset("ds_lancamentoNotas", null, [cstActive, cstDocId, cstTable], null);
    for(var i = 0; i < dsTableBoletoAnexos.rowsCount; i++){
        var boletoFileId = dsTableBoletoAnexos.getValue(i, "anexo_boleto_id");
        var boletoFileName = dsTableBoletoAnexos.getValue(i, "anexo_boleto_name");
        boletoFiles.push({
            id: boletoFileId,
            name: boletoFileName
        });
    }
    return boletoFiles;
}