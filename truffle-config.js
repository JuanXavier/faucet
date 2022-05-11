const HDWalletProvider = require('@truffle/hdwallet-provider')
require('dotenv').config()

module.exports = {
	contracts_build_directory: './src/build', // Changes contract directory

	networks: {
		development: {
			host: '127.0.0.1', // Localhost (default: none)
			port: 7545, // Standard Ethereum port (default: none)
			network_id: '*', // Any network (default: none)
		},

		rinkeby: {
			provider: () => new HDWalletProvider(KEY, INFURA_ENDPOINT),
			network_id: 4, // Rinkeby's id
			gas: 5500000, // Rinkeby has a lower block limit than mainnet
			confirmations: 1, // # of confs to wait between deployments. (default: 0)
			timeoutBlocks: 100, // # of blocks before a deployment times out  (minimum/default: 50)
			skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
		},
	},

	compilers: {
		solc: {
			version: '^0.8.0', // Fetch exact version from solc-bin (default: truffle's version)
		},
	},
}
