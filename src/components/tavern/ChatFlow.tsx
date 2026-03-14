import type { Message } from "../../types";
import { useEffect, useRef } from "react";

interface ChatFlowProps {
    messages: Message[];
}

export default function ChatFlow({ messages }: ChatFlowProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="flex-1 p-4 md:p-8 flex flex-col h-full overflow-hidden pb-16 md:pb-8">
            <div className="mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">公會酒館</h2>
                <p className="text-white/40 text-sm">與冒險者舉杯暢談</p>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto pr-2 md:pr-4 flex flex-col gap-4 md:gap-6 custom-scrollbar"
            >
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.type === 'system' ? 'items-center my-2 md:my-4' : 'items-start animate-slide-in'}`}>
                        {msg.type === 'system' ? (
                            <div className="flex items-center gap-2 md:gap-4 w-full">
                                <div className="flex-1 h-px bg-white/5"></div>
                                <div className="text-[8px] md:text-[10px] text-white/30 font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] flex items-center gap-1 md:gap-2 whitespace-nowrap">
                                    <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-energy-yellow animate-pulse"></span>
                                    {msg.content}
                                </div>
                                <div className="flex-1 h-px bg-white/5"></div>
                            </div>
                        ) : (
                            <div className="flex gap-3 md:gap-4 max-w-[90%] md:max-w-[80%] group">
                                <div className="flex-shrink-0">
                                    <img
                                        src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${msg.avatar}`}
                                        alt={msg.user}
                                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 p-1"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-guild-blue group-hover:text-energy-yellow transition-colors">{msg.user}</span>
                                        <span className="text-[10px] text-white/20">{msg.time}</span>
                                    </div>
                                    <div className="glass-card !rounded-2xl !rounded-tl-none px-4 py-3 text-sm text-white/80 leading-relaxed">
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {messages.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center text-white/20 gap-4">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
                            <span className="text-4xl">🍺</span>
                        </div>
                        <p className="italic">酒館目前空無一人，或許你可以點一杯麥酒開始對話...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
