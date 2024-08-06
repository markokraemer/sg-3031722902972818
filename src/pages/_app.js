import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from "@/components/ui/toaster";
import Layout from '@/components/Layout';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useState, useEffect } from 'react';

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
}

export default function App({ Component, pageProps }) {
  const [isLoading, setIsLoading] = useState(true);
  const [serverStatus, setServerStatus] = useState(null);

  useEffect(() => {
    async function checkServerStatus() {
      try {
        const startTime = Date.now();
        const res = await fetch('/api/status');
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        if (res.ok) {
          const data = await res.json();
          console.log('Server status check:', data);
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

  if (serverStatus?.database !== 'Connected' || serverStatus?.stripe !== 'Connected') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-4">Service Unavailable</h1>
        <p className="text-xl mb-8">We're experiencing some technical difficulties. Please try again later.</p>
        <pre className="bg-white p-4 rounded shadow">{JSON.stringify(serverStatus, null, 2)}</pre>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <SessionProvider session={pageProps.session}>
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