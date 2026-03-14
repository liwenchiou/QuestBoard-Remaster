import { useState, useMemo } from "react";
import type { CheckIn, GuildTask } from "../../types";
import { ChevronLeft, ChevronRight, Eye, Filter } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { zhTW } from "date-fns/locale";

interface BulletinBoardProps {
    checkIns: CheckIn[];
    tasks: GuildTask[];
}

export default function BulletinBoard({ checkIns, tasks }: BulletinBoardProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDay, setSelectedDay] = useState<string>("all");
    const [selectedItem, setSelectedItem] = useState<CheckIn | null>(null);
    const itemsPerPage = 4;

    const filteredCheckIns = useMemo(() => {
        if (selectedDay === "all") return [...checkIns].reverse();
        // Since task string in CheckIn includes "Day XX: ", we can check if it starts with it
        return [...checkIns]
            .filter(ci => ci.task.includes(`Day ${selectedDay}`))
            .reverse();
    }, [checkIns, selectedDay]);

    const totalPages = Math.ceil(filteredCheckIns.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredCheckIns.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="flex-1 p-4 md:p-8 flex flex-col h-full overflow-hidden">
            <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">任務佈告欄</h2>
                    <p className="text-white/40 text-sm">此處記錄了勇者們完成的豐功偉業</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest">
                        <Filter size={14} /> 篩選天數
                    </div>
                    <select
                        value={selectedDay}
                        onChange={(e) => {
                            setSelectedDay(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="bg-surface border border-white/10 rounded-lg px-3 py-1.5 text-sm font-mono text-energy-yellow focus:outline-none focus:border-energy-yellow/50 transition-colors cursor-pointer appearance-none pr-8 relative"
                        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'rgba(255,212,59,0.5)\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '16px' }}
                    >
                        <option value="all">ALL MISSIONS</option>
                        {tasks.map(task => (
                            <option key={task.day} value={task.day}>DAY {task.day}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 flex-1 content-start overflow-y-auto pr-2 pb-20 md:pb-8">
                {currentItems.map((item) => (
                    <div key={item.id} className="glass-card p-5 md:p-6 flex flex-col gap-4 group hover:border-energy-yellow/30 transition-all animate-zoom-in min-h-[220px]">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img
                                    src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${item.avatar}`}
                                    alt={item.name}
                                    className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/5 border border-white/10"
                                />
                                <div>
                                    <h3 className="font-bold text-base md:text-lg leading-tight">{item.name}</h3>
                                    <p className="text-energy-yellow/80 text-[10px] md:text-xs font-mono">{item.task}</p>
                                </div>
                            </div>
                            <div className="text-[10px] text-white/30 text-right">
                                {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: zhTW })}
                            </div>
                        </div>

                        <p className="text-sm text-white/70 line-clamp-3 md:line-clamp-4 leading-relaxed flex-1">
                            {item.report}
                        </p>

                        <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
                            <button
                                onClick={() => setSelectedItem(item)}
                                className="text-xs text-guild-blue hover:text-energy-yellow transition-colors font-bold uppercase tracking-widest flex items-center gap-2"
                            >
                                查看回報 <Eye size={14} />
                            </button>
                            <div className="text-[10px] text-white/20 font-mono uppercase">
                                Report ID: {item.id.toString().substring(0, 8)}
                            </div>
                        </div>
                    </div>
                ))}

                {currentItems.length === 0 && (
                    <div className="col-span-full h-80 flex flex-col items-center justify-center text-white/20">
                        <div className="text-6xl mb-4 font-black">EMPTY</div>
                        <p>目前尚無回報紀錄，勇者速速前往回報！</p>
                    </div>
                )}
            </div>

            {/* Pagination moved to bottom */}
            <div className="mt-4 md:mt-6 flex items-center justify-center">
                <div className="flex items-center gap-4 bg-surface/80 backdrop-blur-md rounded-full px-4 py-2 border border-white/10 shadow-lg">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className="p-1.5 hover:bg-white/10 rounded-full disabled:opacity-20 transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="font-mono text-xs font-bold w-12 text-center text-energy-yellow">
                        {currentPage} / {totalPages || 1}
                    </span>
                    <button
                        disabled={currentPage === totalPages || totalPages === 0}
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className="p-1.5 hover:bg-white/10 rounded-full disabled:opacity-20 transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Modal - Could be a separate component but keeping it here for simplicity in this pass */}
            {selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/80 backdrop-blur-xl animate-zoom-in">
                    <div className="glass-card max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setSelectedItem(null)}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <Eye size={24} className="rotate-180 opacity-50" />
                        </button>

                        <div className="flex items-center gap-6 mb-8">
                            <img
                                src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${selectedItem.avatar}`}
                                alt={selectedItem.name}
                                className="w-24 h-24 rounded-2xl bg-white/5 border border-energy-yellow/30 p-2 shadow-[0_0_20px_rgba(255,212,59,0.2)]"
                            />
                            <div>
                                <span className="text-xs text-energy-yellow font-bold uppercase tracking-widest mb-1 block">Full Report</span>
                                <h3 className="text-3xl font-black leading-tight mb-2 tracking-tight">{selectedItem.name}</h3>
                                <div className="flex items-center gap-3">
                                    <span className="bg-guild-blue/20 text-guild-blue text-[10px] px-2 py-0.5 rounded font-bold uppercase">{selectedItem.task}</span>
                                    <span className="text-white/30 text-[10px]">{new Date(selectedItem.created_at).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold mb-3 border-b border-white/5 pb-2">心得報告文本</h4>
                                <div className="text-white/80 leading-relaxed whitespace-pre-wrap text-lg italic font-serif">
                                    「{selectedItem.report}」
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold mb-3 border-b border-white/5 pb-2">作品連結</h4>
                                <a
                                    href={selectedItem.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-guild-blue hover:text-energy-yellow transition-all w-full md:w-auto"
                                >
                                    <span className="font-mono">{selectedItem.url}</span>
                                </a>
                            </div>
                        </div>

                        <div className="mt-12 flex justify-center">
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="btn-primary"
                            >
                                關閉鑑定介面
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
