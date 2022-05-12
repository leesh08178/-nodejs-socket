const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const wsModule = require('ws');

const HTTPServer = server.listen(30001, () => {
    console.log('listening on *:30001');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const wsServer = new wsModule.Server({
    server: HTTPServer
});

wsServer.on('connection', (ws, request) => {
    const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;

    console.log(`새로운 클라이언트[${ip}] 접속`);
    if (ws.readyState === ws.OPEN) {
        ws.send(`클라이언트[${ip}] 접속을 환영합니다 from 서버`);
    }

    ws.on('message', (msg) => {
        console.log(`클라이언트[${ip}]에게 수신한 메시지 : ${msg}`);
        wsServer.clients.forEach(client => client.send(`메시지 잘 받았습니다! from 서버 / 받은 메시지 : ${msg}`));
    })

    ws.on('error', (error) => {
        console.log(`클라이언트[${ip}] 연결 에러발생 : ${error}`);
    })

    ws.on('close', () => {
        console.log(`클라이언트[${ip}] 웹소켓 연결 종료`);
    })
});

