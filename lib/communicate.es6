define(function () {
	class Communicate {
		constructor(ws, options = {}) {
			this._source = ws
			this._taskId = 0  // task ID, auto increase, never same in a Communicate instance
			this._onPreResponse = options.onPreResponse
			this._onPreRequest = options.onPreRequest
		}

		// multiplyResponse: true
		send(method, params, options = {multiplyResponse: false}, callback = undefined) {
			if (typeof options == 'function') {
				callback = options
				options = {multiplyResponse: false}
			}
			var reqData = {
				id    : this._taskId++,
				type  : method,
				params: params
			}

			if (this._onPreRequest) {
				this._onPreRequest(reqData)
			}

			if (callback) {
				this._source.addEventListener('message', function onMessage(e) {
					var resData = JSON.parse(e.data)

					if (this._onPreResponse) {
						resData = this._onPreResponse(resData)
					}

					if (resData.id == reqData.id) {
						if (!options.multiplyResponse) {
							this._source.removeEventListener('message', onMessage) // only need to execute once
						}
						delete resData.id

						callback(resData)
					}
				}.bind(this))
			}

			this._source.send(JSON.stringify(reqData)) // send request to source
		}


	}

	return Communicate
})

//addEventListener('message', function (e) {
//	var json = e.data
//	if (!('type' in json)) { // not a request
//		return
//	}
//	var id = json.id
//	var type = json.type
//	var data = json.data
//	if (type in this._handlers) {
//		this._handlers[type](data, function (res) {
//			this._source.postMessage({ // send response without type to source
//				id  : id,
//				data: res
//			}, this._domain)
//		}.bind(this))
//	} else {
//		console.debug('[warn] handler of type=' + type + ' not exist')
//	}
//}.bind(this))

//on(name, handler) {
//	this._handlers[name] = handler
//}