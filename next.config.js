/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        SECRETPUBLIC: "pk_live_YTlxMaoTCgg3QeeyjLE5ePHvpRSYd2QUmk8KQArUmVPPDZ03cwRUrHdJr",
        SECRETKEY: "sk_live_AwrTzw38E2uHtDOAUVhu9MaDlItZdQ9N0x6D8XMQZL4FrwbI1SUWCLIdF"
    },
    webpack: (config, { isServer }) => {
        config.module.rules.push({
            test: /\.mp3$/,
            use: {
                loader: 'file-loader',
                options: {
                    publicPath: '/_next/static/sounds/',
                    outputPath: 'static/sounds/',
                    name: '[name].[ext]',
                    esModule: false,
                },
            }, 
        });

        // Retorna la configuración modificada
        return config;
    },
}

module.exports = nextConfig;
