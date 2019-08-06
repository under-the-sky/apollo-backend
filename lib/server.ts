import app from "./app";

import * as http from 'http';
import * as WebSocket from 'ws';
const PORT = process.env.PORT || 3000;


const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

// app.get('/', function (req, res) {
//     res.sendFile(__dirname + '/index.html');
// });

wss.on('connection', (ws: WebSocket) => {
    //connection is up, let's add a simple simple event
    ws.on('message', (message: string) => {

        //log the received message and send it back to the client
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                const msg = JSON.parse(message);
                client.send(JSON.stringify(msg));
            }
        })

    });

    //send immediatly a feedback to the incoming connection    
    // ws.send('Hi there, I am a WebSocket server');
});
server.listen(PORT, () => {
    console.log('Express server listening on port ' + PORT);
})

