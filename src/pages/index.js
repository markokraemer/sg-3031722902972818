import React, { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    console.log('Home component mounted');
    return () => console.log('Home component unmounted');
  }, []);

  console.log('Rendering Home component');

  return (
    <div>
      <h1>Welcome to AITube</h1>
      <p>This is a simple test page.</p>
    </div>
  );
}