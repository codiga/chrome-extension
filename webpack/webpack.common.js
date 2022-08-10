const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const rootDir = path.join(__dirname, "..");

module.exports = {
  entry: {
    popup: path.join(rootDir, "src/pages/popup.tsx"),
    background: path.join(rootDir, "src/lib/background.ts"),
    content_script_stackoverflow: path.join(
      rootDir,
      "src/pages/stackoverflow/contentScript.tsx",
    ),
    content_script_all: path.join(rootDir, "src/pages/contentScriptAll.tsx"),
    content_script_replit: path.join(
      rootDir,
      "src/pages/replit/contentScript.tsx",
    ),
    styles: path.join(rootDir, "styles/app.scss"),
    web_styles: path.join(rootDir, "styles/webapp.scss"),
  },
  output: {
    publicPath: "",
    path: path.join(rootDir, "dist/js"),
    filename: "[name].js",
  },
  optimization: {
    minimize: true,
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
      {
        test: /\.css$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".scss", ".css"],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: ".", to: "../", context: "public" }],
      options: {},
    }),
  ],
};
