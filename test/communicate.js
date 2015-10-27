define(function (require) {
	var Communicate = require('dest/communicate')
	require('mock-socket')

	QUnit.module('Communicate')

	window.WebSocket = MockSocket

	var createStandardServer = function (port) {
		var server = new MockServer('ws://localhost:' + port)
		server.on('message', function (msg) {
			var req = JSON.parse(msg)
			server.send(JSON.stringify({
				id    : req.id,
				result: req.params
			}))
		})
		return server
	}


	QUnit.test('send and callback', function (assert) {
		var async = assert.async()
		createStandardServer(1000)
		var com = new Communicate(new WebSocket('ws://localhost:1000'))
		com.send('test', {msg: 'test data'}, function (data) {
			assert.deepEqual(data, {result: {msg: 'test data'}})
			async()
		})
	})


	QUnit.test('onPreRequest', function (assert) {
		var async = assert.async()
		createStandardServer(1001)
		var com = new Communicate(new WebSocket('ws://localhost:1001'), {
			onPreRequest: function (req) {
				req.params.msg += 'pre'
				return {
					id    : 10,
					method: req.method,
					paras : req.paras
				}
			}
		})
		com.send('method', {msg: 'test'}, function (resData) {
			assert.deepEqual(resData, {
				result: {msg: 'testpre'}
			})
			async()
		})
	})

	QUnit.test('onPreResponse', function (assert) {
		var async = assert.async()
		createStandardServer(1002)
		var com = new Communicate(new WebSocket('ws://localhost:1002'), {
			onPreResponse: function (res) {
				res.result.msg += 'pre'
				return { // todo, 如果这里改ID会导致内部逻辑死循环
					id    : res.id,
					result: res.result
				}
			}
		})
		com.send('method', {msg: 'test'}, function (resData) {
			assert.deepEqual(resData, {
				result: {msg: 'testpre'}
			})
			async()
		})
	})

	QUnit.test('no callback', function (assert) {
		assert.ok(true)
	})

	QUnit.test('multiplyResponse', function (assert) {
		var async = assert.async()
		createStandardServer(1003)
		var com = new Communicate(new WebSocket('ws://localhost:1003'))
		var task = com.send('method', {msg: 'test'}, {multiplyResponse: true}, function (resData) {
			async()
		})
		com.on(task, function () {

		})
	})
})