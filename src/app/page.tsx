import Landing from '@/components/Landing';
import NavBar from '@/components/NavBar';

export default function HomePage() {
  return (
    <>
      <NavBar />
      <main className="flex flex-col min-h-screen w-full items-center justify-center">
        <Landing />
      </main>
    </>
  );
}
