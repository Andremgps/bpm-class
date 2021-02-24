function validaData(data){
    log.info('>>>>>>>>>> validaData');
    log.dir(data);
    
    if (data.match(/\d\d\/\d\d\/\d\d\d\d\s\d\d:\d\d:\d\d/)) {
        log.info('>>>>>>>>>> Primeiro Match');
        log.dir(data.match(/\d\d\/\d\d\/\d\d\d\d\s\d\d:\d\d:\d\d/));

        return data.match(/\d\d\/\d\d\/\d\d\d\d\s\d\d:\d\d:\d\d/)[0];
    }
    
    if (data.match(/\d\d\/\d\d\/\d\d\d\d/)) {
        log.info('>>>>>>>>>> Segundo Match');
        log.dir(data.match(/\d\d\/\d\d\/\d\d\d\d/));

        return data.match(/\d\d\/\d\d\/\d\d\d\d/)[0]
    }

    log.info('>>>>>>>>>> Sem Match');    

    return '';
}