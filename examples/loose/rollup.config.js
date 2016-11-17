import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: 'index.js',
  external: [
    'jFactory',
  ],
  plugins: [
    nodeResolve({
      browser: true,
    }),
    commonjs({
      //include: 'node_modules/**',
    }),
    babel({
      "presets": [
        [
          "es2015",
          {
            "modules": false,
            "loose": true,
          }
        ],
      ],
      "plugins": [
        "external-helpers"
      ]
    }),
  ],
  format: 'umd',
  moduleName: 'test',
  dest: 'bundle.js'
};
