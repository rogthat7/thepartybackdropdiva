import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/AuthService';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const data = await loginUser(email, password);
            login(data.token, data.user);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 dark">
            <div className="absolute inset-0 bg-[url('/images/lux-bg.png')] opacity-10 bg-cover bg-center pointer-events-none"></div>
            
            <div className="relative w-full max-w-md bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-10 rounded-3xl shadow-2xl">
                {/* Close Button */}
                <button 
                    onClick={() => navigate('/')}
                    className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
                    aria-label="Close"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="text-center mb-10">
                    <Link to="/" className="text-xl font-light tracking-widest uppercase mb-4 block">
                        <span className="tubelight-text">The Party Backdrop</span> <span className="font-semibold text-gold-500">Diva</span>
                    </Link>
                    <h2 className="text-3xl font-light text-white">Welcome Back</h2>
                    <p className="text-gray-500 mt-2">Sign in to manage your luxury events</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-sm mb-6 text-center animate-shake">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 ml-1">Email Address</label>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-950 border border-gray-800 text-white px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all placeholder:text-gray-700"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 ml-1">Password</label>
                        <input 
                            type="password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-950 border border-gray-800 text-white px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all placeholder:text-gray-700"
                            placeholder="••••••••"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-gold-500 hover:bg-gold-600 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-gold-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {loading ? 'AUTHENTICATING...' : 'SIGN IN'}
                    </button>
                    
                    <div className="text-center pt-4">
                        <p className="text-gray-500 text-sm">
                            Don't have an account? {' '}
                            <Link to="/register" className="text-gold-500 hover:text-gold-400 font-medium transition-colors">Create one</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};
