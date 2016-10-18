[![dependencies Status](https://david-dm.org/valaxy/rpc-websocket-client/status.svg?style=flat-square)](https://david-dm.org/valaxy/rpc-websocket-client)

RPC WebSocket comply 2 rules: 
- one request one response(for client and server)
- only one request/response pair can exist in the webSocket channel at any time(for client and server)

Only used in a very simple situation

```js
const RPCWebSocketClient = require('rpc-websocket-client/lib/index')
let client = new RPCWebSocketClient(new WebSocket('ws://...'))
client.send(msg).then((e) => {
    console.log(e)
})
```