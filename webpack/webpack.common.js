const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = path.join(__dirname, "..", "src");

module.exports = {
    entry: {
      popup: path.join(srcDir, 'popup.tsx'),
      options: path.join(srcDir, 'options.tsx'),
      background: path.join(srcDir, 'background.ts'),
      content_script_github: path.join(srcDir, 'github/content_script.ts'),
      content_script_jupyter: path.join(srcDir, 'jupyter/content_script.ts'),
      content_script_all: path.join(srcDir, 'allPages/content_script.ts'),
      styles: path.join(__dirname, '../styles/app.scss')
    },
    output: {
        path: path.join(__dirname, "../dist/js"),
        filename: "[name].js",
    },
    optimization: {
        minimize: true
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                  // Creates `style` nodes from JS strings
                  "style-loader",
                  // Translates CSS into CommonJS
                  "css-loader",
                  // Compiles Sass to CSS
                  "sass-loader",
                ],
            },
        ]
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".scss"],
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: ".", to: "../", context: "public" }],
            options: {},
        }),
    ],
};
