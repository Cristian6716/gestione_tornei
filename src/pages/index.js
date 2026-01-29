import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/pubblico');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <i className="fas fa-spinner fa-spin text-4xl text-blue-400 mb-4"></i>
        <p className="text-gray-400">Caricamento...</p>
      </div>
    </div>
  );
}
