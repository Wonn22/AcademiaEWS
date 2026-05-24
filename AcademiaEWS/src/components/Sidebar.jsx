import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, History, Trash2, LogOut, GraduationCap } from "lucide-react";

export function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            navigate('/login');
        }
    };

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/history', label: 'History', icon: History },
        { path: '/delete', label: 'Manage Data', icon: Trash2 }
    ];

    return (
        <aside className="flex h-screen w-64 flex-col bg-white border-r border-slate-200 font-sans shrink-0">
            <div className="px-6 py-6 border-b border-slate-100 flex flex-col gap-1">
                <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white shadow-sm">
                        <GraduationCap className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-800">
                        Academia<span className="text-blue-600">EWS</span>
                    </span>
                </div>
                <p className="text-[11px] font-medium text-slate-500 pl-0.5 mt-1">
                    AI Predictor Platform
                </p>
            </div>

            <nav className="flex-1 space-y-1.5 px-3 py-5 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium transition-colors cursor-pointer ${
                                isActive
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-slate-400"}`} strokeWidth={isActive ? 2.5 : 2} />
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer group"
                >
                    <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500" strokeWidth={2} />
                    Logout
                </button>
            </div>
        </aside>
    );
}