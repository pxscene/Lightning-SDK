const resolve = require('rollup-plugin-node-resolve');

export default {
    input: 'start.mjs',
    plugins: [resolve({
        only: [ 'wpe-lightning' ]
    })],
    output: {
        file: './lightning-demo-spark.mjs',
        format: 'esm',
        name: 'lng'
    }
};
