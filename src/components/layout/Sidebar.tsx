import { useState, useEffect } from "react";
import type { AppMode, GuildTask } from "../../types";
import { Send, User, Link as LinkIcon, MessageSquare, Calendar } from "lucide-react";

interface SidebarProps {
    mode: AppMode;
    tasks: GuildTask[];
    onSubmit: (data: any) => void;
}

const AVATAR_SEEDS = ['Felix', 'Aneka', 'Caleb', 'Jocelyn'];

export default function Sidebar({ mode, tasks, onSubmit }: SidebarProps) {
    const [name, setName] = useState("");
    const [selectedSeed, setSelectedSeed] = useState(AVATAR_SEEDS[0]);
    const [selectedDay, setSelectedDay] = useState("");

    useEffect(() => {
        if (tasks.length > 0 && !selectedDay) {
            setSelectedDay(tasks[0].day);
        }
    }, [tasks]);
    const [url, setUrl] = useState("");
    const [report, setReport] = useState("");
    const [message, setMessage] = useState("");

    const isBulletin = mode === "bulletin";
    const isTavern = mode === "tavern";

    if (!isBulletin && !isTavern) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isBulletin) {
            const taskObj = tasks.find(t => t.day === selectedDay);
            onSubmit({
                name,
                avatar: selectedSeed,
                url,
                report,
                task: `Day ${selectedDay}: ${taskObj?.title}`,
                created_at: new Date().toISOString()
            });
        } else {
            onSubmit({ user: name || "匿名勇者", avatar: selectedSeed, content: message, type: 'user' });
        }
        // Simple reset
        setReport("");
        setMessage("");
    };

    return (
        <aside className="w-full md:w-80 h-full bg-surface border-r border-white/5 p-6 pt-20 md:pt-6 animate-slide-in flex flex-col gap-6 overflow-y-auto">
            <div className="flex items-center justify-between md:block">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
                        {isBulletin ? "傳送任務回報" : "在酒館留言"}
                        <span className="text-xs font-normal text-white/40 border border-white/20 px-1.5 rounded uppercase">Input</span>
                    </h2>
                    <p className="text-sm text-white/50">{isBulletin ? "提交今日的修煉成果" : "與其他冒險者交流心得"}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Name & Avatar */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-energy-yellow uppercase tracking-widest flex items-center gap-2">
                        <User size={12} /> 勇者稱號
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="輸入稱號..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-energy-yellow/50 transition-colors"
                        required
                    />

                    <div className="flex justify-between gap-2 mt-2">
                        {AVATAR_SEEDS.map((seed) => (
                            <button
                                key={seed}
                                type="button"
                                onClick={() => setSelectedSeed(seed)}
                                className={`w-12 h-12 rounded-xl border-2 transition-all p-1 ${selectedSeed === seed ? "border-energy-yellow bg-energy-yellow/10 scale-110" : "border-white/5 bg-white/5 grayscale"
                                    }`}
                            >
                                <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}`} alt={seed} />
                            </button>
                        ))}
                    </div>
                </div>

                {isBulletin && (
                    <>
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-energy-yellow uppercase tracking-widest flex items-center gap-2">
                                <Calendar size={12} /> 任務天數
                            </label>
                            <select
                                value={selectedDay}
                                onChange={(e) => setSelectedDay(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-energy-yellow/50 transition-colors cursor-pointer appearance-none"
                            >
                                {tasks.map(task => (
                                    <option key={task.day} value={task.day} className="bg-surface" disabled={!task.available}>
                                        Day {task.day}: {task.available ? `${task.title.substring(0, 15)}...` : " [ 封印中 ]"}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold text-energy-yellow uppercase tracking-widest flex items-center gap-2">
                                <LinkIcon size={12} /> CodePen URL
                            </label>
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://codepen.io/..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-energy-yellow/50 transition-colors"
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold text-energy-yellow uppercase tracking-widest flex items-center gap-2">
                                <MessageSquare size={12} /> 心得報告
                            </label>
                            <textarea
                                value={report}
                                onChange={(e) => setReport(e.target.value)}
                                placeholder="描述你的戰鬥細節..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-energy-yellow/50 transition-colors h-32 resize-none"
                                required
                            />
                        </div>
                    </>
                )}

                {isTavern && (
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-energy-yellow uppercase tracking-widest flex items-center gap-2">
                            <MessageSquare size={12} /> 留言內容
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="說點什麼吧..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-energy-yellow/50 transition-colors h-40 resize-none"
                            required
                        />
                    </div>
                )}

                <button type="submit" className="btn-primary mt-2 flex items-center justify-center gap-2">
                    {isBulletin ? "傳送回報" : "發送留言"} <Send size={16} />
                </button>
            </form>

            <div className="mt-auto pt-6 border-t border-white/5">
                <div className="flex items-center justify-between text-[10px] text-white/30 uppercase tracking-[0.2em]">
                    <span>System Status</span>
                    <span className="text-green-500 font-bold">Online</span>
                </div>
            </div>
        </aside>
    );
}
