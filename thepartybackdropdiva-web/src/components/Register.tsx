import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/AuthService';

export const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await registerUser(formData);
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
            <div className="absolute inset-0 bg-[url('/images/lux-bg.png')] opacity-10 bg-cover bg-center pointer-events-none"></div>
            
            <div className="relative w-full max-w-lg bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-10 rounded-3xl shadow-2xl">
                <div className="text-center mb-8">
                    <Link to="/" className="text-xl font-light tracking-widest uppercase mb-4 block">
                        The Party Backdrop <span className="font-semibold text-gold-500">Diva</span>
                    </Link>
                    <h2 className="text-3xl font-light text-white">Join the Circle</h2>
                    <p className="text-gray-500 mt-2">Become a member and track your events</p>
                </div>

                {success ? (
                    <div className="text-center py-12">
                        <div className="text-5xl mb-6 animate-bounce">✨</div>
                        <h3 className="text-2xl font-light text-white mb-2">Registration Successful!</h3>
                        <p className="text-gray-500">Redirecting you to login...</p>
                    </div>
                ) : (
                    <>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-sm mb-6 text-center animate-shake">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 ml-1">First Name</label>
                                    <input 
                                        type="text" 
                                        name="firstName"
                                        required
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full bg-gray-950 border border-gray-800 text-white px-5 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all placeholder:text-gray-700"
                                        placeholder="Jane"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 ml-1">Last Name</label>
                                    <input 
                                        type="text" 
                                        name="lastName"
                                        required
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full bg-gray-950 border border-gray-800 text-white px-5 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all placeholder:text-gray-700"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 ml-1">Email Address</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-gray-950 border border-gray-800 text-white px-5 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all placeholder:text-gray-700"
                                    placeholder="jane@example.com"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 ml-1">Password</label>
                                <input 
                                    type="password" 
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-gray-950 border border-gray-800 text-white px-5 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all placeholder:text-gray-700"
                                    placeholder="••••••••"
                                />
                                <p className="text-[10px] text-gray-600 mt-2 px-1 text-center italic">Requires at least 8 characters, one number, and one special character.</p>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full mt-4 bg-gold-500 hover:bg-gold-600 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-gold-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                            >
                                {loading ? 'CREATING ACCOUNT...' : 'REGISTER'}
                            </button>
                            
                            <div className="text-center pt-2">
                                <p className="text-gray-500 text-sm">
                                    Already have an account? {' '}
                                    <Link to="/login" className="text-gold-500 hover:text-gold-400 font-medium transition-colors">Login</Link>
                                </p>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};
