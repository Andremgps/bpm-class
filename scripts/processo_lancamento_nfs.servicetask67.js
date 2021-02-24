function servicetask67(attempt, message) {        

    var user = "admin";
    var password = "adm";
    var companyId = getValue("WKCompany");
    var processInstanceId = getValue("WKNumProces");
    var choosedState = 67;
    var comments = "";
    var userId = "admin";
    var completeTask = false;
    var managerMode = true;
    var threadSequence = 0;

    var notaFileId = hAPI.getCardValue("anexo_nota_id");
    var notaFileName = hAPI.getCardValue("anexo_nota_name");
    var boletoFiles = getBoletoFiles();

    if((notaFileId == "" || notaFileId == null || notaFileId == undefined) && boletoFiles.length == 0){
        return true;
    }

    try{
        var service = ServiceManager.getService('ECMWorkflowEngineService'); 		
		var workflowEngineService = service.instantiate('com.totvs.technology.ecm.workflow.ws.ECMWorkflowEngineServiceService');
        var workflowEngineServicePort = workflowEngineService.getWorkflowEngineServicePort();
                
        var appointment = service.instantiate('com.totvs.technology.ecm.workflow.ws.ProcessTaskAppointmentDtoArray');
        var cardData = service.instantiate('net.java.dev.jaxb.array.StringArrayArray');
        var colleagueIds = service.instantiate('net.java.dev.jaxb.array.StringArray');
        var attachments = service.instantiate('com.totvs.technology.ecm.workflow.ws.ProcessAttachmentDtoArray');

        log.info("Instanciou webservices --------");

        if(notaFileId != "" && notaFileId != null && notaFileId != undefined){
            var notaAttachment = getAttachmentDto(service, notaFileId, notaFileName);                      
            attachments.getItem().add(notaAttachment);
        }

        if(boletoFiles.length > 0){
            boletoFiles.forEach(function(boletoFile) {
                var boletoFileId = boletoFile.id;
                var boletoFileName = boletoFile.name;
                var boletoAttachment = getAttachmentDto(service, boletoFileId, boletoFileName);
                attachments.getItem().add(boletoAttachment);
            });
        }

        log.info("Chamando save and send task ---------");

        var result = workflowEngineServicePort.saveAndSendTask(
            user, 
            password, 
            companyId, 
            processInstanceId, 
            choosedState, 
            colleagueIds, 
            comments, 
            userId, 
            completeTask,
            attachments,
            cardData,
            appointment,
            managerMode,
            threadSequence
        );

        log.info("Chamou save and send task -----------");

        if(result.getItem().get(0).getItem().get(0).indexOf("ERROR") > -1){
            throw result.getItem().get(0).getItem().get(1);
        }
                
    }catch(error){
        throw error;
    }

    return true;

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

function getAttachmentDto(service, fileId, fileName){   
    var fileUrl = fluigAPI.getDocumentService().getDownloadURL(parseInt(fileId));
    var requestUrl = new java.net.URL(fileUrl);
    var fileStream = requestUrl.openStream();
    var fileBytes = org.apache.commons.io.IOUtils.toByteArray(fileStream);    

    var attachmentDto = service.instantiate("com.totvs.technology.ecm.workflow.ws.ProcessAttachmentDto");
    var attachment = service.instantiate("com.totvs.technology.ecm.workflow.ws.Attachment"); 

    attachment.setAttach(true);
    attachment.setEditing(false);
    attachment.setFileSize(0);
    attachment.setFileName(fileName);               
    attachment.setFilecontent(fileBytes);            
    attachmentDto.getAttachments().add(attachment);
    attachmentDto.setDescription(fileName);
    return attachmentDto;
}