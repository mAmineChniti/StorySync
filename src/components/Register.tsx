'use client';

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from './authSchemas';
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

interface RegisterResponse {
	message: string;
	user: User;
	tokens: Tokens;
}

const AUTH_API_URL = "https://gordian.onrender.com";

export default function Register() {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const form = useForm({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
	});

	const registerMutation = useMutation<RegisterResponse, unknown, z.infer<typeof registerSchema>>({
		mutationFn: async (data: z.infer<typeof registerSchema>) => {
			const response = await fetch(`${AUTH_API_URL}/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error('Registration failed');
			}

			return response.json() as Promise<RegisterResponse>;
		},
		onSuccess: async (userData) => {
			try {
				await setCookie('user', JSON.stringify(userData.user));
				await setCookie('tokens', JSON.stringify(userData.tokens));
				setErrorMessage(null);
			} catch (error) {
				console.error('Error setting cookies:', error);
				setErrorMessage('Error setting cookies');
			}
		},
		onError: (error: unknown) => {
			const typedError = error instanceof Error ? error : new Error('An unknown error occurred');
			setErrorMessage(typedError.message);
		},
	});

	const onSubmit = (data: z.infer<typeof registerSchema>) => {
		registerMutation.mutate(data);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<FormField name="name" control={form.control} render={({ field }) => (
					<FormItem>
						<FormLabel>Name</FormLabel>
						<FormControl>
							<Input placeholder="Your Name" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)} />
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
				<FormField name="confirmPassword" control={form.control} render={({ field }) => (
					<FormItem>
						<FormLabel>Confirm Password</FormLabel>
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
				<Button type="submit" className="w-full mt-4" disabled={registerMutation.isPending}>
					{registerMutation.isPending ? 'Registering...' : 'Register'}
				</Button>
			</form>
		</Form>
	);
}
