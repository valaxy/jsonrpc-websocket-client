define(function (require) {
	var Communicate = require('dest/communicate')
	require('mock-socket')

	QUnit.module('Communicate')

	QUnit.test('xx', function (assert) {
		var server = new MockServer('ws://localhost:8080')
		server.on('connection', function () {
			console.log(arguments)
		})

		window.WebSocket = MockSocket
		var c = new Communicate('ws://localhost:8080')

		assert.ok(true)
	})
})