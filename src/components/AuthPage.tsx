'use client';

import Login from '@/components/Login';
import Register from '@/components/Register';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface AuthPageProps {
  isLogin: boolean;
}

export default function AuthPage({ isLogin }: AuthPageProps) {
  const [isLoginState, setIsLoginState] = useState(isLogin);
  const router = useRouter();

  useEffect(() => {
    setIsLoginState(isLogin);
  }, [isLogin]);

  const handleSwitchToRegister = () => {
    setIsLoginState(false);
    router.push('/register');
  };

  const handleSwitchToLogin = () => {
    setIsLoginState(true);
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">
          {isLoginState ? 'Login' : 'Register'}
        </h2>
        {isLoginState ? <Login /> : <Register />}
        <p className="mt-4 text-center">
          {isLoginState ? (
            <>
              Don&apos;t have an account?{' '}
              <button
                onClick={handleSwitchToRegister}
                className="text-blue-500 hover:underline"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={handleSwitchToLogin}
                className="text-blue-500 hover:underline"
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
