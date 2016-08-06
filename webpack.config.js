const webpack = require("webpack");

module.exports = {
  cache: true,
  entry: "./virtual/main.js",
  output: {
    path: __dirname,
    filename: "./virtual/build/bundle.js"
  },
  module: {
  }
};