module.exports = {
	matchOnFileRelativePath: [
		'lib',
		'lib/**/*'
	],

	tasks: [{
		isEnabled              : true,
		name                   : 'es6',
		matchOnFileRelativePath: [
			/\.es6$/
		],
		program                : 'babel',
		arguments              : [
			'$filePath'
		],
		createOutputFromStdout : true,
		outputPath             : function (info) {
			return info.projectPath + '/dest/' + info.dirRelativePath.slice('lib/'.length) + info.fileNameWithoutAllExtensions + '.js'
		}
	}]
}