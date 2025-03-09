'use client';

import { useState, useEffect } from 'react';
import Login from '@/components/Login';
import Register from '@/components/Register';

interface AuthPageProps {
	isLogin: boolean;
}

export default function AuthPage({ isLogin }: AuthPageProps) {
	const [isLoginState, setIsLoginState] = useState(isLogin);

	useEffect(() => {
		setIsLoginState(isLogin);
	}, [isLogin]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="bg-white p-8 rounded shadow-md w-full max-w-md">
				<h2 className="text-2xl font-bold mb-6">{isLoginState ? 'Login' : 'Register'}</h2>
				{isLoginState ? (
					<Login />
				) : (
					<Register />
				)}
				<p className="mt-4 text-center">
					{isLoginState ? (
						<>
							Don&apos;t have an account?{' '}
							<button
								onClick={() => setIsLoginState(false)}
								className="text-blue-500 hover:underline"
							>
								Register
							</button>
						</>
					) : (
						<>
							Already have an account?{' '}
							<button
								onClick={() => setIsLoginState(true)}
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
};
