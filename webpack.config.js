const Dotenv = require('dotenv-webpack');
const path = require('path');


module.exports={
    mode: 'production',
    entry: './src/index.js',
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist')
    },
    devtool: 'source-map',
    plugins: [
        new Dotenv()
      ],
    devServer: {
        contentBase: './dist'
    }

}