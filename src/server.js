const express = require('express');
const path = require('path');
const morgan = require('morgan')

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const ports = process.env.PORT || 3333;

app.use(express.static(path.join(__dirname,'public')));
app.set('views',path.join(__dirname,'public'));
app.engine('html',require('ejs').renderFile);
app.set('view engine','html');
app.use(morgan('tiny'));
app.use('/',(req,res,next)=>{
  res.render('index.html');
});

let mensagens = [];

io.on('connect', socket=>{
  console.log(`cliente conectado: ${socket.id}`);
  socket.emit('preMesagem',mensagens);
  socket.on('sendMesagem',data=>{
    mensagens.push(data);
    socket.broadcast.emit('enviar',data);
  });
});

server.listen(ports,()=>{
  console.log(`Api rodando na porta ${ports}`);
});