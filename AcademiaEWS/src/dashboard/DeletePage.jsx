import { useState, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { Database, Trash2, AlertTriangle, Calendar, Users, AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";

export function DeletePage() {
    const [history, setHistory] = useState([]);
    const [confirmModal, setConfirmModal] = useState({ show: false, type: "", targetId: null });

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = () => {
        const savedHistory = JSON.parse(localStorage.getItem("predict_history") || "[]");
        setHistory(savedHistory);
    };

    const triggerDeleteSingle = (id) => {
        setConfirmModal({ show: true, type: "SINGLE", targetId: id });
    };

    const triggerClearAll = () => {
        setConfirmModal({ show: true, type: "ALL", targetId: null });
    };

    const executeDelete = () => {
        if (confirmModal.type === "SINGLE" && confirmModal.targetId !== null) {
            const updatedHistory = history.filter(item => item.id !== confirmModal.targetId);
            localStorage.setItem("predict_history", JSON.stringify(updatedHistory));
            setHistory(updatedHistory);
        } else if (confirmModal.type === "ALL") {
            localStorage.setItem("predict_history", "[]");
            setHistory([]);
        }
        setConfirmModal({ show: false, type: "", targetId: null });
    };

    const totalRecords = history.length;
    const lastRecord = history[0];
    const lastAnalysisDate = lastRecord ? lastRecord.date : "Never";

    const riskCount = history.filter(item => item.status === 'RISK').length;
    const successCount = totalRecords - riskCount;
    const riskPercent = totalRecords > 0 ? Math.round((riskCount / totalRecords) * 100) : 0;

    return (
        <div className="flex h-screen w-full overflow-hidden bg-slate-50 text-slate-900 font-sans">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-8 lg:p-10 flex flex-col gap-8">

                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Database Console</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Monitor local storage telemetry and perform administrative database management actions.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="bg-white rounded-xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.01)] p-5 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                            <Database className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Database Size</p>
                            <h3 className="text-xl font-bold text-slate-900 mt-0.5">{totalRecords} student entries</h3>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.01)] p-5 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">At-Risk Ratio</p>
                            <h3 className="text-xl font-bold text-slate-900 mt-0.5">{riskPercent}% avg ({riskCount} students)</h3>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.01)] p-5 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200/50 flex items-center justify-center text-slate-500">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Interaction</p>
                            <h3 className="text-sm font-semibold text-slate-700 mt-1 truncate max-w-[170px]" title={lastAnalysisDate}>
                                {lastAnalysisDate}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Records</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {history.length > 0 ? history.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:border-slate-300 transition-all flex flex-col justify-between gap-4"
                                >
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-semibold text-slate-400">{item.date}</span>
                                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide border">
                                                {item.status === 'RISK' ? (
                                                    <span className="text-red-600 bg-red-50/50 border-red-100">At Risk</span>
                                                ) : (
                                                    <span className="text-green-600 bg-green-50/50 border-green-100">Success</span>
                                                )}
                                            </div>
                                        </div>
                                        <h4 className="text-base font-bold text-slate-800 break-words">{item.name}</h4>
                                    </div>

                                    <button
                                        onClick={() => triggerDeleteSingle(item.id)}
                                        className="w-full flex items-center justify-center gap-1.5 py-2 bg-slate-50 hover:bg-red-50 hover:text-red-600 text-slate-500 rounded-lg text-xs font-semibold border border-slate-200 hover:border-red-100 transition-all cursor-pointer"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Delete Record
                                    </button>
                                </div>
                            )) : (
                                <div className="col-span-full py-16 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 bg-slate-50/30 rounded-xl text-slate-400 gap-3">
                                    <Database className="w-8 h-8 text-slate-300" />
                                    <span className="text-xs font-semibold">No records stored in local database</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden flex flex-col">
                            <div className="bg-red-50/50 px-5 py-4 border-b border-red-100 flex items-center gap-2 text-red-700">
                                <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
                                <h3 className="text-xs font-bold uppercase tracking-wider">Danger Zone</h3>
                            </div>

                            <div className="p-5 flex flex-col gap-4">
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Purging the database is a destructive administrative action that permanently deletes all student analysis history from your browser's local storage. This action cannot be undone.
                                </p>

                                <button
                                    onClick={triggerClearAll}
                                    disabled={history.length === 0}
                                    className="w-full py-3.5 bg-red-600 hover:bg-red-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 text-white rounded-lg text-xs font-bold tracking-wider uppercase transition-colors shadow-sm cursor-pointer border border-transparent flex items-center justify-center gap-1.5"
                                >
                                    <AlertTriangle className="w-4 h-4 shrink-0" />
                                    Purge Complete Database
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            {confirmModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-[2px]">
                    <div className="bg-white w-full max-w-md rounded-xl border border-slate-200 shadow-2xl p-6 flex flex-col gap-5">
                        <div className="flex items-center gap-3 text-red-600">
                            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center border border-red-100 shrink-0">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Are you absolutely sure?</h3>
                                <p className="text-xs text-slate-500 mt-0.5">This administrative action cannot be reverted.</p>
                            </div>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 rounded-lg p-3">
                            {confirmModal.type === "ALL"
                                ? "You are attempting to delete the entire student database. This will purge all logged assessment records."
                                : "You are attempting to delete this single student record. The logged values will be permanently removed."
                            }
                        </p>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setConfirmModal({ show: false, type: "", targetId: null })}
                                className="flex-1 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={executeDelete}
                                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}