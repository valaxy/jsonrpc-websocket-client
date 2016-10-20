module.exports = class RPCWebSocketServer {
	constructor(ws) {
		this._ws = ws
		this._responsePromiseResolves = []
		this._requestHandlers = []

		this._ws.on('message', (msg) => {
			if (this._responsePromiseResolves.length == 0) {
				this._requestHandlers.forEach(handler => {
					handler(msg)
				})
			} else {
				let resolve = this._responsePromiseResolves.shift()
				resolve(msg)
			}
		})
	}

	on(handler) {
		this._requestHandlers.push(handler)
	}

	/** string || object */
	send(data) {
		if (typeof data == 'object') data = JSON.stringify(data)

		return new Promise(resolve => {
			this._responsePromiseResolves.push(resolve)
			this._ws.send(data) // send request to client
		})
	}
}