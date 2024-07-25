module.exports = function override(config, env) {
    config.module.rules.push({
      test: /\.csv$/,
      loader: 'raw-loader',
    })
    return config
  }