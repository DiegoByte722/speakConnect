$(document).ready(function () {
    function muestrahora() {
        //variable hora de vista profile
        var hora = $('#hora');
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
        hora.text(horadate + ':' + minutos + ':' + segundos + ' ' + sufijo);
    };
    setInterval(muestrahora, 1000);
});