/** 当前执行的指令 */
const HU_RUNNING_COMMAND = process.env.HU_RUNNING_COMMAND;

module.exports = {
  mode: HU_RUNNING_COMMAND === 'build',
  format: 'esm',

  browserslist: [
    'last 2 Chrome versions'
  ],

  replace: {
    'process.env.NODE_ENV': JSON.stringify(HU_RUNNING_COMMAND === 'build' ? 'production' : 'development')
  },
  bundleReplace: {
    'process.env.html': ''
  }
};
