import { ChevronRight, ExternalLink } from "lucide-react";
import type { GuildTask, CheckIn } from "../../types";

interface TodayMissionProps {
    tasks: GuildTask[];
    checkIns: CheckIn[];
    onGoToReport: () => void;
}

export default function TodayMission({ tasks, checkIns, onGoToReport }: TodayMissionProps) {
    // Find the latest available task
    const todayTask = [...tasks].reverse().find(t => t.available) || tasks[0];

    // Real-time stats calculations
    const uniqueUsers = new Set(checkIns.map(ci => ci.name)).size;
    const totalCheckIns = checkIns.length;

    // Calculate days remaining based on the current highest unlocked day
    const currentMaxDay = tasks.filter(t => t.available).reduce((max, task) => {
        const d = parseInt(task.day);
        return d > max ? d : max;
    }, 0);
    const daysRemaining = Math.max(0, 30 - currentMaxDay);

    if (!todayTask) return null;

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 animate-zoom-in text-center h-full overflow-y-auto">
            <div className="relative mb-8 md:mb-12">
                <div className="text-[80px] md:text-[200px] font-black leading-none text-white/5 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    DAY {todayTask.day}
                </div>
                <div className="relative z-10 flex flex-col items-center">
                    <span className="text-energy-yellow font-mono tracking-[0.3em] md:tracking-[0.5em] uppercase mb-2 md:mb-4 text-xs md:text-base">現正進行的任務</span>
                    <h1 className="text-3xl md:text-7xl font-black tracking-tight mb-2 uppercase drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] px-4">
                        {todayTask.title}
                    </h1>
                    <p className="text-base md:text-2xl text-guild-blue font-medium italic opacity-80">
                        {todayTask.theme}
                    </p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 mt-4 md:mt-8">
                <a
                    href={todayTask.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary flex items-center justify-center gap-2 group w-full sm:w-auto"
                >
                    接取任務 <ExternalLink size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
                <button
                    onClick={onGoToReport}
                    className="btn-secondary flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                    前往回報 <ChevronRight size={18} />
                </button>
            </div>

            <div className="mt-12 md:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 w-full max-w-4xl px-4">
                <div className="glass-card p-4 md:p-6 flex flex-col items-center gap-1 md:gap-3 group hover:border-energy-yellow/30 transition-all">
                    <div className="text-white/40 uppercase text-[10px] md:text-[12px] tracking-widest font-bold">參與勇者總數</div>
                    <div className="text-2xl md:text-4xl font-black text-energy-yellow">{uniqueUsers.toLocaleString()}</div>
                </div>
                <div className="glass-card p-4 md:p-6 flex flex-col items-center gap-1 md:gap-3 group hover:border-guild-blue/30 transition-all">
                    <div className="text-white/40 uppercase text-[10px] md:text-[12px] tracking-widest font-bold">累計打卡次數</div>
                    <div className="text-2xl md:text-4xl font-black text-guild-blue">{totalCheckIns.toLocaleString()}</div>
                </div>
                <div className="glass-card p-4 md:p-6 flex flex-col items-center gap-1 md:gap-3 group hover:border-white/30 transition-all">
                    <div className="text-white/40 uppercase text-[10px] md:text-[12px] tracking-widest font-bold">計畫剩餘天數</div>
                    <div className="text-2xl md:text-4xl font-black text-white">{daysRemaining}</div>
                </div>
            </div>
        </div>
    );
}
