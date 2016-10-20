const Server = require('../lib/server')
const MockServer = require('mock-socket/dist/main').Server
const MockClient = require('mock-socket/dist/main').WebSocket;

QUnit.module('RPCWebSocketServer')


QUnit.test('request()', assert => {
	let done = assert.async()
	let server = new Server(new MockServer(`ws://localhost:2000`))
	let client = new MockClient('ws://localhost:2000')
	client.addEventListener('message', ({data}) => {
		client.send(JSON.stringify({echo: JSON.parse(data)}))
	})

	server.request({tt: 't1'}).then(data => {
		assert.deepEqual(data, {echo: {tt: 't1'}})
		return server.request({tt: 't2'})
	}).then(data => {
		assert.deepEqual(data, {echo: {tt: 't2'}})
		done()
	})
})

QUnit.test('send()', assert => {
	let done = assert.async()
	let server = new Server(new MockServer(`ws://localhost:2001`))
	let client = new MockClient('ws://localhost:2001')
	client.addEventListener('message', ({data}) => {
		assert.equal(data, '{"a":1}')
		done()
	})

	server.send({a: 1})
})


QUnit.test('on', assert => {
	let done = assert.async()
	let server = new Server(new MockServer(`ws://localhost:2002`))
	let client = new MockClient('ws://localhost:2002')
	server.on(data => {
		assert.deepEqual(data, {tt: 1})
		done()
	})

	client.send(JSON.stringify({tt: 1}))
})

QUnit.test('request and send', assert => {
	let done = assert.async()
	let server = new Server(new MockServer(`ws://localhost:2003`))
	let client = new MockClient('ws://localhost:2003')

	server.on((data) => {
		assert.deepEqual(data, {value: 55})
		done()
	})

	client.addEventListener('message', ({data}) => {
		data = JSON.parse(data)
		data.value += 1
		client.send(JSON.stringify(data))
	})

	server.request({value: 12}).then(data => {
		assert.deepEqual(data, {value: 13})
		client.send(JSON.stringify({value: 55}))
	})
})