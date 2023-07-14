
var Chat = require('./models/Chat');

var socket = io => {

  let users = {};

  io.on('connection', async socket => {
    console.log('new user connected');
    let messages = await Chat.find({}).limit(8).sort('-created');
    //variable para tomar tiempo de carga de mensajes
    var time = new Date();

    socket.emit('load old msgs', messages);

    //termina tiempo de carga de mensajes
    var time2 = new Date();
    console.log('Tiempo de carga de mensajes: ' + (time2 - time) + 'ms');

    socket.on('new user', (data, cb) => {
      if (data in users) {
        cb(false);
      } else {
        cb(true);
        socket.nickname = data;
        users[socket.nickname] = socket;
        updateNicknames();
      }
    });

    // receive a message a broadcasting
    socket.on('send message', async (data, cb) => {
      var msg = data.trim();

      if (msg.substr(0, 3) === '/w ') {
        msg = msg.substr(3);
        var index = msg.indexOf(' ');
        if (index !== -1) {
          var name = msg.substring(0, index);
          var msg = msg.substring(index + 1);
          if (name in users) {
            users[name].emit('whisper', {
              msg,
              nick: socket.nickname
            });
          } else {
            cb('Error! Ingresaste un usuario que no existe');
          }
        } else {
          cb('Error! Por favor ingresa tu mensaje');
        }
      } else {
        //variable para tomar tiempo de envio de mensaje
        var time = new Date();
        var newMsg = new Chat({
          msg,
          nick: socket.nickname
        });
        await newMsg.save();

        io.sockets.emit('new message', {
          msg,
          nick: socket.nickname
        });
        //termina tiempo de envio de mensaje
        var time2 = new Date();
        console.log('Tiempo de envio de mensaje: ' + (time2 - time) + 'ms');
      }

    });

    //cuando se reciba un mensaje del cliente con el nombre "sendFile"
    socket.on('sendFile', function (data) {
      //se envia el mensaje al cliente con el nombre "newFile"
      io.sockets.emit('newFile', {
        nick: socket.nickname,
        imagen: data.imagen,
      });
      console.log("imagen recibida");
    });

    socket.on('disconnect', data => {
      if (!socket.nickname) return;
      delete users[socket.nickname];
      updateNicknames();
    });

    function updateNicknames() {
      io.sockets.emit('usernames', Object.keys(users));
    }
  });

}

module.exports = socket;
