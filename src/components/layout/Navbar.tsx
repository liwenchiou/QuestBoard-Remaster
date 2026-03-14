import type { AppMode } from "../../types";
import { Home, ClipboardList, Book, Beer, Crown } from "lucide-react";

interface NavbarProps {
    currentMode: AppMode;
    setMode: (mode: AppMode) => void;
}

export default function Navbar({ currentMode, setMode }: NavbarProps) {
    const navItems = [
        { id: 'home', label: '冒險首頁', icon: Home },
        { id: 'bulletin', label: '任務佈告欄', icon: ClipboardList },
        { id: 'library', label: '公會圖書庫', icon: Book },
        { id: 'tavern', label: '公會酒館', icon: Beer },
        { id: 'admin', label: '酒吧老闆', icon: Crown },
    ] as const;

    return (
        <nav className="h-16 bg-surface border-b border-white/5 flex items-center px-4 md:px-8 justify-between z-50 relative shrink-0">
            <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-energy-yellow rounded-lg flex items-center justify-center text-background font-black text-lg md:text-xl shadow-[0_0_15px_rgba(255,212,59,0.5)]">
                    R
                </div>
                <span className="font-bold text-base md:text-lg tracking-wider hidden sm:block">
                    REMASTER <span className="text-energy-yellow underline md:no-underline">HUB</span>
                </span>
            </div>

            <ul className="flex items-center gap-1 md:gap-4">
                {navItems.map((item) => (
                    <li key={item.id}>
                        <button
                            onClick={() => setMode(item.id)}
                            className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl transition-all ${currentMode === item.id
                                ? "bg-white/10 text-energy-yellow"
                                : "text-white/60 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <item.icon size={18} />
                            <span className="text-sm font-medium hidden lg:block">{item.label}</span>
                        </button>
                    </li>
                ))}
            </ul>

            {/* <div className="hidden lg:block">
                <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-full pr-4">
                    <img
                        src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Felix"
                        alt="Avatar"
                        className="w-8 h-8 rounded-full border border-energy-yellow"
                    />
                    <span className="text-xs font-mono text-white/50 tracking-tighter uppercase">Lv. 99 Grandmaster</span>
                </div>
            </div> */}
        </nav>
    );
}
