const Server = require('../lib/server')
const MockServer = require('mock-socket/dist/main').Server
const MockClient = require('mock-socket/dist/main').WebSocket;

QUnit.module('RPCWebSocketServer')


QUnit.test('server request and callback', assert => {
	let done = assert.async()
	let server = new Server(new MockServer(`ws://localhost:2000`))
	let client = new MockClient('ws://localhost:2000')
	client.addEventListener('message', ({data}) => {
		client.send(`echo: ${data}`)
	})

	server.send('t1').then((data) => {
		assert.equal(data, 'echo: t1')
		return server.send({tt: 'tt'})
	}).then(data => {
		assert.equal(data, 'echo: {"tt":"tt"}')
		done()
	})
})


QUnit.test('server response', assert => {
	let done = assert.async()
	let server = new Server(new MockServer(`ws://localhost:2001`))
	let client = new MockClient('ws://localhost:2001')
	server.on((data) => {
		assert.equal(data, 'tt')
		done()
	})

	client.send('tt')
})

QUnit.test('server request and response', assert => {
	let done = assert.async()
	let server = new Server(new MockServer(`ws://localhost:2002`))
	let client = new MockClient('ws://localhost:2002')

	server.on((data) => {
		assert.equal(data, 't2')
		done()
	})

	client.addEventListener('message', ({data}) => {
		client.send(`echo: ${data}`)
	})

	server.send('t1').then(data => {
		assert.equal(data, 'echo: t1')

		client.send('t2')
	})
})