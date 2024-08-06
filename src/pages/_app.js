import '@/styles/globals.css';

function MyApp({ Component, pageProps }) {
  console.log('MyApp is rendering');
  return <Component {...pageProps} />;
}

export default MyApp;