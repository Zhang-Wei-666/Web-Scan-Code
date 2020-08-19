/** 当前执行的指令 */
const HU_RUNNING_COMMAND = process.env.HU_RUNNING_COMMAND;
const packages = require('./package.json');

const banner = `${packages.title} v${packages.version}\n${packages.homepage}\n\n(c) 2020-present ${packages.author}\nReleased under the MIT License.`;
const pipe = [
  { output: 'index.js' }
];


if (HU_RUNNING_COMMAND === 'build') {
  // UMD Minify
  pipe.forEach((config) => {
    pipe.push(
      Object.$assign(null, config, {
        mode: true,
        output: config.output.replace(/\.js$/, '.min.js')
      })
    );
  });
  // Other
  pipe.forEach((config) => {
    // CommonJS
    config.mode || pipe.push(
      Object.$assign(null, config, {
        format: 'cjs',
        output: config.output.replace(/\.js$/, '.common.js')
      })
    );
    // ES Module
    config.mode || pipe.push(
      Object.$assign(null, config, {
        format: 'esm',
        output: config.output.replace(/\.js$/, '.esm.js')
      })
    );
    // ES Module Browser + ES Module Browser Minify
    pipe.push(
      Object.$assign(null, config, {
        format: 'esm.browser',
        output: config.mode
          ? config.output.replace(/\.min\.js$/, '.esm.browser.min.js')
          : config.output.replace(/\.js$/, '.esm.browser.js')
      })
    );
  });
}


module.exports = {
  name: 'webScanCode',
  format: 'umd',
  banner,
  browserslist: [
    'last 2 Chrome versions'
  ],
  replace: {
    'process.env.NODE_ENV': JSON.stringify(HU_RUNNING_COMMAND === 'build' ? 'production' : 'development'),
    '__VERSION__': packages.version
  },
  bundleReplace: {
    'process.env.html': ''
  },
  pipe
};
