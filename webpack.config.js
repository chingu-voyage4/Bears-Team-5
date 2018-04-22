const path = require('path');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');


module.exports = {
  entry: "./src/app.jsx",
  output: {
    path: path.join(__dirname, "public"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        loader: "babel-loader",
        test: /\.jsx?$/,
        exclude: /node_modules/
      },
      {
        test: /\.s?css$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    historyApiFallback: true,

  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.json', '.jsx'],
  },
  plugins: [
    new Dotenv(),
    new webpack.DefinePlugin({
      "process.env.DB_HOST": JSON.stringify(
        process.env.DB_HOST
      ),
      "process.env.DB_USER": JSON.stringify(
        process.env.DB_USER
      ),
      "process.env.DB_PASSWORD": JSON.stringify(
        process.env.DB_PASSWORD
      ),
      "process.env.DB_NAME": JSON.stringify(
        process.env.DB_NAME
      ),
      "process.env.DB_URL": JSON.stringify(
        process.env.DB_URL
      )
    })
  ]
};
