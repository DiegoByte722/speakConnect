const { parentPort } = require('worker_threads');
//obtenemos la hora
function muestrahora() {
    //variable hora de vista profile
    var hora;
    var fecha = new Date();
    var horadate = fecha.getHours();
    var minutos = fecha.getMinutes();
    var segundos = fecha.getSeconds();
    var sufijo = 'AM';
    if (horadate < 10) {
        horadate = '0' + horadate;
    }
    if (minutos < 10) {
        minutos = '0' + minutos;
    }
    if (segundos < 10) {
        segundos = '0' + segundos;
    }
    if (horadate > 12) {
        horadate = horadate - 12;
        sufijo = 'PM';
    }
    hora = horadate + ':' + minutos + ':' + segundos + ' ' + sufijo;
    //enviamos el mensaje al hilo principal
    parentPort.postMessage(hora);
};
parentPort.on('message', (msg) => {
    console.log('MENSAJE RECIBIDO: ' + msg);
});
var repeticion = setInterval(muestrahora, 1000);

setTimeout(() => {
    clearInterval(repeticion);
}, 11000);



//enviar mensaje al hilo principal
//parentPort.postMessage('Hola desde el hilo secundario');