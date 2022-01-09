const Dotenv = require('dotenv-webpack');
const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    "layout-builder": './src-js/index.ts'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    // Add '.ts' and '.js' as resolvable extensions.
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      // All files with a '.ts' extension will be handled by 'ts-loader'.
      {
        test: /\.ts?$/,
        loader: "ts-loader"
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ]
      },
      {
        test: /\.handlebars$/,
        loader: "handlebars-loader",
        options: {
          helperDirs: path.resolve(__dirname, "./src-js/lib/hb-helpers")
        }
      }
    ]
  },
  plugins: [
    new Dotenv(),
    new webpack.BannerPlugin({
      banner: "-----------------------------------------------------------------------------------" +
        "\nTHIS FILE IS A COMPILED VERSION. IF YOU WANT TO EDIT AND COMPILE SOURCE GO TO src-js DIR.\n" +
        "-----------------------------------------------------------------------------------"
    }),
    new CopyPlugin({
      patterns: [
        {
          from: `${path.join(__dirname, './src-js')}/assets`,
          to: 'assets',
          globOptions: {
            ignore: ["**/*.ts"],
          }
        }
      ]
    })
  ]
}
