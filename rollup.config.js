import babel from 'rollup-plugin-babel';

export default {
  entry: 'index.js',
  plugins: [babel({
    "presets": [
      [
        "es2015",
        {
          "modules": false
        }
      ]
    ],
    "plugins": [
      "external-helpers"
    ]
  })],
  format: 'umd',
  moduleName: 'jFactory',
  dest: 'dist/jFactory.js'
};
