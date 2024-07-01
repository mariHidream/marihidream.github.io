import '../styles/global.css';  // CSS 모듈이 아닌 일반 CSS 파일 가져오기
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;