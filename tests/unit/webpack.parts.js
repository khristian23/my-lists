const vueLoaderConfig = require('../../build/vue-loader.conf')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

exports.devServer = ({ host, port } = {}) => ({
    devServer: {
      inline: false,
      stats: "errors-only",
      host, // Defaults to `localhost`
      port, // Defaults to 8080
      open: true,
      overlay: true,
    },
  });

const HtmlWebpackPlugin = require("html-webpack-plugin");

exports.page = ({
  path = "",
  template = require.resolve(
    "html-webpack-plugin/default_index.ejs"
  ),
  title,
} = {}) => ({
  plugins: [
    new HtmlWebpackPlugin({
      filename: `${path && path + "/"}index.html`,
      template,
      title,
    }),
  ],
});

exports.output = () => ({
    output: {
      path: __dirname,
      filename: 'test.build.js',
    }
}); 

exports.resolve = () => ({
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('../src')
        }
    },
});

exports.module = () => ({
  module: {
    rules: [
        {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: vueLoaderConfig
        },{
            test: /\.css$/i,
            use: ['vue-style-loader', MiniCssExtractPlugin.loader, 'css-loader']
        }
    ]
  }
})

exports.plugins = () => ({
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
        filename: "[name].css"
    })
  ]
})
