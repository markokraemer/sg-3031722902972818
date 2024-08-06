import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function Layout({ children }) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            AITube
          </Link>
          <nav className="flex items-center space-x-4">
            <Link href="/create" className="text-gray-600 hover:text-primary">
              Create
            </Link>
            {session ? (
              <>
                <Link href={`/profile/${session.user.id}`} className="text-gray-600 hover:text-primary">
                  Profile
                </Link>
                <Button onClick={() => signOut()} variant="outline">Sign out</Button>
              </>
            ) : (
              <Link href="/signin">
                <Button>Sign in</Button>
              </Link>
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