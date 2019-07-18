const resolve = require('rollup-plugin-node-resolve');

export default {
    input: 'start.mjs',
    plugins: [resolve({
        only: [ 'wpe-lightning' , 'wpe-lightning-spark']
    })],
    output: {
        file: './lightning-demo-spark.js',
        format: 'cjs',
        name: 'lng'
    }
};