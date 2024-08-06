import '@/styles/globals.css';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    console.log('MyApp mounted');
    return () => console.log('MyApp unmounted');
  }, []);

  console.log('MyApp is rendering');

  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;