module.exports = (config) => {
	return {
		...config,
		externals: [],
		target: "web",
		plugins: [
			...config.plugins,
		],
		devtool: false,
		optimization: { minimize: true },
		output: {
			...config.output,
			filename: 'renderend.[contenthash].js',
			libraryTarget: 'umd',
		},
	}
}