import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from "@/components/ui/toaster";
import Layout from '@/components/Layout';
import { ErrorBoundary } from 'react-error-boundary';
import { useState, useEffect } from 'react';

function ErrorFallback({ error }) {
  console.error('Uncaught error:', error);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Oops! Something went wrong.</h1>
      <p className="text-xl mb-8">{error.message}</p>
      <button onClick={() => window.location.reload()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Reload page
      </button>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
}

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [serverStatus, setServerStatus] = useState(null);

  useEffect(() => {
    async function checkServerStatus() {
      try {
        const startTime = Date.now();
        const res = await fetch('/api/health');
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        if (res.ok) {
          const data = await res.json();
          console.log('Server health check:', data);
          setServerStatus({ ...data, responseTime });
        } else {
          throw new Error(`Server responded with status: ${res.status}`);
        }
      } catch (error) {
        console.error('Error checking server status:', error);
        setServerStatus({ status: 'Error', message: error.message });
      } finally {
        setIsLoading(false);
      }
    }

    checkServerStatus();
  }, []);

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (serverStatus?.status !== 'OK') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-4">Server Error</h1>
        <p className="text-xl mb-8">Unable to connect to the server. Please try again later.</p>
        <p>Status: {JSON.stringify(serverStatus)}</p>
      </div>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <SessionProvider session={session}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Layout>
            <Component {...pageProps} />
            <Toaster />
          </Layout>
        </ThemeProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
}