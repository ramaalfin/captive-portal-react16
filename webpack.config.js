const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
require("dotenv").config(); // <--- load .env

module.exports = {
  entry: ["core-js/stable", "regenerator-runtime/runtime", "./src/index.js"],

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.[hash].js",
    publicPath: "/",
  },

  mode: "development",

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "assets/",
            },
          },
        ],
      },
    ],
  },

  resolve: {
    extensions: [".js", ".jsx"],
  },

  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 3000,
    historyApiFallback: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "index.html",
    }),
    new webpack.DefinePlugin({
      "process.env.REACT_APP_URL_MASTER_DATA": JSON.stringify(process.env.REACT_APP_URL_MASTER_DATA),
      "process.env.REACT_APP_API_KEY": JSON.stringify(process.env.REACT_APP_API_KEY),
      "process.env.REACT_MINIO_BANNERS": JSON.stringify(process.env.REACT_MINIO_BANNERS),
      "process.env.REACT_MINIO_VIDEOS": JSON.stringify(process.env.REACT_MINIO_VIDEOS),
      "process.env.REACT_MINIO_THUMBNAILS": JSON.stringify(process.env.REACT_MINIO_THUMBNAILS),
    }),
  ],
};
