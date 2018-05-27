import WebSocket from 'ws';

export default class WebSocketServer {
  constructor(server) {
    if(server) {
      /** Let's create the websocket server */
      const wss = new WebSocket.Server({
        server,
      });

      wss.on('connection', ws => {
        ws.on('message', msg => {
          console.log('received: %s', msg)
        });

        //Let's send some status (timestamp) every minute
        setInterval(() => ws.send(`socket status: ${new Date()}`), 1000*60);
      });
    } else {
      console.error('check ws connection.');
    }
  }
}
