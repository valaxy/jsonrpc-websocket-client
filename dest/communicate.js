'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

define(function () {
	var Communicate = (function () {
		function Communicate(ws, options) {
			_classCallCheck(this, Communicate);

			this._source = ws;
			this._taskId = 0; // task ID, auto increase, never same in a Communicate instance
			this._source = options.source; // which to post message to
			this._domain = options.domain; // domain rule specify who can been sent
			this._handlers = {};
			this._onPreResponse = options.onPreResponse;
			this._onPreRequest = options.onPreRequest;
		}

		_createClass(Communicate, [{
			key: 'send',
			value: function send(method, params, callback) {
				var reqData = {
					id: this._taskId++,
					type: method,
					data: params
				};

				if (callback) {
					this._source.addEventListener('message', (function onMessage(e) {
						var resData = JSON.parse(e.data);
						if (resData.id == reqData.id) {
							this._source.removeEventListener('message', onMessage); // only need to execute once
							callback(resData.data);
						}
					}).bind(this));
				}

				this._source.send(JSON.stringify(reqData)); // send request to source
			}
		}]);

		return Communicate;
	})();

	return Communicate;
});

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

