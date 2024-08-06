import { useState } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search } from 'lucide-react';

export default function Layout({ children }) {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            AITube
          </Link>
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/create" className="text-gray-600 hover:text-primary">
              Create
            </Link>
            {session ? (
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={session.user.image} alt={session.user.name} />
                  <AvatarFallback>{session.user.name[0]}</AvatarFallback>
                </Avatar>
                <Button onClick={() => signOut()} variant="outline">Sign out</Button>
              </div>
            ) : (
              <Button onClick={() => signIn('google')}>Sign in</Button>
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