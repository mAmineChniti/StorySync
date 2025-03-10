import AuthPage from '@/components/AuthPage';
import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';

export default function LoginPage() {
  return (
    <>
      <NavBar />
      <main className="flex flex-col min-h-screen w-full items-center justify-center">
        <div className="flex justify-center items-center w-full flex-grow">
          <AuthPage isLogin={true} />
        </div>
        <Footer />
      </main>
    </>
  );
}
