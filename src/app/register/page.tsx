import AuthPage from '@/components/AuthPage';
import NavBar from '@/components/NavBar';

export default function RegisterPage() {
  return (
    <>
      <NavBar />
      <AuthPage isLogin={false} />
    </>
  );
}
