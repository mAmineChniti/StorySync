"use client";

import Login from "@/components/Login";
import Register from "@/components/Register";
import { Button } from "@/components/ui/button";
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
    router.push("/register");
  };

  const handleSwitchToLogin = () => {
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-center p-4 w-full min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-md p-6 bg-card text-card-foreground border-border shadow-lg dark:shadow-none">
        <CardHeader className="px-0 pt-0 pb-4">
          <CardTitle className="text-2xl font-bold text-center">
            {isLoginState ? "Welcome Back" : "Create Account"}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          {isLoginState ? <Login /> : <Register />}
          <p className="mt-4 text-center text-muted-foreground text-sm">
            {isLoginState ? (
              <>
                Don&apos;t have an account?{" "}
                <Button
                  variant="link"
                  className="text-primary p-0 h-auto hover:no-underline font-normal cursor-pointer"
                  onClick={handleSwitchToRegister}
                >
                  Register here
                </Button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Button
                  variant="link"
                  className="text-primary p-0 h-auto hover:no-underline font-normal cursor-pointer"
                  onClick={handleSwitchToLogin}
                >
                  Login here
                </Button>
              </>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
