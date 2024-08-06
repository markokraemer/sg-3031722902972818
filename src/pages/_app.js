import '@/styles/globals.css';
import { useEffect } from 'react';

function ErrorFallback({ error }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  )
}

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    console.log('MyApp mounted');
    return () => console.log('MyApp unmounted');
  }, []);

  console.log('MyApp is rendering');

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}

export default MyApp;