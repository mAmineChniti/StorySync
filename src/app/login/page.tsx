import AuthPage from '@/components/AuthPage';
import NavBar from '@/components/NavBar';

export default function LoginPage() {
  return (
    <>
      <NavBar />
      <AuthPage isLogin={true} />
    </>
  );
}
