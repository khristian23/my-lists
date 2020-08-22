const path = require("path");
const merge = require("webpack-merge");
const parts = require("./webpack.parts");

module.exports = merge([
  parts.devServer(),
  parts.page({
    title: "Mocha Vue Testing",
    entry: {
      tests: path.join(__dirname, "test"),
    },
  }),
  { entry: './test/index.js' },
  parts.resolve(),
  parts.output(),
  parts.module()
]);