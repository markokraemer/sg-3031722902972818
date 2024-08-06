import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Layout({ children }) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" passHref>
            <span className="text-2xl font-bold text-primary cursor-pointer">AITube</span>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link href="/create" passHref>
              <span className="text-gray-600 hover:text-primary cursor-pointer">Create</span>
            </Link>
            {session ? (
              <button onClick={() => signOut()} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Sign out</button>
            ) : (
              <button onClick={() => signIn('google')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Sign in</button>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-gray-600">
          © 2023 AITube. All rights reserved.
        </div>
      </footer>
    </div>
  );
}