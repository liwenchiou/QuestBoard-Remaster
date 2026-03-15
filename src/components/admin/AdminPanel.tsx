import { useState } from "react";
import type { GuildTask } from "../../types";
import { Save, Lock, Unlock, ExternalLink, RotateCw } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface AdminPanelProps {
    tasks: GuildTask[];
    onRefresh: () => void;
}

interface EditState {
    id: number;
    title: string;
    link: string;
    available: boolean;
}

export default function AdminPanel({ tasks, onRefresh }: AdminPanelProps) {
    const [isSaving, setIsSaving] = useState<number | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");

    // Local state for all rows being edited
    const [editStates, setEditStates] = useState<Record<number, EditState>>({});

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "guild-master-2026") {
            setIsAuthenticated(true);
        } else {
            alert("暗號錯誤！衛兵正在趕來的路上...");
            setPassword("");
        }
    };

    const getEditState = (task: GuildTask) => {
        return editStates[task.id] || {
            id: task.id,
            title: task.title,
            link: task.link,
            available: task.available
        };
    };

    const updateEditState = (id: number, updates: Partial<EditState>) => {
        setEditStates(prev => ({
            ...prev,
            [id]: { ...getEditState(tasks.find(t => t.id === id)!), ...updates }
        }));
    };

    const handleUpdateTask = async (id: number) => {
        const state = editStates[id];
        if (!state) return;

        setIsSaving(id);
        const { error } = await supabase
            .from('guild_tasks')
            .update({
                title: state.title,
                link: state.link,
                available: state.available
            })
            .eq('id', id);

        if (error) {
            console.error('Error updating task:', error);
            alert('更新失敗');
        } else {
            onRefresh();
            // Clear local edit state for this row on success to sync with server
            const newEditStates = { ...editStates };
            delete newEditStates[id];
            setEditStates(newEditStates);
        }
        setIsSaving(id);
        setTimeout(() => setIsSaving(null), 1000);
    };

    if (!isAuthenticated) {
        return (
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="glass-card p-8 w-full max-w-md animate-zoom-in text-center">
                    <div className="w-16 h-16 bg-energy-yellow/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-energy-yellow/30">
                        <Lock size={32} className="text-energy-yellow" />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-widest mb-2">秘密通道</h2>
                    <p className="text-white/40 text-sm mb-8">此區僅限酒吧老闆進入，請輸入公會暗號：</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="輸入暗號..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center text-sm focus:border-energy-yellow/50 outline-none tracking-[0.5em]"
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="w-full btn-primary py-3 rounded-xl font-bold uppercase tracking-widest"
                        >
                            解鎖權限
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-4 md:p-8 flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between mb-8 transition-all">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight flex items-center gap-3">
                        酒吧老闆管理區 <span className="text-xs font-normal text-energy-yellow border border-energy-yellow/30 px-2 py-0.5 rounded tracking-widest uppercase">Admin</span>
                    </h2>
                    <p className="text-white/40 text-sm mt-1">在這裡控管 30 天任務的解鎖狀態與內容</p>
                </div>
                <button
                    onClick={onRefresh}
                    className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-white/40 hover:text-energy-yellow"
                    title="重新整理數據"
                >
                    <RotateCw size={20} className={isSaving ? "animate-spin" : ""} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 pb-8">
                <div className="grid grid-cols-1 gap-4">
                    {tasks.map((task) => {
                        const state = getEditState(task);
                        const isModified = editStates[task.id] !== undefined;

                        return (
                            <div key={task.id} className={`glass-card p-4 flex flex-col md:flex-row items-center gap-4 transition-all ${state.available ? "border-energy-yellow/20" : "opacity-80"
                                } ${isModified ? "border-guild-blue/30 bg-guild-blue/5" : ""}`}>
                                <div className={`w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center font-mono font-black text-xl shrink-0 ${state.available ? "text-energy-yellow" : "text-white/40"}`}>
                                    {task.day}
                                </div>

                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold">任務標題</label>
                                        <input
                                            type="text"
                                            value={state.title}
                                            onChange={(e) => updateEditState(task.id, { title: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:border-energy-yellow/50 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold">課程連結</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={state.link}
                                                onChange={(e) => updateEditState(task.id, { link: e.target.value })}
                                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:border-energy-yellow/50 outline-none"
                                            />
                                            <a href={task.link} target="_blank" rel="noreferrer" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                                <ExternalLink size={14} className="text-white/40" />
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0 self-end mb-1">
                                    <button
                                        onClick={() => updateEditState(task.id, { available: !state.available })}
                                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all min-w-[100px] ${state.available
                                            ? "bg-energy-yellow/10 text-energy-yellow border border-energy-yellow/30"
                                            : "bg-white/5 text-white/40 border border-white/10"
                                            }`}
                                    >
                                        {state.available ? (
                                            <>
                                                <Unlock size={14} />
                                                <span>已解鎖</span>
                                            </>
                                        ) : (
                                            <>
                                                <Lock size={14} />
                                                <span>封鎖中</span>
                                            </>
                                        )}
                                    </button>

                                    <button
                                        onClick={() => handleUpdateTask(task.id)}
                                        disabled={!isModified || isSaving === task.id}
                                        className={`flex items-center justify-center gap-2 px-6 py-2 rounded-xl text-xs font-bold transition-all ${isModified
                                            ? "bg-guild-blue text-white shadow-lg shadow-guild-blue/20"
                                            : "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
                                            }`}
                                    >
                                        {isSaving === task.id ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <Save size={14} />
                                                <span>更新資料</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
