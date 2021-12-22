const path = require("path");
const dotenv = require("dotenv-webpack");

const config = {
    entry: "./src/index.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "build"),
    },
    module: {
        rules: [
            {
                use: {
                    loader: "babel-loader",
                },
                exclude: /node_modules/,
                test: /\.(js|jsx)$/,
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(jpg|JPG|jpeg|gif|mp3|svg|ttf|woff2|woff|eot)$/gi,
                use: {
                    loader: "file-loader",
                },
            },
            {
                test: /\.png$/,
                exclude: /node_modules/,
                use: {
                    loader: "file-loader?name=images/[name].[ext]",
                },
            },
        ],
    },
    plugins: [new dotenv()],
};

module.exports = config;
