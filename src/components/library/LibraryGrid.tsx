import { useState } from "react";
import type { GuildTask } from "../../types";
import { Lock, Search, BookOpen, ChevronRight } from "lucide-react";

interface LibraryGridProps {
    tasks: GuildTask[];
}

export default function LibraryGrid({ tasks }: LibraryGridProps) {
    const [search, setSearch] = useState("");

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.day.includes(search) ||
        task.theme.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex-1 p-4 md:p-8 flex flex-col h-full overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">公會圖書庫</h2>
                    <p className="text-white/40 text-sm">30 天修煉全紀錄</p>
                </div>

                <div className="relative group w-full md:w-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-energy-yellow transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="搜尋標題或天數..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-surface border border-white/5 rounded-full pl-12 pr-6 py-2.5 text-sm w-full md:w-80 focus:outline-none focus:border-energy-yellow/30 focus:bg-white/5 transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 overflow-y-auto pr-2 pb-8">
                {filteredTasks.map((task) => (
                    <div
                        key={task.id}
                        className={`glass-card p-6 flex flex-col gap-4 group transition-all relative ${!task.available ? "grayscale brightness-50" : "hover:border-guild-blue/30"
                            }`}
                    >
                        {!task.available && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="bg-background/80 p-3 rounded-full border border-white/10 group-hover:scale-110 transition-transform">
                                        <Lock size={24} className="text-white/40" />
                                    </div>
                                    <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-black">封印中</span>
                                </div>
                            </div>
                        )}

                        <div className="flex items-start justify-between">
                            <div className={`w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center font-mono font-black text-2xl ${task.available ? "text-energy-yellow" : "text-white/20"}`}>
                                {task.day}
                            </div>
                            {task.available && (
                                <div className="bg-guild-blue/20 p-2 rounded-lg text-guild-blue">
                                    <BookOpen size={16} />
                                </div>
                            )}
                        </div>

                        <div>
                            <h3 className="font-bold text-lg leading-tight mb-1 group-hover:text-energy-yellow transition-colors">
                                {task.available ? task.title : "？？？？？？？？"}
                            </h3>
                            <p className="text-white/40 text-xs">{task.available ? task.theme : "此檔案尚未解鎖"}</p>
                        </div>

                        <div className="mt-auto pt-4 border-t border-white/5">
                            {task.available ? (
                                <a
                                    href={task.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full btn-secondary py-1.5 flex items-center justify-center gap-2 !rounded-xl text-xs"
                                >
                                    複習檔案 <ChevronRight size={14} />
                                </a>
                            ) : (
                                <div className="w-full text-center py-1.5 text-[10px] text-white/10 italic font-mono uppercase tracking-widest">
                                    Unlock in {task.id - 1} days
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
