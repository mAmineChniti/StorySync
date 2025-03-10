'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { LoginResponse } from '@/types/authInterfaces';
import { loginSchema } from '@/types/authSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type * as z from 'zod';
const AUTH_API_URL = 'https://gordian.onrender.com/api/v1';

export default function Login() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });
  const router = useRouter();
  const loginMutation = useMutation<
    LoginResponse,
    unknown,
    z.infer<typeof loginSchema>
  >({
    mutationFn: async (data: z.infer<typeof loginSchema>) => {
      const response = await fetch(`${AUTH_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: data.identifier,
          password: data.password,
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      return response.json() as Promise<LoginResponse>;
    },

    onSuccess: async (userData) => {
      try {
        await setCookie('user', JSON.stringify(userData.user));
        await setCookie('tokens', JSON.stringify(userData.tokens));
        setErrorMessage(null);
        router.push('/home');
      } catch (error) {
        console.error('Error setting cookies:', error);
        setErrorMessage('Failed to set cookies');
      }
    },

    onError: (error: unknown) => {
      const typedError =
        error instanceof Error ? error : new Error('An unknown error occurred');
      setErrorMessage(typedError.message);
      form.reset();
    },
  });

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="identifier"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mt-2">Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mt-2">Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {errorMessage && (
          <Label className="text-red-500" htmlFor="error">
            {errorMessage}
          </Label>
        )}
        <Button
          type="submit"
          className="w-full mt-4"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </Form>
  );
}
