const {defaults} = require('jest-config');
module.exports = {
	moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
	verbose: true,
	setupFiles: [ "<rootDir>/enzyme.setup.js" ]
}