$(function () {
  // socket.io client side connection
  const socket = io.connect();

  // obtaining DOM elements from the Chat Interface
  const $messageForm = $("#message-form");
  const $messageBox = $("#message");
  const $chat = $("#chat");
  const $file = $("#file");

  // obtaining DOM elements from the NicknameForm Interface
  const $nickForm = $("#nickForm");
  const $nickError = $("#nickError");
  const $nickname = $("#nickname");

  // obtaining the usernames container DOM
  const $users = $("#usernames");

  //obteniendo el nick de formulario
  $nickForm.submit((e) => {
    e.preventDefault();
    socket.emit("new user", $nickname.val(), (data) => {
      if (data) {
        $("#nickWrap").hide();
        // $('#contentWrap').show();
        document.querySelector("#contentWrap").style.display = "flex";
        $("#message").focus();
      } else {
        $nickError.html(`
            <div class="alert alert-danger">
              That username already Exists.
            </div>
          `);
      }
    });
    $nickname.val("");
  });


  // events
  $messageForm.submit((e) => {
    e.preventDefault();
    socket.emit("send message", $messageBox.val(), (data) => {
      $chat.append(`<p class="error">${data}</p>`);
    });
    $messageBox.val("");
  });

  //verificamos si se envia un archivo
  $file.on('change',function (e) {
    console.log("imagen enviada")
    var file = e.originalEvent.target.files[0];
    //verificamos que sea una imagen
    if (!file.type.match('image.*')) {
      return;
    }
    var reader = new FileReader();
    reader.onload = function (progressEvent) {
      var data={
        name: file.name,
        imagen: progressEvent.target.result,
        nick: socket.nickname
      }
      socket.emit('sendFile', data);
    };
    reader.readAsDataURL(file);
  });

  socket.on("new message", (data) => {
    displayMsg(data);
  });


  socket.on("usernames", (data) => {
    let html = "";
    for (i = 0; i < data.length; i++) {
      html += `<p><i class="fas fa-user"></i> ${data[i]}</p>`;
    }
    $users.html(html);
  });

  socket.on("whisper", (data) => {
    $chat.append(`<p class="whisper"><b>${data.nick}</b>: ${data.msg}</p>`);
  });

  socket.on("load old msgs", (msgs) => {
    for (let i = msgs.length - 1; i >= 0; i--) {
      displayMsg(msgs[i]);
    }
  });

  function displayMsg(data) {
    $chat.append(
      `<p class="p-2 bg-secondary w-75 animate__animated animate__backInUp"><b>${data.nick}</b>: ${data.msg}</p>`
    );
    const chat = document.querySelector("#chat");
    chat.scrollTop = chat.scrollHeight;
  };


  //cuando se recibe el mensaje del servidor con el nombre "newFile"
  socket.on('newFile', function (data) {
    //se muestra el mensaje en el chat
    $chat.append(`<p class="p-2 bg-secondary w-75 animate__animated animate__backInUp"><b>${data.nick}</b>: <a target="_blank" href="${data.imagen}"> <img  style="width: 18rem;" src="${data.imagen}" /> </a> </p>`);
  });



});
