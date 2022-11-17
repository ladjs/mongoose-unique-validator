module.exports = {
  prettier: true,
  space: true,
  extends: ['xo-lass'],
  overrides: [
    {
      files: 'test/**/*.js',
      envs: ['mocha']
    }
  ]
};
