const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'development', // Change to 'production' for production builds
    entry: './src/index.js', // Entry point of the application
    output: {
        filename: 'bundle.js', // Output bundle file name
        path: path.resolve(__dirname, 'dist'), // Output directory
        publicPath: '/', // Public URL of the output directory when referenced in a browser
    },
    resolve: {
        extensions: ['.js', '.jsx'], // Resolve these extensions
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/, // Transpile JavaScript and JSX files
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
            {
                test: /\.css$/, // Handle CSS files
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                ],
            },
            {
                test: /\.(png|jpg|gif|svg)$/, // Handle image files
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                            outputPath: 'images/',
                        },
                    },
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/, // Handle font files
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                            outputPath: 'fonts/',
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(), // Clean the output directory before each build
        new HtmlWebpackPlugin({
            template: './public/index.html', // Template for the HTML file
            filename: 'index.html', // Output HTML file name
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css', // Output CSS file name
            chunkFilename: '[id].css', // Output CSS file name for chunks
        }),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'), // Serve content from the dist directory
        compress: true, // Enable gzip compression
        port: 3000, // Port for the dev server
        historyApiFallback: true, // Enable support for HTML5 History API
    },
    optimization: {
        splitChunks: {
            chunks: 'all', // Split chunks for better caching
        },
    },
};
