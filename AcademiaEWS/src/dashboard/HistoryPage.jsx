import { useState, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { Search, Filter, AlertCircle, CheckCircle2, User, ArrowRight, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    PieChart, Pie, Cell, Label,
    BarChart, Bar, XAxis, YAxis,
    Tooltip, ResponsiveContainer
} from 'recharts';

export function HistoryPage() {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [selectedResult, setSelectedResult] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem("predict_history") || "[]");
        setHistory(savedHistory);
    }, []);

    const filteredHistory = history.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = statusFilter === "ALL" || item.status === statusFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="flex h-screen w-full overflow-hidden bg-slate-50 text-slate-900 font-sans">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-8 lg:p-10 flex flex-col gap-6">

                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Prediction History</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        View, search, and audit all previously analyzed student academic risk reports.
                    </p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.01)] overflow-hidden flex flex-col flex-1">

                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-3">
                        <div className="relative w-full sm:max-w-xs">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search student name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-1.5 text-sm rounded-lg border border-slate-200 bg-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-sm"
                            />
                        </div>

                        <div className="flex items-center gap-1.5 self-stretch sm:self-auto">
                            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1">
                                <Filter className="w-3.5 h-3.5" />
                                Filter:
                            </span>
                            {['ALL', 'RISK', 'SUCCESS'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setStatusFilter(f)}
                                    className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${statusFilter === f
                                            ? 'bg-slate-900 text-white shadow-sm'
                                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/30">
                                    <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Name</th>
                                    <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Risk Index</th>
                                    <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Analysis Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredHistory.length > 0 ? (
                                    filteredHistory.map((item) => {
                                        const riskVal = item.riskPercent !== undefined ? item.riskPercent : (item.status === 'RISK' ? 100 : 0);
                                        return (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-slate-50/40 transition-colors cursor-pointer"
                                                onClick={() => {
                                                    const resultToPass = item.fullResult || {
                                                        prediction: item.status === 'RISK' ? 0 : 1,
                                                        riskPercent: item.riskPercent || (item.status === 'RISK' ? 100 : 0),
                                                        contributions: []
                                                    };
                                                    setSelectedResult(resultToPass);
                                                    setShowModal(true);
                                                }}
                                            >
                                                <td className="px-6 py-4.5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 border border-slate-200/50 text-slate-600">
                                                            <User className="w-4 h-4" />
                                                        </div>
                                                        <span className="font-semibold text-slate-900 text-sm">{item.name}</span>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4.5">
                                                    <div className="flex items-center gap-2 max-w-[140px]">
                                                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                                                            <div
                                                                className={`h-1.5 rounded-full ${item.status === 'RISK' ? 'bg-red-500' : 'bg-green-500'
                                                                    }`}
                                                                style={{ width: `${riskVal}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-700 shrink-0">{riskVal}%</span>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4.5">
                                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide border shadow-sm">
                                                        {item.status === 'RISK' ? (
                                                            <div className="flex items-center gap-1 text-red-700 bg-red-50/50 border-red-200/50">
                                                                <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                                                                <span>AT RISK</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-1 text-green-700 bg-green-50/50 border-green-200/50">
                                                                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                                                <span>SUCCESS</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4.5 text-xs text-slate-500 font-medium">{item.date}</td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="py-16 text-center">
                                            <div className="max-w-[280px] mx-auto flex flex-col items-center gap-4">
                                                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/60 text-slate-400">
                                                    <Search className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-semibold text-slate-800">No records found</h3>
                                                    <p className="text-xs text-slate-400 leading-relaxed mt-1">
                                                        {history.length === 0
                                                            ? "There are no student analysis records currently stored in the database."
                                                            : "Adjust your search filters to find the requested record."
                                                        }
                                                    </p>
                                                </div>
                                                {history.length === 0 ? (
                                                    <button
                                                        onClick={() => navigate('/dashboard')}
                                                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-all shadow-sm cursor-pointer active:scale-95"
                                                    >
                                                        Analyze First Student
                                                        <ArrowRight className="w-3.5 h-3.5" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => { setSearchTerm(""); setStatusFilter("ALL"); }}
                                                        className="text-xs text-blue-600 hover:underline font-semibold"
                                                    >
                                                        Reset Filters
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            <AnimatePresence>
                {showModal && selectedResult && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-[2px]">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white w-full max-w-4xl rounded-xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh]"
                        >
                            <div className={`p-8 md:w-[320px] flex flex-col justify-between shrink-0 border-r border-slate-100 ${selectedResult.prediction === 0 ? 'bg-red-50/20' : 'bg-green-50/20'
                                }`}>
                                <div className="flex flex-col gap-6">
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Prediction Status</h4>
                                        <div className="flex items-center gap-2 mt-2">
                                            {selectedResult.prediction === 0 ? (
                                                <>
                                                    <AlertCircle className="w-6 h-6 text-red-600" />
                                                    <span className="text-2xl font-black tracking-tight text-red-700">AT RISK</span>
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                                                    <span className="text-2xl font-black tracking-tight text-green-700">SUCCESS</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="h-44 w-full flex items-center justify-center relative bg-white rounded-lg border border-slate-100 shadow-sm">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={[{ v: 100 - selectedResult.riskPercent }, { v: selectedResult.riskPercent }]}
                                                    innerRadius={50}
                                                    outerRadius={65}
                                                    startAngle={180}
                                                    endAngle={0}
                                                    dataKey="v"
                                                >
                                                    <Cell fill="#F1F5F9" />
                                                    <Cell fill={selectedResult.prediction === 0 ? "#DC2626" : "#16A34A"} />
                                                    <Label
                                                        value={`${selectedResult.riskPercent}%`}
                                                        position="center"
                                                        fill="#0F172A"
                                                        style={{ fontSize: '1.4rem', fontWeight: '800' }}
                                                    />
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="absolute bottom-4 left-0 right-0 text-center">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Risk Index</p>
                                        </div>
                                    </div>

                                    <div className="text-xs leading-relaxed text-slate-600 bg-white border border-slate-100 rounded-lg p-3.5 shadow-sm">
                                        <span className="font-bold text-slate-800">Interpretation:</span>{' '}
                                        {selectedResult.prediction === 0
                                            ? "The student exhibits academic patterns strongly correlated with class failure or withdrawal. Immediate support intervention is advised."
                                            : "The student exhibits robust learning activity patterns corresponding to successful class completion and achievement."
                                        }
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowModal(false)}
                                    className="mt-6 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-xs tracking-wider uppercase transition-colors shadow-sm cursor-pointer"
                                >
                                    Close Assessment
                                </button>
                            </div>

                            <div className="flex-1 p-8 overflow-y-auto flex flex-col justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2 mb-6">
                                        <span>Key Driving Variables Impact</span>
                                        <span className="text-[10px] font-medium text-slate-400">(Relative weights)</span>
                                    </h3>

                                    <div className="h-[280px]">
                                        {selectedResult.contributions && selectedResult.contributions.length > 0 ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={selectedResult.contributions} layout="vertical" margin={{ left: -10, right: 10 }}>
                                                    <XAxis type="number" hide />
                                                    <YAxis
                                                        dataKey="name"
                                                        type="category"
                                                        tick={{ fontSize: 9, fontWeight: '600', fill: '#64748B' }}
                                                        width={130}
                                                        axisLine={false}
                                                        tickLine={false}
                                                    />
                                                    <Bar
                                                        dataKey="value"
                                                        fill="#3B82F6"
                                                        radius={[0, 4, 4, 0]}
                                                        label={{ position: 'right', fontSize: 9, fontWeight: '700', fill: '#334155', formatter: (v) => `${v}%` }}
                                                    />
                                                    <Tooltip cursor={{ fill: '#F8FAFC' }} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center border border-dashed border-slate-200 rounded-lg bg-slate-50 text-xs text-slate-400 p-4 text-center">
                                                Detailed breakdown not available for this record. Please run a new analysis.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6 border-t border-slate-100 pt-6 flex flex-col gap-2">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recommended Action Item</p>
                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                        <ChevronRight className="w-4 h-4 text-blue-500 shrink-0" />
                                        <span>
                                            {selectedResult.prediction === 0
                                                ? "Flag student in EWS, initiate student-teacher consultation, and suggest a review of study credits load."
                                                : "No action items. Continue monitoring student's Virtual Learning Environment clicks consistency."
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}