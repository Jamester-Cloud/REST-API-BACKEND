const {format, register} =  require('timeago.js');

const helpers={};
// Condicional if para handlebars
helpers.ifCond=(v1,v2,options)=>{
    if(v1 === v2) {
        return options.fn(this);
    }else{
        return options.inverse(this);
    }   
}

// traduciendo a español formatos para fechas
helpers.timeago = (timeStamp)=>{
    const es =  function (number, index) {
        return [
            ['justo ahora', 'en un rato'],
            ['hace %s segundos', 'en %s segundos'],
            ['hace 1 minuto', 'en 1 minuto'],
            ['hace %s minutos', 'en %s minutos'],
            ['hace 1 hora', 'en 1 hora'],
            ['hace %s horas', 'en %s horas'],
            ['hace 1 día', 'en 1 día'],
            ['hace %s días', 'en %s días'],
            ['hace 1 semana', 'en 1 semana'],
            ['hace %s semanas', 'en %s semanas'],
            ['hace 1 mes', 'en 1 mes'],
            ['hace %s meses', 'en %s meses'],
            ['hace 1 año', 'en 1 año'],
            ['hace %s años', 'en %s años'],
        ][index];
    }
    register('fechaSpan', es);
    return format(timeStamp,'fechaSpan');   
};

// traduciendo a español formatos para fechas
helpers.dateFormatSpanish=(Date)=>{
    const es =  function (number, index) {
        return [
            ['justo ahora', 'en un rato'],
            ['hace %s segundos', 'en %s segundos'],
            ['hace 1 minuto', 'en 1 minuto'],
            ['hace %s minutos', 'en %s minutos'],
            ['hace 1 hora', 'en 1 hora'],
            ['hace %s horas', 'en %s horas'],
            ['hace 1 día', 'en 1 día'],
            ['hace %s días', 'en %s días'],
            ['hace 1 semana', 'en 1 semana'],
            ['hace %s semanas', 'en %s semanas'],
            ['hace 1 mes', 'en 1 mes'],
            ['hace %s meses', 'en %s meses'],
            ['hace 1 año', 'en 1 año'],
            ['hace %s años', 'en %s años'],
        ][index];
    }
    register('fechaSpan', es);
    return format(Date,'fechaSpan');
}


    




module.exports = helpers;