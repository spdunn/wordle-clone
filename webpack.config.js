const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.tsx', // Your main React file
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript']
          }
        }
      },
      {
        test: /\.css$/,  // Add this rule
        use: ['style-loader', 'css-loader'],
      },
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/util', to: 'util' }, // Copy everything from 'src/util' to 'dist'
        { from: 'src/components', to: 'components'}
      ]
    })
  ]
};