module.exports = class RPCWebSocketClient {
	constructor(ws) {
		this._ws = ws
		this._responsePromiseResolves = []
		this._requestHandlers = []

		this._ws.addEventListener('message', (e) => {
			if (this._responsePromiseResolves.length == 0) {
				this._requestHandlers.forEach(handler => {
					handler(e)
				})
			} else {
				let resolve = this._responsePromiseResolves.shift()
				resolve(e)
			}
		})
	}

	on(handler) {
		this._requestHandlers.push(handler)
	}

	send(data) {
		return new Promise(resolve => {
			this._responsePromiseResolves.push(resolve)
			this._ws.send(data) // send request to server
		})

	}
}

//this._onPreResponse = options.onPreResponse
//this._onPreRequest = options.onPreRequest
