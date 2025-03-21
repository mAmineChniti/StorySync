"use client";

import Login from "@/components/Login";
import Register from "@/components/Register";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthPage({ isLogin }: { isLogin: boolean }) {
  const [isLoginState, setIsLoginState] = useState(isLogin);
  const router = useRouter();

  useEffect(() => {
    setIsLoginState(isLogin);
  }, [isLogin]);

  const handleSwitchToRegister = () => {
    setIsLoginState(false);
    router.push("/register");
  };

  const handleSwitchToLogin = () => {
    setIsLoginState(true);
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] w-full">
      <div className="flex justify-center items-center h-full w-full">
        <Card className="w-full max-w-md p-6 shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {isLoginState ? "Login" : "Register"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoginState ? <Login /> : <Register />}
            <p className="mt-4 text-center">
              {isLoginState ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={handleSwitchToRegister}
                    className="text-blue-500 hover:underline cursor-pointer"
                  >
                    Register
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={handleSwitchToLogin}
                    className="text-blue-500 hover:underline cursor-pointer"
                  >
                    Login
                  </button>
                </>
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
