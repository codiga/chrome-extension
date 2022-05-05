const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = path.join(__dirname, "..", "src");

module.exports = {
    entry: {
      popup: path.join(srcDir, 'popup.tsx'),
      background: path.join(srcDir, 'background.ts'),
      content_script_stackoverflow: path.join(srcDir, 'stackoverflow/contentScript.tsx'),
      content_script_all: path.join(srcDir, 'allPages/contentScript.tsx'),
      content_script_replit: path.join(srcDir, 'replit/contentScript.tsx'),
      styles: path.join(__dirname, '../styles/app.scss'),
      web_styles: path.join(__dirname, '../styles/webapp.scss')
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
