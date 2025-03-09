'use client';

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from './authSchemas';
import { useMutation } from '@tanstack/react-query';
import { setCookie } from 'cookies-next';
import { useState } from 'react';
import type * as z from 'zod';

interface User {
	id: string;
	username: string;
	email: string;
	first_name: string;
	last_name: string;
	date_joined: string;
}

interface Tokens {
	access_token: string;
	access_created_at: string;
	access_expires_at: string;
	refresh_token: string;
	refresh_created_at: string;
	refresh_expires_at: string;
}

interface LoginResponse {
	message: string;
	user: User;
	tokens: Tokens;
}

export default function Login() {
	const AUTH_API_URL = "https://gordian.onrender.com";
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const form = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const loginMutation = useMutation<LoginResponse, unknown, z.infer<typeof loginSchema>>({
		mutationFn: async (data: z.infer<typeof loginSchema>) => {
			const response = await fetch(`${AUTH_API_URL}/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
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
			} catch (error) {
				console.error('Error setting cookies:', error);
				setErrorMessage('Failed to set cookies');
			}
		},

		onError: (error: unknown) => {
			const typedError = error instanceof Error ? error : new Error('An unknown error occurred');
			setErrorMessage(typedError.message);
		},
	});

	const onSubmit = (data: z.infer<typeof loginSchema>) => {
		loginMutation.mutate(data);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<FormField name="email" control={form.control} render={({ field }) => (
					<FormItem>
						<FormLabel>Email</FormLabel>
						<FormControl>
							<Input placeholder="you@example.com" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)} />
				<FormField name="password" control={form.control} render={({ field }) => (
					<FormItem>
						<FormLabel>Password</FormLabel>
						<FormControl>
							<Input type="password" placeholder="••••••" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)} />
				{errorMessage && (
					<div className="text-red-500 mt-2">
						<p>{errorMessage}</p>
					</div>
				)}
				<Button type="submit" className="w-full mt-4" disabled={loginMutation.isPending}>
					{loginMutation.isPending ? 'Logging in...' : 'Login'}
				</Button>
			</form>
		</Form>
	);
}
