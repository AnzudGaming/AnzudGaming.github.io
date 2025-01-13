// const express = require('express');
// const { Socket } = require('socket.io');
// const app = express();

// // VARIABLE PARA EL SERVIDOR DE EXPRESS
// const http = require('http').Server(app)

// //PARA GENERAR LA COMUNICACION SE NECESITA SOCKET.IO
// const io = require('socket.io')(http);

// //RUTAS
// app.use(require('./routes/ejercicio.routes.js'));

// //HTML CON LOS QUE SE VA A TRABAJAR
// app.use(express.static(__dirname + "/public"));

// io.on('connection', (socket) => {
//   socket.on('stream', (image) => {
//     // DONDE SE EMITEN LOS SOCKETS CONECTADOS
//     socket.broadcast.emit('stream', image);
//   })
// })


// module.exports = http;

const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  maxHttpBufferSize: 1e8,
});

// RUTAS
app.use(express.static(__dirname + "/public"));

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  // LEER EL EVENTO FILE DESDE EL LADO DEL CLIENTE O VISUALOZADOR
  socket.on('file', (fileData) => {
    console.log('Archivo recibido: ', fileData.slice(0, 100));

    socket.broadcast.emit('file', fileData);
  });

  socket.on('sync', (data) => {
    console.log('Evento recibido:',data)
    socket.broadcast.emit('sync', data);
  })

  socket.on('clear', () => {
    console.log('Limpiando contenido');
    io.emit('clear');
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

module.exports = server;