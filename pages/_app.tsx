import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ToastContainer } from 'react-toastify';
import Template from 'components/template';
import AuthProvider from 'components/AuthProvider';
import ErrorBoundary from 'components/ErrorBoundary';
import theme from 'styles/theme';
import { useApollo } from 'apollo/apolloClient';
import 'styles/tailwind.css';
import 'react-toastify/dist/ReactToastify.css';

declare global {
  interface Window {
    naver: any;
    gapi: any;
    Kakao: any;
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }

    const mydoc = document.documentElement;
    mydoc.style.height = `${window.innerHeight}px`;
  }, []);

  return (
    <>
      <Template>
        <Head>
          <meta charSet="utf-8" />
          <script src="https://apis.google.com/js/platform.js" async defer></script>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <link rel="shortcut icon" href="/favicon.png" type="image/x-icon" />
          <script
            type="text/javascript"
            src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_MAP_CLIENT_ID}&submodules=geocoder`}
          ></script>
          <script src="https://developers.kakao.com/sdk/js/kakao.js" defer></script>
          <script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
        </Head>
        <ThemeProvider theme={theme}>
          <ErrorBoundary>
            <ApolloProvider client={apolloClient}>
              <CssBaseline />
              {/* <AuthProvider> */}
              <Component {...pageProps} />
              {/* </AuthProvider> */}
              <ToastContainer newestOnTop />
            </ApolloProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </Template>
    </>
  );
}

export default MyApp;
