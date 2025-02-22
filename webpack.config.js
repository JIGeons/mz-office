const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");

const outputDirectory = "dist";

module.exports = {
    entry: ["core-js/stable", "regenerator-runtime/runtime", "./src/index.js"],
    output: {
        globalObject: `typeof self !== 'undefined' ? self : this`,
        path: path.resolve(__dirname, outputDirectory),
        filename: "bundle.js",
    },
    module: {
        rules: [
            {
                test:/\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                        plugins: ["@babel/plugin-syntax-dynamic-import"],
                    },
                },
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/i,  // ✅ 폰트 및 SVG만 url-loader 사용
                use: {
                    loader: "url-loader",
                    options: {
                        limit: 100000,  // 100KB 이하의 파일은 Base64 변환
                        name: "assets/fonts/[name].[hash].[ext]",  // 파일명 지정
                    },
                },
            },
            {
                test: /\.(png|jpe?g|gif)$/i,  // 이미지 파일은 asset/resource 사용
                type: "asset/resource",
                generator: {
                    filename: "assets/images/[name].[hash].[ext]",  // 파일 저장 경로 지정
                },
            },
        ],
    },
    resolve: {
        extensions: ["*", ".js", ".jsx", ".json"],
    },
    devServer: {
        allowedHosts: "all",
        historyApiFallback: {
            disableDotRule: true,   // '.' 포함된 경로 요청 시 오류 방지
        },
        host: "0.0.0.0",
        port: 80,
        open: true,
        proxy: [
            {
                context: ["/api"],  // 프록시할 엔드포인트 경로
                target: "http://localhost:8080",    // 백엔드 서버 주소
                changeOrigin: true, // Cross-Origin 허용
                secure: false,  // HTTPS 인증서 무시
            },
        ],
        static: {
            watch: {
                ignored: /node_modules/, // node_modules 변경 감지 방지 (성능 개선)
            },
        },
        client: {
            overlay: true, // 브라우저에서 오류 메시지 표시
        },
    },
    plugins: [
        new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: [outputDirectory] }),
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            favicon: "./public/favicon.ico",
        }),
        new CopyWebpackPlugin({
           patterns: [
               { from: "public/404.html", to: "404.html" },
           ]
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
        }),
        new Dotenv(),   // dotenv-webpack 추가
    ],
};