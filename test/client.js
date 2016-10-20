const Client = require('../lib/client')
const MockServer = require('mock-socket/dist/main').Server
const MockClient = require('mock-socket/dist/main').WebSocket

QUnit.module('RPCWebsocketClient')

window.WebSocket = MockClient

let createStandardServer = function (port) {
	let server = new MockServer(`ws://localhost:${port}`)
	server.on('message', function (msg) {
		server.send(`echo: ${msg}`)
	})
	return server
}


QUnit.test('client request and callback', (assert) => {
	let done = assert.async()
	createStandardServer(1000)
	let client = new Client(new WebSocket('ws://localhost:1000'))
	client.send('test').then(({data}) => {
		assert.equal(data, `echo: test`)
		return client.send({tt: 'tt'})
	}).then(({data}) => {
		assert.equal(data, `echo: {"tt":"tt"}`)
		done()
	})
})


QUnit.test('multiply client request', assert => {
	let async = assert.async()
	createStandardServer(1001)
	let client = new Client(new WebSocket('ws://localhost:1001'))

	client.send('test1').then(({data}) => {
		assert.equal(data, `echo: test1`)
	})

	client.send('test2').then(({data}) => {
		assert.equal(data, `echo: test2`)
	})

	client.send('test3').then(({data}) => {
		assert.equal(data, `echo: test3`)
		async()
	})
})


QUnit.test('server request', assert => {
	let async = assert.async()
	let server = new MockServer(`ws://localhost:1002`)
	let client = new Client(new WebSocket('ws://localhost:1002'))
	client.on(({data}) => {
		assert.equal(data, 'test')
		async()
	})

	server.send('test')
})


QUnit.test('mix client and server request', assert => {
	let async = assert.async()
	let server = new MockServer(`ws://localhost:1003`)
	let client = new Client(new WebSocket('ws://localhost:1003'))

	server.on('message', function (msg) {
		switch (msg) {
			case 'test1':
				server.send('echo: test1')
				break
		}
	})

	client.on(({data}) => {
		assert.equal(data, 'test2')
		async()
	})

	// start
	client.send('test1').then(({data}) => {
		assert.equal(data, 'echo: test1')

		server.send('test2')
	})
})


//QUnit.test('multiplyResponse', function (assert) {
//	var async = assert.async()
//	createStandardServer(1003)
//	var com = new Communicate(new WebSocket('ws://localhost:1003'))
//	var task = com.send('method', {msg: 'test'}, {multiplyResponse: true}, function (resData) {
//		async()
//	})
//	com.on(task, function () {
//
//	})
//})
//

//QUnit.test('onPreRequest', function (assert) {
//	var async = assert.async()
//	createStandardServer(1001)
//	var com = new Communicate(new WebSocket('ws://localhost:1001'), {
//		onPreRequest: function (req) {
//			req.params.msg += 'pre'
//			return {
//				id    : 10,
//				method: req.method,
//				paras : req.paras
//			}
//		}
//	})
//	com.send('method', {msg: 'test'}, function (resData) {
//		assert.deepEqual(resData, {
//			result: {msg: 'testpre'}
//		})
//		async()
//	})
//})
//
//QUnit.test('onPreResponse', function (assert) {
//	var async = assert.async()
//	createStandardServer(1002)
//	var com = new Communicate(new WebSocket('ws://localhost:1002'), {
//		onPreResponse: function (res) {
//			res.result.msg += 'pre'
//			return {
//				id    : res.id,
//				result: res.result
//			}
//		}
//	})
//	com.send('method', {msg: 'test'}, function (resData) {
//		assert.deepEqual(resData, {
//			result: {msg: 'testpre'}
//		})
//		async()
//	})
//})
