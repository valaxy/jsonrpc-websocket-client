requirejs.config({
	baseUrl: '../',
	paths  : {
		'amd-loader' : 'node_modules/amd-loader/amd-loader',
		'cjs'        : 'node_modules/cjs/cjs',
		'mock-socket': 'node_modules/mock-socket/'
	},
	cjs    : {
		cjsPaths: [
			'mock-socket'
		]
	}
})