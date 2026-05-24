import logo from '../assets/logo.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowRight } from 'lucide-react';

export function LoginPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ 'username': '', 'password': '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleLogin = (e) => {
        e.preventDefault();

        const { username, password } = formData;

        if (!username.includes('@gmail.com')) {
            alert('Username must contain @gmail.com');
            return;
        }

        if (password.length < 8) {
            alert('Password length must be at least 8 characters');
            return;
        }

        setIsLoading(true);

        const savedUser = JSON.parse(localStorage.getItem('userAccount'));

        setTimeout(() => {
            if (savedUser && formData.username === savedUser.username && formData.password === savedUser.password) {
                navigate('/dashboard');
            } else {
                alert('Wrong username or password');
                setIsLoading(false);
            }
        }, 1000);
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 font-sans p-6">
            <div className="w-full max-w-[420px] bg-white rounded-2xl border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 flex flex-col gap-6">
                
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 shadow-sm">
                        {logo ? (
                            <img src={logo} alt="Logo" className="w-8 h-8 object-contain" onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                            }} />
                        ) : null}
                        <GraduationCap className="w-6 h-6 hidden" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Sign in to AcademiaEWS</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Enter your email and password to access the predictor
                        </p>
                    </div>
                </div>

                <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-700">Username or Email</label>
                        <input
                            name='username'
                            type="text"
                            required
                            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            placeholder="name@gmail.com"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-semibold text-slate-700">Password</label>
                        </div>
                        <input
                            name='password'
                            type="password"
                            required
                            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            placeholder="Password"
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-2 w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-sm font-semibold text-white py-2.5 shadow-sm transition-all cursor-pointer active:scale-[0.98]"
                    >
                        {isLoading ? "Signing in..." : (
                            <>
                                Sign in
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center pt-2 border-t border-slate-100">
                    <p className="text-xs text-slate-500">
                        New to the platform?{' '}
                        <a href="/register" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                            Register now
                        </a>
                    </p>
                </div>

            </div>
        </div>
    );
}