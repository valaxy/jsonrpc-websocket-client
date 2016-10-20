// 默认只支持String通信
module.exports = class RPCWebSocketServer {
	constructor(ws) {
		this._ws = ws
		this._responsePromiseResolves = []
		this._requestHandlers = []

		this._ws.on('message', (data) => {
			let options = {data}
			this.onBeforeReceive(options)

			if (this._responsePromiseResolves.length == 0) {
				this._requestHandlers.forEach(handler => {
					handler(options.data)
				})
			} else {
				let resolve = this._responsePromiseResolves.shift()
				resolve(options.data)
			}
		})
	}

	onBeforeSend(options) {
		options.data = JSON.stringify(options.data)
	}

	onBeforeReceive(options) {
		options.data = JSON.parse(options.data)
	}

	on(handler) {
		this._requestHandlers.push(handler)
	}

	/**
	 * send data
	 */
	send(data) {
		let options = {data}
		this.onBeforeSend(options)
		this._ws.send(options.data)
	}

	/**
	 * send data and response
	 */
	request(data) {
		return new Promise(resolve => {
			this._responsePromiseResolves.push(resolve)
			let options = {data}
			this.onBeforeSend(options)
			this._ws.send(options.data)
		})
	}
}