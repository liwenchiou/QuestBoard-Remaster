import { useState, useEffect, useCallback } from "react";
import { supabase } from "./lib/supabase";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import TodayMission from "./components/home/TodayMission";
import BulletinBoard from "./components/bulletin/BulletinBoard";
import LibraryGrid from "./components/library/LibraryGrid";
import ChatFlow from "./components/tavern/ChatFlow";
import AdminPanel from "./components/admin/AdminPanel";
import type { AppMode, CheckIn, Message, GuildTask } from "./types";

function App() {
  const [mode, setMode] = useState<AppMode>("home");
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [tasks, setTasks] = useState<GuildTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    const { data: taskData, error: taskError } = await supabase
      .from('guild_tasks')
      .select('*')
      .order('id', { ascending: true });

    if (taskError) console.error('Error fetching tasks:', taskError);
    else if (taskData) setTasks(taskData as GuildTask[]);
  }, []);

  // Load initial data and setup subscriptions
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      // Fetch initial check-ins
      const { data: ciData, error: ciError } = await supabase
        .from('check_ins')
        .select('*')
        .order('created_at', { ascending: true });

      if (ciError) console.error('Error fetching check-ins:', ciError);
      else if (ciData) setCheckIns(ciData);

      // Fetch initial messages
      const { data: msgData, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (msgError) console.error('Error fetching messages:', msgError);
      else if (msgData) {
        const mappedMsgs = msgData.map(m => ({
          ...m,
          time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        }));
        setMessages(mappedMsgs);
      }

      await fetchTasks();

      setIsLoading(false);
    };

    fetchData();

    // Set up Real-time subscriptions
    const checkInChannel = supabase
      .channel('public:check_ins')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'check_ins' }, (payload) => {
        setCheckIns(prev => [...prev, payload.new as CheckIn]);
      })
      .subscribe();

    const messageChannel = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newMsg = payload.new;
        setMessages(prev => [...prev, {
          ...newMsg,
          time: new Date(newMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        } as Message]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(checkInChannel);
      supabase.removeChannel(messageChannel);
    };
  }, [fetchTasks]);

  const handleCheckInSubmit = async (data: Omit<CheckIn, "id">) => {
    const { error } = await supabase
      .from('check_ins')
      .insert([{
        name: data.name,
        avatar: data.avatar,
        task: data.task,
        url: data.url,
        report: data.report
      }]);

    if (error) {
      console.error('Error submitting check-in:', error);
      alert('回報傳送失敗，請檢查網路連線');
      return;
    }

    // Add a system message to tavern
    await supabase.from('messages').insert([{
      user: 'System',
      avatar: 'Felix',
      content: `${data.name} 完成了一個任務！`,
      type: 'system'
    }]);
  };

  const handleMessageSubmit = async (data: any) => {
    const { error } = await supabase
      .from('messages')
      .insert([{
        user: data.user,
        avatar: data.avatar,
        content: data.content,
        type: 'user'
      }]);

    if (error) {
      console.error('Error submitting message:', error);
      alert('發送留言失敗');
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-background flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-energy-yellow border-t-transparent rounded-full animate-spin"></div>
        <div className="font-mono text-energy-yellow animate-pulse uppercase tracking-[0.3em]">Establishing Guild Link...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-white overflow-hidden selection:bg-energy-yellow selection:text-background">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-energy-yellow/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-guild-blue/20 blur-[120px] rounded-full"></div>
      </div>

      <Navbar currentMode={mode} setMode={(m) => { setMode(m); setIsSidebarOpen(false); }} />

      <main className="flex-1 flex overflow-hidden relative z-10 flex-col md:flex-row">
        {/* Mobile Toggle Button for Sidebar - Only shown on bulletin/tavern */}
        {(mode === 'bulletin' || mode === 'tavern') && (
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden fixed bottom-12 right-6 z-[110] w-14 h-14 bg-energy-yellow text-background rounded-full shadow-lg flex items-center justify-center animate-bounce font-bold"
          >
            {isSidebarOpen ? "✕" : "提交"}
          </button>
        )}

        <div className={`
          fixed inset-0 z-[100] bg-background/95 backdrop-blur-md md:relative md:bg-transparent md:backdrop-blur-none md:z-0
          ${isSidebarOpen ? "flex" : "hidden"} md:block
        `}>
          <Sidebar
            mode={mode}
            tasks={tasks}
            onSubmit={(data) => {
              if (mode === 'bulletin') handleCheckInSubmit(data);
              else handleMessageSubmit(data);
              setIsSidebarOpen(false);
            }}
          />
          <div className="flex-1 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
        </div>

        <div className="flex-1 overflow-hidden h-full">
          {mode === "home" && (
            <TodayMission
              tasks={tasks}
              checkIns={checkIns}
              onGoToReport={() => {
                setMode("bulletin");
                setIsSidebarOpen(true);
              }}
            />
          )}
          {mode === "bulletin" && <BulletinBoard checkIns={checkIns} tasks={tasks} />}
          {mode === "library" && <LibraryGrid tasks={tasks} />}
          {mode === "tavern" && <ChatFlow messages={messages} />}
          {mode === "admin" && <AdminPanel tasks={tasks} onRefresh={fetchTasks} />}
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="h-8 bg-surface border-t border-white/5 flex items-center px-6 justify-between text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold z-50">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-energy-yellow"></span>
            Version 2.5
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-guild-blue"></span>
            Session: Active
          </span>
        </div>
        <div>
          Remaster Guild © 2026
        </div>
      </footer>
    </div>
  );
}

export default App;
