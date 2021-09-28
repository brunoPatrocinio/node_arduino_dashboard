//Servidor WEB com Node JS, Socket.io e leitura de dados obtidos da serialPort USB com Arduino
//usando um Sensor de Temperatura e Umidade, e um fotoresistor LDR
var http = require('http');
var express = require('express');
var app = express();
const { createServer } = require("http");
const { Server, Socket } = require("socket.io");
const httpServer = createServer(app);

const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const io = new Server(httpServer, {});

const porta = new SerialPort('COM6', { //importante: prta USB deve ser a mesma usada pela IDE do arduino.
    baudRate: 115200 // baudrate deve ser o mesmo configurado na IDE do Arduino/monitor Serial
});

app.engine('ejs', require('ejs').__express);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('index');
});

/*
porta.on('readable', () => { //imprime o buffer
    console.log('Data: ', porta.read())
});
*/
//const parser = porta.pipe(new Readline({ delimiter: '\r\n' })); //delimita leitura com qas quebras correspondentes

io.on('connection', (socket) => { // Na hora que abrir a pagina web / raiz, printa no console
    console.log("Conectado.");
});

const parser = porta.pipe(new Readline());
parser.on('data', console.log);

parser.on('data', (data) => {
    io.emit('data', { data: data });
});

httpServer.listen(3000, () => {
    console.log("Ouvindo na porta 3000");
});