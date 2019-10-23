const copy = require('rollup-plugin-copy');

export default {
    input: 'start.mjs',
    plugins: [
        copy({
            targets: [
                { src: [
                    'node_modules/wpe-lightning-spark/dist/lightning-spark.js',
                    'node_modules/wpe-lightning-spark/dist/lightning-spark.mjs'],
                  dest: './src'
                }
            ],
            hook: 'buildStart'
        })
    ],
    output: {
        file: './lightning-demo-spark.js',
        format: 'cjs',
        name: 'lng'
    }
};