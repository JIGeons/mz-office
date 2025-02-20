const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpack = require("webpack");

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
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                use: {
                    loader: "url-loader",   // 작은 파일(100KB 이하)은 Base64 인코딩하여 번들에 포함
                    options: {  // 100KB 이하의 파일은 Base64로 변환, 그 이상은 별도 파일로 저장
                        limit: 100000,
                    }
                }
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
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
        }),
    ],
};