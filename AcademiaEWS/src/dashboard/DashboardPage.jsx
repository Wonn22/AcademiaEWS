import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import {
    PieChart, Pie, Cell, Label,
    BarChart, Bar, XAxis, YAxis,
    Tooltip, ResponsiveContainer
} from 'recharts';
import {
    User, BookOpen, Clock, Activity, Award, HelpCircle,
    RefreshCw, SlidersHorizontal, AlertCircle, CheckCircle2, ChevronRight
} from "lucide-react";

export function DashboardPage() {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    const featureLabels = {
        'code_module': 'Mata Kuliah (ID)',
        'gender': 'Jenis Kelamin (L/P)',
        'highest_education': 'Tingkat Pendidikan Terakhir',
        'imd_band': 'Tingkat Ekonomi',
        'age_band': 'Kategori Usia',
        'num_of_prev_attempts': 'Jumlah Percobaan Sebelumnya',
        'studied_credits': 'Total SKS yang Diambil',
        'date_registration': 'Hari Pendaftaran (H-)',
        'total_clicks': 'Total Aktivitas (Klik VLE)',
        'mean_score': 'Rata-rata Nilai Tugas',
        'mean_delay': 'Rata-rata Keterlambatan',
        'clicks_early': 'Aktivitas 30 Hari Pertama',
        'clicks_late': 'Aktivitas 30 Hari Terakhir'
    };

    const featureLimits = {
        'code_module': { min: 0, max: 6, label: '0-6' },
        'gender': { min: 0, max: 1, label: '0: P, 1: L' },
        'highest_education': { min: 0, max: 4, label: '0-4' },
        'imd_band': { min: 0, max: 10, label: '0-10' },
        'age_band': { min: 0, max: 2, label: '0-2' },
        'num_of_prev_attempts': { min: 0, max: 10, label: 'Max 10' },
        'studied_credits': { min: 30, max: 600, label: '30-600' },
        'date_registration': { min: -300, max: 0, label: '-300 s/d 0' },
        'total_clicks': { min: 0, max: 10000, label: 'Max 10k' },
        'mean_score': { min: 0, max: 100, label: '0-100' },
        'mean_delay': { min: 0, max: 100, label: 'Max 100' },
        'clicks_early': { min: 0, max: 5000, label: 'Max 5k' },
        'clicks_late': { min: 0, max: 5000, label: 'Max 5k' }
    };

    const featureDetails = {
        'code_module': 'Tingkat kesulitan mata kuliah berdasarkan data historis. 0 = AAA (mudah, fail 12%), 1 = BBB (sedang, fail 22%), 2 = CCC (sulit, withdrawal tinggi), 3 = DDD (sulit, withdrawal tinggi), 4 = EEE (sedang), 5 = FFF (sedang, fail 22%), 6 = GGG (sulit, fail 29%). Angka 0 sampai 6 masing-masing mewakili mata kuliah berbeda.',
        'gender': 'Jenis kelamin mahasiswa. Isi 0 untuk perempuan dan 1 untuk laki-laki.',
        'highest_education': 'Tingkat pendidikan terakhir sebelum masuk universitas. 0 = belum ada ijazah, 1 = dibawah SMA, 2 = SMA atau sederajat, 3 = Diploma/Sarjana, 4 = Magister atau lebih tinggi.',
        'imd_band': 'Tingkat ekonomi keluarga atau daerah tempat tinggal. Semakin rendah angkanya, semakin rendah tingkat ekonominya. Skala 0 sampai 10.',
        'age_band': 'Usia mahasiswa saat mendaftar. 0 = di bawah 35 tahun, 1 = 35 sampai 55 tahun, 2 = di atas 55 tahun.',
        'num_of_prev_attempts': 'Berapa kali mahasiswa sudah mengulang mata kuliah ini sebelumnya. Isi 0 jika baru pertama kali.',
        'studied_credits': 'Jumlah total SKS yang diambil di semester ini. Semakin banyak SKS, semakin berat beban belajarnya.',
        'date_registration': 'Kapan mahasiswa mendaftar dibanding tanggal mulai kuliah. Gunakan angka negatif untuk mendaftar lebih awal, misalnya -50 artinya daftar 50 hari sebelum kuliah dimulai.',
        'total_clicks': 'Berapa kali mahasiswa membuka halaman materi atau tugas di website kampus sepanjang semester. Angka ini menunjukkan seberapa aktif mahasiswa belajar online.',
        'mean_score': 'Rata-rata nilai tugas dan ujian yang sudah dikerjakan, dari skala 0 sampai 100. Semakin tinggi, semakin bagus nilainya.',
        'mean_delay': 'Rata-rata keterlambatan mahasiswa dalam mengumpulkan tugas, dihitung dalam hari. 0 artinya selalu tepat waktu, semakin besar angkanya artinya semakin sering terlambat.',
        'clicks_early': 'Berapa kali mahasiswa membuka website kampus pada 30 hari pertama semester. Menunjukkan semangat belajar di awal perkuliahan.',
        'clicks_late': 'Berapa kali mahasiswa membuka website kampus pada 30 hari terakhir semester. Menunjukkan apakah mahasiswa tetap rajin menjelang ujian atau malah mulai meninggalkan.'
    };

    const [studentName, setStudentName] = useState("");
    const [inputs, setInputs] = useState(
        Object.keys(featureLabels).reduce((acc, f) => ({ ...acc, [f]: 0 }), {})
    );
    const [result, setResult] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showHelpPanel, setShowHelpPanel] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let val = value === "" ? "" : parseFloat(value);
        if (val !== "" && featureLimits[name]) {
            if (val > featureLimits[name].max) val = featureLimits[name].max;
            if (val < featureLimits[name].min) val = featureLimits[name].min;
        }
        setInputs({ ...inputs, [name]: val });
    };

    const handleReset = () => {
        setStudentName("");
        setInputs(Object.keys(featureLabels).reduce((acc, f) => ({ ...acc, [f]: 0 }), {}));
    };

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!studentName) return alert("Please enter student name!");
        setLoading(true);
        try {
            const res = await fetch(`${apiBaseUrl}/predict`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputs),
            });
            const data = await res.json();
            if (data.status === 'success') {
                setResult(data);
                setShowModal(true);

                const newRecord = {
                    id: Date.now(),
                    name: studentName,
                    date: new Date().toLocaleString('id-ID'),
                    status: data.prediction === 0 ? 'RISK' : 'SUCCESS',
                    riskPercent: data.riskPercent,
                    fullResult: data
                };
                const existing = JSON.parse(localStorage.getItem("predict_history") || "[]");
                localStorage.setItem("predict_history", JSON.stringify([newRecord, ...existing]));
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (err) {
            alert(`Error: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    const profileFields = ['code_module', 'gender', 'highest_education', 'imd_band', 'age_band', 'num_of_prev_attempts'];
    const engagementFields = ['studied_credits', 'date_registration', 'total_clicks', 'clicks_early', 'clicks_late'];
    const performanceFields = ['mean_score', 'mean_delay'];

    return (
        <div className="flex h-screen w-full overflow-hidden bg-slate-50 text-slate-900 font-sans">
            <Sidebar />

            <main className="flex-1 flex overflow-hidden">

                <div className="flex-1 overflow-y-auto p-8 lg:p-10">

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Prediction Workspace</h1>
                                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                    Oulad Engine v2.0
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">
                                Evaluate academic risks and predict student performance using the machine learning models.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setShowHelpPanel(!showHelpPanel)}
                                className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors shadow-sm cursor-pointer"
                            >
                                <HelpCircle className="w-4 h-4 text-slate-500" />
                                {showHelpPanel ? "Hide Variable Guide" : "Show Variable Guide"}
                            </button>
                            <button
                                type="button"
                                onClick={handleReset}
                                className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors shadow-sm cursor-pointer"
                            >
                                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                                Reset Form
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleAnalyze} className="max-w-4xl flex flex-col gap-6">

                        <div className="bg-white rounded-xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.01)] p-6">
                            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                                <User className="w-4.5 h-4.5 text-slate-400" />
                                <h2 className="text-sm font-bold text-slate-900">Student Identity</h2>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-slate-700">Student Full Name</label>
                                <input
                                    type="text"
                                    value={studentName}
                                    onChange={(e) => setStudentName(e.target.value)}
                                    required
                                    placeholder="Enter full name (e.g., John Doe)"
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.01)] p-6">
                            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                                <BookOpen className="w-4.5 h-4.5 text-slate-400" />
                                <h2 className="text-sm font-bold text-slate-900">Student Profile & Background</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {profileFields.map((f) => (
                                    <div key={f} className="flex flex-col gap-1.5">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-semibold text-slate-700">{featureLabels[f]}</label>
                                            <span className="text-[9px] font-bold text-blue-600 bg-blue-50/50 px-1.5 py-0.5 rounded">{featureLimits[f]?.label}</span>
                                        </div>
                                        <input
                                            type="number"
                                            name={f}
                                            value={inputs[f]}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-sm"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.01)] p-6">
                            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                                <Activity className="w-4.5 h-4.5 text-slate-400" />
                                <h2 className="text-sm font-bold text-slate-900">Academic Load & VLE Engagement</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {engagementFields.map((f) => (
                                    <div key={f} className="flex flex-col gap-1.5">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-semibold text-slate-700">{featureLabels[f]}</label>
                                            <span className="text-[9px] font-bold text-blue-600 bg-blue-50/50 px-1.5 py-0.5 rounded">{featureLimits[f]?.label}</span>
                                        </div>
                                        <input
                                            type="number"
                                            name={f}
                                            value={inputs[f]}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-sm"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.01)] p-6">
                            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                                <Award className="w-4.5 h-4.5 text-slate-400" />
                                <h2 className="text-sm font-bold text-slate-900">Performance Metrics</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {performanceFields.map((f) => (
                                    <div key={f} className="flex flex-col gap-1.5">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-semibold text-slate-700">{featureLabels[f]}</label>
                                            <span className="text-[9px] font-bold text-blue-600 bg-blue-50/50 px-1.5 py-0.5 rounded">{featureLimits[f]?.label}</span>
                                        </div>
                                        <input
                                            type="number"
                                            name={f}
                                            value={inputs[f]}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-sm"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3.5 rounded-lg font-semibold text-white text-sm tracking-wide transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 ${loading
                                    ? 'bg-slate-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99]'
                                }`}
                        >
                            {loading ? 'Processing Analysis...' : 'Analyze Academic Data'}
                        </button>
                    </form>
                </div>

                <AnimatePresence>
                    {showHelpPanel && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 360, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="hidden xl:flex flex-col h-full bg-white border-l border-slate-200 w-[360px] overflow-hidden shrink-0"
                        >
                            <div className="px-6 py-6 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
                                <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                                <h3 className="text-sm font-bold text-slate-800">Variable Information Guide</h3>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-5">
                                {Object.keys(featureLabels).map((f) => (
                                    <div key={f} className="flex flex-col gap-1 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">{featureLabels[f]}</h4>
                                            <span className="text-[9px] font-black text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{featureLimits[f]?.label}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed mt-1">{featureDetails[f]}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <AnimatePresence>
                {showModal && result && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-[2px]">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white w-full max-w-4xl rounded-xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh]"
                        >
                            <div className={`p-8 md:w-[320px] flex flex-col justify-between shrink-0 border-r border-slate-100 ${result.prediction === 0 ? 'bg-red-50/20' : 'bg-green-50/20'
                                }`}>
                                <div className="flex flex-col gap-6">
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Prediction Status</h4>
                                        <div className="flex items-center gap-2 mt-2">
                                            {result.prediction === 0 ? (
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
                                                    data={[{ v: 100 - result.riskPercent }, { v: result.riskPercent }]}
                                                    innerRadius={50}
                                                    outerRadius={65}
                                                    startAngle={180}
                                                    endAngle={0}
                                                    dataKey="v"
                                                >
                                                    <Cell fill="#F1F5F9" />
                                                    <Cell fill={result.prediction === 0 ? "#DC2626" : "#16A34A"} />
                                                    <Label
                                                        value={`${result.riskPercent}%`}
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
                                        {result.prediction === 0
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
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={result.contributions} layout="vertical" margin={{ left: -10, right: 10 }}>
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
                                    </div>
                                </div>

                                <div className="mt-6 border-t border-slate-100 pt-6 flex flex-col gap-2">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recommended Action Item</p>
                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                        <ChevronRight className="w-4 h-4 text-blue-500 shrink-0" />
                                        <span>
                                            {result.prediction === 0
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
