import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { GraduationCap, ArrowRight } from 'lucide-react';

export function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleRegister = (e) => {
        e.preventDefault();
        const { username, password, confirmPassword } = formData;

        if (!username.includes('@gmail.com')) {
            alert('Username must contain @gmail.com');
            return;
        }
        if (password.length < 8) {
            alert('Password length must be at least 8 characters');
            return;
        }
        if (password !== confirmPassword) {
            alert('Password and Confirm Password do not match');
            return;
        }

        localStorage.setItem('userAccount', JSON.stringify({ username, password }));
        alert('Account Created Successfully');
        navigate('/login');
    };

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
                        <h1 className="text-xl font-bold text-slate-900">Create your account</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Sign up for the prediction platform today
                        </p>
                    </div>
                </div>

                <form className="flex flex-col gap-4" onSubmit={handleRegister}>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-700">Username or Email</label>
                        <input
                            type="text"
                            name="username"
                            required
                            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            placeholder="example@gmail.com"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            placeholder="At least 8 characters"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-700">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            required
                            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            placeholder="Repeat password"
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        className="mt-2 w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-semibold text-white py-2.5 shadow-sm transition-all cursor-pointer active:scale-[0.98]"
                    >
                        Create Account
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </form>

                <div className="text-center pt-2 border-t border-slate-100">
                    <p className="text-xs text-slate-500">
                        Already have an account?{' '}
                        <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                            Log in
                        </a>
                    </p>
                </div>

            </div>
        </div>
    );
}