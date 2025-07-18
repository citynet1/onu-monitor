'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (username === 'jhonone' && password === '102017') {
            sessionStorage.setItem('loggedIn', 'true');
            router.push('/'); // Ganti ke path OnuPage-mu
        } else {
            alert('Username atau password salah');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-800 px-4">
            <form
                onSubmit={handleLogin}
                className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-full max-w-sm"
            >
                <h1 className="text-2xl font-bold mb-4 text-center text-white">Login</h1>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-white mb-1">Username</label>
                    <input
                        type="text"
                        className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
			placeholder="Username"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-white mb-1">Password</label>
                    <input
                        type="password"
                        className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
			placeholder="Password"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                >
                    Login
                </button>
            </form>
        </div>
    );
}