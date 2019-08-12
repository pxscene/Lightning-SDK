const resolve = require('rollup-plugin-node-resolve');
const execute = require('rollup-plugin-execute');

export default {
    input: 'start.mjs',
    plugins: [resolve({
        only: [ 'wpe-lightning-spark', 'wpe-lightning' ]
    }), execute("mkdir lib; cp node_modules/wpe-lightning-spark/dist/lightning-spark.mjs lib/.")],
    output: {
        file: './lightning-demo-spark.js',
        format: 'cjs',
        name: 'lng'
    }
};
