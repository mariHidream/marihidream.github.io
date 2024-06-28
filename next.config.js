const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  output: "export",
  pageExtensions: ['jsx', 'js', 'ts', 'tsx'], // 페이지 파일의 확장자 설정
  webpack(config, options) {
    config.resolve.modules.push(__dirname); // 절대 경로 설정을 위해 현재 디렉토리를 추가합니다.
    return config;
  },
  eslint: {
    // ESLint 설정을 추가합니다.
    dirs: ['src/pages'], // src/pages 디렉토리에서 ESLint 검사를 수행하도록 설정합니다.
  },
  trailingSlash: true,
  reactStrictMode: true,
  basePath: isProd ? 'https://marihidream.github.io' : ''
};